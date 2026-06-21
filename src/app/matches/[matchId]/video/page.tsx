
'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  setDoc, 
  getDoc,
  collectionGroup,
  query,
  where,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Loader2, 
  Maximize2,
  Users,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function VideoCallPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);

  const pc = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    pc.current = new RTCPeerConnection(servers);
    
    return () => {
      stopStreams();
      pc.current?.close();
    };
  }, []);

  const stopStreams = () => {
    localStream?.getTracks().forEach(track => track.stop());
    remoteStream?.getTracks().forEach(track => track.stop());
  };

  const setupLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      
      stream.getTracks().forEach((track) => {
        if (pc.current) pc.current.addTrack(track, stream);
      });

      pc.current!.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      };

      return stream;
    } catch (e) {
      toast({ variant: "destructive", title: "Media Access Error", description: "Could not access camera or microphone. ✨" });
      return null;
    }
  };

  const startCall = async () => {
    if (!db || !user || !pc.current) return;
    setIsCalling(true);

    const stream = await setupLocalMedia();
    if (!stream) {
      setIsCalling(false);
      return;
    }

    const callDoc = doc(collection(db, 'matches', matchId, 'calls'));
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    setCallId(callDoc.id);

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(offerCandidates, event.candidate.toJSON());
      }
    };

    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(callDoc, { offer, callerId: user.uid, status: 'calling', timestamp: serverTimestamp() });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!pc.current?.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.current?.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.current?.addIceCandidate(candidate);
        }
      });
    });
  };

  const joinCall = async (existingCallId: string) => {
    if (!db || !pc.current) return;
    setCallId(existingCallId);
    setIsCalling(true);

    const stream = await setupLocalMedia();
    if (!stream) return;

    const callDoc = doc(db, 'matches', matchId, 'calls', existingCallId);
    const answerCandidates = collection(callDoc, 'answerCandidates');
    const offerCandidates = collection(callDoc, 'offerCandidates');

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    const callData = (await getDoc(callDoc)).data();
    const offerDescription = callData?.offer;
    await pc.current.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(callDoc, { answer, status: 'active' });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current?.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  useEffect(() => {
    if (!db || !user) return;

    const callsQuery = collection(db, 'matches', matchId, 'calls');
    const unsubscribe = onSnapshot(callsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const callData = change.doc.data();
          if (callData.callerId !== user.uid && callData.status === 'calling') {
            toast({
              title: "Incoming Spark Call",
              description: "A partner is inviting you to video chat! ❤️",
              action: (
                <Button variant="default" size="sm" onClick={() => joinCall(change.doc.id)}>Join</Button>
              )
            });
          }
        }
      });
    });

    return () => unsubscribe();
  }, [db, user, matchId]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
      setIsVideoOff(!isVideoOff);
    }
  };

  const hangUp = async () => {
    stopStreams();
    if (db && matchId && callId) {
      await updateDoc(doc(db, 'matches', matchId, 'calls', callId), { status: 'ended' });
    }
    router.back();
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* Main Video View */}
      <main className="flex-grow relative flex items-center justify-center p-4">
        {/* Remote Video (Full Screen) */}
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl relative border border-white/5">
          {remoteStream ? (
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border-2 border-dashed border-primary/30">
                <Users className="w-12 h-12 text-primary/40 animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                 <h2 className="text-2xl font-black tracking-tighter uppercase">Waiting for Spark...</h2>
                 <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Secured Room • Peer-to-Peer</p>
              </div>
            </div>
          )}

          {/* Local Video (Floating) */}
          <div className="absolute bottom-6 right-6 w-32 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black z-20">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            {isVideoOff && (
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <VideoOff className="w-6 h-6 text-white/40" />
              </div>
            )}
          </div>

          {/* Signaling Info Overlay */}
          <div className="absolute top-6 left-6 z-20">
             <div className="bg-black/20 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="flex flex-col">
                   <span className="text-[9px] font-black uppercase tracking-widest">Room Active</span>
                   <span className="text-[7px] text-white/60 font-bold uppercase">End-to-End Encrypted</span>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Control Bar */}
      <footer className="p-8 pb-12 shrink-0 relative z-30">
        <div className="max-w-md mx-auto flex items-center justify-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMute}
            className={cn(
              "w-16 h-16 rounded-full transition-all border-2",
              isMuted ? "bg-red-500/20 border-red-500 text-red-500" : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            )}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          {!isCalling ? (
            <Button 
              onClick={startCall}
              className="h-20 px-10 rounded-[2.5rem] gradient-bg text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 group active:scale-95 transition-all"
            >
              <Zap className="w-6 h-6 mr-3 group-hover:animate-bounce" />
              Launch call
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={hangUp}
              className="w-20 h-20 rounded-[2rem] shadow-2xl shadow-red-500/40 active:scale-90 transition-transform"
            >
              <PhoneOff className="w-8 h-8" />
            </Button>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleVideo}
            className={cn(
              "w-16 h-16 rounded-full transition-all border-2",
              isVideoOff ? "bg-red-500/20 border-red-500 text-red-500" : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            )}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-8 opacity-20">
           <ShieldCheck className="w-3.5 h-3.5" />
           <p className="text-[8px] font-black uppercase tracking-[0.3em]">Mandatory Respect • Secured Journey</p>
        </div>
      </footer>
    </div>
  );
}

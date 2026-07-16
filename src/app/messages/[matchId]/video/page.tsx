'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  setDoc, 
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Loader2, 
  Users, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const servers = {
  iceServers: [
    { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
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
      localStream?.getTracks().forEach(track => track.stop());
      remoteStream?.getTracks().forEach(track => track.stop());
      pc.current?.close();
    };
  }, []);

  const setupLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => pc.current?.addTrack(track, stream));
      pc.current!.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      };
      return stream;
    } catch (e) {
      toast({ variant: "destructive", title: "Media Access Error", description: "Camera access required. ❤️" });
      return null;
    }
  };

  const startCall = async () => {
    if (!db || !user || !pc.current) return;
    setIsCalling(true);
    const stream = await setupLocalMedia();
    if (!stream) { setIsCalling(false); return; }
    const callDoc = doc(collection(db, 'matches', matchId, 'calls'));
    setCallId(callDoc.id);
    pc.current.onicecandidate = (event) => { if (event.candidate) addDoc(collection(callDoc, 'offerCandidates'), event.candidate.toJSON()); };
    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);
    await setDoc(callDoc, { offer: { sdp: offerDescription.sdp, type: offerDescription.type }, callerId: user.uid, status: 'calling', timestamp: serverTimestamp() });
    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!pc.current?.currentRemoteDescription && data?.answer) {
        pc.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });
    onSnapshot(collection(callDoc, 'answerCandidates'), (snapshot) => {
      snapshot.docChanges().forEach((change) => { if (change.type === 'added') pc.current?.addIceCandidate(new RTCIceCandidate(change.doc.data())); });
    });
  };

  const hangUp = async () => {
    localStream?.getTracks().forEach(t => t.stop());
    if (db && matchId && callId) await updateDoc(doc(db, 'matches', matchId, 'calls', callId), { status: 'ended' });
    router.back();
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-white overflow-hidden">
      <main className="flex-grow relative flex items-center justify-center p-4">
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-900 relative border border-white/5 shadow-2xl">
          {remoteStream ? <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" /> : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
              <Users className="w-12 h-12 text-primary/40 animate-pulse" />
              <h2 className="text-2xl font-black tracking-tighter uppercase">Waiting for Spark...</h2>
            </div>
          )}
          <div className="absolute bottom-6 right-6 w-32 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            {isVideoOff && <div className="absolute inset-0 bg-slate-900 flex items-center justify-center"><VideoOff className="w-6 h-6 text-white/40" /></div>}
          </div>
        </div>
      </main>
      <footer className="p-8 pb-12 flex items-center justify-center gap-6">
        <Button onClick={isCalling ? hangUp : startCall} className={cn("h-20 px-10 rounded-[2.5rem] text-lg font-black uppercase tracking-widest", isCalling ? "bg-red-500" : "gradient-bg")}>
           {isCalling ? <PhoneOff className="mr-3" /> : <Zap className="mr-3" />}
           {isCalling ? 'End' : 'Launch Call'}
        </Button>
      </footer>
    </div>
  );
}

'use client';

import { useState, useMemo, useEffect, useRef, use } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  ChevronLeft, 
  Sparkles, 
  Loader2, 
  Camera, 
  Lock, 
  MapPin, 
  ShieldCheck, 
  Cake, 
  TreePine, 
  BookOpen,
  Users,
  HeartOff,
  Heart,
  Languages,
  Gift,
  Paperclip,
  FileIcon,
  Volume2,
  Image as ImageIcon,
  EyeOff,
  ShieldAlert,
  Video,
  Zap
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { useUser, useFirestore, useCollection, useDoc, useFirebaseStorage } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateIcebreaker } from '@/ai/flows/generate-icebreaker-flow';
import { moderateImage } from '@/ai/flows/moderate-image-flow';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { translateMessage } from '@/ai/flows/translate-flow';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import Image from 'next/image';
import { encryptText, decryptText } from '@/lib/crypto';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import Link from 'next/link';
import { LiveCamera } from '@/components/LiveCamera';

const CHAT_SHORTCUTS = [
  { id: 'teachable', label: 'Teachable Pic', icon: BookOpen, description: 'Share a skill or a piece of your culture.' },
  { id: 'holiday', label: 'Holiday Tradition', icon: TreePine, description: 'Show how your family celebrates holidays.' },
  { id: 'birthday', label: 'Birthday Moment', icon: Cake, description: 'Share a happy birthday memory.' }
];

export default function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const { uploadFile, isUploading: isStorageUploading } = useFirebaseStorage();
  const router = useRouter();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUnconnecting, setIsUnconnecting] = useState(false);
  const [isInvitingWitness, setIsInvitingWitness] = useState(false);
  const [witnessUid, setWitnessUid] = useState('');
  const [decryptedMessages, setDecryptedMessages] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());
  const [speakingIds, setSpeakingIds] = useState<Set<string>>(new Set());
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: myProfile } = useDoc(userRef);

  const hasAcceptedPolicy = myProfile?.policyAccepted === true;

  const matchRef = useMemoFirebase(() => {
    if (!db || !matchId) return null;
    return doc(db, 'matches', matchId);
  }, [db, matchId]);
  const { data: matchData, loading: matchLoading } = useDoc(matchRef);

  const partnerId = useMemo(() => {
    return matchData?.userIds?.find((id: string) => id !== user?.uid);
  }, [matchData, user]);

  const partnerRef = useMemoFirebase(() => {
    if (!db || !partnerId) return null;
    return doc(db, 'users', partnerId);
  }, [db, partnerId]);
  const { data: partnerProfile } = useDoc(partnerRef);

  const matchInfo = useMemo(() => {
    if (!matchId) return { name: "...", photoUrl: null, interests: [] };
    const idParts = matchId.split('_');
    const idNum = idParts.length > 1 ? parseInt(idParts[1].substring(0, 5), 36) || 0 : 0;
    const userImages = PlaceHolderImages.filter(img => img.id.startsWith('user-'));
    const img = userImages[idNum % userImages.length] || userImages[0];
    
    return {
      name: partnerProfile?.displayName || partnerProfile?.publicNickname || "Mystery Heart",
      photoUrl: partnerProfile?.photoUrl || img?.imageUrl,
      interests: partnerProfile?.interests || ['Happiness', 'Respect', 'Love']
    };
  }, [matchId, partnerProfile]);

  const messagesQuery = useMemoFirebase(() => {
    if (!db || !matchId) return null;
    return query(
      collection(db, 'matches', matchId, 'messages'),
      orderBy('timestamp', 'asc')
    );
  }, [db, matchId]);

  const { data: messages, loading: messagesLoading } = useCollection(messagesQuery);

  useEffect(() => {
    const decryptAll = async () => {
      if (!messages || !user) return;
      const privKey = localStorage.getItem(`spark_priv_${user.uid}`);
      if (!privKey) return;

      const newDecrypted: Record<string, string> = { ...decryptedMessages };
      let changed = false;

      for (const msg of messages as any[]) {
        if (msg.encryptedText && !newDecrypted[msg.id]) {
          try {
            const decrypted = await decryptText(msg.encryptedText, privKey);
            newDecrypted[msg.id] = decrypted;
            changed = true;
          } catch (e) {
            newDecrypted[msg.id] = "[Encryption Ripple]";
          }
        }
      }

      if (changed) setDecryptedMessages(newDecrypted);
    };

    decryptAll();
  }, [messages, user, matchId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!hasAcceptedPolicy) {
      toast({ variant: "destructive", title: "Action Denied", description: "Agreement required to message. ✨" });
      return;
    }
    if (!newMessage.trim() || !user || !db || !matchId || isSending) return;

    setIsSending(true);
    try {
      try {
        const moderation = await moderateText({ text: newMessage });
        if (moderation.isFlagged) {
          toast({
            variant: "destructive",
            title: "Respect Mandatory Rule",
            description: "This message was blocked by AI for violating our Mandatory Respect & Love policy. ✨"
          });
          setIsSending(false);
          return;
        }
      } catch (modError) {
        setIsSending(false);
        return;
      }

      const partnerPubKey = partnerProfile?.publicKey;

      let encryptedText = null;
      if (partnerPubKey) {
        encryptedText = await encryptText(newMessage, partnerPubKey);
      }

      await addDoc(collection(db, 'matches', matchId, 'messages'), {
        senderId: user.uid,
        text: partnerPubKey ? "[Encrypted Content]" : newMessage,
        encryptedText: encryptedText,
        timestamp: serverTimestamp(),
      });

      setNewMessage('');
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not send message." });
    } finally {
      setIsSending(false);
    }
  };

  const handleLiveCapture = async (data: { url: string; file: File; type: 'image' | 'video' }) => {
    if (!user || !db || !matchId) return;

    try {
      if (data.type === 'image') {
        const moderation = await moderateImage({ photoDataUri: data.url });
        const cloudUrl = await uploadFile(`matches/${matchId}/${Date.now()}.jpg`, data.file);
        await addDoc(collection(db, 'matches', matchId, 'messages'), {
          senderId: user.uid,
          imageUrl: cloudUrl,
          isSensitive: moderation.isSensitive,
          timestamp: serverTimestamp(),
        });
      } else {
        const cloudUrl = await uploadFile(`matches/${matchId}/${Date.now()}.mp4`, data.file);
        await addDoc(collection(db, 'matches', matchId, 'messages'), {
          senderId: user.uid,
          videoUrl: cloudUrl,
          timestamp: serverTimestamp(),
        });
      }
      toast({ title: "Moment Shared", description: "Your live capture is live! ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not share live moment." });
    }
  };

  const handleTranslate = async (msgId: string, text: string) => {
    if (translatingIds.has(msgId)) return;
    setTranslatingIds(prev => new Set(prev).add(msgId));
    try {
      const result = await translateMessage({
        text,
        targetLanguage: myProfile?.preferredLanguage || 'English'
      });
      await updateDoc(doc(db, 'matches', matchId, 'messages', msgId), {
        [`translations.${myProfile?.preferredLanguage || 'English'}`]: result.translatedText
      });
    } finally {
      setTranslatingIds(prev => {
        const next = new Set(prev);
        next.delete(msgId);
        return next;
      });
    }
  };

  const handleSpeak = async (msgId: string, text: string) => {
    if (speakingIds.has(msgId)) return;
    setSpeakingIds(prev => new Set(prev).add(msgId));
    try {
      const result = await textToSpeech({ text });
      const audio = new Audio(result.media);
      audio.play();
    } finally {
      setSpeakingIds(prev => {
        const next = new Set(prev);
        next.delete(msgId);
        return next;
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasAcceptedPolicy) return;
    const file = e.target.files?.[0];
    if (!file || !user || !db || !matchId) return;

    try {
      const cloudUrl = await uploadFile(`matches/${matchId}/${Date.now()}-${file.name}`, file);
      await addDoc(collection(db, 'matches', matchId, 'messages'), {
        senderId: user.uid,
        fileUrl: cloudUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        timestamp: serverTimestamp(),
      });
      toast({ title: "File Shared", description: `${file.name} sent.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not share file." });
    }
  };

  const handleUnconnect = async () => {
    if (!user || !db || !matchId) return;
    setIsUnconnecting(true);
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'matches', matchId), {
        status: 'unmatched',
        unmatchedAt: serverTimestamp(),
        unmatchedBy: user.uid
      });
      await batch.commit();
      toast({ title: "Unconnected", description: "Connection ended respectfully." });
      router.push('/matches');
    } finally {
      setIsUnconnecting(false);
    }
  };

  const handleInviteWitness = async () => {
    if (!user || !db || !matchId || !witnessUid) return;
    setIsInvitingWitness(true);
    try {
      await updateDoc(doc(db, 'matches', matchId), { witnessId: witnessUid, witnessStatus: 'pending' });
      toast({ title: "Witness Invited", description: "Waiting for them to vouch for your relationship! ✨" });
      setWitnessUid('');
    } finally {
      setIsInvitingWitness(false);
    }
  };

  const handleIcebreaker = async () => {
    if (!hasAcceptedPolicy) return;
    setIsGenerating(true);
    try {
      const result = await generateIcebreaker({
        recipientName: matchInfo.name,
        recipientInterests: matchInfo.interests,
        language: myProfile?.preferredLanguage || 'English'
      });
      setNewMessage(result.icebreaker);
    } finally {
      setIsGenerating(false);
    }
  };

  if (matchLoading) return <div className="flex items-center justify-center h-screen bg-white"><Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" /></div>;

  if (!matchData) return <div className="flex flex-col items-center justify-center h-screen bg-muted/30 p-8 text-center"><Lock className="w-12 h-12 text-muted-foreground opacity-20 mb-4" /><h2 className="text-2xl font-black">Room Disconnected</h2><Button variant="outline" className="mt-8 rounded-2xl" onClick={() => router.push('/matches')}>Back to Hearts</Button></div>;

  const isDatingMatch = matchData?.type === 'date';
  const partnerExactLoc = partnerProfile?.exactLocation;
  const isWitnessed = matchData?.witnessStatus === 'confirmed';

  return (
    <div className={cn("flex flex-col h-[100dvh] overflow-hidden", isDatingMatch ? "bg-accent/30" : "bg-white")}>
      <header className="flex items-center gap-4 px-4 h-14 border-b shrink-0 bg-white/80 backdrop-blur-md z-20 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="relative">
          <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-lg">
            <AvatarImage src={matchInfo.photoUrl || undefined} className="object-cover" />
            <AvatarFallback>{matchInfo.name[0]}</AvatarFallback>
          </Avatar>
          {isDatingMatch && (
            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 rounded-full border border-white shadow-sm">
               <Heart className="w-2.5 h-2.5 fill-white" />
            </div>
          )}
        </div>

        <div className="flex-grow min-w-0">
          <h2 className="font-black text-sm tracking-tight flex items-center gap-1 truncate">
            {matchInfo.name}
            {isWitnessed && <ShieldCheck className="w-3 h-3 text-primary" />}
            <Lock className="w-2.5 h-2.5 text-green-500/50" />
          </h2>
          <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest leading-none">
            {isDatingMatch ? "Spark Room Active" : "Friendship Circle"}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isDatingMatch && (
            <>
              <Button variant="ghost" size="icon" asChild className="text-primary hover:bg-primary/5 rounded-full w-9 h-9">
                <Link href={`/matches/${matchId}/video`}><Video className="w-4 h-4" /></Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5 rounded-full w-9 h-9"><Users className="w-4 h-4" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[3rem] p-8">
                  <AlertDialogHeader className="text-center">
                    <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                    <AlertDialogTitle className="text-3xl font-black">Invite Witness</AlertDialogTitle>
                    <AlertDialogDescription>Invite a trusted 3rd party to vouch for your relationship.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-6"><Input placeholder="Witness User ID" value={witnessUid} onChange={e => setWitnessUid(e.target.value)} className="rounded-2xl h-14 bg-muted/30 border-none" /></div>
                  <AlertDialogFooter className="flex-col gap-3">
                    <AlertDialogAction onClick={handleInviteWitness} disabled={!witnessUid || isInvitingWitness} className="w-full h-14 rounded-2xl gradient-bg font-black">
                      {isInvitingWitness ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Send Invitation"}
                    </AlertDialogAction>
                    <AlertDialogCancel className="w-full h-14 rounded-2xl border-none">Maybe Later</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={handleIcebreaker} disabled={isGenerating || !hasAcceptedPolicy} className="text-primary gap-1 font-black text-[9px] uppercase tracking-widest h-9 px-3 bg-primary/5 rounded-full hidden sm:flex">
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} AI Spark
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full w-9 h-9"><HeartOff className="w-4 h-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[3rem] p-10 border-none shadow-2xl">
              <AlertDialogHeader><AlertDialogTitle className="text-3xl font-black">End this Journey?</AlertDialogTitle></AlertDialogHeader>
              <AlertDialogFooter className="mt-8 flex-col sm:flex-row gap-4">
                <AlertDialogCancel className="rounded-2xl h-14 font-bold flex-1 border-none bg-muted/50">Keep Connecting</AlertDialogCancel>
                <AlertDialogAction onClick={handleUnconnect} className="gradient-bg rounded-2xl h-14 font-black flex-1 shadow-xl shadow-primary/20">
                  {isUnconnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Unconnect Now"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {!hasAcceptedPolicy && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-between animate-in slide-in-from-top-2 shrink-0">
           <div className="flex items-center gap-2 text-amber-800">
              <ShieldAlert className="w-4 h-4" />
              <p className="text-[10px] font-bold uppercase tracking-tight">View Only Mode Active</p>
           </div>
           <Link href="/policy/agree">
              <Button size="sm" variant="ghost" className="h-7 text-[9px] font-black uppercase text-amber-900 hover:bg-amber-200">Agree to Unlock Chat</Button>
           </Link>
        </div>
      )}

      {isDatingMatch && partnerExactLoc && (
        <div className="bg-red-50/80 backdrop-blur-sm border-b border-red-100 p-2 px-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <p className="text-[9px] font-black text-red-700 uppercase tracking-widest">GPS Accountability Active</p>
          </div>
          <Button size="sm" variant="ghost" className="h-7 text-[8px] font-bold uppercase text-red-600 hover:bg-red-100 rounded-full bg-white shadow-sm" onClick={() => window.open(`https://www.google.com/maps?q=${partnerExactLoc.latitude},${partnerExactLoc.longitude}`)}>
            View Map
          </Button>
        </div>
      )}

      <main ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 relative no-scrollbar">
        {messagesLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" /></div>
        ) : (
          messages?.map((msg: any, i) => {
            const isMe = msg.senderId === user?.uid;
            const textToShow = msg.encryptedText ? (decryptedMessages[msg.id] || "...") : msg.text;
            const translation = msg.translations?.[myProfile?.preferredLanguage || 'English'];
            const actualText = translation || textToShow;

            return (
              <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={cn("max-w-[85%] px-5 py-4 rounded-[2.2rem] text-sm leading-relaxed shadow-sm transition-all relative group", isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-foreground rounded-tl-none border')}>
                  {msg.imageUrl ? (
                     <div className="relative w-60 h-72 overflow-hidden rounded-[1.8rem] bg-muted shadow-inner">
                        <Image src={msg.imageUrl} alt="Moment" fill className="object-cover" />
                      </div>
                  ) : msg.videoUrl ? (
                    <div className="relative w-60 aspect-video rounded-2xl overflow-hidden bg-black">
                       <video src={msg.videoUrl} controls className="w-full h-full" />
                    </div>
                  ) : msg.fileUrl ? (
                    <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-dashed">
                       <FileIcon className="w-6 h-6 text-primary" />
                       <div className="min-w-0 flex-grow">
                          <p className="font-bold text-xs truncate">{msg.fileName}</p>
                          <p className="text-[8px] text-muted-foreground uppercase font-black">{(msg.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                       </div>
                       <Button size="sm" variant="ghost" className="text-primary font-black text-[9px] uppercase" onClick={() => window.open(msg.fileUrl)}>Download</Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold">{actualText}</span>
                      <div className="flex items-center gap-3 mt-1 opacity-40 justify-end">
                         <div className="flex items-center gap-2">
                            {!isMe && !translation && textToShow !== "..." && (
                              <button onClick={() => handleTranslate(msg.id, textToShow)} className="flex items-center gap-1 hover:text-primary"><Languages className="w-2.5 h-2.5" /><span className="text-[8px] font-black uppercase">Translate</span></button>
                            )}
                            {actualText && actualText !== "..." && (
                               <button onClick={() => handleSpeak(msg.id, actualText)} className="flex items-center gap-1 hover:text-primary"><Volume2 className="w-2.5 h-2.5" /><span className="text-[8px] font-black uppercase">Listen</span></button>
                            )}
                         </div>
                         <Lock className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      <footer className="p-4 border-t pb-8 bg-white/80 backdrop-blur-xl z-20 shrink-0">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-1">
           {CHAT_SHORTCUTS.map((shortcut) => (
             <Button key={shortcut.id} variant="outline" size="sm" onClick={() => setIsCameraOpen(true)} className="rounded-full shrink-0 h-9 gap-2 border-primary/10 text-primary hover:bg-primary/5 font-black text-[9px] uppercase tracking-widest px-4" disabled={!hasAcceptedPolicy}>
               <shortcut.icon className="w-3.5 h-3.5" /> {shortcut.label}
             </Button>
           ))}
           <Button variant="outline" size="sm" onClick={() => router.push('/shop')} className="rounded-full shrink-0 h-9 gap-2 border-primary/10 text-primary hover:bg-primary/5 font-black text-[9px] uppercase tracking-widest px-4" disabled={!hasAcceptedPolicy}><Gift className="w-3.5 h-3.5" /> Send Gift</Button>
        </div>

        <div className="flex items-center gap-2">
          <input type="file" id="chat-file-upload" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          <input type="file" id="chat-gallery-upload" className="hidden" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleLiveCapture({ url: URL.createObjectURL(file), file, type: 'image' });
          }} ref={galleryInputRef} />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl shrink-0 bg-muted/40 h-12 w-12 text-muted-foreground" disabled={isSending || isStorageUploading || !hasAcceptedPolicy}>
                {isStorageUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-6 h-6" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 rounded-2xl border-none shadow-2xl" side="top" align="start">
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="sm" onClick={() => setIsCameraOpen(true)} className="justify-start gap-3 rounded-xl py-5 h-auto">
                   <Zap className="w-4 h-4 text-primary" />
                   <span className="font-bold text-xs uppercase tracking-tight">Live Camera</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => galleryInputRef.current?.click()} className="justify-start gap-3 rounded-xl py-5 h-auto">
                   <ImageIcon className="w-4 h-4 text-primary" />
                   <span className="font-bold text-xs uppercase tracking-tight">Gallery</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="justify-start gap-3 rounded-xl py-5 h-auto border-t border-muted/50 mt-1">
                   <Paperclip className="w-4 h-4 text-primary" />
                   <span className="font-bold text-xs uppercase tracking-tight">Share File</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <form onSubmit={handleSendMessage} className="flex-grow flex gap-2">
            <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={hasAcceptedPolicy ? "Respectful message..." : "Agree to policy"} className="rounded-2xl bg-muted/40 border-none h-12 px-6 font-bold" disabled={isSending || !hasAcceptedPolicy} />
            <Button type="submit" size="icon" className="rounded-xl h-12 w-12 gradient-bg shrink-0 shadow-lg" disabled={!newMessage.trim() || isSending || !hasAcceptedPolicy}>
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </form>
        </div>
      </footer>

      <LiveCamera 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onCapture={handleLiveCapture} 
      />
    </div>
  );
}

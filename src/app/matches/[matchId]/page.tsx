
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
  ShieldAlert
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
  const cameraInputRef = useRef<HTMLInputElement>(null);
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
          const decrypted = await decryptText(msg.encryptedText, privKey);
          newDecrypted[msg.id] = decrypted;
          changed = true;
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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send message."
      });
    } finally {
      setIsSending(false);
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
    } catch (error) {
      toast({ variant: "destructive", title: "Translation Ripple", description: "AI couldn't bridge this language yet." });
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
    } catch (error) {
      toast({ variant: "destructive", title: "Audio Error", description: "The platform couldn't find its voice right now. ✨" });
    } finally {
      setSpeakingIds(prev => {
        const next = new Set(prev);
        next.delete(msgId);
        return next;
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isImage = false) => {
    if (!hasAcceptedPolicy) return;
    const file = e.target.files?.[0];
    if (!file || !user || !db || !matchId) return;

    try {
      if (isImage) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUri = reader.result as string;
          const moderation = await moderateImage({ photoDataUri: dataUri });
          
          const fileName = `${Date.now()}-${file.name}`;
          const cloudUrl = await uploadFile(`matches/${matchId}/${fileName}`, file);

          await addDoc(collection(db, 'matches', matchId, 'messages'), {
            senderId: user.uid,
            imageUrl: cloudUrl,
            isSensitive: moderation.isSensitive,
            timestamp: serverTimestamp(),
          });
        };
        reader.readAsDataURL(file);
      } else {
        const fileName = `${Date.now()}-${file.name}`;
        const cloudUrl = await uploadFile(`matches/${matchId}/${fileName}`, file);

        await addDoc(collection(db, 'matches', matchId, 'messages'), {
          senderId: user.uid,
          fileUrl: cloudUrl,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          timestamp: serverTimestamp(),
        });

        toast({ title: "File Shared", description: `${file.name} sent to your connection.` });
      }
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
      if (matchData?.type === 'date') {
        matchData.userIds.forEach((uid: string) => {
          batch.update(doc(db, 'users', uid), { relationshipStatus: 'single', partnerId: null });
        });
      }
      await batch.commit();
      toast({ title: "Unconnected", description: "Your connection has been ended respectfully." });
      router.push('/matches');
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not unconnect." });
    } finally {
      setIsUnconnecting(false);
    }
  };

  const handleInviteWitness = async () => {
    if (!user || !db || !matchId || !witnessUid) return;
    setIsInvitingWitness(true);
    try {
      await updateDoc(doc(db, 'matches', matchId), { witnessId: witnessUid, witnessStatus: 'pending' });
      toast({ title: "Witness Invited", description: "A trusted third party has been invited to vouch for your relationship! ✨" });
      setWitnessUid('');
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not invite witness." });
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (matchLoading) return (
    <div className="flex flex-col h-[100dvh] items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mt-4">Opening Room...</p>
    </div>
  );

  if (!matchData && !matchLoading) return (
    <div className="flex flex-col h-[100dvh] items-center justify-center bg-muted/30 p-8 text-center">
      <Lock className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
      <h2 className="text-2xl font-black tracking-tighter">Room Disconnected</h2>
      <p className="text-muted-foreground mt-2 max-w-xs mx-auto">The sacred space for this connection could not be opened. It may have been ended respectfully.</p>
      <Button variant="outline" className="mt-8 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={() => router.push('/matches')}>Back to Hearts</Button>
    </div>
  );

  const isDatingMatch = matchData?.type === 'date';
  const partnerExactLoc = partnerProfile?.exactLocation;
  const isWitnessed = matchData?.witnessStatus === 'confirmed';

  return (
    <div className={cn("flex flex-col h-[100dvh] overflow-hidden", isDatingMatch ? "bg-accent/30" : "bg-white")}>
      <header className="flex items-center gap-4 px-4 h-14 border-b shrink-0 bg-white/80 backdrop-blur-md z-20 shadow-sm" role="banner">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back to matches list" className="rounded-full w-9 h-9">
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </Button>
        
        <div className="relative">
          <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-lg">
            <AvatarImage src={matchInfo.photoUrl || undefined} className="object-cover" alt="" />
            <AvatarFallback>{matchInfo.name[0]}</AvatarFallback>
          </Avatar>
          {isDatingMatch && (
            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 rounded-full border border-white">
               <Heart className="w-2.5 h-2.5 fill-white" />
            </div>
          )}
        </div>

        <div className="flex-grow min-w-0">
          <h2 className="font-black text-sm tracking-tight flex items-center gap-1 truncate">
            {matchInfo.name}
            {isWitnessed && <ShieldCheck className="w-3 h-3 text-primary" aria-label="Witnessed" />}
            <Lock className="w-2.5 h-2.5 text-green-500/50" aria-label="E2EE Active" />
          </h2>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest leading-none">
              {isDatingMatch ? "Spark Room Active" : "Friendship Circle"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isDatingMatch && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5 rounded-full w-9 h-9" aria-label="Invite Witness">
                  <Users className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[3rem] border-none shadow-2xl p-8">
                <AlertDialogHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <AlertDialogTitle className="text-3xl font-black tracking-tighter">Invite Success Witness</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground text-base italic leading-relaxed">
                    "Happy relationships build global prosperity." Invite a trusted third party to vouch for your respectful and loving Spark.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-6 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="witness-id" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Witness User ID</label>
                    <Input id="witness-id" placeholder="e.g. gHZ9n7s..." value={witnessUid} onChange={e => setWitnessUid(e.target.value)} className="rounded-2xl h-14 bg-muted/30 border-none px-6 text-lg font-bold" />
                  </div>
                </div>
                <AlertDialogFooter className="flex-col gap-3">
                  <AlertDialogAction onClick={handleInviteWitness} disabled={!witnessUid || isInvitingWitness} className="w-full h-14 rounded-2xl gradient-bg font-black text-lg shadow-xl shadow-primary/20">
                    {isInvitingWitness ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Send Invitation"}
                  </AlertDialogAction>
                  <AlertDialogCancel className="w-full h-14 rounded-2xl border-none font-bold text-muted-foreground">Maybe Later</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button variant="ghost" size="sm" onClick={handleIcebreaker} disabled={isGenerating || !hasAcceptedPolicy} className="text-primary gap-1 font-black text-[9px] uppercase tracking-widest h-9 px-3 bg-primary/5 rounded-full hidden sm:flex">
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            AI Spark
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full w-9 h-9">
                <HeartOff className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[3rem] p-10 border-none shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-3xl font-black tracking-tighter">End this Journey?</AlertDialogTitle>
                <AlertDialogDescription className="text-lg leading-relaxed italic">Stopping this connection is final. You can always start a new journey respectfully.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-8 flex-col sm:flex-row gap-4">
                <AlertDialogCancel className="rounded-2xl h-14 font-bold flex-1 border-none bg-muted/50">Keep Connecting</AlertDialogCancel>
                <AlertDialogAction onClick={handleUnconnect} className="gradient-bg rounded-2xl h-14 font-black text-lg flex-1 shadow-xl shadow-primary/20">
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

      {isDatingMatch && (
        <div className="bg-red-50/80 backdrop-blur-sm border-b border-red-100 p-2 px-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <p className="text-[9px] font-black text-red-700 uppercase tracking-widest">GPS Accountability Active</p>
          </div>
          {partnerExactLoc && (
            <Button size="sm" variant="ghost" className="h-7 text-[8px] font-bold uppercase text-red-600 hover:bg-red-100 rounded-full bg-white shadow-sm" onClick={() => window.open(`https://www.google.com/maps?q=${partnerExactLoc.latitude},${partnerExactLoc.longitude}`)}>
              View Map
            </Button>
          )}
        </div>
      )}

      <main ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 relative no-scrollbar">
        <div className="flex flex-col items-center gap-4 py-6 opacity-40">
           <ShieldCheck className="w-12 h-12 text-primary fill-primary/5" />
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary text-center">
             E2EE Secured & AI Moderated <br/> Sacred Space
           </p>
        </div>

        {messagesLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" /></div>
        ) : (
          messages?.map((msg: any, i) => {
            const isMe = msg.senderId === user?.uid;
            const isSensitive = msg.isSensitive;
            const blurContent = isSensitive && !myProfile?.settings?.allowSensitiveContent;
            const textToShow = msg.encryptedText ? (decryptedMessages[msg.id] || "...") : msg.text;
            const translation = msg.translations?.[myProfile?.preferredLanguage || 'English'];
            const actualText = translation || textToShow;

            return (
              <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                <div className={cn("max-w-[85%] px-5 py-4 rounded-[2.2rem] text-sm leading-relaxed shadow-sm transition-all relative group", isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-foreground rounded-tl-none border border-primary/5')}>
                  {msg.imageUrl ? (
                    <div className="flex flex-col gap-3">
                       <div className="relative w-60 h-72 overflow-hidden rounded-[1.8rem] bg-muted shadow-inner">
                        {blurContent ? (
                          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-center p-6 gap-3">
                            <EyeOff className="w-10 h-10 text-white/20" />
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Flagged by AI</p>
                          </div>
                        ) : (
                          <Image src={msg.imageUrl} alt="Shared moment" fill className={cn("object-cover transition-all duration-1000", isSensitive && "blur-3xl hover:blur-none")} unoptimized={msg.imageUrl?.startsWith('https://firebasestorage.googleapis.com')} />
                        )}
                      </div>
                    </div>
                  ) : msg.fileUrl ? (
                    <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-dashed border-primary/10">
                       <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
                          <FileIcon className="w-6 h-6" />
                       </div>
                       <div className="min-w-0 flex-grow">
                          <p className="font-bold text-xs truncate">{msg.fileName || "Shared File"}</p>
                          <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">{(msg.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                       </div>
                       <Button size="sm" variant="ghost" className="text-primary font-black text-[9px] uppercase tracking-widest" onClick={() => window.open(msg.fileUrl)}>Download</Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-sm tracking-tight">{actualText}</span>
                      {translation && <p className="text-[9px] opacity-60 italic font-medium">Translated from partner language</p>}
                      <div className={cn("flex items-center gap-3 mt-1", isMe ? "justify-end text-white/40" : "justify-between text-primary/40")}>
                         <div className="flex items-center gap-2">
                            {!isMe && !translation && textToShow !== "..." && (
                              <button onClick={() => handleTranslate(msg.id, textToShow)} className="flex items-center gap-1 hover:text-primary transition-colors">
                                {translatingIds.has(msg.id) ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Languages className="w-2.5 h-2.5" />}
                                <span className="text-[8px] font-black uppercase">Translate</span>
                              </button>
                            )}
                            {actualText && actualText !== "..." && actualText !== "[Encrypted Content]" && (
                               <button onClick={() => handleSpeak(msg.id, actualText)} className="flex items-center gap-1 hover:text-primary transition-colors">
                                 {speakingIds.has(msg.id) ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Volume2 className="w-2.5 h-2.5" />}
                                 <span className="text-[8px] font-black uppercase">Listen</span>
                               </button>
                            )}
                         </div>
                         <div className="flex items-center gap-1">
                           <Lock className="w-2.5 h-2.5" />
                           <span className="text-[7px] uppercase font-black tracking-widest">Secured</span>
                         </div>
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
           <TooltipProvider>
             {CHAT_SHORTCUTS.map((shortcut) => (
               <Tooltip key={shortcut.id}>
                 <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => galleryInputRef.current?.click()} className="rounded-full shrink-0 h-9 gap-2 border-primary/10 text-primary hover:bg-primary/5 transition-all font-black text-[9px] uppercase tracking-widest px-4" disabled={!hasAcceptedPolicy}>
                      <shortcut.icon className="w-3.5 h-3.5" />
                      {shortcut.label}
                    </Button>
                 </TooltipTrigger>
                 <TooltipContent className="rounded-xl bg-primary text-white p-3"><p className="text-[10px] font-bold uppercase tracking-widest">{shortcut.description}</p></TooltipContent>
               </Tooltip>
             ))}
             <Button variant="outline" size="sm" onClick={() => router.push('/shop')} className="rounded-full shrink-0 h-9 gap-2 border-primary/10 text-primary hover:bg-primary/5 transition-all font-black text-[9px] uppercase tracking-widest px-4" disabled={!hasAcceptedPolicy}>
                <Gift className="w-3.5 h-3.5" />
                Send Gift
             </Button>
           </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
          <input type="file" id="chat-photo-gallery" accept="image/*" className="hidden" ref={galleryInputRef} onChange={(e) => handleFileUpload(e, true)} />
          <input type="file" id="chat-photo-camera" accept="image/*" capture="user" className="hidden" ref={cameraInputRef} onChange={(e) => handleFileUpload(e, true)} />
          <input type="file" id="chat-file-upload" className="hidden" ref={fileInputRef} onChange={(e) => handleFileUpload(e, false)} />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl shrink-0 bg-muted/40 h-12 w-12 text-muted-foreground" disabled={isSending || isStorageUploading || !hasAcceptedPolicy}>
                {isStorageUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-6 h-6" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 rounded-2xl border-none shadow-2xl" side="top" align="start">
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="sm" onClick={() => cameraInputRef.current?.click()} className="justify-start gap-3 rounded-xl py-5 h-auto">
                   <Camera className="w-4 h-4 text-primary" />
                   <span className="font-bold text-xs uppercase tracking-tight">Camera</span>
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
            <Input 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)} 
              placeholder={hasAcceptedPolicy ? "Respectful message..." : "Agree to policy to chat"} 
              className="rounded-2xl bg-muted/40 border-none h-12 px-6 font-bold text-base shadow-inner" 
              disabled={isSending || !hasAcceptedPolicy} 
            />
            <Button type="submit" size="icon" className="rounded-xl h-12 w-12 gradient-bg shrink-0 shadow-lg shadow-primary/20 active:scale-90 transition-transform" disabled={!newMessage.trim() || isSending || !hasAcceptedPolicy}>
              {isSending ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Send className="w-5 h-5 text-white" />}
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}

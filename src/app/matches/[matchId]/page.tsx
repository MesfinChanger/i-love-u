
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
  ImageIcon,
  EyeOff,
  ShieldAlert,
  Video,
  Zap,
  X,
  Trash2,
  CheckCircle2,
  Square,
  CheckSquare,
  TrendingDown
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { useUser, useFirestore, useCollection, useDoc, useFirebaseStorage } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, doc, updateDoc, writeBatch, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { moderateImage } from '@/ai/flows/moderate-image-flow';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { translateMessage } from '@/ai/flows/translate-flow';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { encryptText, decryptText } from '@/lib/crypto';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LiveCamera } from '@/components/LiveCamera';
import { Progress } from "@/components/ui/progress";
import { compressImage, fileToDataUri } from '@/lib/image-utils';
import { DonationDialog } from '@/components/DonationDialog';

export default function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const { uploadFile, deleteFile, isUploading: isStorageUploading, progress: uploadProgress } = useFirebaseStorage();
  const router = useRouter();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [decryptedMessages, setDecryptedMessages] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const userRef = useMemoFirebase(() => db && user ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: myProfile } = useDoc(userRef);
  const hasAcceptedPolicy = myProfile?.policyAccepted === true;

  const matchRef = useMemoFirebase(() => db && matchId ? doc(db, 'matches', matchId) : null, [db, matchId]);
  const { data: matchData, loading: matchLoading } = useDoc(matchRef);

  const partnerId = useMemo(() => matchData?.userIds?.find((id: string) => id !== user?.uid), [matchData, user]);
  const partnerRef = useMemoFirebase(() => db && partnerId ? doc(db, 'users', partnerId) : null, [db, partnerId]);
  const { data: partnerProfile } = useDoc(partnerRef);

  const matchInfo = useMemo(() => {
    return {
      name: partnerProfile?.displayName || partnerProfile?.publicNickname || "Mystery Heart",
      photoUrl: partnerProfile?.photoUrl || null
    };
  }, [partnerProfile]);

  const messagesQuery = useMemoFirebase(() => {
    if (!db || !matchId) return null;
    return query(collection(db, 'matches', matchId, 'messages'), orderBy('timestamp', 'asc'));
  }, [db, matchId]);
  const { data: messages, loading: messagesLoading } = useCollection(messagesQuery);

  useEffect(() => {
    const decryptAll = async () => {
      if (!messages || !user) return;
      const privKey = localStorage.getItem(`spark_priv_${user.uid}`);
      if (!privKey) return;
      const newDecrypted = { ...decryptedMessages };
      let changed = false;
      for (const msg of messages as any[]) {
        if (msg.encryptedText && !newDecrypted[msg.id]) {
          try {
            newDecrypted[msg.id] = await decryptText(msg.encryptedText, privKey);
            changed = true;
          } catch (e) {
            newDecrypted[msg.id] = "[Encryption Ripple]";
          }
        }
      }
      if (changed) setDecryptedMessages(newDecrypted);
    };
    decryptAll();
  }, [messages, user]);

  useEffect(() => {
    if (scrollRef.current && !isSelectMode) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isSelectMode]);

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedIds(new Set());
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (!db || !matchId || isSending || selectedIds.size === 0) return;
    setIsSending(true);
    try {
      const idsToDelete = Array.from(selectedIds);
      for (const id of idsToDelete) {
        const msg = messages?.find((m: any) => m.id === id);
        if (msg) {
          if (msg.imageUrl) await deleteFile(msg.imageUrl);
          if (msg.videoUrl) await deleteFile(msg.videoUrl);
          if (msg.fileUrl) await deleteFile(msg.fileUrl);
          await deleteDoc(doc(db, 'matches', matchId, 'messages', id));
        }
      }
      setSelectedIds(new Set());
      setIsSelectMode(false);
      toast({ title: "Messages Purged", description: "Retracted from room securely. ❤️" });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !user || !db || !matchId || isSending || !hasAcceptedPolicy) return;
    setIsSending(true);
    try {
      const moderation = await moderateText({ text: newMessage });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Policy Blocked", description: moderation.reason });
        setIsSending(false);
        return;
      }
      const partnerPubKey = partnerProfile?.publicKey;
      let encryptedText = partnerPubKey ? await encryptText(newMessage, partnerPubKey) : null;
      await addDoc(collection(db, 'matches', matchId, 'messages'), {
        senderId: user.uid,
        text: partnerPubKey ? "[Encrypted Content]" : newMessage,
        encryptedText,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const handleLiveCapture = async (data: { url: string; file: File; type: 'image' | 'video' }) => {
    if (!user || !db || !matchId) return;
    try {
      if (data.type === 'image') {
        const compressed = await compressImage(data.file, 0.65);
        const url = await uploadFile(`matches/${matchId}/${Date.now()}.jpg`, compressed);
        await addDoc(collection(db, 'matches', matchId, 'messages'), { senderId: user.uid, imageUrl: url, timestamp: serverTimestamp() });
      } else {
        const url = await uploadFile(`matches/${matchId}/${Date.now()}.mp4`, data.file);
        await addDoc(collection(db, 'matches', matchId, 'messages'), { senderId: user.uid, videoUrl: url, timestamp: serverTimestamp() });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Upload Ripple", description: "Failed to share media." });
    }
  };

  if (matchLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-primary opacity-20" /></div>;

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-white">
      <header className="flex items-center gap-4 px-4 h-14 border-b shrink-0 bg-white/80 backdrop-blur-md z-20">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full"><ChevronLeft className="w-5 h-5" /></Button>
        <Avatar className="w-10 h-10 border-2 border-primary/20"><AvatarImage src={matchInfo.photoUrl || undefined} /><AvatarFallback>{matchInfo.name[0]}</AvatarFallback></Avatar>
        <div className="flex-grow text-left"><h2 className="font-black text-sm tracking-tight truncate">{matchInfo.name}</h2><p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest leading-none">Spark Room</p></div>
        <div className="flex items-center gap-1">
          <DonationDialog />
          <Button variant="ghost" size="sm" onClick={toggleSelectMode} className={cn("h-7 text-[8px] font-black uppercase tracking-widest px-3 rounded-full", isSelectMode ? "bg-primary text-white" : "text-muted-foreground")}>{isSelectMode ? 'Cancel' : 'Manage'}</Button>
        </div>
      </header>

      <main ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messagesLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary opacity-20" /></div>
        ) : (
          messages?.map((msg: any) => {
            const isMe = msg.senderId === user?.uid;
            const isSelected = selectedIds.has(msg.id);
            const textToShow = msg.encryptedText ? (decryptedMessages[msg.id] || "...") : msg.text;
            return (
              <div key={msg.id} onClick={() => isSelectMode && isMe && toggleSelection(msg.id)} className={cn("flex group", isMe ? 'justify-end' : 'justify-start', isSelectMode && isMe ? "cursor-pointer" : "")}>
                <div className="flex flex-col gap-1 items-end max-w-[85%]">
                  <div className={cn("px-5 py-4 rounded-[2.2rem] text-sm shadow-sm transition-all relative", isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-foreground rounded-tl-none border', isSelected && "ring-2 ring-primary ring-offset-2 opacity-60")}>
                    {msg.imageUrl && <div className="rounded-[1.8rem] overflow-hidden w-60 h-72"><img src={msg.imageUrl} className="w-full h-full object-cover" /></div>}
                    {msg.videoUrl && <div className="rounded-2xl overflow-hidden w-60 aspect-video bg-black"><video src={msg.videoUrl} controls className="w-full h-full" /></div>}
                    {msg.fileUrl && (
                      <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-dashed text-left">
                        <FileIcon className="w-6 h-6 text-primary" />
                        <div className="min-w-0 flex-grow"><p className="font-bold text-xs truncate">{msg.fileName}</p><p className="text-[8px] font-black uppercase">Secured Document</p></div>
                        {!isSelectMode && <Button size="sm" variant="ghost" className="text-primary text-[9px] font-black" onClick={() => window.open(msg.fileUrl)}>Get</Button>}
                      </div>
                    )}
                    {textToShow && <span className="font-semibold text-left block mt-1">{textToShow}</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      <footer className="p-4 border-t pb-8 bg-white/80 backdrop-blur-xl">
        {isSelectMode ? (
           <div className="flex items-center gap-4 animate-in slide-in-from-bottom-4">
             <div className="flex-grow text-left"><p className="text-[10px] font-black uppercase text-primary">{selectedIds.size} Retractions Queued</p></div>
             <Button variant="outline" onClick={() => setIsSelectMode(false)} className="rounded-xl h-12">Cancel</Button>
             <Button onClick={handleDeleteSelected} disabled={isSending || selectedIds.size === 0} className="rounded-xl h-12 gradient-bg"><Trash2 className="w-4 h-4 mr-2" /> Purge</Button>
           </div>
        ) : (
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(`matches/${matchId}/${Date.now()}-${f.name}`, f); await addDoc(collection(db!, 'matches', matchId, 'messages'), { senderId: user?.uid, fileUrl: url, fileName: f.name, timestamp: serverTimestamp() }); }}} className="hidden" />
            <Popover>
              <PopoverTrigger asChild><Button variant="ghost" size="icon" className="rounded-xl bg-muted/40 h-12 w-12"><Camera className="w-6 h-6" /></Button></PopoverTrigger>
              <PopoverContent className="w-48 p-2 rounded-2xl border-none shadow-2xl" side="top" align="start">
                <Button variant="ghost" onClick={() => setIsCameraOpen(true)} className="w-full justify-start gap-3 py-4 h-auto rounded-xl"><Zap className="w-4 h-4 text-primary" /><span className="font-bold text-xs uppercase">Live Camera</span></Button>
                <Button variant="ghost" onClick={() => fileInputRef.current?.click()} className="w-full justify-start gap-3 py-4 h-auto rounded-xl border-t"><Paperclip className="w-4 h-4 text-primary" /><span className="font-bold text-xs uppercase">Document</span></Button>
              </PopoverContent>
            </Popover>
            <form onSubmit={handleSendMessage} className="flex-grow flex gap-2">
              <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Respectful message..." className="rounded-2xl bg-muted/40 border-none h-12 px-6" />
              <Button type="submit" size="icon" className="rounded-xl h-12 w-12 gradient-bg shrink-0 shadow-lg" disabled={!newMessage.trim() || isSending}><Send className="w-5 h-5" /></Button>
            </form>
          </div>
        )}
      </footer>
      <LiveCamera isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleLiveCapture} />
    </div>
  );
}

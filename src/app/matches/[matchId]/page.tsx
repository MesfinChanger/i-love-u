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
  Zap,
  X,
  Trash2,
  CheckCircle2,
  Square,
  CheckSquare
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
import { generateIcebreaker } from '@/ai/flows/generate-icebreaker-flow';
import { moderateImage } from '@/ai/flows/moderate-image-flow';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { translateMessage } from '@/ai/flows/translate-flow';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
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
import Link from 'next/link';
import { LiveCamera } from '@/components/LiveCamera';
import { Progress } from "@/components/ui/progress";
import { compressImage, fileToDataUri } from '@/lib/image-utils';

const CHAT_SHORTCUTS = [
  { id: 'teachable', label: 'Teachable Pic', icon: BookOpen },
  { id: 'holiday', label: 'Holiday Moment', icon: TreePine },
  { id: 'birthday', label: 'Birthday Spark', icon: Cake }
];

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
      photoUrl: partnerProfile?.photoUrl || null,
      interests: partnerProfile?.interests || ['Respect', 'Love']
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
      toast({ title: "Retracting Messages...", description: `Clearing ${idsToDelete.length} moments from room. ✨` });
      
      for (const id of idsToDelete) {
        const msg = messages?.find((m: any) => m.id === id);
        if (msg) {
          if (msg.imageUrl) await deleteFile(msg.imageUrl);
          if (msg.videoUrl) await deleteFile(msg.videoUrl);
          if (msg.fileUrl) await deleteFile(msg.fileUrl);
          await deleteDoc(doc(db, 'matches', matchId, 'messages', id));
        }
      }
      
      toast({ title: "Room Secured", description: "Selected moments have been purged. ❤️" });
      setSelectedIds(new Set());
      setIsSelectMode(false);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Purge protocol interrupted." });
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
      const path = `matches/${matchId}/${Date.now()}`;
      if (data.type === 'image') {
        const compressed = await compressImage(data.file, 0.65);
        const dataUri = await fileToDataUri(compressed);
        const mod = await moderateImage({ photoDataUri: dataUri });
        if (mod.isSensitive) {
          toast({ variant: "destructive", title: "Policy Blocked", description: "Sensitive content." });
          return;
        }
        const cloudUrl = await uploadFile(`${path}.jpg`, compressed);
        await addDoc(collection(db, 'matches', matchId, 'messages'), { senderId: user.uid, imageUrl: cloudUrl, timestamp: serverTimestamp() });
      } else {
        const cloudUrl = await uploadFile(`${path}.mp4`, data.file);
        await addDoc(collection(db, 'matches', matchId, 'messages'), { senderId: user.uid, videoUrl: cloudUrl, timestamp: serverTimestamp() });
      }
      toast({ title: "Moment Shared", description: "Secured in room! ✨" });
    } catch (e) {
      toast({ variant: "destructive", title: "Upload Ripple", description: "Failed to share media." });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !db || !matchId) return;
    try {
      const cloudUrl = await uploadFile(`matches/${matchId}/${Date.now()}-${file.name}`, file);
      await addDoc(collection(db, 'matches', matchId, 'messages'), {
        senderId: user.uid, fileUrl: cloudUrl, fileName: file.name, fileType: file.type, fileSize: file.size, timestamp: serverTimestamp(),
      });
      toast({ title: "File Shared", description: `${file.name} sent.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to upload file." });
    }
  };

  const handleTranslate = async (msgId: string, text: string) => {
    if (translatingIds.has(msgId)) return;
    setTranslatingIds(prev => new Set(prev).add(msgId));
    try {
      const result = await translateMessage({ text, targetLanguage: myProfile?.preferredLanguage || 'English' });
      await updateDoc(doc(db!, 'matches', matchId, 'messages', msgId), { [`translations.${myProfile?.preferredLanguage || 'English'}`]: result.translatedText });
    } finally {
      translatingIds.delete(msgId);
      setTranslatingIds(new Set(translatingIds));
    }
  };

  const handleSpeak = async (text: string) => {
    try {
      const result = await textToSpeech({ text });
      new Audio(result.media).play();
    } catch (e) {}
  };

  if (matchLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-primary opacity-20" /></div>;

  const isDatingMatch = matchData?.type === 'date';

  return (
    <div className={cn("flex flex-col h-[100dvh] overflow-hidden", isDatingMatch ? "bg-accent/30" : "bg-white")}>
      <header className="flex items-center gap-4 px-4 h-14 border-b shrink-0 bg-white/80 backdrop-blur-md z-20">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full w-9 h-9"><ChevronLeft className="w-5 h-5" /></Button>
        <Avatar className="w-10 h-10 border-2 border-primary/20"><AvatarImage src={matchInfo.photoUrl || undefined} className="object-cover" /><AvatarFallback>{matchInfo.name[0]}</AvatarFallback></Avatar>
        <div className="flex-grow min-w-0">
          <h2 className="font-black text-sm tracking-tight truncate">{matchInfo.name}</h2>
          <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest leading-none">{isDatingMatch ? "Spark Room" : "Friendship"}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSelectMode}
          className={cn("h-7 text-[8px] font-black uppercase tracking-widest px-3 rounded-full", isSelectMode ? "bg-primary text-white" : "text-muted-foreground")}
        >
          {isSelectMode ? 'Cancel' : 'Manage'}
        </Button>
      </header>

      {!hasAcceptedPolicy && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-between shrink-0">
           <p className="text-[10px] font-bold text-amber-800 uppercase">View Only Mode Active</p>
           <Button size="sm" variant="ghost" className="h-7 text-[9px] font-black uppercase text-amber-900" asChild><Link href="/policy/agree">Agree to Unlock</Link></Button>
        </div>
      )}

      <main ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar" role="log">
        {messagesLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary opacity-20" /></div>
        ) : (
          messages?.map((msg: any) => {
            const isMe = msg.senderId === user?.uid;
            const isSelected = selectedIds.has(msg.id);
            const textToShow = msg.encryptedText ? (decryptedMessages[msg.id] || "...") : msg.text;
            const translation = msg.translations?.[myProfile?.preferredLanguage || 'English'];
            const actualText = translation || textToShow;

            return (
              <div 
                key={msg.id} 
                onClick={() => isSelectMode && isMe && toggleSelection(msg.id)}
                className={cn(
                  "flex animate-in fade-in slide-in-from-bottom-2 group", 
                  isMe ? 'justify-end' : 'justify-start',
                  isSelectMode && isMe ? "cursor-pointer" : ""
                )}
              >
                <div className="flex flex-col gap-1 items-end max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1">
                    {isSelectMode && isMe && (
                      <div className="animate-in zoom-in-95">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-muted-foreground/30" />}
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "px-5 py-4 rounded-[2.2rem] text-sm shadow-sm transition-all relative", 
                    isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-foreground rounded-tl-none border',
                    isSelected && "ring-2 ring-primary ring-offset-2 opacity-60"
                  )}>
                    {msg.imageUrl ? (
                      <div className="relative w-60 h-72 rounded-[1.8rem] overflow-hidden">
                        <img 
                          src={msg.imageUrl} 
                          alt="Moment" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : msg.videoUrl ? (
                      <div className="relative w-60 aspect-video rounded-2xl overflow-hidden bg-black"><video src={msg.videoUrl} controls className="w-full h-full" /></div>
                    ) : msg.fileUrl ? (
                      <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-dashed">
                        <FileIcon className="w-6 h-6 text-primary" />
                        <div className="min-w-0 flex-grow">
                          <p className="font-bold text-xs truncate">{msg.fileName}</p>
                          <p className="text-[8px] font-black uppercase">{(msg.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        {!isSelectMode && <Button size="sm" variant="ghost" className="text-primary text-[9px] font-black" onClick={() => window.open(msg.fileUrl)}>Get</Button>}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold">{actualText}</span>
                        {!isSelectMode && (
                          <div className="flex items-center gap-3 mt-1 opacity-40 justify-end">
                            {!isMe && !translation && textToShow !== "..." && <button onClick={() => handleTranslate(msg.id, textToShow)} className="flex items-center gap-1 hover:text-primary"><Languages className="w-2.5 h-2.5" /><span className="text-[8px] font-black uppercase">Translate</span></button>}
                            {actualText && actualText !== "..." && <button onClick={() => handleSpeak(actualText)} className="flex items-center gap-1 hover:text-primary"><Volume2 className="w-2.5 h-2.5" /><span className="text-[8px] font-black uppercase">Listen</span></button>}
                            <Lock className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px] rounded-[2.2rem]">
                         <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      <footer className="p-4 border-t pb-8 bg-white/80 backdrop-blur-xl shrink-0 space-y-3">
        {isSelectMode ? (
           <div className="flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-300">
             <div className="flex-grow">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">{selectedIds.size} Retractions Queued</p>
                <p className="text-[9px] text-muted-foreground italic">Batch cloud purge protocol.</p>
             </div>
             <Button variant="outline" onClick={() => setIsSelectMode(false)} className="rounded-xl h-12 px-6 font-black uppercase text-[10px] border-2">Cancel</Button>
             <Button 
                onClick={handleDeleteSelected} 
                disabled={isSending || selectedIds.size === 0} 
                className="rounded-xl h-12 px-6 gradient-bg shadow-xl flex items-center gap-2 font-black uppercase text-[10px]"
             >
               {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
               Purge selected
             </Button>
           </div>
        ) : (
          <>
            {isStorageUploading && (
              <div className="px-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between text-[8px] font-black uppercase text-primary mb-1"><span>Securing Media...</span><span>{Math.round(uploadProgress)}%</span></div>
                <Progress value={uploadProgress} className="h-1 bg-primary/10" />
              </div>
            )}

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
               {CHAT_SHORTCUTS.map((shortcut) => <Button key={shortcut.id} variant="outline" size="sm" onClick={() => setIsCameraOpen(true)} className="rounded-full shrink-0 h-9 gap-2 border-primary/10 text-primary font-black text-[9px] uppercase tracking-widest px-4" disabled={!hasAcceptedPolicy}><shortcut.icon className="w-3.5 h-3.5" /> {shortcut.label}</Button>)}
            </div>

            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const c = await compressImage(f, 0.65); const u = await fileToDataUri(c); handleLiveCapture({ url: u, file: c, type: 'image' }); }}} ref={galleryInputRef} className="hidden" />
              
              <Popover>
                <PopoverTrigger asChild><Button variant="ghost" size="icon" className="rounded-xl shrink-0 bg-muted/40 h-12 w-12 text-muted-foreground" disabled={isSending || isStorageUploading || !hasAcceptedPolicy}><Camera className="w-6 h-6" /></Button></PopoverTrigger>
                <PopoverContent className="w-48 p-2 rounded-2xl border-none shadow-2xl" side="top" align="start">
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setIsCameraOpen(true)} className="justify-start gap-3 rounded-xl py-5 h-auto"><Zap className="w-4 h-4 text-primary" /><span className="font-bold text-xs uppercase">Live Camera</span></Button>
                    <Button variant="ghost" size="sm" onClick={() => galleryInputRef.current?.click()} className="justify-start gap-3 rounded-xl py-5 h-auto"><ImageIcon className="w-4 h-4 text-primary" /><span className="font-bold text-xs uppercase">Gallery</span></Button>
                    <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="justify-start gap-3 rounded-xl py-5 h-auto border-t mt-1"><Paperclip className="w-4 h-4 text-primary" /><span className="font-bold text-xs uppercase">Share File</span></Button>
                  </div>
                </PopoverContent>
              </Popover>

              <form onSubmit={handleSendMessage} className="flex-grow flex gap-2">
                <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={hasAcceptedPolicy ? "Respectful message..." : "Agree to policy"} className="rounded-2xl bg-muted/40 border-none h-12 px-6 font-bold" disabled={isSending || !hasAcceptedPolicy} />
                <Button type="submit" size="icon" className="rounded-xl h-12 w-12 gradient-bg shrink-0 shadow-lg" disabled={!newMessage.trim() || isSending || !hasAcceptedPolicy}>{isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}</Button>
              </form>
            </div>
          </>
        )}
      </footer>
      <LiveCamera isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleLiveCapture} />
    </div>
  );
}

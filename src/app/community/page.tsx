'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Globe2, 
  Send, 
  Loader2, 
  ShieldCheck, 
  Sparkles, 
  Heart,
  Ghost,
  MessageSquare,
  Camera,
  EyeOff,
  Paperclip,
  FileIcon,
  Volume2,
  Video,
  PlayCircle,
  Image as ImageIcon,
  ShieldAlert,
  Zap,
  X,
  Trash2,
  Settings
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { useUser, useFirestore, useCollection, useDoc, useFirebaseStorage } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, limit, doc, deleteDoc } from 'firebase/firestore';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { moderateImage } from '@/ai/flows/moderate-image-flow';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { LiveCamera } from '@/components/LiveCamera';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { Progress } from "@/components/ui/progress";
import { compressImage, fileToDataUri } from '@/lib/image-utils';

export default function CommunityPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { uploadFile, isUploading: isStorageUploading, progress: uploadProgress } = useFirebaseStorage();
  const { toast } = useToast();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ file: File; url: string } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ file: File; url: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [speakingIds, setSpeakingIds] = useState<Set<string>>(new Set());
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: myProfile } = useDoc(userRef);

  const hasAcceptedPolicy = myProfile?.policyAccepted === true;

  const communityQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'communityMessages'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );
  }, [db, user]);

  const { data: messages, loading } = useCollection(communityQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasAcceptedPolicy) return;
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage({ file, url });
      setSelectedVideo(null);
      setSelectedFile(null);
      toast({ title: "Photo Ready", description: "Add a caption and post to the wall! ✨" });
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (!hasAcceptedPolicy) return;
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (!file) continue;
        
        const url = URL.createObjectURL(file);
        if (item.type.startsWith('image/')) {
          setSelectedImage({ file, url });
          setSelectedVideo(null);
          setSelectedFile(null);
        } else if (item.type.startsWith('video/')) {
          setSelectedVideo({ file, url });
          setSelectedImage(null);
          setSelectedFile(null);
        } else {
          setSelectedFile(file);
          setSelectedImage(null);
          setSelectedVideo(null);
        }
        toast({ title: "Moment Pasted", description: "Ready to share with the circle. ❤️" });
      }
    }
  };

  const handleLiveCapture = (data: { url: string; file: File; type: 'image' | 'video' }) => {
    if (data.type === 'image') {
      setSelectedImage({ file: data.file, url: data.url });
      setSelectedVideo(null);
    } else {
      setSelectedVideo({ file: data.file, url: data.url });
      setSelectedImage(null);
    }
    setSelectedFile(null);
    toast({ title: "Live Capture Secured", description: "Post your moment to the wall. ✨" });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasAcceptedPolicy) return;
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(null);
      setSelectedVideo(null);
      toast({ title: "File Ready", description: "Shared documents inspire prosperity. ❤️" });
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
      toast({ variant: "destructive", title: "Audio Ripple", description: "The platform is momentarily silent." });
    } finally {
      speakingIds.delete(msgId);
      setSpeakingIds(new Set(speakingIds));
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!db || isDeleting) return;
    setIsDeleting(id);
    try {
      await deleteDoc(doc(db, 'communityMessages', id));
      toast({ title: "Post Removed", description: "Cleared from Global Circle. ✨" });
    } catch (e) {
      const permissionError = new FirestorePermissionError({
        path: `communityMessages/${id}`,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!hasAcceptedPolicy) {
      toast({ variant: "destructive", title: "Action Denied", description: "Agreement required to post. ✨" });
      return;
    }
    if ((!newMessage.trim() && !selectedImage && !selectedVideo && !selectedFile) || !user || !db || isSending) return;

    setIsSending(true);
    try {
      const promises: Promise<any>[] = [];
      let imageUrl: string | null = null;
      let videoUrl: string | null = null;
      let fileUrl: string | null = null;
      let fileName: string | null = null;
      let isSensitive = false;

      if (newMessage.trim()) {
        promises.push(moderateText({ text: newMessage, context: 'chat' }).then(res => {
          if (res.isFlagged) throw new Error(`TEXT_FLAGGED: ${res.reason}`);
          return res;
        }));
      }

      if (selectedImage) {
        const compressed = await compressImage(selectedImage.file, 0.65);
        const photoDataUri = await fileToDataUri(compressed);
        promises.push(moderateImage({ photoDataUri }).then(async res => {
          if (res.isSensitive) throw new Error("IMAGE_SENSITIVE");
          isSensitive = res.isSensitive;
          imageUrl = await uploadFile(`community/${Date.now()}-${compressed.name}`, compressed);
          return res;
        }));
      }

      if (selectedVideo) {
        promises.push(uploadFile(`community_videos/${Date.now()}-${selectedVideo.file.name}`, selectedVideo.file).then(url => {
          videoUrl = url;
          return url;
        }));
      }

      if (selectedFile) {
        promises.push(uploadFile(`community_files/${Date.now()}-${selectedFile.name}`, selectedFile).then(url => {
          fileUrl = url;
          fileName = selectedFile!.name;
          return url;
        }));
      }

      await Promise.all(promises);

      const messageData = {
        senderId: user.uid,
        senderNickname: myProfile?.displayName || myProfile?.publicNickname || "Mystery Heart",
        text: newMessage,
        imageUrl: imageUrl,
        videoUrl: videoUrl,
        fileUrl: fileUrl,
        fileName: fileName,
        isSensitive: isSensitive,
        timestamp: serverTimestamp(),
      };

      const collRef = collection(db, 'communityMessages');
      addDoc(collRef, messageData)
        .catch(async (err) => {
          const permissionError = new FirestorePermissionError({
            path: collRef.path,
            operation: 'create',
            requestResourceData: messageData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      setNewMessage('');
      setSelectedImage(null);
      setSelectedVideo(null);
      setSelectedFile(null);
      toast({ title: "Moment Shared!", description: "Your contribution is live on the wall. ❤️" });
    } catch (error: any) {
      if (error.message.startsWith("TEXT_FLAGGED")) {
        toast({ variant: "destructive", title: "Respect Rule Violation", description: error.message.split(": ")[1] || "Disrespectful words are forbidden." });
      } else if (error.message === "IMAGE_SENSITIVE") {
        toast({ variant: "destructive", title: "Safe Space Protocol", description: "Image contains sensitive content and was blocked by AI. ✨" });
      } else if (error.message === "Storage not initialized.") {
        toast({ variant: "destructive", title: "Bridge Offline", description: "Mission Control is waiting for project credentials. ❤️" });
      } else if (error.code === 'storage/unknown') {
        toast({ 
          variant: "destructive", 
          title: "Storage Configuration Ripple", 
          description: "Firebase Storage needs setup. Check Rules & CORS in console. 🛠️",
          action: <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={() => window.open('https://console.firebase.google.com/')}>Open Console</Button>
        });
      } else {
        toast({ variant: "destructive", title: "Sharing Ripple", description: error.message || "Could not secure your post right now." });
      }
    } finally {
      setIsSending(false);
    }
  };

  if (!mounted) return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white">
       <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="flex flex-col h-[100dvh] bg-muted/30 overflow-hidden">
      <Header />
      
      {!hasAcceptedPolicy && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-between animate-in slide-in-from-top-2 shrink-0">
           <div className="flex items-center gap-2 text-amber-800">
              <ShieldAlert className="w-4 h-4" />
              <p className="text-[10px] font-bold uppercase tracking-tight">View Only Mode Active</p>
           </div>
           <Link href="/policy/agree">
              <Button size="sm" variant="ghost" className="h-7 text-[9px] font-black uppercase text-amber-900 hover:bg-amber-200">Agree to Interact</Button>
           </Link>
        </div>
      )}

      <div className="bg-primary/5 border-b p-2 flex items-center justify-center gap-2 shrink-0">
         <ShieldCheck className="w-3.5 h-3.5 text-primary animate-pulse" />
         <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">Global Moderation Active • Respect is Mandatory</p>
      </div>

      <main ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
        <div className="text-center py-8 space-y-3 opacity-60">
           <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-sm border">
              <Globe2 className="w-8 h-8 text-primary" />
           </div>
           <div>
              <h2 className="text-xl font-black tracking-tighter">{t('community.title')}</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest">{t('community.subtitle')}</p>
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary/20" /></div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg: any, i) => {
            const isMe = msg.senderId === user?.uid;
            const isMedia = !!(msg.imageUrl || msg.videoUrl || msg.fileUrl);
            return (
              <div key={msg.id || i} className={cn("flex flex-col gap-1 group animate-in fade-in slide-in-from-bottom-2 duration-300", isMe ? "items-end" : "items-start")}>
                <div className="flex items-center gap-2 px-2">
                   <span className="text-[9px] font-black uppercase text-muted-foreground truncate max-w-[120px]">{msg.senderNickname}</span>
                   <span className="text-[7px] text-muted-foreground/40 shrink-0">{msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}</span>
                   {isMe && (
                     <button onClick={() => handleDeletePost(msg.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500">
                        {isDeleting === msg.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                     </button>
                   )}
                </div>
                <div className={cn(
                  "max-w-[85%] px-4 py-3 rounded-[1.8rem] text-sm font-medium shadow-sm transition-all flex flex-col gap-3 relative",
                  isMe ? "bg-primary text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border"
                )}>
                  {msg.imageUrl && (
                    <div className="relative w-full aspect-square min-w-[200px] overflow-hidden rounded-2xl bg-muted/20">
                      {msg.isSensitive && !myProfile?.settings?.allowSensitiveContent ? (
                         <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-center p-6 gap-2">
                            <EyeOff className="w-8 h-8 text-white/20" />
                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">{t('community.flagged')}</p>
                         </div>
                      ) : (
                        <Image src={msg.imageUrl} alt="Community moment" fill className="object-cover" />
                      )}
                    </div>
                  )}
                  {msg.videoUrl && (
                    <div className="relative w-full aspect-video min-w-[200px] overflow-hidden rounded-2xl bg-black shadow-inner">
                       <video src={msg.videoUrl} controls className="w-full h-full" playsInline />
                    </div>
                  )}
                  {msg.fileUrl && (
                    <div className={cn("flex items-center gap-3 p-3 rounded-xl border border-dashed", isMe ? "bg-white/10 border-white/20" : "bg-muted/30 border-primary/10")}>
                       <FileIcon className="w-5 h-5 shrink-0" />
                       <div className="min-w-0 flex-grow">
                          <p className="text-[10px] font-bold truncate">{msg.fileName || "Community Document"}</p>
                       </div>
                       <Button size="sm" variant="ghost" className="h-7 text-[8px] font-black uppercase px-2 shrink-0" onClick={() => window.open(msg.fileUrl)}>Download</Button>
                    </div>
                  )}
                  {msg.text && (
                    <div className="flex flex-col gap-2">
                       <p className="break-words">{msg.text}</p>
                       <div className="flex justify-end">
                          <button onClick={() => handleSpeak(msg.id, msg.text)} className={cn("flex items-center gap-1.5 transition-opacity opacity-40 hover:opacity-100", isMe ? "text-white" : "text-primary")}>
                            {speakingIds.has(msg.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />}
                            <span className="text-[8px] font-black uppercase">{t('community.listen')}</span>
                          </button>
                       </div>
                    </div>
                  )}

                  {isMedia && (
                    <div className={cn("flex justify-between items-center mt-1 pt-1 border-t", isMe ? "border-white/10" : "border-slate-100")}>
                       <span className="text-[8px] font-black uppercase opacity-40">{msg.senderNickname}</span>
                       <span className="text-[7px] opacity-30">
                          {msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                       </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-20">
             <MessageSquare className="w-12 h-12" />
             <p className="text-sm font-bold uppercase tracking-widest">{t('community.empty')}</p>
          </div>
        )}
      </main>

      <footer className="p-4 bg-white/80 backdrop-blur-xl border-t pb-24 shrink-0 space-y-3">
        {(selectedImage || selectedVideo || selectedFile) && (
          <div className="flex flex-col gap-3 animate-in zoom-in-95 bg-muted/20 p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              {selectedImage ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg shrink-0">
                  <Image src={selectedImage.url} alt="Preview" fill className="object-cover" />
                  <button onClick={() => setSelectedImage(null)} className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-bl-xl"><X className="w-3 h-3" /></button>
                </div>
              ) : selectedVideo ? (
                <div className="bg-slate-900 p-3 rounded-xl flex items-center gap-3 border border-primary/20 shadow-lg shrink-0">
                   <PlayCircle className="w-4 h-4 text-primary" />
                   <span className="text-[10px] text-white font-bold truncate max-w-[120px]">{selectedVideo.file.name}</span>
                   <button onClick={() => setSelectedVideo(null)} className="text-white/40 hover:text-white"><X className="w-3 h-3" /></button>
                </div>
              ) : selectedFile ? (
                <div className="bg-muted/50 p-3 rounded-xl flex items-center gap-3 border border-primary/10 shadow-sm shrink-0">
                   <FileIcon className="w-4 h-4 text-primary" />
                   <span className="text-[10px] font-bold truncate max-w-[120px]">{selectedFile.name}</span>
                   <button onClick={() => setSelectedFile(null)} className="text-muted-foreground hover:text-primary"><X className="w-3 h-3" /></button>
                </div>
              ) : null}
              <div className="flex-grow text-left pl-2">
                 <p className="text-[9px] font-black uppercase text-primary">Media Queue Active</p>
                 <p className="text-[8px] font-bold text-muted-foreground italic uppercase">Caption & Post below</p>
              </div>
            </div>
            
            {isStorageUploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-black uppercase">
                  <span>Securing Media...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1" />
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="rounded-xl h-12 w-12 bg-muted/40 text-muted-foreground shrink-0" disabled={!hasAcceptedPolicy}>
                <Camera className="w-6 h-6" />
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
                   <span className="font-bold text-xs uppercase tracking-tight">Post File</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Input 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)} 
            onPaste={handlePaste}
            placeholder={hasAcceptedPolicy ? t('community.placeholder') : t('community.viewOnly')} 
            className="rounded-2xl bg-muted/40 border-none h-12 px-6 font-bold text-sm"
            disabled={isSending || !hasAcceptedPolicy}
          />
          <Button type="submit" size="icon" className="rounded-xl h-12 w-12 gradient-bg shrink-0 shadow-lg" disabled={(!newMessage.trim() && !selectedImage && !selectedVideo && !selectedFile) || isSending || !hasAcceptedPolicy}>
            {isSending || isStorageUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </footer>
      
      <LiveCamera 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onCapture={handleLiveCapture} 
      />

      <BottomNav />
    </div>
  );
}

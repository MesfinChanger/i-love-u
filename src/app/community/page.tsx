
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
  Image as ImageIcon
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { useUser, useFirestore, useCollection, useDoc, useFirebaseStorage } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, limit, doc } from 'firebase/firestore';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { moderateImage } from '@/ai/flows/moderate-image-flow';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function CommunityPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { uploadFile, isUploading: isStorageUploading } = useFirebaseStorage();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [speakingIds, setSpeakingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: myProfile } = useDoc(userRef);

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
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setSelectedVideo(null);
      setSelectedFile(null);
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      setSelectedImage(null);
      setSelectedImagePreview(null);
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(null);
      setSelectedImagePreview(null);
      setSelectedVideo(null);
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

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!newMessage.trim() && !selectedImage && !selectedVideo && !selectedFile) || !user || !db || isSending) return;

    setIsSending(true);
    try {
      let imageUrl = null;
      let videoUrl = null;
      let fileUrl = null;
      let fileName = null;
      let isSensitive = false;

      if (newMessage.trim()) {
        const textModeration = await moderateText({ text: newMessage, context: 'chat' });
        if (textModeration.isFlagged) {
          toast({ variant: "destructive", title: "Respect Rule Violation", description: textModeration.reason || "Disrespectful words are forbidden." });
          setIsSending(false);
          return;
        }
      }

      if (selectedImage && imagePreview) {
        const imageModeration = await moderateImage({ photoDataUri: imagePreview });
        if (imageModeration.isSensitive) {
          toast({ variant: "destructive", title: "Safe Space Protocol", description: "Image contains sensitive content and was blocked by AI. ✨" });
          setIsSending(false);
          return;
        }
        imageUrl = await uploadFile(`community/${Date.now()}-${selectedImage.name}`, selectedImage);
        isSensitive = imageModeration.isSensitive;
      }

      if (selectedVideo) {
        videoUrl = await uploadFile(`community_videos/${Date.now()}-${selectedVideo.name}`, selectedVideo);
      }

      if (selectedFile) {
        fileUrl = await uploadFile(`community_files/${Date.now()}-${selectedFile.name}`, selectedFile);
        fileName = selectedFile.name;
      }

      await addDoc(collection(db, 'communityMessages'), {
        senderId: user.uid,
        senderNickname: myProfile?.publicNickname || "Mystery Heart",
        text: newMessage,
        imageUrl: imageUrl,
        videoUrl: videoUrl,
        fileUrl: fileUrl,
        fileName: fileName,
        isSensitive: isSensitive,
        timestamp: serverTimestamp(),
      });

      setNewMessage('');
      setSelectedImage(null);
      setSelectedImagePreview(null);
      setSelectedVideo(null);
      setSelectedFile(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not post to wall." });
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
              <h2 className="text-xl font-black tracking-tighter">Global Circle Wall</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest">Bridging Hearts Across Every City</p>
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary/20" /></div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg: any, i) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id || i} className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}>
                <div className="flex items-center gap-2 px-2">
                   <span className="text-[9px] font-black uppercase text-muted-foreground">{msg.senderNickname}</span>
                   <span className="text-[7px] text-muted-foreground/40">{msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}</span>
                </div>
                <div className={cn(
                  "max-w-[85%] px-4 py-3 rounded-[1.8rem] text-sm font-medium shadow-sm transition-all flex flex-col gap-3",
                  isMe ? "bg-primary text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border"
                )}>
                  {msg.imageUrl && (
                    <div className="relative w-full aspect-square min-w-[200px] overflow-hidden rounded-2xl bg-muted/20">
                      {msg.isSensitive && !myProfile?.settings?.allowSensitiveContent ? (
                         <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-center p-6 gap-2">
                            <EyeOff className="w-8 h-8 text-white/20" />
                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Flagged by AI</p>
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
                       <Button size="sm" variant="ghost" className="h-7 text-[8px] font-black uppercase px-2" onClick={() => window.open(msg.fileUrl)}>Download</Button>
                    </div>
                  )}
                  {msg.text && (
                    <div className="flex flex-col gap-2">
                       <p>{msg.text}</p>
                       <div className="flex justify-end">
                          <button onClick={() => handleSpeak(msg.id, msg.text)} className={cn("flex items-center gap-1.5 transition-opacity opacity-40 hover:opacity-100", isMe ? "text-white" : "text-primary")}>
                            {speakingIds.has(msg.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />}
                            <span className="text-[8px] font-black uppercase">Listen</span>
                          </button>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-20">
             <MessageSquare className="w-12 h-12" />
             <p className="text-sm font-bold uppercase tracking-widest">The Wall is Silent.<br/>Spark the First Message.</p>
          </div>
        )}
      </main>

      <footer className="p-4 bg-white/80 backdrop-blur-xl border-t pb-24 shrink-0 space-y-3">
        {(imagePreview || selectedVideo || selectedFile) && (
          <div className="flex items-center gap-3 animate-in zoom-in-95">
            {imagePreview ? (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/20">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button onClick={() => { setSelectedImage(null); setSelectedImagePreview(null); }} className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-bl-xl"><EyeOff className="w-3 h-3" /></button>
              </div>
            ) : selectedVideo ? (
              <div className="bg-slate-900 p-3 rounded-xl flex items-center gap-3 border border-primary/20">
                 <PlayCircle className="w-4 h-4 text-primary" />
                 <span className="text-[10px] text-white font-bold truncate max-w-[120px]">{selectedVideo.name}</span>
                 <button onClick={() => setSelectedVideo(null)} className="text-white/40 hover:text-white"><EyeOff className="w-3 h-3" /></button>
              </div>
            ) : selectedFile ? (
              <div className="bg-muted/50 p-3 rounded-xl flex items-center gap-3 border border-primary/10">
                 <FileIcon className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-bold truncate max-w-[120px]">{selectedFile.name}</span>
                 <button onClick={() => setSelectedFile(null)} className="text-muted-foreground hover:text-primary"><EyeOff className="w-3 h-3" /></button>
              </div>
            ) : null}
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
          <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="user" onChange={handleImageSelect} />
          <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleVideoSelect} />
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="rounded-xl h-12 w-12 bg-muted/40 text-muted-foreground">
                <Camera className="w-6 h-6" />
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
                <Button variant="ghost" size="sm" onClick={() => videoInputRef.current?.click()} className="justify-start gap-3 rounded-xl py-5 h-auto">
                   <Video className="w-4 h-4 text-primary" />
                   <span className="font-bold text-xs uppercase tracking-tight">Video</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="justify-start gap-3 rounded-xl py-5 h-auto border-t border-muted/50 mt-1">
                   <Paperclip className="w-4 h-4 text-primary" />
                   <span className="font-bold text-xs uppercase tracking-tight">Big File</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Input 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)} 
            placeholder="Share a respectful thought..." 
            className="rounded-2xl bg-muted/40 border-none h-12 px-6 font-bold text-sm"
            disabled={isSending}
          />
          <Button type="submit" size="icon" className="rounded-xl h-12 w-12 gradient-bg shrink-0 shadow-lg" disabled={(!newMessage.trim() && !selectedImage && !selectedVideo && !selectedFile) || isSending}>
            {isSending || isStorageUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </footer>
      
      <BottomNav />
    </div>
  );
}

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
  ImageIcon, 
  X,
  Camera,
  Video,
  FileIcon,
  Paperclip,
  Zap,
  Trash2,
  Image as LucideImageIcon,
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
import { collection, addDoc, query, orderBy, serverTimestamp, limit, doc, deleteDoc } from 'firebase/firestore';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { moderateImage } from '@/ai/flows/moderate-image-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Progress } from "@/components/ui/progress";
import { compressImage, fileToDataUri } from '@/lib/image-utils';
import { cn } from '@/lib/utils';
import { LiveCamera } from '@/components/LiveCamera';

/**
 * @fileOverview Universal Global Wall with Select-to-Delete Protocol.
 * Enforces "Respect is Mandatory" and enables live multi-media sharing.
 * Optimized for standard img rendering and batch secure deletion.
 */
export default function CommunityPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { uploadFile, deleteFile, isUploading, progress } = useFirebaseStorage();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<{ 
    file: File; 
    url: string; 
    type: 'image' | 'video' | 'file' 
  } | null>(null);

  const userRef = useMemoFirebase(() => db && user ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: myProfile } = useDoc(userRef);

  const communityQuery = useMemoFirebase(() => db ? query(collection(db, 'communityMessages'), orderBy('timestamp', 'asc'), limit(100)) : null, [db]);
  const { data: messages, loading } = useCollection(communityQuery);

  useEffect(() => {
    if (scrollRef.current && !isSelectMode) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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

  const handleLiveCapture = async (data: { url: string; file: File; type: 'image' | 'video' }) => {
    setAttachedMedia({ file: data.file, url: data.url, type: data.type });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'file') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAttachedMedia({ file, url, type });
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!newMessage.trim() && !attachedMedia) || !user || !db || isSending) return;
    setIsSending(true);
    try {
      if (newMessage.trim()) {
        const moderation = await moderateText({ text: newMessage });
        if (moderation.isFlagged) {
          toast({
            variant: "destructive",
            title: "Respect Policy Ripple",
            description: moderation.reason || "Your message violates the mandatory respect rule. ❤️"
          });
          setIsSending(false);
          return;
        }
      }

      let imageUrl = null;
      let videoUrl = null;
      let fileUrl = null;
      let fileName = null;

      if (attachedMedia) {
        toast({ title: "Securing Media...", description: "Your moment is reaching the cloud bridge. ✨" });
        
        if (attachedMedia.type === 'image') {
          const compressed = await compressImage(attachedMedia.file, 0.65);
          const dataUri = await fileToDataUri(compressed);
          const modResult = await moderateImage({ photoDataUri: dataUri });
          if (modResult.isSensitive) {
            toast({ variant: "destructive", title: "Policy Blocked", description: "Sensitive content detected." });
            setIsSending(false);
            return;
          }
          imageUrl = await uploadFile(`community/images/${Date.now()}_${compressed.name}`, compressed);
        } else if (attachedMedia.type === 'video') {
          videoUrl = await uploadFile(`community/videos/${Date.now()}_${attachedMedia.file.name}`, attachedMedia.file);
        } else {
          fileUrl = await uploadFile(`community/files/${Date.now()}_${attachedMedia.file.name}`, attachedMedia.file);
          fileName = attachedMedia.file.name;
        }
      }
      
      await addDoc(collection(db, 'communityMessages'), {
        senderId: user.uid,
        senderNickname: myProfile?.publicNickname || "Mystery Heart",
        text: newMessage,
        imageUrl,
        videoUrl,
        fileUrl,
        fileName,
        timestamp: serverTimestamp(),
      });
      
      setNewMessage('');
      setAttachedMedia(null);
      toast({ title: "Shared!", description: "Your post is live on the wall. ❤️" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sharing Ripple", description: error.message || "Could not secure post." });
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!db || isSending || selectedIds.size === 0) return;
    setIsSending(true);
    try {
      const idsToDelete = Array.from(selectedIds);
      toast({ title: "Purging Moments...", description: `Cleaning ${idsToDelete.length} selected items. ✨` });
      
      for (const id of idsToDelete) {
        const msg = messages?.find((m: any) => m.id === id);
        if (msg) {
          if (msg.imageUrl) await deleteFile(msg.imageUrl);
          if (msg.videoUrl) await deleteFile(msg.videoUrl);
          if (msg.fileUrl) await deleteFile(msg.fileUrl);
          await deleteDoc(doc(db, 'communityMessages', id));
        }
      }
      
      toast({ title: "Purge Complete", description: "Selected moments have been cleared from the wall. ❤️" });
      setSelectedIds(new Set());
      setIsSelectMode(false);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not complete purge protocol." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-muted/30 overflow-hidden">
      <Header />
      <div className="bg-primary/5 border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <ShieldCheck className="w-3.5 h-3.5 text-primary animate-pulse" />
           <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">Global Wall • Respect is Mandatory</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSelectMode}
          className={cn("h-7 text-[9px] font-black uppercase tracking-widest px-3 rounded-full", isSelectMode ? "bg-primary text-white hover:bg-primary/90" : "text-muted-foreground")}
        >
          {isSelectMode ? 'Cancel Selection' : 'Manage Posts'}
        </Button>
      </div>

      <main 
        ref={scrollRef} 
        className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar"
        role="log"
        aria-label="Community conversation wall"
      >
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary opacity-20" /></div>
        ) : messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-20 space-y-4">
             <Globe2 className="w-16 h-16" />
             <p className="text-sm font-black uppercase tracking-widest">The wall is silent. Spark a message.</p>
          </div>
        ) : messages?.map((msg: any) => {
          const isOwn = msg.senderId === user?.uid;
          const isSelected = selectedIds.has(msg.id);

          return (
            <div 
              key={msg.id} 
              onClick={() => isSelectMode && isOwn && toggleSelection(msg.id)}
              className={cn(
                "flex flex-col gap-1 transition-all duration-300", 
                msg.senderId === user?.uid ? "items-end" : "items-start",
                isSelectMode && isOwn ? "cursor-pointer scale-[0.98]" : "",
                isSelected && "opacity-60"
              )}
            >
              <div className="flex items-center gap-2 px-2">
                {isSelectMode && isOwn && (
                  <div className="mr-1">
                    {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-primary" /> : <Square className="w-3.5 h-3.5 text-muted-foreground/30" />}
                  </div>
                )}
                <span className="text-[8px] font-black uppercase text-muted-foreground">{msg.senderNickname}</span>
              </div>
              <div className={cn(
                "max-w-[85%] px-4 py-3 rounded-[1.5rem] shadow-sm relative overflow-hidden", 
                msg.senderId === user?.uid ? "bg-primary text-white" : "bg-white border text-slate-800",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}>
                {msg.imageUrl && (
                  <div className={cn("relative w-full aspect-square rounded-xl overflow-hidden", msg.text ? "mb-2" : "mb-0")}>
                    <img 
                      src={msg.imageUrl} 
                      alt="Community share" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                {msg.videoUrl && (
                  <div className={cn("relative w-full aspect-video rounded-xl overflow-hidden bg-black", msg.text ? "mb-2" : "mb-0")}>
                     <video src={msg.videoUrl} controls className="w-full h-full" />
                  </div>
                )}
                {msg.fileUrl && (
                  <div className={cn("flex items-center gap-3 bg-black/10 p-3 rounded-xl border border-white/10", msg.text ? "mb-2" : "mb-0")}>
                     <FileIcon className="w-5 h-5 shrink-0" />
                     <div className="min-w-0 flex-grow">
                        <p className="text-[10px] font-bold truncate">{msg.fileName}</p>
                     </div>
                     {!isSelectMode && <Button size="sm" variant="ghost" className="h-7 text-[8px] font-black uppercase" onClick={() => window.open(msg.fileUrl)}>Get</Button>}
                </div>
                )}
                {msg.text && <p className="text-sm font-medium leading-relaxed">{msg.text}</p>}
                
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-[1px]">
                     <CheckCircle2 className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>

      <footer className="p-4 bg-white/80 backdrop-blur-xl border-t pb-24 shrink-0 space-y-3">
        {isSelectMode ? (
          <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
             <div className="flex-grow">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">{selectedIds.size} Moments Selected</p>
                <p className="text-[9px] text-muted-foreground italic">Ready for secure cloud purge.</p>
             </div>
             <Button 
              variant="outline" 
              onClick={() => setIsSelectMode(false)}
              className="rounded-xl h-12 px-6 font-black uppercase text-[10px] border-2"
             >
               Cancel
             </Button>
             <Button 
              onClick={handleDeleteSelected}
              disabled={isSending || selectedIds.size === 0}
              className="rounded-xl h-12 px-6 gradient-bg shadow-xl flex items-center gap-2 font-black uppercase text-[10px]"
             >
               {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
               Purge Selected
             </Button>
          </div>
        ) : (
          <>
            {isUploading && (
              <div className="space-y-1" role="status" aria-label={`Uploading: ${Math.round(progress)}%`}>
                <Progress value={progress} className="h-1" />
                <p className="text-[8px] font-black uppercase text-primary">Securing Media {Math.round(progress)}%</p>
              </div>
            )}
            
            {attachedMedia && (
              <div className="flex items-center gap-3 p-2 bg-muted/40 rounded-xl animate-in zoom-in-95">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900 flex items-center justify-center">
                   {attachedMedia.type === 'image' ? (
                     <img src={attachedMedia.url} alt="Selected" className="w-full h-full object-cover" />
                   ) : attachedMedia.type === 'video' ? (
                     <Video className="w-5 h-5 text-white" />
                   ) : (
                     <FileIcon className="w-5 h-5 text-white" />
                   )}
                </div>
                <p className="text-[10px] font-bold truncate flex-grow">{attachedMedia.file.name}</p>
                <Button variant="ghost" size="icon" onClick={() => setAttachedMedia(null)} className="rounded-full h-8 w-8 hover:bg-red-50 hover:text-red-500">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <input type="file" ref={galleryRef} onChange={(e) => handleFileSelect(e, 'image')} accept="image/*,video/*" className="hidden" />
              <input type="file" ref={fileRef} onChange={(e) => handleFileSelect(e, 'file')} className="hidden" />
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl h-12 w-12 bg-muted/40 text-muted-foreground"
                    aria-label="Attach Media"
                  >
                    <Camera className="w-6 h-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 rounded-2xl border-none shadow-2xl" side="top" align="start">
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setIsCameraOpen(true)} className="justify-start gap-3 rounded-xl py-5 h-auto">
                       <Zap className="w-4 h-4 text-primary" />
                       <span className="font-bold text-xs uppercase tracking-tight">Live Camera</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => galleryRef.current?.click()} className="justify-start gap-3 rounded-xl py-5 h-auto">
                       <LucideImageIcon className="w-4 h-4 text-primary" />
                       <span className="font-bold text-xs uppercase tracking-tight">Gallery</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()} className="justify-start gap-3 rounded-xl py-5 h-auto border-t border-muted/50 mt-1">
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
                  placeholder="Share a respectful thought..." 
                  className="rounded-2xl border-none bg-muted/40 h-12 font-bold px-6"
                />
                <Button 
                  type="submit" 
                  disabled={isSending || (!newMessage.trim() && !attachedMedia)} 
                  className="rounded-xl h-12 gradient-bg shadow-lg px-6 shrink-0"
                >
                  {isSending ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
              </form>
            </div>
          </>
        )}
      </footer>
      <BottomNav />
      <LiveCamera isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleLiveCapture} />
    </div>
  );
}

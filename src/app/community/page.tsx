'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { 
  Globe, 
  Loader2, 
  X,
  Camera,
  Video,
  FileIcon,
  Paperclip,
  Zap,
  Trash2,
  Image as LucideImageIcon,
  Square,
  CheckSquare,
  Shield,
  Star,
  TrendingUp,
  Heart,
  MessageCircle,
  Sparkles,
  Rocket,
  Lock,
  UserCheck
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { useUser, useFirestore, useCollection, useDoc, useFirebaseStorage } from '@/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  limit, 
  doc, 
  deleteDoc, 
  onSnapshot, 
  updateDoc, 
  setDoc 
} from 'firebase/firestore';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { moderateImage } from '@/ai/flows/moderate-image-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { compressImage, fileToDataUri } from '@/lib/image-utils';
import { cn } from '@/lib/utils';
import { LiveCamera } from '@/components/LiveCamera';

/**
 * @fileOverview Community Wall Protocol.
 * Enforces Sovereign Vision and role === 'admin' authority.
 */
export default function CommunityPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { uploadFile, deleteFile } = useFirebaseStorage();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

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

  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600");
  const [pageOwnerId, setPageOwnerId] = useState("");
  const [ownerNickname, setOwnerNickname] = useState("");
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const userRef = useMemoFirebase(() => db && user?.uid ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: myProfile } = useDoc(userRef);

  const communityQuery = useMemoFirebase(() => db ? query(collection(db, 'communityMessages'), orderBy('timestamp', 'asc'), limit(100)) : null, [db]);
  const { data: messages, loading } = useCollection(communityQuery);

  // Real-time Vision Guardianship
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, "siteSettings", "communityHero"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setHeroImage(data.heroImageUrl || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600");
        setPageOwnerId(data.ownerId || "");
        setOwnerNickname(data.ownerNickname || "A Guardian");
      }
    });
    return () => unsub();
  }, [db]);

  // Use role === 'admin' check for absolute authority
  const isAdmin = myProfile?.role === 'admin';
  const canEditHero = isAdmin || (user?.uid === pageOwnerId && pageOwnerId !== "");
  const isOwner = user?.uid === pageOwnerId;
  const isUnowned = !pageOwnerId || pageOwnerId === "";

  useEffect(() => {
    if (scrollRef.current && !isSelectMode) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSelectMode]);

  const handleClaimOwnership = async () => {
    if (!user || !db || isClaiming) return;
    setIsClaiming(true);
    try {
      await setDoc(doc(db, "siteSettings", "communityHero"), {
        ownerId: user.uid,
        ownerNickname: myProfile?.publicNickname || myProfile?.displayName || "Mystery Guardian",
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast({ title: "Wall Guardian Assigned", description: "You now protect the global vision. ✨" });
    } catch (err) {
      toast({ variant: "destructive", title: "Claim Failed", description: "This wall is already protected." });
    } finally {
      setIsClaiming(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && db && user && canEditHero) {
      setIsUploadingHero(true);
      try {
        const url = await uploadFile(`hero-images/community-${Date.now()}_${file.name}`, file);
        await updateDoc(doc(db, "siteSettings", "communityHero"), {
          heroImageUrl: url,
          updatedAt: serverTimestamp(),
        });
        setHeroImage(url);
        toast({ title: "Vision Updated", description: "The Global Wall has a new heartbeat. ✨" });
      } catch (err) {
        toast({ variant: "destructive", title: "Update Failed", description: "Could not change the global vision." });
      } finally {
        setIsUploadingHero(false);
      }
    }
  };

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
          toast({ variant: "destructive", title: "Respect Policy Ripple", description: moderation.reason });
          setIsSending(false);
          return;
        }
      }

      let imageUrl = null, videoUrl = null, fileUrl = null, fileName = null;

      if (attachedMedia) {
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
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!db || isSending || selectedIds.size === 0) return;
    setIsSending(true);
    try {
      const idsToDelete = Array.from(selectedIds);
      for (const id of idsToDelete) {
        const msg = messages?.find((m: any) => m.id === id);
        if (msg) {
          if (msg.imageUrl) await deleteFile(msg.imageUrl);
          if (msg.videoUrl) await deleteFile(msg.videoUrl);
          if (msg.fileUrl) await deleteFile(msg.fileUrl);
          await deleteDoc(doc(db, 'communityMessages', id));
        }
      }
      setSelectedIds(new Set());
      setIsSelectMode(false);
      toast({ title: "Moments Retracted", description: "Cleared from Global Wall. ❤️" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <section className="max-w-7xl mx-auto w-full p-6">
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-pink-50 via-white to-amber-50 shadow-2xl border border-white/50 mb-8">
          
          <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

          <div className="grid lg:grid-cols-2 gap-10 items-center p-8 lg:p-12">
            <div className="text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 font-bold text-sm mb-6">
                <Shield className="w-4 h-4" /> GLOBAL WALL
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-none tracking-tight">
                Respect is <span className="block bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Mandatory.</span>
              </h1>
              <p className="mt-6 text-xl text-slate-600 max-w-xl leading-relaxed font-medium">
                Share your moments. Inspire people around the world. Every respectful connection helps build a stronger global community.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute top-6 left-6 z-30 flex flex-col gap-2">
                 {isUnowned && user && (
                    <Button 
                      onClick={handleClaimOwnership} 
                      disabled={isClaiming}
                      className="rounded-full h-10 px-6 bg-slate-900/90 backdrop-blur-md text-white shadow-2xl text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-black transition-all"
                    >
                      {isClaiming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4 text-primary" />}
                      Claim Guardianship
                    </Button>
                 )}
                 {!isUnowned && !isOwner && (
                    <Badge className="bg-slate-900/90 text-white backdrop-blur-md border-none px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                       <Lock className="w-3.5 h-3.5 text-primary" />
                       Vision Protected by {ownerNickname}
                    </Badge>
                 )}
                 {isOwner && (
                    <Badge className="bg-primary text-white border-none px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                       <UserCheck className="w-3.5 h-3.5" />
                       You are the Wall Guardian
                    </Badge>
                 )}
              </div>

              <div className="relative overflow-hidden rounded-[35px] bg-white p-3 shadow-2xl group transition-transform hover:scale-[1.01] duration-700">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
                  <Image
                    src={heroImage}
                    alt="Community Vision"
                    fill
                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {canEditHero && (
                  <div className="absolute top-6 right-6 z-20">
                    <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                    <Button 
                      onClick={() => heroInputRef.current?.click()}
                      disabled={isUploadingHero}
                      className="bg-white/90 text-slate-900 hover:bg-white rounded-full px-4 h-10 shadow-2xl font-black uppercase text-[9px] tracking-widest gap-2 backdrop-blur-md border-none"
                    >
                      {isUploadingHero ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 text-primary" />}
                      Change Vision
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto w-full flex-grow px-6 space-y-6">
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden mb-10">
           <div className="bg-primary/5 p-6 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Sparkles className="w-6 h-6 text-primary" />
                 </div>
                 <h3 className="font-black text-xl tracking-tighter uppercase">Spark the Conversation</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleSelectMode} className={cn("rounded-full h-8 px-4 text-[8px] font-black uppercase tracking-widest", isSelectMode ? "bg-primary text-white" : "text-muted-foreground")}>
                {isSelectMode ? 'Cancel' : 'Manage Wall'}
              </Button>
           </div>
           
           <CardContent className="p-8 space-y-6">
              <div className="flex gap-4">
                 <input type="file" ref={galleryRef} accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, 'image')} />
                 <input type="file" ref={fileRef} className="hidden" onChange={(e) => handleFileSelect(e, 'file')} />
                 
                 <Button variant="ghost" size="icon" onClick={() => setIsCameraOpen(true)} className="w-14 h-14 rounded-2xl bg-muted/40 text-primary transition-all active:scale-90 shadow-inner">
                    <Camera className="w-6 h-6" />
                 </Button>
                 <Popover>
                    <PopoverTrigger asChild>
                       <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl bg-muted/40 text-blue-500 transition-all active:scale-90 shadow-inner">
                          <Paperclip className="w-6 h-6" />
                       </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2 rounded-2xl border-none shadow-2xl" align="start">
                       <Button variant="ghost" onClick={() => galleryRef.current?.click()} className="w-full justify-start gap-3 py-3 h-auto rounded-xl"><LucideImageIcon className="w-4 h-4 text-primary" /> Gallery</Button>
                       <Button variant="ghost" onClick={() => fileRef.current?.click()} className="w-full justify-start gap-3 py-3 h-auto rounded-xl"><FileIcon className="w-4 h-4 text-blue-500" /> Document</Button>
                    </PopoverContent>
                 </Popover>
                 
                 <form onSubmit={handleSendMessage} className="flex-grow flex gap-2">
                    <Input 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Share a respectful moment..." 
                      className="rounded-2xl bg-muted/40 border-none h-14 px-6 text-lg font-medium"
                    />
                    <Button type="submit" size="icon" className="w-14 h-14 rounded-2xl gradient-bg shrink-0 shadow-lg shadow-primary/20 transition-all active:scale-90" disabled={isSending || (!newMessage.trim() && !attachedMedia)}>
                       {isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6" />}
                    </Button>
                 </form>
              </div>

              {attachedMedia && (
                <div className="relative group animate-in zoom-in-95 duration-300">
                   <div className="rounded-[2rem] overflow-hidden bg-muted/20 border-2 border-dashed border-primary/20 p-2">
                      {attachedMedia.type === 'image' ? (
                        <img src={attachedMedia.url} className="w-full h-48 object-cover rounded-[1.5rem]" alt="Attachment preview" />
                      ) : (
                        <div className="flex items-center gap-4 p-6">
                           <FileIcon className="w-10 h-10 text-primary" />
                           <span className="font-bold text-sm truncate">{attachedMedia.file.name}</span>
                        </div>
                      )}
                   </div>
                   <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-lg" onClick={() => setAttachedMedia(null)}><X className="w-4 h-4" /></Button>
                </div>
              )}
           </CardContent>
        </Card>

        <div className="space-y-6">
           {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" /></div>
           ) : messages?.map((msg: any) => {
             const isMe = msg.senderId === user?.uid;
             const isSelected = selectedIds.has(msg.id);
             return (
               <Card 
                 key={msg.id} 
                 onClick={() => isSelectMode && (isMe || isAdmin) && toggleSelection(msg.id)}
                 className={cn(
                   "rounded-[2.5rem] border-none shadow-md overflow-hidden bg-white group hover:shadow-lg transition-all",
                   isSelected && "ring-4 ring-primary ring-offset-4 scale-[0.98] opacity-60",
                   isSelectMode && (isMe || isAdmin) && "cursor-pointer"
                 )}
               >
                 <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black">
                             {msg.senderNickname?.[0] || 'U'}
                          </div>
                          <div className="text-left leading-none">
                             <h4 className="font-black text-sm tracking-tight">{msg.senderNickname}</h4>
                             <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Community Member</p>
                          </div>
                       </div>
                       {isSelectMode && (isMe || isAdmin) && (
                          <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", isSelected ? "bg-primary border-primary text-white" : "border-muted")}>
                             {isSelected && <CheckSquare className="w-4 h-4" />}
                          </div>
                       )}
                    </div>

                    {msg.imageUrl && (
                      <div className="rounded-3xl overflow-hidden aspect-video relative group-hover:scale-[1.01] transition-transform duration-500">
                         <img src={msg.imageUrl} className="w-full h-full object-cover" alt="Community shared" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}

                    {msg.text && (
                       <p className="text-lg font-medium text-slate-700 leading-relaxed italic border-l-4 border-primary/10 pl-6">
                         "{msg.text}"
                       </p>
                    )}

                    {msg.fileUrl && (
                      <div className="flex items-center gap-4 bg-muted/20 p-5 rounded-2xl border border-dashed text-left">
                        <FileIcon className="w-8 h-8 text-primary" />
                        <div className="min-w-0 flex-grow">
                           <p className="font-black text-sm truncate">{msg.fileName}</p>
                           <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Digital Shared Document</p>
                        </div>
                        {!isSelectMode && <Button size="sm" variant="ghost" className="text-primary text-[10px] font-black uppercase" onClick={() => window.open(msg.fileUrl)}>Download</Button>}
                      </div>
                    )}
                 </div>
               </Card>
             );
           })}
        </div>

        {isSelectMode && selectedIds.size > 0 && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-10 duration-500">
             <Button onClick={handleDeleteSelected} disabled={isSending} className="h-16 px-10 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest shadow-2xl shadow-red-500/20 gap-3 group">
                <Trash2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Purge {selectedIds.size} Moments
             </Button>
          </div>
        )}
      </main>

      <BottomNav />
      <LiveCamera isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleLiveCapture} />
    </div>
  );
}

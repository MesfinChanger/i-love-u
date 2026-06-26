'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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

  // Use role === 'admin' check
  const canEditHero = myProfile?.role === 'admin' || (user?.uid === pageOwnerId && pageOwnerId !== "");
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
    if (!file || !db || !user || !canEditHero) return;

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
              
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-lg">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-sm">192 Countries</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-lg">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="font-bold text-sm">18.2K Members</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-lg">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-sm">Live Community</span>
                </div>
              </div>
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
                  <div className="absolute bottom-8 left-8 text-white text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Global Community</p>
                    <h3 className="text-4xl font-black leading-none tracking-tighter drop-shadow-xl">
                      Together We Build
                    </h3>
                  </div>
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

              <div className="absolute -top-12 -right-6 bg-white rounded-[2rem] p-6 shadow-2xl border border-pink-50 animate-bounce duration-[5000ms] hover:animate-none transition-all">
                <div className="text-pink-500 text-4xl mb-2">❤️</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Community</p>
                <h4 className="text-3xl font-black tracking-tighter">18.2K+</h4>
                <div className="flex items-center gap-1.5 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <p className="text-green-600 font-bold text-[10px] uppercase tracking-widest">Online Now</p>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-[2rem] p-5 shadow-2xl border border-slate-50 transition-transform hover:scale-110">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-green-500 w-6 h-6" />
                  <div className="text-left">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Today</p>
                    <p className="font-black text-xs uppercase tracking-tight">+324 New Connections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-primary/5 border-y px-6 py-2 flex items-center justify-between sticky top-16 z-30 backdrop-blur-md">
        <div className="flex items-center gap-2">
           <ShieldCheck className="w-3.5 h-3.5 text-primary animate-pulse" />
           <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">Mandatory Respect Policy Active</p>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleSelectMode} className={cn("h-7 text-[9px] font-black uppercase tracking-widest rounded-full px-4", isSelectMode ? "bg-primary text-white" : "text-muted-foreground")}>
          {isSelectMode ? 'Cancel' : 'Manage My Posts'}
        </Button>
      </div>

      <main className="max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-8 space-y-8">
          {!isSelectMode && (
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-6">
               <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white font-black shrink-0">
                     {myProfile?.publicNickname?.[0] || 'U'}
                  </div>
                  <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Share a respectful thought..." className="rounded-2xl border-none bg-muted/40 h-14 font-bold px-6 text-lg" />
               </div>
               
               {attachedMedia && (
                  <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-2xl animate-in zoom-in-95">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-900 border-2 border-white">
                       {attachedMedia.type === 'image' ? <img src={attachedMedia.url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white"><Video className="w-8 h-8" /></div>}
                    </div>
                    <p className="text-xs font-black uppercase truncate flex-grow">{attachedMedia.file.name}</p>
                    <Button variant="ghost" size="icon" onClick={() => setAttachedMedia(null)} className="rounded-full"><X className="w-5 h-5" /></Button>
                  </div>
                )}

               <div className="flex items-center justify-between pt-4 border-t border-dashed">
                  <div className="flex gap-2">
                     <input type="file" ref={galleryRef} onChange={(e) => handleFileSelect(e, 'image')} className="hidden" />
                     <input type="file" ref={fileRef} onChange={(e) => handleFileSelect(e, 'file')} className="hidden" />
                     <Popover>
                        <PopoverTrigger asChild><Button variant="ghost" className="rounded-full h-10 px-4 gap-2 font-black uppercase text-[10px] tracking-widest text-slate-500"><Camera className="w-4 h-4 text-primary" /> Attach</Button></PopoverTrigger>
                        <PopoverContent className="w-48 p-2 rounded-2xl border-none shadow-2xl" side="top" align="start">
                          <Button variant="ghost" onClick={() => setIsCameraOpen(true)} className="w-full justify-start gap-3 py-3 h-auto rounded-xl"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase">Live Camera</span></Button>
                          <Button variant="ghost" onClick={() => galleryRef.current?.click()} className="w-full justify-start gap-3 py-3 h-auto rounded-xl"><LucideImageIcon className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase">Gallery</span></Button>
                          <Button variant="ghost" onClick={() => fileRef.current?.click()} className="w-full justify-start gap-3 py-3 h-auto rounded-xl border-t"><Paperclip className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase">Document</span></Button>
                        </PopoverContent>
                     </Popover>
                  </div>
                  <Button onClick={handleSendMessage} disabled={isSending || (!newMessage.trim() && !attachedMedia)} className="px-8 h-14 rounded-full gradient-bg font-black uppercase text-[10px] tracking-widest">Post Heartbeat</Button>
               </div>
            </Card>
          )}

          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary opacity-20 w-12 h-12" /></div>
            ) : messages?.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed opacity-40">
                 <Globe className="w-20 h-20 mx-auto mb-4" />
                 <p className="font-black uppercase tracking-tighter">The wall is silent</p>
              </div>
            ) : [...messages].reverse().map((msg: any) => {
              const isOwn = msg.senderId === user?.uid;
              const isSelected = selectedIds.has(msg.id);
              return (
                <Card key={msg.id} onClick={() => isSelectMode && isOwn && toggleSelection(msg.id)} className={cn("rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden transition-all group", isSelectMode && isOwn && "cursor-pointer scale-[0.98] ring-2 ring-primary ring-offset-4")}>
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4 text-left">
                          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black">{msg.senderNickname?.[0] || 'U'}</div>
                          <div><h3 className="font-black text-lg text-slate-900">{msg.senderNickname}</h3><p className="text-[9px] font-bold text-muted-foreground uppercase">Global Heart • Just Now</p></div>
                       </div>
                       {isSelectMode && isOwn && (isSelected ? <CheckSquare className="w-6 h-6 text-primary" /> : <Square className="w-6 h-6 text-muted-foreground/20" />)}
                    </div>
                    {msg.text && <p className="text-lg font-medium text-slate-700 leading-relaxed italic text-left">"{msg.text}"</p>}
                    {msg.imageUrl && <div className="rounded-3xl overflow-hidden border shadow-sm"><img src={msg.imageUrl} className="w-full h-auto object-contain" /></div>}
                    {msg.videoUrl && <div className="rounded-3xl overflow-hidden bg-black shadow-lg aspect-video"><video src={msg.videoUrl} controls className="w-full h-full" /></div>}
                    {msg.fileUrl && (
                      <div className="flex items-center gap-4 bg-primary/5 p-6 rounded-3xl border border-dashed border-primary/20">
                         <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary"><FileIcon className="w-6 h-6" /></div>
                         <div className="min-w-0 flex-grow text-left"><p className="text-xs font-black uppercase truncate">{msg.fileName}</p><p className="text-[9px] font-bold text-primary uppercase">Secured Document</p></div>
                         {!isSelectMode && <Button size="sm" variant="outline" className="rounded-xl h-10 px-4" onClick={() => window.open(msg.fileUrl)}>Get File</Button>}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8 text-left">
              <div>
                <h3 className="font-black text-xl uppercase tracking-tighter mb-4">What's Happening</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/30 transition-colors cursor-pointer">
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                    <span className="font-bold text-sm">World Kindness Day</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/30 transition-colors cursor-pointer">
                    <Rocket className="w-4 h-4 text-orange-500" />
                    <span className="font-bold text-sm">Entrepreneurship</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/30 transition-colors cursor-pointer">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <span className="font-bold text-sm">Sustainability</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-dashed">
                <h3 className="font-black text-xl uppercase tracking-tighter mb-6">Community Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/5 p-6 rounded-3xl text-center">
                    <p className="font-black text-3xl text-primary">18.2K</p>
                    <p className="text-[9px] font-black uppercase text-primary/40">Members</p>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-3xl text-center">
                    <p className="font-black text-3xl text-secondary">47.6K</p>
                    <p className="text-[9px] font-black uppercase text-secondary/40">Posts</p>
                  </div>
                </div>
              </div>
           </Card>
        </div>
      </main>

      {isSelectMode && (
        <div className="fixed bottom-24 left-0 right-0 z-50 px-6">
           <div className="max-w-3xl mx-auto bg-slate-900 text-white rounded-[2.5rem] p-6 shadow-2xl flex items-center justify-between border border-primary/20 animate-in slide-in-from-bottom-10">
              <div className="text-left"><p className="text-xl font-black uppercase">{selectedIds.size} Selected</p><p className="text-[9px] font-bold text-white/40 uppercase">Ready for retraction</p></div>
              <div className="flex gap-3">
                 <Button variant="outline" onClick={() => setIsSelectMode(false)} className="rounded-xl h-12 text-white border-white/10">Cancel</Button>
                 <Button onClick={handleDeleteSelected} disabled={isSending || selectedIds.size === 0} className="rounded-xl h-12 gradient-bg px-6"><Trash2 className="w-4 h-4 mr-2" /> Purge Selected</Button>
              </div>
           </div>
        </div>
      )}

      <BottomNav />
      <LiveCamera isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleLiveCapture} />
    </div>
  );
}
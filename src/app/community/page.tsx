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
  CheckSquare,
  Plus,
  Shield,
  Star,
  TrendingUp,
  Users
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
 * Merged with High-Impact Mission UI.
 * Enforces "Respect is Mandatory" and enables live multi-media sharing.
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
    <div className="flex flex-col min-h-screen bg-muted/30 overflow-x-hidden">
      <Header />
      
      {/* MISSION HERO SECTION */}
      <section className="max-w-7xl mx-auto w-full p-6 pt-8">
        <div className="rounded-[3rem] overflow-hidden bg-gradient-to-r from-pink-100 via-white to-orange-100 shadow-xl border border-white/50">
          <div className="grid lg:grid-cols-2 gap-8 p-10 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-xs">
                <Shield className="w-5 h-5" />
                Global Wall
              </div>

              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                Respect is <br/><span className="gradient-text">Mandatory.</span>
              </h2>

              <p className="text-slate-600 text-lg font-medium italic max-w-md">
                "Share with love. Inspire the world. Every respectful post funds local job creation to end poverty."
              </p>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-white rounded-full px-5 py-2 shadow-sm border-none font-bold text-slate-600">
                  🌎 192 Countries
                </Badge>
                <Badge variant="secondary" className="bg-white rounded-full px-5 py-2 shadow-sm border-none font-bold text-slate-600">
                  ❤️ 18.2K Members
                </Badge>
                <Badge variant="secondary" className="bg-white rounded-full px-5 py-2 shadow-sm border-none font-bold text-slate-600">
                  ✨ {messages?.length || '0'} Live Moments
                </Badge>
              </div>
            </div>

            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
              <img
                src="https://picsum.photos/seed/community-hero/800/600"
                alt="Global Community"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Globe2 className="w-6 h-6 text-white" />
                 </div>
                 <p className="text-white font-black uppercase tracking-widest text-[10px]">Reaching every village</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-primary/5 border-y px-6 py-2 flex items-center justify-between backdrop-blur-md sticky top-16 z-30">
        <div className="flex items-center gap-2">
           <ShieldCheck className="w-3.5 h-3.5 text-primary animate-pulse" />
           <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">Global Circle • Mandatory Respect Policy Active</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSelectMode}
          className={cn("h-7 text-[9px] font-black uppercase tracking-widest px-4 rounded-full transition-all", isSelectMode ? "bg-primary text-white hover:bg-primary/90 shadow-lg" : "text-muted-foreground hover:bg-white")}
        >
          {isSelectMode ? 'Cancel Selection' : 'Manage My Posts'}
        </Button>
      </div>

      {/* MAIN CONTENT GRID */}
      <main className="max-w-7xl mx-auto w-full px-6 pb-32 grid lg:grid-cols-12 gap-8 mt-8">
        
        {/* POSTS FEED */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* CREATE POST BOX */}
          {!isSelectMode && (
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden animate-in slide-in-from-top-4 duration-500">
               <div className="p-8 space-y-6">
                 <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white font-black shrink-0 shadow-lg">
                       {myProfile?.publicNickname?.[0] || 'U'}
                    </div>
                    <div className="flex-grow">
                      <Input 
                        value={newMessage} 
                        onChange={e => setNewMessage(e.target.value)} 
                        placeholder="Share a respectful thought..." 
                        className="rounded-2xl border-none bg-muted/40 h-14 font-bold px-6 text-lg focus-visible:ring-2 focus-visible:ring-primary/20"
                      />
                    </div>
                 </div>

                 {attachedMedia && (
                    <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-2xl animate-in zoom-in-95">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-900 border-2 border-white shadow-md">
                         {attachedMedia.type === 'image' ? (
                           <img src={attachedMedia.url} alt="Selected" className="w-full h-full object-cover" />
                         ) : attachedMedia.type === 'video' ? (
                           <div className="w-full h-full flex items-center justify-center"><Video className="w-8 h-8 text-white" /></div>
                         ) : (
                           <div className="w-full h-full flex items-center justify-center"><FileIcon className="w-8 h-8 text-white" /></div>
                         )}
                      </div>
                      <div className="flex-grow min-w-0">
                         <p className="text-xs font-black uppercase truncate">{attachedMedia.file.name}</p>
                         <p className="text-[10px] text-muted-foreground italic">Ready to share with the world.</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setAttachedMedia(null)} className="rounded-full h-10 w-10 hover:bg-red-50 hover:text-red-500">
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  )}

                 <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-dashed">
                    <div className="flex gap-2">
                       <input type="file" ref={galleryRef} onChange={(e) => handleFileSelect(e, 'image')} accept="image/*,video/*" className="hidden" />
                       <input type="file" ref={fileRef} onChange={(e) => handleFileSelect(e, 'file')} className="hidden" />
                       
                       <Popover>
                          <PopoverTrigger asChild>
                             <Button variant="ghost" className="rounded-full h-10 px-4 gap-2 font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-slate-50">
                                <Camera className="w-4 h-4 text-primary" />
                                Attach Media
                             </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2 rounded-2xl border-none shadow-2xl" side="top" align="start">
                            <div className="flex flex-col gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setIsCameraOpen(true)} className="justify-start gap-3 rounded-xl py-4 h-auto">
                                 <Zap className="w-4 h-4 text-primary" />
                                 <span className="font-bold text-xs">Live Camera</span>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => galleryRef.current?.click()} className="justify-start gap-3 rounded-xl py-4 h-auto">
                                 <LucideImageIcon className="w-4 h-4 text-primary" />
                                 <span className="font-bold text-xs">Gallery</span>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()} className="justify-start gap-3 rounded-xl py-4 h-auto border-t mt-1">
                                 <Paperclip className="w-4 h-4 text-primary" />
                                 <span className="font-bold text-xs">Share File</span>
                              </Button>
                            </div>
                          </PopoverContent>
                       </Popover>
                    </div>

                    <Button 
                      onClick={handleSendMessage}
                      disabled={isSending || (!newMessage.trim() && !attachedMedia)} 
                      className="px-8 h-14 rounded-full gradient-bg text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all gap-2"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Share Moment
                    </Button>
                 </div>
                 
                 {isUploading && (
                    <div className="space-y-2 px-2" role="status">
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-primary"><span>Securing Cloud Bridge...</span><span>{Math.round(progress)}%</span></div>
                      <Progress value={progress} className="h-1 bg-primary/5" />
                    </div>
                  )}
               </div>
            </Card>
          )}

          {/* POST LIST */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary opacity-20 w-12 h-12" /></div>
            ) : messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border-2 border-dashed opacity-40 space-y-6">
                 <Globe2 className="w-20 h-20" />
                 <div className="space-y-1">
                    <p className="text-xl font-black uppercase tracking-tighter">The wall is silent</p>
                    <p className="text-sm font-medium italic">"Every revolution starts with a single respectful spark."</p>
                 </div>
              </div>
            ) : [...messages].reverse().map((msg: any) => {
              const isOwn = msg.senderId === user?.uid;
              const isSelected = selectedIds.has(msg.id);

              return (
                <Card 
                  key={msg.id} 
                  onClick={() => isSelectMode && isOwn && toggleSelection(msg.id)}
                  className={cn(
                    "rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden transition-all duration-300 relative group", 
                    isSelectMode && isOwn ? "cursor-pointer scale-[0.98] ring-2 ring-primary ring-offset-4" : "",
                    isSelected && "opacity-60"
                  )}
                >
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black shadow-inner border border-primary/10">
                            {msg.senderNickname?.[0] || 'U'}
                          </div>
                          <div>
                            <h3 className="font-black text-lg tracking-tight text-slate-900">{msg.senderNickname}</h3>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                               <Globe2 className="w-3 h-3" />
                               Global Heart • {msg.timestamp ? 'Recently Shared' : 'Just Now'}
                            </div>
                          </div>
                       </div>
                       
                       {isSelectMode && isOwn && (
                         <div className="animate-in zoom-in-95">
                           {isSelected ? <CheckSquare className="w-6 h-6 text-primary" /> : <Square className="w-6 h-6 text-muted-foreground/20" />}
                         </div>
                       )}
                    </div>

                    {msg.text && <p className="text-lg font-medium text-slate-700 leading-relaxed italic">"{msg.text}"</p>}

                    {msg.imageUrl && (
                      <div className="relative w-full aspect-video rounded-3xl overflow-hidden border shadow-sm">
                        <img 
                          src={msg.imageUrl} 
                          alt="Community moment" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}

                    {msg.videoUrl && (
                      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-lg">
                         <video src={msg.videoUrl} controls className="w-full h-full" />
                      </div>
                    )}

                    {msg.fileUrl && (
                      <div className="flex items-center gap-4 bg-primary/5 p-6 rounded-3xl border border-dashed border-primary/20 group/file">
                         <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover/file:rotate-6 transition-transform">
                            <FileIcon className="w-6 h-6" />
                         </div>
                         <div className="min-w-0 flex-grow">
                            <p className="text-xs font-black uppercase truncate text-slate-900">{msg.fileName}</p>
                            <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Secured Document</p>
                         </div>
                         {!isSelectMode && <Button size="sm" variant="outline" className="h-10 px-6 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest" onClick={() => window.open(msg.fileUrl)}>Get File</Button>}
                      </div>
                    )}
                  </div>

                  <div className="px-8 py-4 bg-slate-50 border-t flex gap-6 text-slate-400">
                    <button className="flex items-center gap-2 hover:text-primary transition-colors font-black uppercase text-[10px] tracking-widest"><Heart className="w-4 h-4" /> 186</button>
                    <button className="flex items-center gap-2 hover:text-blue-500 transition-colors font-black uppercase text-[10px] tracking-widest"><MessageCircle className="w-4 h-4" /> 24</button>
                    <button className="flex items-center gap-2 hover:text-indigo-500 transition-colors font-black uppercase text-[10px] tracking-widest ml-auto"><Send className="w-4 h-4" /> Share</button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-6">
            <h3 className="font-black text-xl uppercase tracking-tighter flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              What's Happening
            </h3>

            <div className="space-y-4">
              {[
                { label: "World Kindness Day", count: "12k Hearts", color: "bg-pink-50 text-pink-600" },
                { label: "Entrepreneurship", count: "4.5k Posts", color: "bg-blue-50 text-blue-600" },
                { label: "Eliminate Poverty", count: "8k Sparks", color: "bg-green-50 text-green-600" }
              ].map((trend, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group">
                   <div>
                      <p className="font-black text-sm text-slate-800 group-hover:text-primary transition-colors">❤️ {trend.label}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">{trend.count}</p>
                   </div>
                   <TrendingUp className="w-4 h-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full h-12 rounded-2xl font-black uppercase text-[9px] tracking-widest border-2">Explore All Topics</Button>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 p-8 space-y-6 text-white relative overflow-hidden group">
            <Star className="absolute top-4 right-4 w-12 h-12 text-primary opacity-10 group-hover:rotate-12 transition-transform" />
            <h3 className="font-black text-xl uppercase tracking-tighter">Community Stats</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center space-y-1">
                <p className="font-black text-3xl text-primary tracking-tighter">18.2K</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Members</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center space-y-1">
                <p className="font-black text-3xl text-secondary tracking-tighter">47.6K</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Posts</p>
              </div>
            </div>
            
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-start gap-3">
               <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
               <p className="text-[10px] font-bold text-primary/80 uppercase leading-relaxed tracking-tight">
                 Every member is verified for verified human status and respect compliance.
               </p>
            </div>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 text-center space-y-4">
             <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe2 className="w-8 h-8 text-slate-400 opacity-40" />
             </div>
             <p className="text-[11px] text-muted-foreground font-medium italic leading-relaxed">
               "Reaching hearts in every village and every global city. Prosperity is mandatory."
             </p>
          </Card>
        </div>
      </main>

      {/* BATCH ACTION BAR (Replaces Input in Select Mode) */}
      {isSelectMode && (
        <div className="fixed bottom-24 left-0 right-0 z-[60] px-6 animate-in slide-in-from-bottom-10 duration-500">
           <div className="max-w-3xl mx-auto bg-slate-900 text-white rounded-[2.5rem] p-6 shadow-2xl flex flex-col sm:flex-row items-center gap-6 border border-primary/20">
             <div className="flex-grow text-center sm:text-left">
                <p className="text-xl font-black tracking-tighter uppercase leading-none">{selectedIds.size} Moments Highlighted</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-2 italic">Ready for secure cloud retraction.</p>
             </div>
             <div className="flex gap-4 w-full sm:w-auto">
               <Button 
                variant="outline" 
                onClick={() => setIsSelectMode(false)}
                className="flex-1 sm:flex-none h-14 rounded-2xl border-white/10 bg-white/5 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10"
               >
                 Cancel
               </Button>
               <Button 
                onClick={handleDeleteSelected}
                disabled={isSending || selectedIds.size === 0}
                className="flex-1 sm:flex-none h-14 rounded-2xl gradient-bg shadow-xl shadow-primary/20 flex items-center gap-3 font-black uppercase text-[10px] tracking-widest"
               >
                 {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                 Purge Selected
               </Button>
             </div>
           </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      {!isSelectMode && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-8 w-16 h-16 rounded-[1.8rem] gradient-bg shadow-[0_20px_50px_-10px_rgba(255,51,102,0.5)] text-white flex items-center justify-center active:scale-90 transition-all hover:rotate-6 z-50 group"
          aria-label="Create Post"
        >
          <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>
      )}

      <BottomNav />
      <LiveCamera isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleLiveCapture} />
    </div>
  );
}

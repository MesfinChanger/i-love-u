'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Sparkles, 
  MapPin, 
  Loader2, 
  Star, 
  Send, 
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Clock,
  Maximize2,
  VolumeX,
  Volume2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, collection, serverTimestamp, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from 'next/link';
import { useTranslation } from '@/components/providers/LanguageProvider';

/**
 * @fileOverview Discovery Grid Protocol.
 * Implements Online/Offline sorting and role-aware View Only restrictions.
 */
export default function DiscoverPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [mounted, setMounted] = useState(false);
  const [isLiveExpanded, setIsLiveExpanded] = useState(true);
  const [isOfflineExpanded, setIsOfflineExpanded] = useState(true);
  const [presenceOverrides, setPresenceShimmer] = useState<Record<string, { isOnline: boolean, lastActive: string }>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  const { data: myProfile } = useDoc(userRef);

  const isCommercial = myProfile?.isSeller || myProfile?.isAdvertiser;
  const hasAcceptedPolicy = myProfile?.policyAccepted === true;
  const isInteractionRestricted = isCommercial && !hasAcceptedPolicy;

  const discoveryQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, 'publicProfiles'));
  }, [db, user?.uid]);
  const { data: discoveryItems, loading: usersLoading } = useCollection(discoveryQuery);

  useEffect(() => {
    if (discoveryItems && discoveryItems.length > 0) {
      const newOverrides: Record<string, { isOnline: boolean, lastActive: string }> = {};
      discoveryItems.forEach((u: any) => {
        const id = u.uid || u.id;
        if (!presenceOverrides[id]) {
          newOverrides[id] = {
            isOnline: u.isOnline ?? (Math.random() > 0.5),
            lastActive: u.lastActive || `${Math.floor(Math.random() * 59)}m ago`
          };
        }
      });
      if (Object.keys(newOverrides).length > 0) {
        setPresenceShimmer(prev => ({ ...prev, ...newOverrides }));
      }
    }
  }, [discoveryItems]);

  const { liveHearts, restingHearts } = useMemo(() => {
    const hasItems = mounted && discoveryItems && discoveryItems.length > 0;
    const allHearts = hasItems 
      ? (discoveryItems || [])
        .filter((u: any) => u.uid !== user?.uid)
        .map((u: any) => {
          const id = u.uid || u.id;
          const override = presenceOverrides[id];
          return {
            id,
            name: u.publicNickname || "Mystery Heart", 
            age: u.age,
            verified: u.verified === true,
            photoUrl: u.photoUrl || u.publicPhotoUrl || null,
            videoUrl: u.videoUrl || u.publicVideoUrl || null,
            additionalPhotoUrls: u.additionalPhotoUrls || [],
            interests: u.interests || [],
            bio: u.bio || "Sharing respect and looking for sparks.",
            country: u.country || "Global Community",
            isOnline: override?.isOnline ?? false,
            lastActive: override?.lastActive || "Recently Active"
          };
        })
      : [];

    return {
      liveHearts: allHearts.filter((h: any) => h.isOnline),
      restingHearts: allHearts.filter((h: any) => !h.isOnline)
    };
  }, [discoveryItems, user?.uid, mounted, presenceOverrides]);

  const handleSparkAction = async (targetId: string, type: 'friend' | 'date') => {
    if (isInteractionRestricted) {
      toast({ variant: "destructive", title: "Commercial Interaction Locked", description: "Sellers and Purchasers must agree to our Mandatory Policy before sparking. ✨" });
      return;
    }
    if (!user || !db) return;

    const uids = [user.uid, targetId].sort();
    const matchId = uids.join('_');
    try {
      await setDoc(doc(db, 'matches', matchId), {
        userIds: uids,
        timestamp: serverTimestamp(),
        lastMessage: type === 'date' ? "A Spark invitation has been sent! ✨" : "Connection invitation sent 🤝",
        status: "pending",
        invitedBy: user.uid,
        type: type
      }, { merge: true });
      toast({ title: "Invitation Sent!", description: "Waiting for them to accept your spark. ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Respectful invitation could not be sent." });
    }
  };

  if (!mounted || (usersLoading && db && user?.uid)) return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      {isInteractionRestricted && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-3 flex items-center justify-between animate-in slide-in-from-top-2 z-40 sticky top-16">
           <div className="flex items-center gap-2 text-amber-800">
              <ShieldAlert className="w-4 h-4" />
              <p className="text-[10px] font-bold uppercase tracking-tight">View Only Mode: Commercial Approval Required</p>
           </div>
           <Link href="/policy/agree">
              <Button size="sm" variant="ghost" className="h-7 text-[9px] font-black uppercase text-amber-900 hover:bg-amber-200">Agree to Unlock</Button>
           </Link>
        </div>
      )}

      <main className="container mx-auto px-6 py-10 max-w-7xl space-y-12">
        <div className="space-y-2 text-left">
           <div className="flex items-center gap-3 text-primary">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <h1 className="text-4xl font-black tracking-tighter uppercase">Discover Hearts</h1>
           </div>
           <p className="text-muted-foreground text-sm font-medium italic">"Separated by presence, unified by respect."</p>
        </div>

        {/* ONLINE SECTION */}
        <Collapsible open={isLiveExpanded} onOpenChange={setIsLiveExpanded} className="space-y-6">
           <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                    <Wifi className="w-5 h-5 animate-pulse" />
                 </div>
                 <div className="text-left">
                    <h2 className="text-xl font-black tracking-tight uppercase leading-none">Online Hearts</h2>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{liveHearts.length} Live Now</p>
                 </div>
              </div>
              <CollapsibleTrigger asChild>
                 <Button variant="ghost" size="sm" className="h-10 rounded-xl px-4 gap-2 font-black uppercase text-[10px] tracking-widest">
                    {isLiveExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                 </Button>
              </CollapsibleTrigger>
           </div>
           <CollapsibleContent className="animate-in fade-in slide-in-from-top-2 duration-300">
              {liveHearts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {liveHearts.map((heart: any) => (
                    <DiscoverCard 
                      key={heart.id} 
                      item={heart} 
                      isRestricted={isInteractionRestricted} 
                      onAction={(type: any) => handleSparkAction(heart.id, type)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white/40 rounded-[2.5rem] border-2 border-dashed border-muted">
                   <WifiOff className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
                   <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">No hearts live right now</p>
                </div>
              )}
           </CollapsibleContent>
        </Collapsible>

        {/* OFFLINE SECTION - VIBRANT & VISIBLE */}
        <Collapsible open={isOfflineExpanded} onOpenChange={setIsOfflineExpanded} className="space-y-6">
           <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-500">
                    <Clock className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                    <h2 className="text-xl font-black tracking-tight uppercase leading-none">Offline Hearts</h2>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{restingHearts.length} Resting</p>
                 </div>
              </div>
              <CollapsibleTrigger asChild>
                 <Button variant="ghost" size="sm" className="h-10 rounded-xl px-4 gap-2 font-black uppercase text-[10px] tracking-widest text-slate-400">
                    {isOfflineExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                 </Button>
              </CollapsibleTrigger>
           </div>
           <CollapsibleContent className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {restingHearts.map((heart: any) => (
                  <DiscoverCard 
                    key={heart.id} 
                    item={heart} 
                    isRestricted={isInteractionRestricted} 
                    onAction={(type: any) => handleSparkAction(heart.id, type)} 
                  />
                ))}
              </div>
           </CollapsibleContent>
        </Collapsible>
      </main>

      <BottomNav />
    </div>
  );
}

function DiscoverCard({ item, isRestricted, onAction }: any) {
  const mediaItems = [];
  if (item.videoUrl) mediaItems.push({ type: 'video', url: item.videoUrl });
  if (item.photoUrl) mediaItems.push({ type: 'image', url: item.photoUrl });
  (item.additionalPhotoUrls || []).forEach((url: string) => mediaItems.push({ type: 'image', url }));

  return (
    <Card className="group relative aspect-[3/4] overflow-hidden border-none shadow-xl rounded-[2.5rem] bg-white transition-all hover:scale-[1.02]">
      {mediaItems.length > 0 ? (
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full">
            {mediaItems.map((media, idx) => (
              <CarouselItem key={idx} className="relative h-full">
                <Dialog>
                   <DialogTrigger asChild>
                      <div className="w-full h-full cursor-zoom-in relative">
                        {media.type === 'video' ? (
                          <video src={media.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img src={media.url} alt={item.name} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                   </DialogTrigger>
                   <DialogContent className="max-w-[95vw] max-h-[90vh] p-0 overflow-hidden bg-black border-none rounded-[3rem]">
                      <div className="w-full h-full flex items-center justify-center p-4">
                         {media.type === 'video' ? (
                            <video src={media.url} controls autoPlay loop className="max-w-full max-h-full rounded-3xl" />
                         ) : (
                            <img src={media.url} alt={item.name} className="max-w-full max-h-full object-contain rounded-3xl" />
                         )}
                      </div>
                   </DialogContent>
                </Dialog>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="w-full h-full bg-primary/5 flex items-center justify-center">
           <Heart className="w-8 h-8 text-primary/20" />
        </div>
      )}

      <div className="absolute top-6 left-6 z-30">
         <Badge className={cn(
           "border-none px-3 h-6 flex items-center gap-1.5 uppercase font-black text-[7px] tracking-widest shadow-lg",
           item.isOnline ? "bg-green-500" : "bg-black/40 backdrop-blur-md"
         )}>
            {item.isOnline ? <div className="w-1 h-1 bg-white rounded-full animate-pulse" /> : <Clock className="w-2.5 h-2.5" />}
            {item.isOnline ? 'Live Now' : `Last Active: ${item.lastActive}`}
         </Badge>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 space-y-4">
         <div className="space-y-1">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-white tracking-tighter truncate">{item.name}</h3>
               <Badge className="bg-primary/20 text-white border-white/20 backdrop-blur-md font-black text-[7px] h-5 px-2">{item.age}</Badge>
            </div>
            <div className="flex items-center gap-1.5 text-[8px] font-bold text-white/60 uppercase">
               <MapPin className="w-2.5 h-2.5" /> {item.country}
            </div>
         </div>

         <p className="text-[11px] text-white/80 leading-relaxed font-medium line-clamp-2 italic">"{item.bio}"</p>

         <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => onAction('friend')}
              className={cn("flex-1 h-10 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary font-black uppercase text-[8px] tracking-widest gap-1.5 transition-all", isRestricted && "opacity-40 cursor-not-allowed")}
            >
              <Send className="w-3 h-3" /> Invite
            </Button>
            <Button 
              onClick={() => onAction('date')}
              className={cn("flex-1 h-10 rounded-xl gradient-bg shadow-lg font-black uppercase text-[8px] tracking-widest gap-1.5 active:scale-95", isRestricted && "opacity-40 cursor-not-allowed")}
            >
              <Heart className="w-3 h-3 fill-current" /> Spark
            </Button>
         </div>
      </div>
    </Card>
  );
}
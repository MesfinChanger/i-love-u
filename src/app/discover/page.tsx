'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  X, 
  Sparkles, 
  MapPin, 
  Lock, 
  Volume2, 
  VolumeX, 
  Loader2, 
  Ghost, 
  Star, 
  Send, 
  PlayCircle,
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Info,
  Zap,
  Clock,
  Maximize2,
  Activity,
  Circle,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, collection, serverTimestamp, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
 * @fileOverview Discovery Grid Protocol with Expandable Presence Sections.
 * Organizes hearts into "Live Now" and "Resting" collapsible groups.
 * Provides granular presence details for deeper connection context.
 */
export default function DiscoverPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [mounted, setMounted] = useState(false);
  const [isLiveExpanded, setIsLiveExpanded] = useState(true);
  const [isOfflineExpanded, setIsOfflineExpanded] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: myProfile } = useDoc(userRef);

  const discoveryQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'publicProfiles'));
  }, [db, user]);
  const { data: discoveryItems, loading: usersLoading } = useCollection(discoveryQuery);

  const adsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'ads'), where('status', '==', 'active'));
  }, [db, user]);
  const { data: activeAds } = useCollection(adsQuery);

  const viewerCountry = myProfile?.country || 'GLOBAL';
  const hasAcceptedPolicy = myProfile?.policyAccepted === true;
  
  const { liveHearts, restingHearts, adItems } = useMemo(() => {
    const hasItems = mounted && discoveryItems && discoveryItems.length > 0;
    
    const allHearts = hasItems 
      ? (discoveryItems || [])
        .filter((u: any) => u.uid !== user?.uid)
        .map((u: any) => ({
          id: u.uid,
          name: u.publicNickname || "Mystery Heart", 
          publicPhotoUrl: u.publicPhotoUrl || null,
          publicVideoUrl: u.publicVideoUrl || null,
          additionalPhotoUrls: u.additionalPhotoUrls || [],
          interests: u.interests || [],
          culturalInterests: u.culturalInterests || [],
          bio: u.bio || "Sharing culture and looking for sparks.",
          locationHint: u.locationHint || "Global Community",
          isOnline: u.isOnline ?? (Math.random() > 0.5),
          lastActive: u.lastActive || `${Math.floor(Math.random() * 59)}m ago`,
          type: 'profile'
        }))
      : [
          {
            id: 'mock-1',
            name: 'Amina',
            publicPhotoUrl: PlaceHolderImages.find(img => img.id === 'user-2')?.imageUrl,
            publicVideoUrl: null,
            additionalPhotoUrls: ["https://picsum.photos/seed/africa-1/800/1200"],
            interests: ['Textiles', 'Tea'],
            bio: "Exploring the intersection of art and nature.",
            locationHint: "Nairobi, KE",
            isOnline: true,
            lastActive: "Now",
            type: 'profile'
          },
          {
            id: 'mock-2',
            name: 'Yuki',
            publicPhotoUrl: PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl,
            publicVideoUrl: null,
            additionalPhotoUrls: ["https://picsum.photos/seed/japan-1/800/1200"],
            interests: ['Coding', 'Jazz'],
            bio: "Looking for a soul to share a quiet sunset with.",
            locationHint: "Tokyo, JP",
            isOnline: false,
            lastActive: "4h ago",
            type: 'profile'
          }
        ];

    const ads = (mounted && activeAds ? activeAds : [])
      .filter((ad: any) => {
        if (!ad.targetCountries) return true;
        return ad.targetCountries.includes(viewerCountry) || ad.targetCountries.includes('GLOBAL');
      })
      .map((ad: any) => ({
        id: ad.id,
        title: ad.title,
        description: ad.description,
        targetUrl: ad.targetUrl,
        adType: ad.adType || 'text',
        videoUrl: ad.videoUrl,
        type: 'ad'
      }));

    return {
      liveHearts: allHearts.filter((h: any) => h.isOnline),
      restingHearts: allHearts.filter((h: any) => !h.isOnline),
      adItems: ads
    };
  }, [discoveryItems, activeAds, user, viewerCountry, mounted]);

  const handleSparkAction = async (targetId: string, type: 'friend' | 'date') => {
    if (!hasAcceptedPolicy) {
      toast({ variant: "destructive", title: "Interaction Locked", description: "You must agree to our Mandatory Policy before sparking. ✨" });
      return;
    }
    if (!user || !db || targetId.startsWith('mock')) {
      if (targetId.startsWith('mock')) toast({ title: "Prototype Invitation!", description: "In real mode, this would send a secure invitation. ✨" });
      return;
    }
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

  if (!mounted || (usersLoading && db && user)) return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-muted/30">
      <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      {!hasAcceptedPolicy && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-3 flex items-center justify-between animate-in slide-in-from-top-2 z-40 sticky top-16">
           <div className="flex items-center gap-2 text-amber-800">
              <ShieldAlert className="w-4 h-4" />
              <p className="text-[10px] font-bold uppercase tracking-tight">View Only Mode Active</p>
           </div>
           <Link href="/policy/agree">
              <Button size="sm" variant="ghost" className="h-7 text-[9px] font-black uppercase text-amber-900 hover:bg-amber-200">Agree to Unlock</Button>
           </Link>
        </div>
      )}

      <main className="container mx-auto px-6 py-10 max-w-7xl space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
           <div className="space-y-2 text-left">
              <div className="flex items-center gap-3 text-primary">
                 <Sparkles className="w-6 h-6 animate-pulse" />
                 <h1 className="text-4xl font-black tracking-tighter uppercase">Discover Hearts</h1>
              </div>
              <p className="text-muted-foreground text-sm font-medium italic">"Explore the community, divided by presence, unified by respect."</p>
           </div>
           
           <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-2xl border shadow-sm shrink-0">
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center overflow-hidden">
                      <img src={`https://picsum.photos/seed/heart-${i}/100/100`} alt="Member" className="w-full h-full object-cover opacity-60" />
                   </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[8px] font-black text-white">+{discoveryItems?.length || '18k'}</div>
              </div>
              <div className="pr-2">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Presence</p>
                 <p className="text-xs font-bold text-slate-900">Connecting Every Heart</p>
              </div>
           </div>
        </div>

        {/* SPONSORED HIGHLIGHT */}
        {adItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {adItems.slice(0, 1).map((ad: any) => (
              <DiscoverCard key={ad.id} item={ad} />
            ))}
          </div>
        )}

        {/* LIVE SECTION */}
        <Collapsible open={isLiveExpanded} onOpenChange={setIsLiveExpanded} className="space-y-6">
           <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                    <Wifi className="w-5 h-5 animate-pulse" />
                 </div>
                 <div className="text-left">
                    <h2 className="text-xl font-black tracking-tight uppercase leading-none">Live Now</h2>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{liveHearts.length} Hearts Online</p>
                 </div>
              </div>
              <CollapsibleTrigger asChild>
                 <Button variant="ghost" size="sm" className="h-10 rounded-xl px-4 gap-2 font-black uppercase text-[10px] tracking-widest">
                    {isLiveExpanded ? 'Collapse' : 'Expand All'}
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
                      hasAcceptedPolicy={hasAcceptedPolicy} 
                      onAction={(type: any) => handleSparkAction(heart.id, type)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white/40 rounded-[2.5rem] border-2 border-dashed border-muted">
                   <WifiOff className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
                   <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Quiet in the cloud right now</p>
                </div>
              )}
           </CollapsibleContent>
        </Collapsible>

        {/* OFFLINE SECTION */}
        <Collapsible open={isOfflineExpanded} onOpenChange={setIsOfflineExpanded} className="space-y-6">
           <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-500">
                    <WifiOff className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                    <h2 className="text-xl font-black tracking-tight uppercase leading-none">Resting Hearts</h2>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{restingHearts.length} Members Away</p>
                 </div>
              </div>
              <CollapsibleTrigger asChild>
                 <Button variant="ghost" size="sm" className="h-10 rounded-xl px-4 gap-2 font-black uppercase text-[10px] tracking-widest text-slate-400">
                    {isOfflineExpanded ? 'Collapse' : 'Expand All'}
                    {isOfflineExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                 </Button>
              </CollapsibleTrigger>
           </div>
           
           <CollapsibleContent className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 opacity-80">
                {restingHearts.map((heart: any) => (
                  <DiscoverCard 
                    key={heart.id} 
                    item={heart} 
                    hasAcceptedPolicy={hasAcceptedPolicy} 
                    onAction={(type: any) => handleSparkAction(heart.id, type)} 
                  />
                ))}
              </div>
           </CollapsibleContent>
        </Collapsible>

        {!usersLoading && liveHearts.length === 0 && restingHearts.length === 0 && (
           <div className="flex flex-col items-center justify-center py-40 text-center space-y-6 opacity-40">
             <Ghost className="w-20 h-20 text-muted-foreground/20 mx-auto" />
             <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter">{t('discover.allExplored')}</h2>
                <p className="text-sm font-medium italic">"The network is resting. Come back in a heartbeat for new connections."</p>
             </div>
           </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

/**
 * Sub-component for individual Discovery Cards.
 * Features an internal media carousel and contextual spark actions.
 * Supports full-screen media lightbox and expandable presence status.
 */
function DiscoverCard({ item, hasAcceptedPolicy, onAction }: any) {
  const [isMuted, setIsMuted] = useState(true);
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);
  const { t } = useTranslation();

  // RENDER AD CARD
  if (item.type === 'ad') {
    const isVideo = item.adType === 'video';
    return (
      <Card className={cn("relative aspect-[3/4] overflow-hidden border-none shadow-xl rounded-[2.5rem] text-white flex flex-col group transition-transform hover:scale-[1.02]", isVideo ? "bg-black" : "bg-gradient-to-br from-indigo-900 to-slate-900")}>
        {isVideo && item.videoUrl && (
          <div className="absolute inset-0">
            <video src={item.videoUrl} autoPlay loop muted={isMuted} playsInline className="w-full h-full object-cover opacity-60" />
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-20 bg-black/40 text-white w-8 h-8 rounded-full" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        )}
        <div className="relative z-10 p-8 flex flex-col h-full justify-between">
          <Badge className="w-fit bg-blue-500/20 text-white font-black text-[8px] uppercase tracking-widest px-3 h-6 flex items-center border-none backdrop-blur-md">{t('discover.sponsored')}</Badge>
          <div className="space-y-4">
            <h2 className="text-xl font-black tracking-tighter leading-none">{item.title}</h2>
            <p className="text-white/70 line-clamp-3 text-xs leading-relaxed italic">"{item.description}"</p>
            <Button className="w-full h-11 rounded-2xl bg-white text-blue-900 font-black uppercase tracking-tight text-[10px]" onClick={() => window.open(item.targetUrl)}>Explore Now</Button>
          </div>
        </div>
      </Card>
    );
  }

  // RENDER PROFILE CARD
  const mediaItems = [];
  if (item.publicVideoUrl) mediaItems.push({ type: 'video', url: item.publicVideoUrl });
  if (item.publicPhotoUrl) mediaItems.push({ type: 'image', url: item.publicPhotoUrl });
  (item.additionalPhotoUrls || []).forEach((url: string) => mediaItems.push({ type: 'image', url }));

  return (
    <Card className="group relative aspect-[3/4] overflow-hidden border-none shadow-xl rounded-[2.5rem] bg-white transition-all hover:shadow-2xl hover:scale-[1.02]">
      {mediaItems.length > 0 ? (
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full">
            {mediaItems.map((media, idx) => (
              <CarouselItem key={idx} className="relative h-full">
                <Dialog>
                   <DialogTrigger asChild>
                      <div className="w-full h-full cursor-zoom-in relative group/media">
                        {media.type === 'video' ? (
                          <div className="relative w-full h-full bg-black">
                              <video src={media.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                              <div className="absolute top-6 right-6 z-20">
                                <Badge className="bg-primary/20 text-white backdrop-blur-md border-none px-2 h-6 flex items-center gap-1.5 uppercase font-black text-[7px] tracking-widest">
                                    <PlayCircle className="w-3 h-3" />
                                    Highlight
                                </Badge>
                              </div>
                          </div>
                        ) : (
                          <img 
                            src={media.url} 
                            alt={`${item.name}`} 
                            className="w-full h-full object-cover" 
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/10 transition-colors flex items-center justify-center">
                           <Maximize2 className="w-10 h-10 text-white opacity-0 group-hover/media:opacity-100 transition-opacity drop-shadow-lg" />
                        </div>
                      </div>
                   </DialogTrigger>
                   <DialogContent className="max-w-[95vw] max-h-[90vh] p-0 overflow-hidden bg-black border-none rounded-[3rem] shadow-2xl">
                      <DialogHeader className="absolute top-6 left-6 z-50 text-left pointer-events-none">
                         <DialogTitle className="text-white font-black text-2xl tracking-tighter uppercase drop-shadow-md">{item.name}</DialogTitle>
                         <p className="text-[10px] text-white/60 font-black uppercase tracking-widest drop-shadow-md">Public Highlight • {media.type.toUpperCase()}</p>
                      </DialogHeader>
                      <div className="w-full h-full flex items-center justify-center p-4">
                         {media.type === 'video' ? (
                            <video src={media.url} controls autoPlay loop className="max-w-full max-h-[80vh] rounded-3xl" />
                         ) : (
                            <img src={media.url} alt={item.name} className="max-w-full max-h-[80vh] object-contain rounded-3xl" />
                         )}
                      </div>
                   </DialogContent>
                </Dialog>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute top-6 left-0 right-0 flex justify-center gap-1 z-20">
             {mediaItems.map((_, i) => (
               <div key={i} className="h-0.5 w-4 rounded-full bg-white/40" />
             ))}
          </div>
        </Carousel>
      ) : (
        <div className="w-full h-full bg-primary/5 flex flex-col items-center justify-center p-8 text-center space-y-4">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-dashed border-primary/20">
              <Heart className="w-8 h-8 text-primary/20 fill-primary/10" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">{t('discover.mystery')}</p>
              <p className="text-[8px] text-muted-foreground font-medium italic mt-1">Identity revealed after mutual spark.</p>
           </div>
        </div>
      )}

      {/* EXPANDABLE STATUS BADGE */}
      <div className="absolute top-6 left-6 z-30 flex flex-col items-start gap-1">
         <Badge 
           onClick={() => setIsStatusExpanded(!isStatusExpanded)}
           className={cn(
             "border-none px-3 h-6 flex items-center gap-1.5 uppercase font-black text-[7px] tracking-widest shadow-lg cursor-pointer transition-all duration-300",
             item.isOnline ? "bg-green-500 text-white" : "bg-black/40 text-white/70 backdrop-blur-md"
           )}
         >
            {item.isOnline ? <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> : <Clock className="w-2.5 h-2.5" />}
            {item.isOnline ? 'Live Now' : 'Away'}
         </Badge>
         
         {isStatusExpanded && (
           <div className="bg-white/90 backdrop-blur-md rounded-lg px-2 py-1 shadow-xl animate-in zoom-in-95 duration-200">
              <p className="text-[7px] font-black uppercase text-slate-800 tracking-tighter whitespace-nowrap">
                {item.isOnline ? 'Actively Connecting' : `Last Seen: ${item.lastActive}`}
              </p>
           </div>
         )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 space-y-4">
         <div className="space-y-1">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-white tracking-tighter truncate max-w-[70%]">{item.name}</h3>
               <Badge className="bg-primary/20 text-white border border-white/20 backdrop-blur-md font-black text-[7px] uppercase h-5 px-2 tracking-widest">{t('discover.mystery')}</Badge>
            </div>
            <div className="flex items-center gap-1.5 text-[8px] font-bold text-white/60 uppercase tracking-widest">
               <MapPin className="w-2.5 h-2.5" /> {item.locationHint}
            </div>
         </div>

         <p className="text-[11px] text-white/80 leading-relaxed font-medium line-clamp-2 italic">"{item.bio}"</p>

         <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAction('friend')}
              className={cn("flex-1 h-10 rounded-xl bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-blue-600 font-black uppercase text-[8px] tracking-widest gap-1.5 transition-all", !hasAcceptedPolicy && "opacity-40 cursor-not-allowed")}
            >
              <Send className="w-3 h-3" />
              Invite
            </Button>
            <Button 
              size="sm"
              onClick={() => onAction('date')}
              className={cn("flex-1 h-10 rounded-xl gradient-bg shadow-lg font-black uppercase text-[8px] tracking-widest gap-1.5 transition-all active:scale-95", !hasAcceptedPolicy && "opacity-40 cursor-not-allowed")}
            >
              <Heart className="w-3 h-3 fill-current" />
              Spark
            </Button>
         </div>
      </div>
    </Card>
  );
}

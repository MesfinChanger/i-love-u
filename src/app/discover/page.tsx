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
  Send
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, collection, serverTimestamp, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function DiscoverPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: myProfile } = useDoc(userRef);

  const discoveryQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'publicProfiles'));
  }, [db]);
  const { data: discoveryItems, loading: usersLoading } = useCollection(discoveryQuery);

  const adsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'ads'), where('status', '==', 'active'));
  }, [db]);
  const { data: activeAds } = useCollection(adsQuery);

  const viewerCountry = myProfile?.country || 'GLOBAL';
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const profiles = useMemo(() => {
    // Only attempt to merge real data if we are mounted and have data
    const hasItems = mounted && discoveryItems && discoveryItems.length > 0;
    
    const baseProfiles = hasItems 
      ? (discoveryItems || [])
        .filter((u: any) => u.uid !== user?.uid)
        .map((u: any) => ({
          id: u.uid,
          name: u.publicNickname || "Mystery Heart", 
          publicPhotoUrl: u.publicPhotoUrl || null,
          interests: u.interests || [],
          culturalInterests: u.culturalInterests || [],
          bio: u.bio || "Sharing culture and looking for sparks.",
          locationHint: u.locationHint || "Global Community",
          type: 'profile'
        }))
      : [
          {
            id: 'mock-1',
            name: 'Amina',
            publicPhotoUrl: PlaceHolderImages.find(img => img.id === 'user-2')?.imageUrl,
            interests: ['Textiles', 'Tea', 'Hiking'],
            culturalInterests: ['Swahili History'],
            bio: "Exploring the intersection of art and nature.",
            locationHint: "Nairobi, KE",
            type: 'profile'
          },
          {
            id: 'mock-2',
            name: 'Yuki',
            publicPhotoUrl: PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl,
            interests: ['Coding', 'Origami', 'Jazz'],
            culturalInterests: ['Japanese Tea Ceremony'],
            bio: "Looking for a soul to share a quiet sunset with.",
            locationHint: "Tokyo, JP",
            type: 'profile'
          },
          {
            id: 'mock-3',
            name: 'Elena',
            publicPhotoUrl: PlaceHolderImages.find(img => img.id === 'user-3')?.imageUrl,
            interests: ['Architecture', 'Pasta', 'Piano'],
            culturalInterests: ['Renaissance Art'],
            bio: "Building dreams and finding love in small moments.",
            locationHint: "Rome, IT",
            type: 'profile'
          }
        ];

    const adItems = (mounted && activeAds ? activeAds : [])
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

    const finalFeed = [];
    const pool = [...baseProfiles];
    for (let i = 0; i < pool.length; i++) {
      finalFeed.push(pool[i]);
      if ((i + 1) % 4 === 0 && adItems.length > 0) {
        finalFeed.push(adItems.shift());
      }
    }
    
    return finalFeed;
  }, [discoveryItems, activeAds, user, viewerCountry, mounted]);

  const currentItem = profiles[currentIndex];

  const handleAction = async (type: 'friend' | 'date') => {
    if (!user || !db || !currentItem || currentItem.type === 'ad' || currentItem.id.startsWith('mock')) {
      if (currentItem?.id.startsWith('mock')) {
        toast({ title: "Prototype Invitation!", description: "In real mode, this would send a secure invitation. ✨" });
        handleNext();
      }
      return;
    }

    const uids = [user.uid, currentItem.id].sort();
    const matchId = uids.join('_');

    const matchData = {
      userIds: uids,
      timestamp: serverTimestamp(),
      lastMessage: type === 'date' ? "A Spark invitation has been sent! ✨" : "Connection invitation sent 🤝",
      status: "pending",
      invitedBy: user.uid,
      type: type
    };

    try {
      await setDoc(doc(db, 'matches', matchId), matchData);
      toast({ title: "Invitation Sent!", description: "Waiting for them to accept your spark. ❤️" });
      handleNext();
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Respectful invitation could not be sent." });
    }
  };

  const handleNext = () => setCurrentIndex(prev => prev + 1);

  // If loading real data and we've hydrated, show a stable loader
  if (mounted && usersLoading && db) return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  // Hydration mismatch guard for the final display
  if (!mounted) return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24 items-center justify-center">
       <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
    </div>
  );

  if (!currentItem) return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24 items-center justify-center p-8 text-center">
      <Header />
      <div className="space-y-4">
        <Ghost className="w-20 h-20 text-muted-foreground/20 mx-auto" />
        <h2 className="text-2xl font-black">All Hearts Explored</h2>
        <p className="text-muted-foreground text-sm max-w-[240px]">Come back later for new mysterious connections.</p>
        <Button onClick={() => setCurrentIndex(0)} className="mt-4 rounded-xl gradient-bg px-8">Restart Discovery</Button>
      </div>
      <BottomNav />
    </div>
  );

  if (currentItem?.type === 'ad') {
    const isVideo = currentItem.adType === 'video';
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <Card className={cn("w-full max-w-md relative h-[calc(100vh-18rem)] overflow-hidden border-none shadow-2xl rounded-[2.5rem] text-white", isVideo ? "bg-black" : "bg-gradient-to-br from-indigo-900 to-slate-900")}>
            {isVideo && currentItem.videoUrl && (
              <div className="absolute inset-0">
                <video src={currentItem.videoUrl} autoPlay loop muted={isMuted} playsInline className="w-full h-full object-cover opacity-60" />
                <Button variant="ghost" size="icon" className="absolute top-6 right-6 z-20 bg-black/40 text-white" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX /> : <Volume2 />}
                </Button>
              </div>
            )}
            <div className="relative z-10 p-10 flex flex-col h-full justify-between">
              <Badge className="w-fit bg-blue-500/20 text-white font-black text-[9px] uppercase tracking-widest px-4 h-8 flex items-center">SPONSORED</Badge>
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tighter leading-none">{currentItem.title}</h2>
                <p className="text-white/70 line-clamp-3 text-sm leading-relaxed">{currentItem.description}</p>
                <div className="space-y-3 pt-4">
                  <Button className="w-full h-12 rounded-xl bg-white text-blue-900 font-black uppercase tracking-tight text-xs" onClick={() => window.open(currentItem.targetUrl)}>Explore Now</Button>
                  <Button variant="ghost" className="w-full text-white/40 hover:text-white text-[10px] uppercase font-bold" onClick={handleNext}>Skip ad</Button>
                </div>
              </div>
            </div>
          </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  const isRevealed = currentItem?.publicPhotoUrl !== null && currentItem?.publicPhotoUrl !== undefined;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col items-center">
          {mounted && !db && (
            <div className="mb-4">
               <Badge className="bg-amber-500 text-white font-black uppercase text-[8px] tracking-widest px-4 py-1.5 shadow-xl animate-bounce">Prototype Mode Active</Badge>
            </div>
          )}
          <Card className="w-full relative h-[calc(100vh-18rem)] overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white p-0 flex flex-col">
            {isRevealed && currentItem ? (
              <div className="relative h-full w-full">
                <Image 
                  src={currentItem.publicPhotoUrl!} 
                  alt={currentItem.name} 
                  fill 
                  className="object-cover" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-3xl font-black tracking-tighter">{currentItem.name}</h2>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">
                        <MapPin className="w-3 h-3" /> {currentItem.locationHint}
                      </div>
                    </div>
                    <Badge className="bg-primary text-white border-none font-black text-[8px] uppercase h-7 px-3">Revealed Heart</Badge>
                  </div>
                  <p className="italic text-sm text-white/90 leading-relaxed font-medium line-clamp-2">"{currentItem.bio}"</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentItem.interests.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} className="bg-white/10 text-white backdrop-blur-md border-none px-2.5 py-1 rounded-lg font-bold text-[8px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : currentItem ? (
              <div className="p-8 flex flex-col h-full justify-between">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center border-2 border-dashed border-primary/20">
                      <Heart className="w-8 h-8 text-primary/20 fill-primary/10 animate-pulse" />
                    </div>
                    <Badge variant="outline" className="h-7 px-3 rounded-full border-primary/10 text-primary font-black uppercase tracking-widest text-[8px]">
                      Mystery Connection
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900">{currentItem.name}</h2>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <MapPin className="w-3 h-3" /> {currentItem.locationHint}
                    </div>
                    <p className="italic text-base text-slate-700 leading-relaxed font-medium">"{currentItem.bio}"</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">Interests & Vibe</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentItem.interests.map((tag: string) => (
                        <Badge key={tag} className="bg-slate-100 text-slate-600 border-none px-2.5 py-1 rounded-lg font-bold text-[9px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
                   <div className="flex items-center gap-2 text-primary mb-1">
                     <Lock className="w-3 h-3" />
                     <span className="text-[8px] font-black uppercase tracking-widest">Privacy Shield Active</span>
                   </div>
                   <p className="text-[8px] text-muted-foreground font-medium italic">Consensual matching: Identity revealed after mutual invitation.</p>
                </div>
              </div>
            ) : null}
          </Card>
          
          <div className="relative mt-8 flex justify-center gap-4 w-full px-4">
            <Button variant="outline" size="icon" className="w-14 h-14 rounded-full bg-white text-slate-400 hover:text-red-500 border-none shadow-xl transition-all hover:scale-110 shrink-0" onClick={handleNext}>
              <X className="w-6 h-6" />
            </Button>
            <Button className="w-full max-w-[100px] h-14 rounded-full bg-white text-blue-600 shadow-xl font-black uppercase text-[9px] border-none hover:bg-blue-50 gap-2" onClick={() => handleAction('friend')}>
              <Send className="w-3 h-3" />
              Invite
            </Button>
            <Button className="w-full max-w-[120px] h-14 rounded-full shadow-xl font-black uppercase text-[9px] gradient-bg hover:scale-105 transition-transform gap-2" onClick={() => handleAction('date')}>
              <Heart className="w-3 h-3 fill-current" />
              Spark
            </Button>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
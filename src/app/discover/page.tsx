
'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  X, 
  Sparkles, 
  MapPin, 
  Zap, 
  Globe2, 
  Soup, 
  Lock, 
  Building2, 
  Megaphone, 
  ExternalLink,
  Volume2,
  VolumeX,
  ShieldCheck,
  HeartHandshake,
  Loader2,
  RefreshCw,
  Search
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function DiscoverPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: myProfile } = useDoc(userRef);

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'));
  }, [db]);
  const { data: dbUsers, loading: usersLoading } = useCollection(usersQuery);

  const adsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'ads'), where('status', '==', 'active'));
  }, [db]);
  const { data: activeAds } = useCollection(adsQuery);

  const isAlreadyDating = myProfile?.relationshipStatus === 'dating';
  const isDatingDisabled = myProfile?.isDatingEnabled === false;
  const viewerCountry = myProfile?.country || 'GLOBAL';

  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const profiles = useMemo(() => {
    const baseProfiles = (dbUsers || [])
      .filter((u: any) => u.uid !== user?.uid)
      .map((u: any) => ({
        id: u.uid,
        name: u.displayName || 'Unknown',
        age: u.age || 18,
        gender: u.gender,
        religion: u.religion || 'Not specified',
        location: u.location || 'Unknown World',
        bio: u.bio || 'Sharing culture and looking for sparks.',
        image: u.photoUrl || PlaceHolderImages[1].imageUrl,
        interests: u.interests || [],
        culturalInterests: u.culturalInterests?.join(', ') || '',
        isGlobalFriend: true,
        type: 'profile'
      }));

    const mockProfiles = PlaceHolderImages.filter(img => img.id.startsWith('user-')).map((img, i) => ({
      id: img.id,
      name: ['Alex', 'Jordan', 'Taylor', 'Casey', 'Sasha', 'Riley'][i % 6],
      age: 22 + i,
      gender: i % 2 === 0 ? 'female' : 'male',
      religion: ['Christianity', 'Islam', 'None', 'Buddhism', 'Atheist'][i % 5],
      location: ['Tokyo, JP', 'Paris, FR', 'New York, NY', 'Berlin, DE', 'Seoul, KR', 'Madrid, ES'][i % 6],
      bio: 'Exploring the beauty of life, one coffee shop at a time. Looking for a genuine spark or a global friend to share cultures with!',
      image: img.imageUrl,
      interests: ['Art', 'Cooking', 'Music', 'Fitness'],
      culturalInterests: ['Japanese Calligraphy', 'French Pastries', 'Korean Cinema'][i % 3],
      isGlobalFriend: i % 2 === 0,
      type: 'profile'
    }));

    const combined = [...baseProfiles, ...mockProfiles];
    
    const adItems = (activeAds || [])
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
    for (let i = 0; i < combined.length; i++) {
      finalFeed.push(combined[i]);
      if ((i + 1) % 4 === 0 && adItems.length > 0) {
        finalFeed.push(adItems.shift());
      }
    }
    
    return finalFeed;
  }, [dbUsers, activeAds, user, viewerCountry]);

  const currentItem = profiles[currentIndex];

  const handleAction = async (type: 'friend' | 'date') => {
    if (!user || !db || !currentItem || currentItem.type === 'ad') return;

    if (type === 'date') {
      if (isDatingDisabled) {
        toast({ variant: "destructive", title: "Safety Guard", description: "Your profile has dating disabled for safety." });
        return;
      }
      if (isAlreadyDating) {
        toast({ variant: "destructive", title: "Exclusive Spark", description: "You can only have one active spark for accountability." });
        return;
      }
      if (myProfile?.gender === currentItem.gender) {
        toast({ variant: "destructive", title: "Preference Guard", description: "Sparks are limited to opposite-sex connections per community policy." });
        return;
      }
    }

    const matchData = {
      userIds: [user.uid, currentItem.id],
      timestamp: serverTimestamp(),
      lastMessage: type === 'date' ? "We sparked! ✨" : "Global friendship initiated 🤝",
      status: "active",
      type: type
    };

    addDoc(collection(db, 'matches'), matchData);

    if (type === 'date') {
      setDoc(doc(db, 'users', user.uid), {
        relationshipStatus: 'dating',
        partnerId: currentItem.id
      }, { merge: true });
    }

    toast({
      title: type === 'date' ? "Mutual Spark!" : "New Connection",
      description: `You and ${currentItem.name} are now connected.`,
    });

    handleNext();
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % profiles.length);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (usersLoading) return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24 items-center justify-center p-8 text-center">
      <Header />
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <h2 className="text-xl font-black tracking-tighter">Preparing Your Feed...</h2>
      <BottomNav />
    </div>
  );

  if (!currentItem || currentIndex >= profiles.length) return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24 items-center justify-center p-8 text-center">
      <Header />
      <div className="max-w-xs space-y-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
           <Search className="w-10 h-10 text-primary opacity-20" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tighter">End of the Globe!</h2>
          <p className="text-sm text-muted-foreground mt-2">You've seen all available sparks in your region for now.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={handleRestart} className="rounded-2xl h-14 font-bold gap-2 gradient-bg shadow-xl shadow-primary/20">
            <RefreshCw className="w-5 h-5" />
            Restart Discovery
          </Button>
          <Button variant="ghost" className="text-xs uppercase tracking-widest font-black" asChild>
            <a href="/profile">Update My Preferences</a>
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  );

  if (currentItem.type === 'ad') {
    const isVideo = currentItem.adType === 'video';
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md relative aspect-[3/4]">
            <Card className={cn(
              "absolute inset-0 overflow-hidden border-none shadow-2xl rounded-[3rem] text-white",
              isVideo ? "bg-black" : "bg-gradient-to-br from-indigo-800 via-blue-900 to-slate-900"
            )}>
              {isVideo && currentItem.videoUrl && (
                <div className="absolute inset-0 z-0">
                  <video 
                    src={currentItem.videoUrl} 
                    autoPlay 
                    loop 
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-8 right-8 z-20 bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:text-white"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                </div>
              )}
              
              <div className="relative z-10 p-10 flex flex-col h-full">
                 <div className="flex items-center justify-between mb-6">
                    <Badge className="bg-blue-500/20 backdrop-blur-md border border-blue-400/20 text-white uppercase font-black text-[9px] tracking-widest px-3 h-7">
                       SPONSORED MOMENT
                    </Badge>
                    <ShieldCheck className="w-6 h-6 text-green-400" />
                 </div>
                 
                 <div className="flex-grow flex flex-col justify-center gap-4">
                    <h2 className="text-4xl font-black tracking-tighter leading-none">{currentItem.title}</h2>
                    <p className="text-base text-blue-100/70 leading-relaxed font-medium line-clamp-4">{currentItem.description}</p>
                 </div>

                 <div className="mt-8 space-y-4">
                    <Button 
                      className="w-full h-16 rounded-3xl bg-white text-blue-900 font-black text-lg gap-2 shadow-xl hover:scale-[1.02] transition-transform"
                      onClick={() => currentItem.targetUrl && window.open(currentItem.targetUrl)}
                    >
                      Learn More
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" className="w-full text-white/40 uppercase font-black text-[9px] tracking-widest" onClick={handleNext}>
                      Skip Advertisement
                    </Button>
                 </div>
              </div>
            </Card>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const isSameSex = myProfile?.gender === currentItem.gender;
  const datingIncapable = isAlreadyDating || isDatingDisabled || isSameSex;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md relative aspect-[3/4]">
          <Card className="absolute inset-0 overflow-hidden border-none shadow-2xl rounded-[3.5rem] bg-white">
            <Image src={currentItem.image} alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-4xl font-black tracking-tighter">{currentItem.name}, {currentItem.age}</h2>
                <Badge className="bg-green-500/20 backdrop-blur-md text-green-300 border-green-400/30 font-black text-[9px] uppercase tracking-widest h-7 px-3">
                   RESPECT PLEDGED
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-white/50 mb-6">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> {currentItem.location}</div>
                <div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {currentItem.religion}</div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-white/80 line-clamp-3 text-lg leading-relaxed font-medium italic">"{currentItem.bio}"</p>
                {currentItem.culturalInterests && (
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                    <Soup className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-[11px] font-bold uppercase tracking-tight">Cultural Exchange: <span className="text-primary">{currentItem.culturalInterests}</span></p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {currentItem.interests.slice(0, 3).map(interest => (
                  <Badge key={interest} variant="outline" className="bg-white/5 border-white/20 text-white/80 font-bold text-[10px] uppercase h-7 px-4 rounded-full">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          <div className="absolute -bottom-24 left-0 right-0 flex justify-center items-center gap-4">
            <Button variant="outline" size="icon" className="w-16 h-16 rounded-full border-none bg-white text-red-500 shadow-xl hover:scale-110 active:scale-95 transition-all" onClick={handleNext}>
              <X className="w-7 h-7" />
            </Button>
            
            <Button variant="outline" className="rounded-full border-none bg-white text-blue-600 shadow-xl flex flex-col gap-1 h-16 w-28 hover:scale-105 active:scale-95 transition-all" onClick={() => handleAction('friend')}>
              <Globe2 className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Connect</span>
            </Button>

            <Button 
              className={cn(
                "rounded-full shadow-xl flex flex-col gap-1 h-16 w-28 hover:scale-105 active:scale-95 transition-all", 
                datingIncapable ? "bg-muted text-muted-foreground/30 border border-dashed cursor-not-allowed" : "gradient-bg text-white"
              )} 
              onClick={() => handleAction('date')} 
              disabled={datingIncapable}
            >
              {datingIncapable ? <Lock className="w-5 h-5" /> : <Zap className="w-5 h-5 fill-white" />}
              <span className="text-[10px] font-black uppercase tracking-widest">{datingIncapable ? "Restricted" : "Spark"}</span>
            </Button>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

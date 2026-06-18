
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
  ExternalLink,
  Volume2,
  VolumeX,
  ShieldCheck,
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

    const adItems = (activeAds || [])
      .filter((ad: any) => {
        if (!ad.targetCountries) return true;
        // GEO-FENCING COMPLIANCE
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
    for (let i = 0; i < baseProfiles.length; i++) {
      finalFeed.push(baseProfiles[i]);
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
      if (isDatingDisabled || isAlreadyDating) {
        toast({ variant: "destructive", title: "Safety Guard", description: "Dating is restricted per community policy." });
        return;
      }
      if (myProfile?.gender === currentItem.gender) {
        toast({ variant: "destructive", title: "Preference Guard", description: "Sparks are limited to opposite-sex connections." });
        return;
      }
    }

    const matchData = {
      userIds: [user.uid, currentItem.id],
      timestamp: serverTimestamp(),
      lastMessage: type === 'date' ? "We sparked! ✨" : "Connection initiated 🤝",
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

    toast({ title: "New Connection!", description: `You and ${currentItem.name} are connected.` });
    handleNext();
  };

  const handleNext = () => setCurrentIndex(prev => prev + 1);

  if (usersLoading) return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!currentItem) return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24 items-center justify-center p-8 text-center">
      <Header />
      <h2 className="text-2xl font-black">End of Feed!</h2>
      <Button onClick={() => setCurrentIndex(0)} className="mt-4 rounded-xl gradient-bg">Restart Discovery</Button>
      <BottomNav />
    </div>
  );

  if (currentItem.type === 'ad') {
    const isVideo = currentItem.adType === 'video';
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className={cn("w-full max-w-md relative aspect-[3/4] overflow-hidden border-none shadow-2xl rounded-[3rem] text-white", isVideo ? "bg-black" : "bg-gradient-to-br from-indigo-900 to-slate-900")}>
            {isVideo && currentItem.videoUrl && (
              <div className="absolute inset-0">
                <video src={currentItem.videoUrl} autoPlay loop muted={isMuted} playsInline className="w-full h-full object-cover opacity-60" />
                <Button variant="ghost" size="icon" className="absolute top-8 right-8 z-20 bg-black/40 text-white" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX /> : <Volume2 />}
                </Button>
              </div>
            )}
            <div className="relative z-10 p-10 flex flex-col h-full justify-between">
              <Badge className="w-fit bg-blue-500/20 text-white font-black text-[9px] uppercase tracking-widest px-3 h-7">SPONSORED</Badge>
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tighter">{currentItem.title}</h2>
                <p className="text-white/70 line-clamp-4">{currentItem.description}</p>
                <Button className="w-full h-14 rounded-2xl bg-white text-blue-900 font-black" onClick={() => window.open(currentItem.targetUrl)}>Learn More</Button>
                <Button variant="ghost" className="w-full text-white/40" onClick={handleNext}>Skip</Button>
              </div>
            </div>
          </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md relative aspect-[3/4]">
          <Card className="absolute inset-0 overflow-hidden border-none shadow-2xl rounded-[3.5rem]">
            <Image src={currentItem.image} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
              <h2 className="text-4xl font-black tracking-tighter">{currentItem.name}, {currentItem.age}</h2>
              <div className="flex items-center gap-2 text-xs opacity-60 mt-2 mb-4"><MapPin className="w-3 h-3" /> {currentItem.location}</div>
              <p className="italic text-lg">"{currentItem.bio}"</p>
            </div>
          </Card>
          <div className="absolute -bottom-24 left-0 right-0 flex justify-center gap-4">
            <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-white text-red-500 shadow-xl" onClick={handleNext}><X /></Button>
            <Button className="w-28 h-16 rounded-full bg-white text-blue-600 shadow-xl font-black uppercase text-[10px]" onClick={() => handleAction('friend')}>Connect</Button>
            <Button className={cn("w-28 h-16 rounded-full shadow-xl font-black uppercase text-[10px]", datingIncapable ? "bg-muted" : "gradient-bg")} onClick={() => handleAction('date')} disabled={datingIncapable}>Spark</Button>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

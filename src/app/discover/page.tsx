'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Heart, X, Sparkles, MapPin, Zap, UserPlus, ShieldAlert, Church, Globe2, Languages, Soup, Lock } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
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

  const isAlreadyDating = myProfile?.relationshipStatus === 'dating';

  const profiles = useMemo(() => {
    return PlaceHolderImages.filter(img => img.id.startsWith('user-')).map((img, i) => ({
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
      isGlobalFriend: i % 2 === 0
    }));
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProfile = profiles[currentIndex];

  const handleAction = async (type: 'friend' | 'date') => {
    if (!user || !db || !currentProfile) return;

    if (type === 'date') {
      if (isAlreadyDating) {
        toast({
          variant: "destructive",
          title: "Relationship Exclusive",
          description: "You are currently sparking with someone. Go to Profile to end your current Spark before dating others."
        });
        return;
      }

      if (myProfile?.gender === currentProfile.gender) {
        toast({
          variant: "destructive",
          title: "Restriction",
          description: "Spark dating is currently limited to opposite-sex connections. Add as a friend instead!"
        });
        return;
      }
    }

    const matchData = {
      userIds: [user.uid, currentProfile.id],
      timestamp: serverTimestamp(),
      lastMessage: type === 'date' ? "We sparked! ✨" : "Global friendship initiated 🤝",
      status: "active",
      type: type
    };

    addDoc(collection(db, 'matches'), matchData);

    if (type === 'date') {
      setDoc(doc(db, 'users', user.uid), {
        relationshipStatus: 'dating',
        partnerId: currentProfile.id
      }, { merge: true });
      
      // Also update the partner if we had real user accounts
      // In this demo, we're just updating our own status
    }

    toast({
      title: type === 'date' ? "It's a Spark!" : "Global Connection Made",
      description: type === 'date' ? `Connection made with ${currentProfile.name}.` : `You are now global friends with ${currentProfile.name}.`
    });

    handleNext();
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % profiles.length);
  };

  if (!currentProfile) return null;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md relative aspect-[3/4]">
          <Card className="absolute inset-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
            <Image 
              src={currentProfile.image} 
              alt={currentProfile.name} 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl font-black">{currentProfile.name}, {currentProfile.age}</h2>
                {currentProfile.isGlobalFriend ? (
                  <Badge variant="secondary" className="bg-blue-500/30 text-white border-blue-400/30 backdrop-blur-md">
                    <Globe2 className="w-3 h-3 mr-1" />
                    Global Friend
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-primary/20 text-white border-primary/30 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 mr-1 fill-white" />
                    AI Match
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 mb-4">
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{currentProfile.location}</div>
                <div className="flex items-center gap-1"><Church className="w-3 h-3" />{currentProfile.religion}</div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-white/90 line-clamp-2 text-lg">{currentProfile.bio}</p>
                {currentProfile.isGlobalFriend && (
                  <div className="flex items-center gap-2 text-blue-300 text-sm font-bold">
                    <Soup className="w-4 h-4" />
                    Interested in: {currentProfile.culturalInterests}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map(interest => (
                  <Badge key={interest} variant="outline" className="bg-white/10 border-white/20 text-white">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          <div className="absolute -bottom-20 left-0 right-0 flex justify-center items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="w-14 h-14 rounded-full border-2 bg-white text-red-500 shadow-lg hover:bg-red-50"
              onClick={handleNext}
            >
              <X className="w-6 h-6" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-2 bg-white text-blue-500 shadow-lg flex flex-col gap-1 h-14 w-24 border-blue-100"
              onClick={() => handleAction('friend')}
            >
              <Globe2 className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Friendship</span>
            </Button>

            <Button 
              size="icon" 
              className={cn(
                "rounded-full shadow-xl flex flex-col gap-1 h-14 w-24",
                isAlreadyDating ? "bg-muted text-muted-foreground border-2 border-dashed" : "gradient-bg text-white"
              )}
              onClick={() => handleAction('date')}
            >
              {isAlreadyDating ? (
                <>
                  <Lock className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Exclusive</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-white" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Spark</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
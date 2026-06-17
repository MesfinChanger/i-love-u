'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Heart, X, Info, Sparkles, MapPin, Zap, UserPlus, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

export default function DiscoverPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: myProfile } = useDoc(userRef);

  const profiles = useMemo(() => {
    return PlaceHolderImages.filter(img => img.id.startsWith('user-')).map((img, i) => ({
      id: img.id,
      name: ['Alex', 'Jordan', 'Taylor', 'Casey'][i % 4],
      age: 24 + i,
      gender: i % 2 === 0 ? 'female' : 'male', // Added gender to mock data
      location: 'New York, NY',
      bio: 'Lover of coffee, hiking, and late night jazz. Looking for someone to explore the city with.',
      image: img.imageUrl,
      interests: ['Hiking', 'Coffee', 'Music', 'Travel']
    }));
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProfile = profiles[currentIndex];

  const handleAction = async (type: 'friend' | 'date') => {
    if (!user || !db) return;

    if (type === 'date') {
      // 1. Relationship Constraint
      if (myProfile?.relationshipStatus === 'dating') {
        toast({
          variant: "destructive",
          title: "Exclusive Dating",
          description: "You are already dating someone. To date others, you must first unmatch your current partner."
        });
        return;
      }

      // 2. Opposite Sex Constraint
      if (myProfile?.gender && currentProfile.gender && myProfile.gender === currentProfile.gender) {
        toast({
          variant: "destructive",
          title: "Preference Restriction",
          description: "Same-sex sparking is currently not allowed. You can still add them as a friend!"
        });
        return;
      }
      
      // 3. Gender missing check
      if (!myProfile?.gender) {
        toast({
          variant: "destructive",
          title: "Profile Incomplete",
          description: "Please set your gender in your profile before sparking."
        });
        return;
      }
    }

    // Simulate match creation
    const matchData = {
      userIds: [user.uid, currentProfile.id],
      timestamp: serverTimestamp(),
      lastMessage: type === 'date' ? "We sparkled!" : "Let's be friends!",
      status: "active",
      type: type
    };

    addDoc(collection(db, 'matches'), matchData);

    if (type === 'date') {
      setDoc(doc(db, 'users', user.uid), {
        relationshipStatus: 'dating',
        partnerId: currentProfile.id
      }, { merge: true });
    }

    toast({
      title: type === 'date' ? "Sparked!" : "Friend Request Sent",
      description: `You and ${currentProfile.name} have connected as ${type}s.`
    });

    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (!currentProfile) return null;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md relative aspect-[3/4]">
          <div className="absolute inset-0 flex flex-col">
            <Card className="flex-grow overflow-hidden border-none shadow-2xl relative rounded-[2.5rem]">
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
                  <Badge variant="secondary" className="bg-primary/20 text-white border-primary/30 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 mr-1 fill-white" />
                    AI Match
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {currentProfile.location}
                  </div>
                  <div className="flex items-center gap-1 uppercase font-bold tracking-tighter">
                    <ShieldAlert className="w-3 h-3" />
                    {currentProfile.gender}
                  </div>
                </div>

                <p className="text-white/90 line-clamp-2 mb-6 text-lg leading-relaxed">
                  {currentProfile.bio}
                </p>

                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map(interest => (
                    <Badge key={interest} variant="outline" className="bg-white/10 border-white/20 text-white">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            <div className="flex justify-center items-center gap-4 mt-8">
              <Button 
                variant="outline" 
                size="icon" 
                className="w-14 h-14 rounded-full border-2 border-muted-foreground/20 bg-white hover:bg-red-50 hover:border-red-200 text-red-500 shadow-lg"
                onClick={handleNext}
              >
                <X className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-2 border-primary/20 bg-white text-primary hover:bg-primary/5 shadow-lg flex flex-col gap-1 h-14 w-24"
                onClick={() => handleAction('friend')}
              >
                <UserPlus className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Friend</span>
              </Button>

              <Button 
                size="icon" 
                className="rounded-full gradient-bg hover:opacity-90 text-white shadow-xl shadow-primary/30 flex flex-col gap-1 h-14 w-24"
                onClick={() => handleAction('date')}
              >
                <Zap className="w-5 h-5 fill-white" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Spark</span>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

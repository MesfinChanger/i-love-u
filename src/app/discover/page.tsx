'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Heart, X, Info, Sparkles, MapPin } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';

export default function DiscoverPage() {
  const profiles = useMemo(() => {
    return PlaceHolderImages.filter(img => img.id.startsWith('user-')).map((img, i) => ({
      id: img.id,
      name: ['Alex', 'Jordan', 'Taylor', 'Casey'][i % 4],
      age: 24 + i,
      location: 'New York, NY',
      bio: 'Lover of coffee, hiking, and late night jazz. Looking for someone to explore the city with.',
      image: img.imageUrl,
      interests: ['Hiking', 'Coffee', 'Music', 'Travel']
    }));
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProfile = profiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
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
                
                <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
                  <MapPin className="w-4 h-4" />
                  {currentProfile.location}
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

            <div className="flex justify-center items-center gap-6 mt-8">
              <Button 
                variant="outline" 
                size="icon" 
                className="w-16 h-16 rounded-full border-2 border-muted-foreground/20 bg-white hover:bg-red-50 hover:border-red-200 text-red-500 shadow-lg"
                onClick={() => handleSwipe('left')}
              >
                <X className="w-8 h-8" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="w-12 h-12 rounded-full border-muted-foreground/20 bg-white"
              >
                <Info className="w-6 h-6 text-muted-foreground" />
              </Button>
              <Button 
                size="icon" 
                className="w-16 h-16 rounded-full gradient-bg hover:opacity-90 text-white shadow-xl shadow-primary/30"
                onClick={() => handleSwipe('right')}
              >
                <Heart className="w-8 h-8 fill-white" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

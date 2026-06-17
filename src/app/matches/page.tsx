'use client';

import { useMemo } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useCollection, useUser } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function MatchesPage() {
  const { user } = useUser();
  
  // Mocking matches for the demo since the DB might be empty initially
  const mockMatches = useMemo(() => {
    return PlaceHolderImages.filter(img => img.id.startsWith('user-')).map((img, i) => ({
      id: `match-${i}`,
      userIds: [user?.uid || 'me', `user-${i}`],
      name: ['Alex', 'Jordan', 'Taylor', 'Casey'][i % 4],
      lastMessage: i === 0 ? "That sounds amazing! Let's do it." : "Hey! How was your weekend?",
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      photoUrl: img.imageUrl,
      unread: i < 2
    }));
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-4 pt-8">
        <h1 className="text-4xl font-black mb-8 tracking-tighter">Your Matches</h1>

        <div className="grid gap-4">
          {mockMatches.map((match) => (
            <Link key={match.id} href={`/matches/${match.id}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-none shadow-sm bg-white">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16 border-2 border-primary/10">
                      <AvatarImage src={match.photoUrl} className="object-cover" />
                      <AvatarFallback>{match.name[0]}</AvatarFallback>
                    </Avatar>
                    {match.unread && (
                      <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-lg">{match.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(match.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-sm line-clamp-1 ${match.unread ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                      {match.lastMessage}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {mockMatches.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-primary opacity-20" />
              </div>
              <h3 className="text-xl font-bold">No matches yet</h3>
              <p className="text-muted-foreground">Keep swiping to find your spark!</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function Heart(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}


'use client';

import { useMemo } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useCollection, useUser, useFirestore } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Globe2 } from 'lucide-react';

export default function MatchesPage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const matchesQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, 'matches'),
      where('userIds', 'array-contains', user.uid),
      orderBy('timestamp', 'desc')
    );
  }, [user, db]);

  const { data: dbMatches, loading } = useCollection(matchesQuery);

  // Mocking some initial data if DB is empty for demo
  const matches = useMemo(() => {
    if (dbMatches && dbMatches.length > 0) return dbMatches;
    
    return PlaceHolderImages.filter(img => img.id.startsWith('user-')).map((img, i) => ({
      id: `match-${i}`,
      userIds: [user?.uid || 'me', `user-${i}`],
      name: ['Alex', 'Jordan', 'Taylor', 'Casey'][i % 4],
      lastMessage: i === 0 ? "That sounds amazing! Let's do it." : "Hey! I'd love to learn more about your culture.",
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      photoUrl: img.imageUrl,
      unread: i === 0,
      type: i === 0 ? 'date' : 'friend'
    }));
  }, [user, dbMatches]);

  const dateMatch = matches.find((m: any) => m.type === 'date');
  const friendMatches = matches.filter((m: any) => m.type === 'friend');

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-4 pt-8">
        <h1 className="text-4xl font-black mb-8 tracking-tighter">Connections</h1>

        {/* The One - Current Date */}
        {dateMatch && (
          <section className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 fill-primary" />
              The Current Spark
            </h2>
            <Link href={`/matches/${dateMatch.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-all border-2 border-primary/20 bg-white group">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-primary/10">
                      <AvatarImage src={dateMatch.photoUrl} className="object-cover" />
                      <AvatarFallback>{dateMatch.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-lg">
                      <Zap className="w-4 h-4 fill-white" />
                    </div>
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-black text-2xl tracking-tight">{dateMatch.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(dateMatch.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-lg italic">
                      "{dateMatch.lastMessage}"
                    </p>
                    <Badge variant="outline" className="mt-4 border-primary text-primary bg-primary/5">
                      Mutual Spark
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </section>
        )}

        {/* Culture & Friendship */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 flex items-center gap-2 mb-4">
            <Globe2 className="w-4 h-4" />
            Culture & Language Exchange
          </h2>
          <div className="grid gap-3">
            {friendMatches.map((match: any) => (
              <Link key={match.id} href={`/matches/${match.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-none shadow-sm bg-white">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="w-14 h-14 border border-muted">
                      <AvatarImage src={match.photoUrl} className="object-cover" />
                      <AvatarFallback>{match.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="font-bold text-base">{match.name}</h3>
                        <Badge variant="outline" className="text-[8px] h-4 border-blue-200 text-blue-500 bg-blue-50">
                          GLOBAL FRIEND
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {match.lastMessage}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {friendMatches.length === 0 && !dateMatch && (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-muted-foreground/20">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-primary opacity-20" />
              </div>
              <h3 className="text-xl font-bold">No sparks yet</h3>
              <p className="text-muted-foreground px-8">Keep swiping to find friends or your perfect match!</p>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

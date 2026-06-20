'use client';

import { useMemo, useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useCollection, useUser, useFirestore, useDoc } from '@/firebase';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Globe2, MessageCircle, Loader2, Sparkles, ShieldCheck, Clock, Star, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MatchesPage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const matchesQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, 'matches'),
      where('userIds', 'array-contains', user.uid),
      where('status', '==', 'active'),
      orderBy('timestamp', 'desc')
    );
  }, [user, db]);

  const { data: dbMatches, loading } = useCollection(matchesQuery);

  const { dateMatch, friendMatches } = useMemo(() => {
    if (!dbMatches) return { dateMatch: null, friendMatches: [] };
    return {
      dateMatch: dbMatches.find((m: any) => m.type === 'date'),
      friendMatches: dbMatches.filter((m: any) => m.type === 'friend')
    };
  }, [dbMatches]);

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-4 pt-6 max-w-2xl">
        <div className="flex justify-between items-end mb-6">
          <div className="space-y-0.5">
            <h1 className="text-3xl font-black tracking-tighter">My Hearts</h1>
            <p className="text-[10px] text-muted-foreground font-medium italic">Nurturing global connections.</p>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm border border-primary/5">
            <Sparkles className="w-3 h-3" />
            {dbMatches?.length || 0} Sparks
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
          </div>
        ) : (
          <>
            {/* The One - Current Active Date Match */}
            {dateMatch && <ExclusiveSparkCard match={dateMatch} currentUserId={user?.uid!} />}

            {/* Culture & Friendship Circle */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1 bg-blue-500/10 rounded-full">
                  <Globe2 className="w-3 h-3 text-blue-500" />
                </div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Friendship Circle</h2>
              </div>
              
              {friendMatches.length > 0 ? (
                <div className="grid gap-4">
                  {friendMatches.map((match: any) => (
                    <FriendMatchCard key={match.id} match={match} currentUserId={user?.uid!} />
                  ))}
                </div>
              ) : !dateMatch ? (
                <div className="text-center py-16 px-8 bg-white rounded-[3rem] border-2 border-dashed border-muted/50 flex flex-col items-center gap-6 shadow-inner">
                  <div className="w-20 h-20 bg-muted/30 rounded-[2rem] flex items-center justify-center relative">
                    <Heart className="w-10 h-10 text-primary opacity-10 animate-pulse" />
                    <Star className="absolute top-2 right-2 w-4 h-4 text-secondary opacity-20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tighter">No Sparks Yet</h3>
                    <p className="text-muted-foreground text-sm max-w-[200px] mx-auto leading-relaxed italic">
                      Every journey starts with a single swipe of respect.
                    </p>
                  </div>
                  <Button asChild className="rounded-2xl h-12 gradient-bg px-8 font-black text-sm shadow-xl shadow-primary/30">
                    <Link href="/discover">Start Discovering</Link>
                  </Button>
                </div>
              ) : null}
            </section>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function ExclusiveSparkCard({ match, currentUserId }: { match: any, currentUserId: string }) {
  const db = useFirestore();
  const partnerId = match.userIds.find((id: string) => id !== currentUserId);
  const partnerRef = useMemoFirebase(() => partnerId ? doc(db, 'users', partnerId) : null, [db, partnerId]);
  const { data: partnerProfile } = useDoc(partnerRef);

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1 bg-primary/10 rounded-full">
          <Zap className="w-3 h-3 text-primary fill-primary" />
        </div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Exclusive Spark</h2>
      </div>
      <Link href={`/matches/${match.id}`}>
        <Card className="overflow-hidden hover:shadow-xl transition-all border-none bg-gradient-to-br from-white via-white to-pink-50 shadow-lg group rounded-[2.5rem] relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Heart className="w-24 h-24 fill-primary text-primary" />
          </div>
          <CardContent className="p-6 flex items-center gap-6 relative z-10">
            <div className="relative shrink-0">
              <Avatar className="w-20 h-20 border-2 border-primary/20 shadow-xl ring-2 ring-white">
                <AvatarImage src={partnerProfile?.photoUrl} className="object-cover" />
                <AvatarFallback>{partnerProfile?.displayName?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                <Heart className="w-3 h-3 fill-white" />
              </div>
            </div>
            
            <div className="flex-grow min-w-0 space-y-2">
              <div className="flex flex-col gap-0.5">
                <h3 className="font-black text-2xl tracking-tighter truncate">{partnerProfile?.displayName || "Partner"}</h3>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[8px] text-green-600 uppercase font-black tracking-widest">Active Spark Room</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm italic font-medium line-clamp-1">
                {match.lastMessage || "Start your journey..."}
              </p>
              <div className="flex flex-wrap gap-2">
                 <Badge className="bg-green-500/10 text-green-600 border-none text-[7px] font-black uppercase tracking-widest px-2 h-5 flex items-center gap-1">
                   <Lock className="w-2 h-2" />
                   E2EE
                 </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </section>
  );
}

function FriendMatchCard({ match, currentUserId }: { match: any, currentUserId: string }) {
  const db = useFirestore();
  const partnerId = match.userIds.find((id: string) => id !== currentUserId);
  const partnerRef = useMemoFirebase(() => partnerId ? doc(db, 'users', partnerId) : null, [db, partnerId]);
  const { data: partnerProfile } = useDoc(partnerRef);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dateString = useMemo(() => {
    if (!mounted || !match.timestamp) return '';
    try {
      const d = match.timestamp.toDate ? match.timestamp.toDate() : new Date(match.timestamp);
      return d.toLocaleDateString();
    } catch (e) {
      return '';
    }
  }, [mounted, match.timestamp]);

  return (
    <Link href={`/matches/${match.id}`}>
      <Card className="overflow-hidden hover:scale-[1.01] transition-all border-none shadow-sm hover:shadow-md bg-white rounded-[2rem] group">
        <CardContent className="p-4 flex items-center gap-4">
          <Avatar className="w-14 h-14 border border-muted shadow-sm group-hover:rotate-2 transition-transform">
            <AvatarImage src={partnerProfile?.photoUrl} className="object-cover" />
            <AvatarFallback>{partnerProfile?.displayName?.[0] || '?'}</AvatarFallback>
          </Avatar>
          
          <div className="flex-grow min-w-0 space-y-0.5">
            <div className="flex justify-between items-baseline">
              <h3 className="font-black text-lg tracking-tight group-hover:text-blue-500 transition-colors">{partnerProfile?.displayName || "Friend"}</h3>
              <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">
                {dateString || 'Now'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 italic font-medium">
              {match.lastMessage || "Starting..."}
            </p>
          </div>
          
          <div className="bg-blue-50 p-2 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
             <MessageCircle className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

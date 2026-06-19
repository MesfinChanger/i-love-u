
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
      
      <main className="container mx-auto px-4 pt-10 max-w-2xl">
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter">My Hearts</h1>
            <p className="text-sm text-muted-foreground font-medium italic">Nurturing global connections with respect.</p>
          </div>
          <div className="bg-primary/10 text-primary px-5 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm border border-primary/5">
            <Sparkles className="w-3.5 h-3.5" />
            {dbMatches?.length || 0} Sparks
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
          </div>
        ) : (
          <>
            {/* The One - Current Active Date Match */}
            {dateMatch && <ExclusiveSparkCard match={dateMatch} currentUserId={user?.uid!} />}

            {/* Culture & Friendship Circle */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 bg-blue-500/10 rounded-full">
                  <Globe2 className="w-4 h-4 text-blue-500" />
                </div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500">Global Friendship Circle</h2>
              </div>
              
              {friendMatches.length > 0 ? (
                <div className="grid gap-5">
                  {friendMatches.map((match: any) => (
                    <FriendMatchCard key={match.id} match={match} currentUserId={user?.uid!} />
                  ))}
                </div>
              ) : !dateMatch ? (
                <div className="text-center py-24 px-12 bg-white rounded-[4rem] border-2 border-dashed border-muted/50 flex flex-col items-center gap-8 shadow-inner">
                  <div className="w-28 h-28 bg-muted/30 rounded-[3rem] flex items-center justify-center relative">
                    <Heart className="w-14 h-14 text-primary opacity-10 animate-pulse" />
                    <Star className="absolute top-4 right-4 w-6 h-6 text-secondary opacity-20" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black tracking-tighter">No Sparks Yet</h3>
                    <p className="text-muted-foreground text-lg max-w-[280px] mx-auto leading-relaxed italic font-medium">
                      Every great global connection starts with a single swipe of respect.
                    </p>
                  </div>
                  <Button asChild className="rounded-[2rem] h-16 gradient-bg px-12 font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
                    <Link href="/discover">Start Discovering</Link>
                  </Button>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-30">Happiness is Mandatory ❤️</p>
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
    <section className="mb-14">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 bg-primary/10 rounded-full">
          <Zap className="w-4 h-4 text-primary fill-primary" />
        </div>
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Your Exclusive Spark</h2>
      </div>
      <Link href={`/matches/${match.id}`}>
        <Card className="overflow-hidden hover:shadow-2xl transition-all border-none bg-gradient-to-br from-white via-white to-pink-50 shadow-xl group rounded-[3rem] relative">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
             <Heart className="w-32 h-32 fill-primary text-primary" />
          </div>
          <CardContent className="p-10 flex flex-col sm:flex-row items-center gap-10 relative z-10">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-2xl ring-4 ring-white transition-transform group-hover:scale-105 duration-500">
                <AvatarImage src={partnerProfile?.photoUrl} className="object-cover" />
                <AvatarFallback>{partnerProfile?.displayName?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-3 -right-3 bg-primary text-white p-3 rounded-full shadow-2xl animate-heartbeat border-4 border-white">
                <Heart className="w-6 h-6 fill-white" />
              </div>
            </div>
            
            <div className="flex-grow text-center sm:text-left space-y-4 min-w-0">
              <div className="flex flex-col gap-1">
                <h3 className="font-black text-4xl tracking-tighter leading-none group-hover:text-primary transition-colors">{partnerProfile?.displayName || "Dating Partner"}</h3>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] text-green-600 uppercase font-black tracking-widest">Active Spark Room</span>
                </div>
              </div>
              <p className="text-muted-foreground text-xl italic font-medium line-clamp-2 leading-relaxed">
                {match.lastMessage ? `"${match.lastMessage}"` : "Start your sparkling journey of prosperity..."}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-2">
                 {match.witnessStatus === 'confirmed' ? (
                   <Badge className="bg-primary text-white border-none text-[10px] font-black uppercase tracking-widest px-4 h-8 flex items-center gap-1.5 shadow-lg shadow-primary/10">
                     <ShieldCheck className="w-4 h-4" />
                     Witnessed
                   </Badge>
                 ) : match.witnessStatus === 'pending' ? (
                   <Badge className="bg-amber-100 text-amber-700 border-none text-[10px] font-black uppercase tracking-widest px-4 h-8 flex items-center gap-1.5">
                     <Clock className="w-4 h-4" />
                     Pending Vouch
                   </Badge>
                 ) : (
                   <Badge className="bg-primary/5 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 h-8">
                     Exclusive Match
                   </Badge>
                 )}
                 <Badge className="bg-green-500/10 text-green-600 border-none text-[10px] font-black uppercase tracking-widest px-4 h-8 flex items-center gap-1.5">
                   <Lock className="w-3 h-3" />
                   E2EE VAULT
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
      <Card className="overflow-hidden hover:scale-[1.02] transition-all border-none shadow-sm hover:shadow-xl bg-white rounded-[2.5rem] group">
        <CardContent className="p-6 flex items-center gap-6">
          <Avatar className="w-20 h-20 border-2 border-muted shadow-sm transition-transform group-hover:rotate-3">
            <AvatarImage src={partnerProfile?.photoUrl} className="object-cover" />
            <AvatarFallback>{partnerProfile?.displayName?.[0] || '?'}</AvatarFallback>
          </Avatar>
          
          <div className="flex-grow min-w-0 space-y-1">
            <div className="flex justify-between items-baseline">
              <h3 className="font-black text-xl tracking-tight group-hover:text-blue-500 transition-colors">{partnerProfile?.displayName || "Friend"}</h3>
              <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">
                {dateString || 'Just now'}
              </span>
            </div>
            <p className="text-base text-muted-foreground line-clamp-1 italic font-medium">
              {match.lastMessage || "Cultural exchange starting..."}
            </p>
            <div className="flex gap-2 pt-1">
               <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-blue-100 text-blue-400">Cultural Link</Badge>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
             <MessageCircle className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

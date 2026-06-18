
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
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Globe2, MessageCircle, Loader2, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      
      <main className="container mx-auto px-4 pt-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">My Matches</h1>
            <p className="text-sm text-muted-foreground mt-1">Nurturing connections with respect.</p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            {dbMatches?.length || 0} Connections
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
          </div>
        ) : (
          <>
            {/* The One - Current Date */}
            {dateMatch && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-primary fill-primary" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Your Active Spark</h2>
                </div>
                <Link href={`/matches/${dateMatch.id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-all border-none bg-gradient-to-br from-white to-pink-50 shadow-xl group rounded-[2.5rem]">
                    <CardContent className="p-8 flex flex-col sm:flex-row items-center gap-8">
                      <div className="relative">
                        <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-xl">
                          <AvatarImage src={dateMatch.photoUrl} className="object-cover" />
                          <AvatarFallback>{dateMatch.name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-2xl animate-pulse">
                          <Heart className="w-4 h-4 fill-white" />
                        </div>
                      </div>
                      
                      <div className="flex-grow text-center sm:text-left space-y-2 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                          <h3 className="font-black text-3xl tracking-tight">{dateMatch.name || "Dating Partner"}</h3>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold">Active Now</span>
                        </div>
                        <p className="text-muted-foreground text-lg italic line-clamp-2">
                          {dateMatch.lastMessage ? `"${dateMatch.lastMessage}"` : "Start your sparkling journey..."}
                        </p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                           {dateMatch.witnessStatus === 'confirmed' ? (
                             <Badge className="bg-primary text-white border-none text-[9px] font-black uppercase tracking-widest px-3 h-6 flex items-center gap-1">
                               <ShieldCheck className="w-3 h-3" />
                               Community Witnessed
                             </Badge>
                           ) : dateMatch.witnessStatus === 'pending' ? (
                             <Badge className="bg-amber-100 text-amber-700 border-none text-[9px] font-black uppercase tracking-widest px-3 h-6 flex items-center gap-1">
                               <Clock className="w-3 h-3" />
                               Witness Pending
                             </Badge>
                           ) : (
                             <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest px-3 h-6">
                               Exclusive Match
                             </Badge>
                           )}
                           <Badge className="bg-green-500/10 text-green-600 border-none text-[9px] font-black uppercase tracking-widest px-3 h-6">
                             E2EE Protected
                           </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </section>
            )}

            {/* Culture & Friendship */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Globe2 className="w-4 h-4 text-blue-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Global Friendship Circle</h2>
              </div>
              
              {friendMatches.length > 0 ? (
                <div className="grid gap-4">
                  {friendMatches.map((match: any) => (
                    <Link key={match.id} href={`/matches/${match.id}`}>
                      <Card className="overflow-hidden hover:scale-[1.01] transition-all border-none shadow-sm bg-white rounded-3xl">
                        <CardContent className="p-5 flex items-center gap-5">
                          <Avatar className="w-16 h-16 border-2 border-muted shadow-sm">
                            <AvatarImage src={match.photoUrl} className="object-cover" />
                            <AvatarFallback>{match.name?.[0] || '?'}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                              <h3 className="font-bold text-lg">{match.name || "Friend"}</h3>
                              <span className="text-[9px] text-muted-foreground uppercase font-black">
                                {match.timestamp ? new Date(match.timestamp).toLocaleDateString() : 'Just now'}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1 italic">
                              {match.lastMessage || "Cultural exchange starting..."}
                            </p>
                          </div>
                          
                          <div className="bg-blue-50 p-2 rounded-xl text-blue-500">
                             <MessageCircle className="w-5 h-5" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : !dateMatch ? (
                <div className="text-center py-20 px-10 bg-white rounded-[3rem] border-2 border-dashed border-muted flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-primary opacity-20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">No Sparks Yet</h3>
                    <p className="text-muted-foreground text-sm max-w-[240px] mx-auto leading-relaxed">
                      Every great connection starts with a single swipe. Ready to find yours?
                    </p>
                  </div>
                  <Button asChild className="rounded-2xl h-12 gradient-bg px-8 font-bold">
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

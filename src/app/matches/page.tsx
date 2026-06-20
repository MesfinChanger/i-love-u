'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useCollection, useUser, useFirestore, useDoc } from '@/firebase';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Zap, 
  Globe2, 
  MessageCircle, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Star, 
  Lock, 
  Languages,
  Users,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function MatchesContent() {
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

  const { dateMatches, friendMatches } = useMemo(() => {
    if (!dbMatches) return { dateMatches: [], friendMatches: [] };
    return {
      dateMatches: dbMatches.filter((m: any) => m.type === 'date'),
      friendMatches: dbMatches.filter((m: any) => m.type === 'friend')
    };
  }, [dbMatches]);

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-4 pt-4 max-w-2xl">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">My Hearts</h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em] ml-0.5">Community Connections</p>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3" />
            {dbMatches?.length || 0} Total
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
          </div>
        ) : (
          <Tabs defaultValue="sparks" className="w-full">
            <TabsList className="grid grid-cols-2 h-14 bg-white/50 backdrop-blur-md rounded-2xl p-1 mb-6 border shadow-sm">
              <TabsTrigger value="sparks" className="rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                <Heart className={dbMatches && dateMatches.length > 0 ? "w-4 h-4 fill-primary text-primary" : "w-4 h-4"} />
                Sparks ({dateMatches.length})
              </TabsTrigger>
              <TabsTrigger value="circle" className="rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                <Users className="w-4 h-4" />
                Circle ({friendMatches.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sparks" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {dateMatches.length > 0 ? (
                dateMatches.map((match: any) => (
                  <ExclusiveSparkCard key={match.id} match={match} currentUserId={user?.uid!} />
                ))
              ) : (
                <EmptyState 
                  icon={Heart} 
                  title="No Sparks Found" 
                  desc="A romantic journey begins with a swipe of pure respect."
                  actionLabel="Start Discovering"
                  actionHref="/discover"
                />
              )}
            </TabsContent>

            <TabsContent value="circle" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {friendMatches.length > 0 ? (
                friendMatches.map((match: any) => (
                  <FriendMatchCard key={match.id} match={match} currentUserId={user?.uid!} />
                ))
              ) : (
                <EmptyState 
                  icon={Globe2} 
                  color="blue"
                  title="Circle is Empty" 
                  desc="Bridge cultures and languages. Connect as friends for global prosperity."
                  actionLabel="Build Your Circle"
                  actionHref="/discover"
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, actionLabel, actionHref, color = "primary" }: any) {
  return (
    <div className="text-center py-20 px-8 bg-white rounded-[3rem] border-2 border-dashed border-muted/50 flex flex-col items-center gap-6 shadow-inner">
      <div className="w-20 h-20 bg-muted/30 rounded-[2.5rem] flex items-center justify-center relative">
        <Icon className={`w-10 h-10 text-${color}-500 opacity-20`} />
        <Star className="absolute top-2 right-2 w-4 h-4 text-secondary opacity-20 animate-pulse" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black tracking-tighter uppercase">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-[240px] mx-auto leading-relaxed italic font-medium">
          "{desc}"
        </p>
      </div>
      <Button asChild className={`rounded-2xl h-12 ${color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'gradient-bg'} px-8 font-black text-[10px] uppercase tracking-widest shadow-xl`}>
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}

function ExclusiveSparkCard({ match, currentUserId }: { match: any, currentUserId: string }) {
  const db = useFirestore();
  const partnerId = match.userIds.find((id: string) => id !== currentUserId);
  const partnerRef = useMemoFirebase(() => partnerId ? doc(db, 'users', partnerId) : null, [db, partnerId]);
  const { data: partnerProfile } = useDoc(partnerRef);

  return (
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
               <Badge className="bg-blue-500/10 text-blue-600 border-none text-[7px] font-black uppercase tracking-widest px-2 h-5 flex items-center gap-1">
                 <Languages className="w-2 h-2" />
                 AI Translate
               </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
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
          
          <div className="flex items-center gap-2">
             <div className="bg-blue-50 p-2 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
                <Languages className="w-4 h-4" />
             </div>
             <div className="bg-blue-50 p-2 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
                <MessageCircle className="w-4 h-4" />
             </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>}>
      <MatchesContent />
    </Suspense>
  );
}
'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useCollection, useUser, useFirestore, useDoc } from '@/firebase';
import { collection, query, where, orderBy, doc, updateDoc, serverTimestamp, or } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Globe2, 
  Loader2, 
  Sparkles, 
  Lock, 
  Languages,
  Users,
  Check,
  X,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Matches Hub Module.
 */
function MatchesContent() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const connectionsQuery = useMemoFirebase(() => {
    if (!user?.uid || !db) return null;
    return query(collection(db, 'connections'), or(where('fromUserId', '==', user.uid), where('toUserId', '==', user.uid)), orderBy('createdAt', 'desc'));
  }, [user?.uid, db]);

  const { data: allConnections, loading } = useCollection(connectionsQuery);

  const { dateMatches, friendMatches, invitations } = useMemo(() => {
    if (!allConnections) return { dateMatches: [], friendMatches: [], invitations: [] };
    return {
      dateMatches: allConnections.filter((c: any) => c.status === 'matched' && c.type === 'spark'),
      friendMatches: allConnections.filter((c: any) => c.status === 'matched' && c.type === 'friend'),
      invitations: allConnections.filter((c: any) => c.status === 'pending' && c.toUserId === user?.uid)
    };
  }, [allConnections, user?.uid]);

  const handleAccept = async (connId: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'connections', connId), { status: 'matched', acceptedAt: serverTimestamp() });
      toast({ title: "Invitation Accepted!", description: "Sacred space active. ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Action failed." });
    }
  };

  if (!mounted) return <Loader2 className="animate-spin m-auto opacity-20" />;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 pt-4 max-w-2xl">
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-3xl font-black tracking-tighter">{t('matches.title')}</h1>
        </div>

        {loading ? <Loader2 className="animate-spin mx-auto opacity-20" /> : (
          <Tabs defaultValue="sparks" className="w-full">
            <TabsList className="grid grid-cols-3 h-14 bg-white/50 rounded-2xl p-1 mb-6 border">
              <TabsTrigger value="sparks" className="rounded-xl text-[9px] font-black uppercase">Sparks ({dateMatches.length})</TabsTrigger>
              <TabsTrigger value="circle" className="rounded-xl text-[9px] font-black uppercase">Circle ({friendMatches.length})</TabsTrigger>
              <TabsTrigger value="invites" className="rounded-xl text-[9px] font-black uppercase relative">Invites ({invitations.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="sparks" className="space-y-4">
              {dateMatches.map((match: any) => <ExclusiveSparkCard key={match.id} match={match} currentUserId={user?.uid!} />)}
            </TabsContent>
            <TabsContent value="invites" className="space-y-4">
              {invitations.map((match: any) => <InvitationCard key={match.id} match={match} onAccept={() => handleAccept(match.id)} />)}
            </TabsContent>
          </Tabs>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

function InvitationCard({ match, onAccept }: any) {
  const db = useFirestore();
  const senderRef = useMemoFirebase(() => match.fromUserId ? doc(db, 'users', match.fromUserId) : null, [db, match.fromUserId]);
  const { data: sender } = useDoc(senderRef);
  return (
    <Card className="rounded-[2rem] p-5 flex items-center gap-4 bg-white shadow-md">
      <Avatar className="w-14 h-14 border-2 border-amber-100"><AvatarImage src={sender?.photoURL} /><AvatarFallback>{sender?.displayName?.[0]}</AvatarFallback></Avatar>
      <div className="flex-grow">
        <h3 className="font-black truncate">{sender?.displayName || "Mystery Heart"}</h3>
        <p className="text-[10px] italic">wants to connect</p>
      </div>
      <Button size="icon" onClick={onAccept} className="rounded-full w-10 h-10 gradient-bg"><Check className="w-5 h-5" /></Button>
    </Card>
  );
}

function ExclusiveSparkCard({ match, currentUserId }: { match: any, currentUserId: string }) {
  const db = useFirestore();
  const partnerId = match.fromUserId === currentUserId ? match.toUserId : match.fromUserId;
  const partnerRef = useMemoFirebase(() => partnerId ? doc(db, 'users', partnerId) : null, [db, partnerId]);
  const { data: partnerProfile } = useDoc(partnerRef);
  return (
    <Link href={`/matches/${match.id}`}>
      <Card className="rounded-[2.5rem] p-6 flex items-center gap-6 bg-white shadow-lg group">
        <Avatar className="w-20 h-20 border-2 border-primary/20"><AvatarImage src={partnerProfile?.photoURL} /><AvatarFallback>{partnerProfile?.displayName?.[0]}</AvatarFallback></Avatar>
        <div className="flex-grow"><h3 className="font-black text-2xl tracking-tighter truncate">{partnerProfile?.displayName || "Partner"}</h3><div className="flex items-center gap-2"><Badge className="bg-green-500/10 text-green-600 border-none text-[7px] font-black uppercase">E2EE Secured</Badge></div></div>
      </Card>
    </Link>
  );
}

export default function MatchesPage() {
  return <Suspense fallback={<Loader2 className="animate-spin" />}><MatchesContent /></Suspense>;
}

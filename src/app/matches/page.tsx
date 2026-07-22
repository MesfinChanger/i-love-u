'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useCollection, useUser, useFirestore, useDoc } from '@/firebase';
import { collection, query, where, orderBy, doc, updateDoc, serverTimestamp, or } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Loader2, 
  Check,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/components/providers/LanguageProvider';

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
  }, [db, user?.uid]);

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
      const connRef = doc(db, 'connections', connId);
      await updateDoc(connRef, { status: 'matched', acceptedAt: serverTimestamp() });
      toast({ title: "Invitation Accepted!", description: "Sacred space active. ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Action failed." });
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 pt-4 max-w-2xl">
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-3xl font-black tracking-tighter uppercase">{t('matches.title')}</h1>
        </div>

        {loading ? <div className="flex justify-center py-40 opacity-20"><Loader2 className="animate-spin" /></div> : (
          <Tabs defaultValue="sparks" className="w-full">
            <TabsList className="grid grid-cols-3 h-14 bg-white/50 rounded-2xl p-1 mb-6 border">
              <TabsTrigger value="sparks" className="rounded-xl text-[9px] font-black uppercase">Sparks ({dateMatches.length})</TabsTrigger>
              <TabsTrigger value="circle" className="rounded-xl text-[9px] font-black uppercase">Circle ({friendMatches.length})</TabsTrigger>
              <TabsTrigger value="invites" className="rounded-xl text-[9px] font-black uppercase relative">Invites ({invitations.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="sparks" className="space-y-4">
              {dateMatches.map((match: any) => <ExclusiveSparkCard key={match.id} match={match} currentUserId={user?.uid!} />)}
            </TabsContent>
            <TabsContent value="circle" className="space-y-4">
               {friendMatches.map((match: any) => <ExclusiveSparkCard key={match.id} match={match} currentUserId={user?.uid!} />)}
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
  const senderRef = useMemoFirebase(() => (db && match.fromUserId) ? doc(db, 'users', match.fromUserId) : null, [db, match.fromUserId]);
  const { data: sender } = useDoc(senderRef);
  return (
    <Card className="rounded-[2rem] p-5 flex items-center gap-4 bg-white shadow-md border-none">
      <Avatar className="w-14 h-14 border-2 border-amber-100"><AvatarImage src={sender?.photoURL} /><AvatarFallback>{sender?.displayName?.[0]}</AvatarFallback></Avatar>
      <div className="flex-grow">
        <h3 className="font-black truncate">{sender?.displayName || "Mystery Heart"}</h3>
        <p className="text-[10px] italic font-medium text-muted-foreground">wants to connect</p>
      </div>
      <Button size="icon" onClick={onAccept} className="rounded-full w-10 h-10 gradient-bg"><Check className="w-5 h-5" /></Button>
    </Card>
  );
}

function ExclusiveSparkCard({ match, currentUserId }: { match: any, currentUserId: string }) {
  const db = useFirestore();
  const partnerId = match.fromUserId === currentUserId ? match.toUserId : match.fromUserId;
  const partnerRef = useMemoFirebase(() => (db && partnerId) ? doc(db, 'users', partnerId) : null, [db, partnerId]);
  const { data: partnerProfile } = useDoc(partnerRef);
  return (
    <Link href={`/matches/${match.id}`}>
      <Card className="rounded-[2.5rem] p-6 flex items-center gap-6 bg-white shadow-lg group border-none">
        <Avatar className="w-20 h-20 border-2 border-primary/20 shadow-sm"><AvatarImage src={partnerProfile?.photoURL} /><AvatarFallback className="bg-primary/5 text-primary font-black">{partnerProfile?.displayName?.[0] || 'H'}</AvatarFallback></Avatar>
        <div className="flex-grow"><h3 className="font-black text-2xl tracking-tighter truncate">{partnerProfile?.displayName || "Partner"}</h3><div className="flex items-center gap-2"><Badge className="bg-green-500/10 text-green-600 border-none text-[7px] font-black uppercase px-2 h-5 flex items-center gap-1.5"><ShieldCheck className="w-2.5 h-2.5" /> Secured Room</Badge></div></div>
      </Card>
    </Link>
  );
}

export default function MatchesPage() {
  return <Suspense fallback={<div className="flex justify-center py-40 opacity-20"><Loader2 className="animate-spin" /></div>}><MatchesContent /></Suspense>;
}

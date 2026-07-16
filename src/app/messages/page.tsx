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
  Loader2, 
  Sparkles, 
  Check, 
  X, 
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const connectionsQuery = useMemoFirebase(() => {
    if (!user?.uid || !db) return null;
    return query(
      collection(db, 'connections'),
      or(
        where('fromUserId', '==', user.uid),
        where('toUserId', '==', user.uid)
      ),
      orderBy('createdAt', 'desc')
    );
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
      toast({ title: "Invitation Accepted!", description: "Secured space is now active. ❤️" });
    } catch (e) {}
  };

  const handleDecline = async (connId: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'connections', connId), { status: 'declined', declinedAt: serverTimestamp() });
      toast({ title: "Invitation Declined", description: "Journey ended respectfully." });
    } catch (e) {}
  };

  if (!mounted) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary opacity-20" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 pt-4 max-w-2xl">
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-3xl font-black tracking-tighter uppercase">My Messages</h1>
          <Badge className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[9px] font-black uppercase shadow-sm">{(dateMatches.length + friendMatches.length)} Active</Badge>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" /></div>
        ) : (
          <Tabs defaultValue="sparks" className="w-full">
            <TabsList className="grid grid-cols-3 h-14 bg-white/50 backdrop-blur-md rounded-2xl p-1 mb-6 border shadow-sm">
              <TabsTrigger value="sparks" className="rounded-xl text-[9px] font-black uppercase">Sparks ({dateMatches.length})</TabsTrigger>
              <TabsTrigger value="circle" className="rounded-xl text-[9px] font-black uppercase">Circles ({friendMatches.length})</TabsTrigger>
              <TabsTrigger value="invites" className="rounded-xl text-[9px] font-black uppercase">Invites ({invitations.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="sparks" className="space-y-4">
              {dateMatches.map((match: any) => <SparkRoomCard key={match.id} match={match} currentUserId={user?.uid!} />)}
              {dateMatches.length === 0 && <EmptyState icon={Heart} title="No Sparks" desc="A romantic journey begins with respect." actionHref="/spark" />}
            </TabsContent>

            <TabsContent value="circle" className="space-y-4">
              {friendMatches.map((match: any) => <SparkRoomCard key={match.id} match={match} currentUserId={user?.uid!} />)}
              {friendMatches.length === 0 && <EmptyState icon={Sparkles} title="No Circles" desc="Bridge cultures as friends." actionHref="/spark" />}
            </TabsContent>

            <TabsContent value="invites" className="space-y-4">
              {invitations.map((match: any) => (
                <InvitationCard key={match.id} match={match} onAccept={() => handleAccept(match.id)} onDecline={() => handleDecline(match.id)} />
              ))}
              {invitations.length === 0 && <EmptyState icon={Send} title="No Invites" desc="New sparks appear here." actionHref="/spark" />}
            </TabsContent>
          </Tabs>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

function SparkRoomCard({ match, currentUserId }: any) {
  const db = useFirestore();
  const partnerId = match.fromUserId === currentUserId ? match.toUserId : match.fromUserId;
  const partnerRef = useMemoFirebase(() => partnerId ? doc(db, 'users', partnerId) : null, [db, partnerId]);
  const { data: partner } = useDoc(partnerRef);

  return (
    <Link href={`/messages/${match.id}`}>
      <Card className="rounded-[2.5rem] bg-white shadow-lg hover:shadow-xl transition-all border-none overflow-hidden p-6 flex items-center gap-6">
        <Avatar className="w-20 h-20 border-2 border-primary/10 shadow-xl">
          <AvatarImage src={partner?.photoURL} />
          <AvatarFallback className="font-black">{partner?.displayName?.[0] || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-grow min-w-0">
          <h3 className="font-black text-2xl tracking-tighter truncate">{partner?.displayName || "Partner"}</h3>
          <p className="text-muted-foreground text-sm italic line-clamp-1">Start your conversation...</p>
          <Badge className="bg-green-500/10 text-green-600 border-none text-[7px] font-black uppercase mt-2">Secured Spark Room</Badge>
        </div>
      </Card>
    </Link>
  );
}

function InvitationCard({ match, onAccept, onDecline }: any) {
  const db = useFirestore();
  const senderId = match.fromUserId;
  const senderRef = useMemoFirebase(() => senderId ? doc(db, 'users', senderId) : null, [db, senderId]);
  const { data: sender } = useDoc(senderRef);

  return (
    <Card className="p-5 rounded-[2rem] bg-white shadow-md flex items-center gap-4">
      <Avatar className="w-14 h-14 border-2 border-amber-100">
        <AvatarImage src={sender?.photoURL} />
        <AvatarFallback className="font-bold">{sender?.displayName?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-grow min-w-0">
         <h3 className="font-black text-lg truncate">{sender?.displayName || "Heart"}</h3>
         <p className="text-[10px] text-muted-foreground italic">wants to connect</p>
      </div>
      <div className="flex gap-2">
         <Button size="icon" variant="ghost" onClick={onDecline} className="rounded-full"><X className="w-5 h-5 text-red-500" /></Button>
         <Button size="icon" onClick={onAccept} className="rounded-full gradient-bg shadow-lg"><Check className="w-5 h-5" /></Button>
      </div>
    </Card>
  );
}

function EmptyState({ icon: Icon, title, desc, actionHref }: any) {
  return (
    <div className="text-center py-20 px-8 bg-white rounded-[3rem] border-2 border-dashed border-muted/50 flex flex-col items-center gap-6">
      <Icon className="w-16 h-16 text-primary opacity-20" />
      <div className="space-y-2">
        <h3 className="text-2xl font-black tracking-tighter uppercase">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-[240px] italic">"{desc}"</p>
      </div>
      <Button asChild className="rounded-2xl h-12 gradient-bg px-8 font-black uppercase text-[10px] tracking-widest shadow-xl">
        <Link href={actionHref}>Discover Hearts</Link>
      </Button>
    </div>
  );
}

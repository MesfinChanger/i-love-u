'use client';

import { useState, useMemo, use } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Users, 
  ShieldCheck, 
  Heart, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  Lock
} from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

/**
 * @fileOverview Witness Verification Module.
 */
export default function WitnessVerificationPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [isConfirming, setIsConfirming] = useState(false);

  const matchRef = useMemoFirebase(() => db && matchId ? doc(db, 'matches', String(matchId)) : null, [db, matchId]);
  const { data: matchData, loading: matchLoading } = useDoc(matchRef);

  const user1Ref = useMemoFirebase(() => db && matchData?.userIds?.[0] ? doc(db, 'users', matchData.userIds[0]) : null, [db, matchData?.userIds]);
  const { data: user1 } = useDoc(user1Ref);

  const user2Ref = useMemoFirebase(() => db && matchData?.userIds?.[1] ? doc(db, 'users', matchData.userIds[1]) : null, [db, matchData?.userIds]);
  const { data: user2 } = useDoc(user2Ref);

  const handleConfirmWitness = async () => {
    if (!user || !db || !matchId) return;
    setIsConfirming(true);
    try {
      await updateDoc(doc(db, 'matches', String(matchId)), { witnessStatus: 'confirmed', witnessConfirmedAt: serverTimestamp() });
      toast({ title: "Witness Recorded", description: "Thank you for vouching! ✨" });
      router.push('/matches');
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Action failed." });
    } finally {
      setIsConfirming(false);
    }
  };

  if (matchLoading) return <Loader2 className="animate-spin m-auto opacity-20" />;

  if (matchData?.witnessId !== user?.uid && !matchLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 text-center">
        <Lock className="w-12 h-12 text-primary mb-4" />
        <h2 className="text-2xl font-black uppercase">Access Restricted</h2>
        <Button variant="ghost" asChild><Link href="/matches">Return Home</Link></Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-lg space-y-10">
        <div className="text-center space-y-4">
          <Users className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-4xl font-black tracking-tighter uppercase">Vouch for Love</h2>
        </div>

        <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
          <CardHeader className="bg-primary/5 text-center py-10">
             <div className="flex items-center justify-center gap-4">
                <Avatar className="w-16 h-16 border-4 border-white"><AvatarImage src={user1?.photoURL} /><AvatarFallback>{user1?.displayName?.[0]}</AvatarFallback></Avatar>
                <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
                <Avatar className="w-16 h-16 border-4 border-white"><AvatarImage src={user2?.photoURL} /><AvatarFallback>{user2?.displayName?.[0]}</AvatarFallback></Avatar>
             </div>
             <CardTitle className="text-2xl font-black mt-6">{user1?.displayName} & {user2?.displayName}</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
             <div className="bg-muted/30 p-6 rounded-3xl border border-dashed text-xs italic">By confirming, you vouch that this relationship treats each heart with mandatory Respect & Love.</div>
             <Button onClick={handleConfirmWitness} disabled={isConfirming || matchData?.witnessStatus === 'confirmed'} className="w-full h-16 rounded-2xl gradient-bg font-black uppercase shadow-xl">
                {isConfirming ? <Loader2 className="animate-spin" /> : <><Sparkles className="w-4 h-4 mr-2" /> Vouch for Couple</>}
             </Button>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}

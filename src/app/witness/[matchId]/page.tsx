
'use client';

import { useState, useMemo, use } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { 
  Users, 
  ShieldCheck, 
  Heart, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
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

export default function WitnessVerificationPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [isConfirming, setIsConfirming] = useState(false);

  const matchRef = useMemoFirebase(() => {
    if (!db || !matchId) return null;
    return doc(db, 'matches', String(matchId));
  }, [db, matchId]);
  const { data: matchData, loading: matchLoading } = useDoc(matchRef);

  const user1Uid = matchData?.userIds?.[0];
  const user2Uid = matchData?.userIds?.[1];

  const user1Ref = useMemoFirebase(() => {
    if (!db || !user1Uid) return null;
    return doc(db, 'users', user1Uid);
  }, [db, user1Uid]);
  const { data: user1 } = useDoc(user1Ref);

  const user2Ref = useMemoFirebase(() => {
    if (!db || !user2Uid) return null;
    return doc(db, 'users', user2Uid);
  }, [db, user2Uid]);
  const { data: user2 } = useDoc(user2Ref);

  const isWitnessAuthorized = matchData?.witnessId === user?.uid;
  const isAlreadyConfirmed = matchData?.witnessStatus === 'confirmed';

  const handleConfirmWitness = async () => {
    if (!user || !db || !matchId) return;
    setIsConfirming(true);
    try {
      await updateDoc(doc(db, 'matches', String(matchId)), {
        witnessStatus: 'confirmed',
        witnessConfirmedAt: serverTimestamp()
      });
      toast({
        title: "Community Witness Recorded",
        description: "Thank you for vouching for this couple! ✨"
      });
      router.push('/matches');
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Action failed." });
    } finally {
      setIsConfirming(false);
    }
  };

  if (matchLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  if (!isWitnessAuthorized && !matchLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 items-center justify-center p-8 text-center">
        <Lock className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
        <h2 className="text-2xl font-black tracking-tighter">Access Restricted</h2>
        <p className="text-muted-foreground mt-2">You are not authorized to witness this relationship.</p>
        <Button variant="ghost" className="mt-6 font-bold" asChild><Link href="/matches">Return Home</Link></Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-5 h-5" /></Button>
          <h1 className="text-xl font-bold">Relationship Witness</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-lg">
        <div className="text-center mb-10 space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-sm">
             <Users className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Vouch for Love</h2>
          <p className="text-muted-foreground leading-relaxed">
            You have been invited to witness the successful relationship between these two community members.
          </p>
        </div>

        <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
          <CardHeader className="bg-primary/5 text-center py-10">
             <div className="flex items-center justify-center gap-4">
                <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
                   <AvatarImage src={user1?.photoUrl} className="object-cover" />
                   <AvatarFallback>{user1?.displayName?.[0]}</AvatarFallback>
                </Avatar>
                <Heart className="w-8 h-8 text-primary fill-primary animate-pulse" />
                <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
                   <AvatarImage src={user2?.photoUrl} className="object-cover" />
                   <AvatarFallback>{user2?.displayName?.[0]}</AvatarFallback>
                </Avatar>
             </div>
             <CardTitle className="text-2xl font-black tracking-tight mt-6">
                {user1?.displayName} & {user2?.displayName}
             </CardTitle>
             <CardDescription className="text-xs font-black uppercase tracking-widest text-primary mt-1">
                Spark Successful Couple
             </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
             <div className="bg-muted/30 p-6 rounded-3xl space-y-4 border border-dashed">
                <div className="flex items-start gap-3">
                   <ShieldCheck className="w-5 h-5 text-green-600 mt-1" />
                   <div>
                      <h4 className="text-sm font-bold">Witness Pledge</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                         By confirming, you vouch that you have seen their interaction and believe they treat each other with the mandatory Respect & Love our community demands.
                      </p>
                   </div>
                </div>
             </div>

             {isAlreadyConfirmed ? (
               <div className="text-center py-4 space-y-2">
                  <Badge className="bg-green-100 text-green-700 border-none px-4 h-8 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                    Relationship Confirmed
                  </Badge>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">You have witnessed this spark!</p>
               </div>
             ) : (
               <Button 
                onClick={handleConfirmWitness} 
                disabled={isConfirming} 
                className="w-full h-16 rounded-2xl gradient-bg text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
               >
                 {isConfirming ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                 Vouch for this Couple
               </Button>
             )}
          </CardContent>
          <CardFooter className="justify-center pb-8">
             <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">
               Mandatory Respect & Love Community • Accountability
             </p>
          </CardFooter>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}

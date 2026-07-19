"use client";

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { 
  MessageSquare, 
  Loader2, 
  Sparkles, 
  Clock, 
  ArrowRight,
  Heart
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import Link from 'next/link';

/**
 * @fileOverview Greetings Registry.
 * High-fidelity module for viewing community outreach and initial heart sparks.
 */
export default function GreetingsPage() {
  const { user } = useUser();
  const db = useFirestore();

  const greetingsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'sparkGreetings'),
      where('toUserId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user?.uid]);

  const { data: greetings, loading } = useCollection(greetingsQuery);

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-6 py-12 max-w-4xl space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none flex items-center gap-3">
            <MessageSquare className="w-10 h-10 text-primary" />
            Greetings
          </h1>
          <p className="text-muted-foreground font-medium italic">
            "Initial respectful outreach from hearts who wish to connect."
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest">Scanning Frequencies...</p>
          </div>
        ) : greetings && greetings.length > 0 ? (
          <div className="grid gap-6">
            {greetings.map((greeting: any) => (
              <GreetingCard key={greeting.id} greeting={greeting} />
            ))}
          </div>
        ) : (
          <Card className="rounded-[3rem] border-2 border-dashed border-primary/10 bg-white/50 p-20 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary opacity-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-400">Quiet vibration</h3>
              <p className="text-muted-foreground font-medium italic max-w-xs mx-auto">
                "Every spark has its timing." No new greetings in your registry yet.
              </p>
            </div>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function GreetingCard({ greeting }: { greeting: any }) {
  const db = useFirestore();
  const senderRef = useMemoFirebase(() => db ? query(collection(db, 'users'), where('uid', '==', greeting.fromUserId)) : null, [db, greeting.fromUserId]);
  const { data: senders } = useCollection(senderRef);
  const sender = senders?.[0];

  return (
    <Card className="rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden hover:shadow-xl transition-all group">
      <CardContent className="p-8 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 flex items-center justify-center text-primary font-black text-2xl group-hover:scale-110 transition-transform">
            {sender?.displayName?.[0] || <Heart className="w-8 h-8 fill-primary" />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-black tracking-tight">{sender?.displayName || "Mystery Heart"}</h4>
              <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase px-2 h-5">
                {greeting.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary/10 pl-4 py-1">
              "{greeting.message}"
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4 shrink-0">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3 h-3" />
            <span className="text-[8px] font-black uppercase tracking-widest">Received</span>
          </div>
          <Button variant="ghost" size="sm" className="rounded-xl h-10 px-4 text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-primary/5 hover:text-primary transition-all">
            Open Spark <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
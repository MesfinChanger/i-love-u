"use client";

import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Loader2, Heart, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * @fileOverview Mission Dashboard.
 * Primary command center for verified heart interactions.
 */
export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  
  const { data: profile, loading: profileLoading } = useDoc(userRef);

  if (authLoading || profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-6 py-12 max-w-4xl space-y-10">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter uppercase flex items-center gap-3">
             <span className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">🏠</span>
             Home
          </h1>
          <p className="text-2xl font-bold tracking-tight text-slate-700 mt-6">
            Hello, <span className="gradient-text">{profile?.name || profile?.displayName || 'Mystery Heart'}</span>
          </p>
          <p className="text-muted-foreground font-medium italic">"Your daily heartbeat in the Prosperity Revolution."</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
           <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 group hover:scale-[1.02] transition-all">
              <CardContent className="p-0 space-y-4">
                 <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Heart className="w-8 h-8 fill-current" />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter">Your Sparks</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed italic">Connect with hearts that vibrate at your frequency.</p>
              </CardContent>
           </Card>

           <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white p-8 group hover:scale-[1.02] transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                 <TrendingUp className="w-32 h-32 text-primary" />
              </div>
              <CardContent className="p-0 space-y-4 relative z-10">
                 <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Prosperity</h3>
                 <p className="text-sm text-white/60 leading-relaxed italic">Every connection builds local jobs globally.</p>
              </CardContent>
           </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

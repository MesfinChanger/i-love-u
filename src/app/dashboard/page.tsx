'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { 
  Heart, 
  Zap, 
  TrendingUp, 
  Users, 
  Sparkles,
  ShieldCheck,
  Globe,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';

/**
 * @fileOverview Mission Dashboard.
 * Orchestrates a high-fidelity overview of the heart's activity and mission impact.
 */
export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  const { data: profile, loading: profileLoading } = useDoc(userRef);

  const walletRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'wallets', user.uid);
  }, [db, user?.uid]);
  const { data: wallet } = useDoc(walletRef);

  if (authLoading || profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <main className="container mx-auto px-6 py-10 max-w-5xl space-y-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              Hello, <span className="gradient-text">{profile?.displayName || 'Mystery Heart'}</span>
            </h1>
            <p className="text-muted-foreground font-medium italic">"Your daily heartbeat in the Prosperity Revolution."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardStatCard 
              title="Matches" 
              value="Active" 
              icon={<Heart className="w-5 h-5" />} 
              href="/matches" 
              color="bg-primary" 
            />
            <DashboardStatCard 
              title="Wallet" 
              value={wallet ? `$${wallet.availableBalance.toFixed(2)}` : '$0.00'} 
              icon={<Zap className="w-5 h-5" />} 
              href="/wallet" 
              color="bg-amber-500" 
            />
            <DashboardStatCard 
              title="Circles" 
              value="Joined" 
              icon={<Users className="w-5 h-5" />} 
              href="/circle" 
              color="bg-blue-500" 
            />
          </div>

          <section className="space-y-6">
             <div className="flex items-center gap-3 px-2">
                <Zap className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tight">Mission Radar</h2>
             </div>
             <div className="grid gap-6 md:grid-cols-2">
                <Link href="/pool">
                  <Card className="rounded-[2.5rem] border-none shadow-lg bg-white p-8 hover:shadow-xl transition-all group overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                        <Sparkles className="w-24 h-24 text-primary" />
                     </div>
                     <div className="flex items-start gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <Sparkles className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                           <h3 className="font-black text-xl uppercase tracking-tighter">Idea Pool</h3>
                           <p className="text-sm text-muted-foreground leading-relaxed italic">Dive into collective intelligence.</p>
                        </div>
                     </div>
                  </Card>
                </Link>
                
                <Link href="/community">
                  <Card className="rounded-[2.5rem] border-none shadow-lg bg-white p-8 hover:shadow-xl transition-all group overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                        <Globe className="w-24 h-24 text-blue-500" />
                     </div>
                     <div className="flex items-start gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                           <Globe className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                           <h3 className="font-black text-xl uppercase tracking-tighter">Global Wall</h3>
                           <p className="text-sm text-muted-foreground leading-relaxed italic">Shared moments from every city.</p>
                        </div>
                     </div>
                  </Card>
                </Link>
             </div>
          </section>

          <Card className="rounded-[3rem] border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <TrendingUp className="w-48 h-48 text-primary" />
             </div>
             <CardContent className="p-10 space-y-6 relative z-10">
                <div className="flex items-center gap-4 text-primary">
                   <ShieldCheck className="w-8 h-8" />
                   <h3 className="text-2xl font-black uppercase tracking-tighter">Impact Protocol</h3>
                </div>
                <p className="text-lg text-white/70 font-medium italic leading-relaxed uppercase tracking-widest">
                   "Every connection ends poverty." Your presence fuels local job creation across the globe.
                </p>
                <Button asChild className="h-16 px-10 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                   <Link href="/donate">Propel Prosperity</Link>
                </Button>
             </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    </AuthGuard>
  );
}

function DashboardStatCard({ title, value, icon, href, color }: { title: string, value: string, icon: React.ReactNode, href: string, color: string }) {
  return (
    <Link href={href}>
      <Card className="rounded-[2.5rem] border-none shadow-md bg-white overflow-hidden hover:shadow-xl transition-all group h-full">
         <div className="p-8 flex flex-col gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform", color)}>
               {icon}
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{title}</p>
               <h4 className="text-3xl font-black tracking-tighter">{value}</h4>
            </div>
         </div>
      </Card>
    </Link>
  );
}

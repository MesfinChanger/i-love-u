"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/use-memo-firebase";
import { 
  Heart, 
  Sparkles, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import Link from "next/link";

/**
 * @fileOverview High-Fidelity Mission Dashboard.
 * The primary command center for every heart identified in the revolution.
 */
export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-6 py-10 max-w-5xl space-y-10">
        <section className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <Zap className="w-8 h-8 animate-pulse" />
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
              Heart Mission
            </h1>
          </div>
          <p className="text-xl text-muted-foreground font-medium italic">
            "Welcome back, {profile?.displayName || "Guardian"}. Your presence builds prosperity."
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <DashboardActionCard 
             href="/spark" 
             icon={<Heart className="w-6 h-6" />} 
             title="Spark Discovery" 
             desc="Find meaningful connections." 
           />
           <DashboardActionCard 
             href="/circle" 
             icon={<Users className="w-6 h-6" />} 
             title="Community Circles" 
             desc="Join a shared frequency." 
           />
           <DashboardActionCard 
             href="/wallet" 
             icon={<TrendingUp className="w-6 h-6" />} 
             title="My Prosperity" 
             desc="Track your registry impact." 
           />
        </div>

        <Card className="rounded-[3rem] bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              <Globe className="w-64 h-64 text-primary" />
           </div>
           <CardHeader className="p-10 pb-0 relative z-10">
              <div className="flex items-center gap-4 text-primary">
                 <ShieldCheck className="w-10 h-10" />
                 <CardTitle className="text-3xl font-black uppercase tracking-tighter">Mission Integrity</CardTitle>
              </div>
           </CardHeader>
           <CardContent className="p-10 space-y-8 relative z-10">
              <p className="text-xl text-white/70 leading-relaxed font-medium italic max-w-2xl">
                "Respect & Love is Mandatory." Every heartbeat you share fuels our global mission to reach every village and eliminate poverty forever.
              </p>
              <div className="flex flex-wrap gap-4">
                 <Link href="/policy/agree" className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border border-white/10">
                    Review Protocols
                 </Link>
                 <Link href="/donate" className="px-8 py-4 gradient-bg rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95">
                    Fund the Revolution
                 </Link>
              </div>
           </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}

function DashboardActionCard({ href, icon, title, desc }: any) {
  return (
    <Link href={href} className="group">
      <Card className="h-full rounded-[2.5rem] border-none shadow-md hover:shadow-xl transition-all bg-white overflow-hidden p-8 flex flex-col gap-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-black text-xl uppercase tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground font-medium italic">{desc}</p>
        </div>
      </Card>
    </Link>
  );
}

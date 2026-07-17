'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Sparkles, 
  TrendingUp, 
  Users, 
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { cn } from '@/lib/utils';

/**
 * @fileOverview High-Fidelity Mission Dashboard.
 * Primary command center for authenticated hearts.
 * Consolidated from route group to resolve Parallel Route Conflict.
 */
export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <main className="container mx-auto px-6 py-12 max-w-5xl space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Welcome Home</h1>
              <p className="text-muted-foreground font-medium italic">"Your presence fuels the Prosperity Revolution."</p>
            </div>
            <div className="bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-xl">
               <ShieldCheck className="w-5 h-5 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Heart</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MetricCard 
              title="Daily Sparks" 
              value="12" 
              icon={<Heart className="w-6 h-6" />} 
              href="/spark" 
              color="text-primary" 
            />
            <MetricCard 
              title="Global Impact" 
              value="$0.25" 
              icon={<TrendingUp className="w-6 h-6" />} 
              href="/donate" 
              color="text-green-500" 
            />
            <MetricCard 
              title="Circle Activity" 
              value="Active" 
              icon={<Users className="w-6 h-6" />} 
              href="/circle" 
              color="text-blue-500" 
            />
          </div>

          <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Sparkles className="w-48 h-48 text-primary" />
             </div>
             <CardHeader className="p-10 pb-0">
                <div className="flex items-center gap-4 text-primary">
                   <Zap className="w-8 h-8" />
                   <CardTitle className="text-3xl font-black uppercase tracking-tighter">Mission Control</CardTitle>
                </div>
             </CardHeader>
             <CardContent className="p-10 space-y-8">
                <p className="text-lg text-slate-600 font-medium italic leading-relaxed max-w-2xl">
                  "Respect & Love is Mandatory." Every match you make and every gift you send helps us reach another village and create a job.
                </p>
                <div className="flex flex-wrap gap-4">
                   <Button asChild className="h-16 px-10 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl active:scale-95 transition-all">
                      <Link href="/discover">Start Discovering</Link>
                   </Button>
                   <Button asChild variant="outline" className="h-16 px-10 rounded-2xl border-2 font-black uppercase text-xs hover:bg-slate-50">
                      <Link href="/shopping">Artisan Shop</Link>
                   </Button>
                </div>
             </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    </AuthGuard>
  );
}

function MetricCard({ title, value, icon, href, color }: { title: string, value: string, icon: React.ReactNode, href: string, color: string }) {
  return (
    <Link href={href}>
      <Card className="rounded-[2.5rem] border-none shadow-lg bg-white p-8 hover:shadow-2xl transition-all group overflow-hidden relative h-full">
         <div className="flex flex-col gap-4 relative z-10 h-full">
            <div className={cn("w-12 h-12 rounded-2xl bg-muted flex items-center justify-center transition-all group-hover:bg-white group-hover:shadow-md", color)}>
               {icon}
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{title}</p>
               <p className="text-3xl font-black tracking-tighter">{value}</p>
            </div>
            <div className="pt-4 mt-auto">
               <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Open Module <ArrowRight className="w-3 h-3" />
               </span>
            </div>
         </div>
      </Card>
    </Link>
  );
}

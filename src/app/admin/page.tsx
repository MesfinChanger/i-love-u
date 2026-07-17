'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import AdminGuard from '@/components/AdminGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  ShieldCheck, 
  Settings, 
  BarChart3, 
  Zap, 
  Gavel,
  ArrowRight,
  TrendingUp,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Admin Command Center.
 * Exclusively accessible to community guardians. 
 */
export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <main className="container mx-auto px-6 py-12 max-w-5xl space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Command Center</h1>
              <p className="text-muted-foreground font-medium italic">"Guardian Protocol Active."</p>
            </div>
            <div className="bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-xl">
               <ShieldCheck className="w-5 h-5 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Guardian Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AdminMetricCard 
              title="Heart Registry" 
              desc="Manage members" 
              icon={<Users className="w-6 h-6" />} 
              href="/admin/users" 
              color="text-blue-500" 
            />
            <AdminMetricCard 
              title="System Config" 
              desc="Calibrate prosperity parameters." 
              icon={<Settings className="w-6 h-6" />} 
              href="/admin/settings" 
              color="text-amber-500" 
            />
            <AdminMetricCard 
              title="Impact Logs" 
              desc="Monitor global mission metrics." 
              icon={<BarChart3 className="w-6 h-6" />} 
              href="/admin/analytics" 
              color="text-green-500" 
            />
          </div>

          <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Gavel className="w-48 h-48 text-primary" />
             </div>
             <CardHeader className="p-10 pb-0">
                <div className="flex items-center gap-4 text-primary">
                   <ShieldCheck className="w-8 h-8" />
                   <CardTitle className="text-3xl font-black uppercase tracking-tighter">Security Protocol</CardTitle>
                </div>
                <CardDescription className="text-lg font-medium italic mt-2">
                   "Respect is Mandatory." Admins have final authority over community vibrations.
                </CardDescription>
             </CardHeader>
             <CardContent className="p-10 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                   <div className="p-6 bg-muted/30 rounded-2xl border border-dashed">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Active Blocks</p>
                      <p className="text-2xl font-black">0 Hearts</p>
                   </div>
                   <div className="p-6 bg-muted/30 rounded-2xl border border-dashed">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Reports Pending</p>
                      <p className="text-2xl font-black">0 Incidents</p>
                   </div>
                </div>
             </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    </AdminGuard>
  );
}

function AdminMetricCard({ title, desc, icon, href, color }: { title: string, desc: string, icon: React.ReactNode, href: string, color: string }) {
  return (
    <Link href={href}>
      <Card className="rounded-[2.5rem] border-none shadow-lg bg-white p-8 hover:shadow-2xl transition-all group overflow-hidden relative h-full">
         <div className="flex flex-col gap-4 relative z-10">
            <div className={cn("w-14 h-14 rounded-2xl bg-muted flex items-center justify-center transition-all group-hover:bg-primary/5 group-hover:scale-110", color)}>
               {icon}
            </div>
            <div>
               <h3 className="text-2xl font-black uppercase tracking-tighter">{title}</h3>
               <p className="text-sm text-muted-foreground font-medium italic mt-1">{desc}</p>
            </div>
            <div className="pt-4 mt-auto">
               <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Enter Module <ArrowRight className="w-3 h-3" />
               </span>
            </div>
         </div>
      </Card>
    </Link>
  );
}

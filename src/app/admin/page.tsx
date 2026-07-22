"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useUser } from "@/firebase";
import { checkAdmin } from "@/lib/admin";
import { ShieldCheck, Lock, Loader2, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview High-Fidelity Sovereign Admin Dashboard.
 * Gateway for Guardians to manage the global mission registry.
 */
export default function AdminPage() {
  const { user, loading: authLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      if (authLoading) return;
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      const allowed = await checkAdmin(user.uid);
      setIsAdmin(allowed);
      setLoading(false);
    }
    verify();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-widest mt-4">Verifying Authority...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-center">
        <Card className="max-w-md p-12 rounded-[3.5rem] border-none shadow-2xl bg-white space-y-6">
          <Lock className="mx-auto w-20 h-20 text-red-500 opacity-20" />
          <div className="space-y-2">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Access Denied</h1>
            <p className="text-muted-foreground italic font-medium leading-relaxed">
              Only verified Guardians can access the Sovereign Command Center. ❤️
            </p>
          </div>
          <Button asChild className="w-full h-14 rounded-2xl gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl">
            <Link href="/dashboard">Return to Mission</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-5xl space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
              <ShieldCheck className="w-12 h-12 text-primary" />
              Guardian Center
            </h1>
            <p className="text-xl text-muted-foreground font-medium italic">"The registry of global honor and prosperity."</p>
          </div>
          <div className="hidden sm:block">
             <Badge className="bg-slate-900 text-white border-none px-4 py-1.5 h-8 font-black uppercase tracking-widest text-[9px]">Sovereign Active</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           <AdminActionCard 
             href="/admin/approvals" 
             icon={<ShieldCheck className="w-6 h-6" />} 
             title="Pending Approvals" 
             desc="Review seller and advertiser hearts." 
           />
           <AdminActionCard 
             href="/admin/users" 
             icon={<Users className="w-6 h-6" />} 
             title="Heart Registry" 
             desc="Manage mission member signatures." 
           />
           <AdminActionCard 
             href="/wallet" 
             icon={<TrendingUp className="w-6 h-6" />} 
             title="Global Ledger" 
             desc="Track prosperity fund distribution." 
           />
        </div>

        <Card className="rounded-[3rem] bg-amber-50 border-2 border-dashed border-amber-200 overflow-hidden group">
           <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-md shrink-0">
                 <AlertTriangle className="w-10 h-10 text-amber-500 animate-pulse" />
              </div>
              <div className="space-y-2 flex-grow text-center md:text-left">
                 <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Mission Maintenance</h3>
                 <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                   Ensuring the "Respect & Love is Mandatory" protocol is enforced globally. Audit the security logs regularly to maintain community honor.
                 </p>
              </div>
              <Button asChild variant="outline" className="h-14 px-8 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest whitespace-nowrap">
                 <Link href="/admin/security">Audit Logs</Link>
              </Button>
           </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}

function AdminActionCard({ href, icon, title, desc }: any) {
  return (
    <Link href={href} className="group">
      <Card className="h-full rounded-[2.5rem] border-none shadow-md hover:shadow-xl transition-all bg-white overflow-hidden p-8 flex flex-col gap-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-black text-xl uppercase tracking-tight group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground font-medium italic">{desc}</p>
        </div>
      </Card>
    </Link>
  );
}

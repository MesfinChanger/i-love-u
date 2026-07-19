"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/Card";
import { Heart, KeyRound, User, Smartphone, ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";

/**
 * @fileOverview Recovery Hub Protocol.
 * A high-fidelity command center for restoring heart identities and secure phrase access.
 */
export default function RecoveryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24 items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-primary/5">
            <ShieldCheck className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Identity Recovery</h1>
          <p className="text-muted-foreground font-medium italic">"Every heart has its way home. Restore yours securely."</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-6 border-b flex items-center justify-center gap-2">
             <Sparkles className="w-4 h-4 text-primary" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Protocol Registry</p>
          </div>

          <CardContent className="p-8 space-y-4">
            <RecoveryLink 
              href="/forgot-password" 
              icon={<KeyRound className="w-5 h-5" />} 
              title="Forgot Phrase" 
              desc="Reset your secure access link via email."
            />
            <RecoveryLink 
              href="/forgot-username" 
              icon={<User className="w-5 h-5" />} 
              title="Forgot Username" 
              desc="Retrieve your community signature."
            />
            <RecoveryLink 
              href="/identity" 
              icon={<Smartphone className="w-5 h-5" />} 
              title="Lost Device" 
              desc="Securely migrate your identity to a new device."
            />
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-4">
           <Link href="/login" className="flex items-center justify-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Identify
           </Link>
           <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300">
             Respect & Love is Mandatory ❤️ Prosperity Revolution
           </p>
        </div>
      </div>
    </div>
  );
}

function RecoveryLink({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link href={href} className="group block">
      <div className="p-5 rounded-2xl border-2 border-transparent hover:border-primary/10 hover:bg-primary/5 transition-all flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-primary group-hover:shadow-md transition-all">
          {icon}
        </div>
        <div className="flex-grow">
          <h3 className="font-black uppercase tracking-tight text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-[10px] text-muted-foreground font-medium italic">{desc}</p>
        </div>
      </div>
    </Link>
  );
}

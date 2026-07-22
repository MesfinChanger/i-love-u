"use client";

import { Button } from "@/components/ui/button";
import { useCircleRole } from "@/hooks/use-circle-role";
import { ShieldCheck, Users, Settings } from "lucide-react";

/**
 * @fileOverview High-Fidelity Circle Administration Panel.
 * Orchestrates community governance for owners and guardians.
 * Synchronized with the Circle Access Protocol.
 */
export default function CircleAdminPanel({
  circleId
}: {
  circleId: string
}) {
  const { isAdmin, loading } = useCircleRole(circleId);

  // Sovereignty Protocol: Only display for identified Guardians
  if (loading || !isAdmin) return null;

  return (
    <div className="rounded-[2.5rem] bg-primary/5 p-8 space-y-6 border border-primary/10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-black text-xl uppercase tracking-tighter leading-none">Circle Administration</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mt-1.5">Guardian Control Hub</p>
        </div>
      </div>

      <div className="grid gap-3">
        <Button className="h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] gap-3 shadow-xl shadow-slate-900/10 active:scale-95 transition-all">
          <Users className="w-4 h-4" />
          Manage Members
        </Button>
        <Button variant="outline" className="h-14 rounded-2xl border-2 border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] gap-3 hover:bg-primary/5 active:scale-95 transition-all">
          <Settings className="w-4 h-4" />
          Circle Settings
        </Button>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2 opacity-30">
        <ShieldCheck className="w-3 h-3 text-primary" />
        <p className="text-[8px] font-black uppercase tracking-widest">Authority Synchronized</p>
      </div>
    </div>
  );
}

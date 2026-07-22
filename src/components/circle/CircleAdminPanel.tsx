"use client";

import { Button } from "@/components/ui/button";
import { useCircleRole } from "@/hooks/use-circle-role";
import { ShieldCheck, Users, Loader2 } from "lucide-react";
import Link from "next/link";

/**
 * @fileOverview High-Fidelity Circle Administration Panel.
 * Synchronized with the Circle Access Protocol.
 */
export default function CircleAdminPanel({ circleId }: { circleId: string }) {
  const { isOwner, isModerator, loading } = useCircleRole(circleId);
  const isAdmin = isOwner || isModerator;

  if (loading) return (
    <div className="rounded-[2.5rem] bg-primary/5 p-8 border border-primary/10 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-primary opacity-20" />
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="rounded-[2.5rem] bg-primary/5 p-8 space-y-6 border border-primary/10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-black text-xl uppercase tracking-tighter leading-none">Administration</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mt-1.5">Guardian Control Hub</p>
        </div>
      </div>
      <div className="grid gap-3">
        <Button asChild className="h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] gap-3 active:scale-95 transition-all">
          <Link href={`/circles/${circleId}/manage`}><Users className="w-4 h-4" />Manage Members</Link>
        </Button>
      </div>
    </div>
  );
}

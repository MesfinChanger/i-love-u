"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { Heart, Sparkles, LogIn, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview Welcome Gateway.
 * The primary entry point for hearts entering the Prosperity Revolution.
 */
export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      const result = await signInAnonymously(auth);
      console.log("Guest Session Launched:", result.user.uid);
      router.push("/dashboard");
    } catch (error) {
      console.error("Guest Access Ripple:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#fcfcfc] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-md w-full space-y-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl ring-4 ring-primary/5 transition-transform hover:rotate-6">
              <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat" />
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase leading-none">❤️ I LOVE U</h1>
              <p className="text-sm font-black text-primary uppercase tracking-[0.5em] opacity-60">Prosperity Revolution</p>
            </div>
          </div>

          <div className="pt-8 space-y-4">
            <h2 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Identify Your Heart</h2>
            <p className="max-w-xs mx-auto text-muted-foreground font-medium italic leading-relaxed">
              "Every spark needs a signature. Join the community, connect, and grow together."
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex gap-4">
            <Button asChild className="h-16 flex-1 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50 font-black uppercase text-[11px] tracking-widest shadow-sm active:scale-95 transition-all gap-2">
              <Link href="/login">
                <LogIn className="w-4 h-4 text-primary" />
                Sign In
              </Link>
            </Button>
            <Button asChild className="h-16 flex-1 rounded-2xl gradient-bg font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all gap-2">
              <Link href="/signup">
                <UserPlus className="w-4 h-4" />
                Join
              </Link>
            </Button>
          </div>
          
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="h-16 w-full rounded-2xl border-2 border-dashed border-primary/20 bg-white/50 hover:bg-primary/5 transition-all font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 text-primary"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Explore as Guest
              </>
            )}
          </button>
        </div>

        <div className="pt-8 border-t border-dashed">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
            Respect & Love is Mandatory ❤️ Reach Every Village
          </p>
        </div>
      </div>
    </main>
  );
}

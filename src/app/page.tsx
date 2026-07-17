"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { 
  Heart, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  Loader2, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview Welcome Gateway (Restored).
 * A clean, light, and professional entry point for the Prosperity Revolution.
 */
export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      await signInAnonymously(auth);
      router.push("/dashboard");
    } catch (error) {
      console.error("Guest Access Ripple:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-6 relative overflow-hidden">
      {/* Subtle Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-2xl w-full space-y-12 text-center animate-in fade-in zoom-in-95 duration-700">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-xl ring-4 ring-primary/5">
              <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
              I LOVE U
            </h1>
            <p className="text-xl font-bold text-muted-foreground italic">
              Identify Your <span className="text-primary not-italic">Heart Signature</span>
            </p>
          </div>

          <p className="max-w-md mx-auto text-base text-slate-500 font-medium leading-relaxed">
            "Respect & Love is Mandatory. Join the community reaching every heart and ending world poverty through the power of connection."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="h-18 px-10 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all gap-2 border-none">
            <Link href="/signup">
              <UserPlus className="w-4 h-4" />
              Join Mission
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-18 px-10 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50 font-black uppercase text-xs shadow-sm active:scale-95 transition-all gap-2">
            <Link href="/login">
              <LogIn className="w-4 h-4 text-primary" />
              Sign In
            </Link>
          </Button>
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 hover:text-primary transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Explore as Guest <ArrowRight className="w-3 h-3" />
          </button>
          
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 pt-8">
            Respect is Mandatory ❤️ Prosperity Revolution
          </p>
        </div>
      </div>
    </main>
  );
}

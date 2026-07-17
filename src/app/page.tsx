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
  Users, 
  Zap, 
  Waves,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview Welcome Gateway.
 * The primary entry point for hearts entering the Prosperity Revolution.
 * Features the "Glowing Mosaic" design representing Spark, Circle, and Idea Pool.
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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-glow relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center z-10">
        
        {/* Left Side: Content & CTAs */}
        <div className="space-y-10 text-center lg:text-left">
          <div className="space-y-6">
            <div className="flex flex-col items-center lg:items-start gap-6">
              <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl ring-4 ring-primary/5 transition-transform hover:rotate-6">
                <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat" />
              </div>
              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                  ❤️ I LOVE U
                </h1>
                <p className="text-lg font-bold text-primary uppercase tracking-[0.4em] opacity-80">
                  Prosperity Revolution
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800 uppercase leading-tight">
                Identify Your <span className="gradient-text">Heart Signature</span>
              </h2>
              <p className="max-w-md mx-auto lg:mx-0 text-lg text-muted-foreground font-medium italic leading-relaxed">
                "Every spark needs a home. Join the community where love creates prosperity and respect is the only currency."
              </p>
            </div>
          </div>

          <div className="grid gap-4 max-w-sm mx-auto lg:mx-0">
            <div className="flex gap-4">
              <Button asChild variant="outline" className="h-16 flex-1 rounded-[1.5rem] bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50 font-black uppercase text-[11px] tracking-widest shadow-sm active:scale-95 transition-all gap-2">
                <Link href="/login">
                  <LogIn className="w-4 h-4 text-primary" />
                  Sign In
                </Link>
              </Button>
              <Button asChild className="h-16 flex-1 rounded-[1.5rem] gradient-bg font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all gap-2 border-none">
                <Link href="/signup">
                  <UserPlus className="w-4 h-4" />
                  Join Mission
                </Link>
              </Button>
            </div>
            
            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="h-16 w-full rounded-[1.5rem] border-2 border-dashed border-primary/20 bg-white/50 hover:bg-primary/5 transition-all font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 text-primary group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Explore as Guest
                </>
              )}
            </button>
          </div>

          <div className="pt-8 border-t border-dashed lg:max-w-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
              Respect & Love is Mandatory ❤️ Reach Every Village
            </p>
          </div>
        </div>

        {/* Right Side: Representational Mosaic */}
        <div className="hidden lg:block relative h-[600px]">
          <div className="grid grid-cols-2 grid-rows-3 gap-6 h-full p-4">
            
            {/* Spark (Love/Identity) */}
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl animate-float bg-slate-100">
               <Image 
                src={PlaceHolderImages[1].imageUrl} 
                alt="Spark Connection" 
                fill 
                className="object-cover" 
                data-ai-hint="happy person"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
               <div className="absolute bottom-8 left-8 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg">
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                  <span className="text-white font-black uppercase tracking-widest text-sm">Spark</span>
               </div>
            </div>

            {/* Circle (Community) */}
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl animate-float [animation-delay:1s] bg-slate-100 row-span-2">
               <Image 
                src={PlaceHolderImages[5].imageUrl} 
                alt="Global Community" 
                fill 
                className="object-cover" 
                data-ai-hint="community gathering"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent" />
               <div className="absolute bottom-8 left-8 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-white font-black uppercase tracking-widest text-sm">Circle</span>
               </div>
            </div>

            {/* Idea Pool (Prosperity) */}
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl animate-float [animation-delay:0.5s] bg-slate-100">
               <Image 
                src={PlaceHolderImages[0].imageUrl} 
                alt="Idea Prosperity" 
                fill 
                className="object-cover" 
                data-ai-hint="ocean waves"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-blue-500/60 to-transparent" />
               <div className="absolute bottom-8 left-8 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-lg">
                    <Waves className="w-6 h-6" />
                  </div>
                  <span className="text-white font-black uppercase tracking-widest text-sm">Idea Pool</span>
               </div>
            </div>

            {/* Global Mission */}
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl animate-float [animation-delay:1.5s] bg-slate-900 border-4 border-primary/20">
               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-spin-slow">
                     <Globe className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-white font-black uppercase tracking-[0.2em] text-[10px]">
                    Unified Prosperity Network
                  </p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

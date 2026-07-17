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
  Globe,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Welcome Gateway.
 * The primary entry point for hearts entering the Prosperity Revolution.
 * Features a light, glowing design with representative imagery.
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-glow relative overflow-hidden">
      {/* Decorative Glow Orbs */}
      <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] -z-10 animate-pulse" />
      
      <div className="container mx-auto px-6 py-12 max-w-7xl z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-primary/10 shadow-sm animate-in fade-in slide-in-from-left-4 duration-700">
                <Heart className="w-5 h-5 text-primary fill-primary animate-heartbeat" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Prosperity Revolution</span>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-none">
                  I LOVE U
                </h1>
                <h2 className="text-xl md:text-2xl font-bold text-muted-foreground italic leading-tight">
                  Identify Your <span className="gradient-text font-black not-italic">Heart Signature</span>
                </h2>
              </div>

              <p className="max-w-md mx-auto lg:mx-0 text-base text-slate-500 font-medium leading-relaxed">
                "Where love creates prosperity and respect is mandatory. Join the community reaching every village through the power of connection."
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button asChild size="lg" className="h-16 px-8 rounded-2xl gradient-bg font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all gap-2 border-none">
                <Link href="/signup">
                  <UserPlus className="w-4 h-4" />
                  Join Mission
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-16 px-8 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50 font-black uppercase text-[11px] tracking-widest shadow-sm active:scale-95 transition-all gap-2">
                <Link href="/login">
                  <LogIn className="w-4 h-4 text-primary" />
                  Sign In
                </Link>
              </Button>
            </div>

            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 hover:text-primary transition-colors mt-4"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
              Explore as Guest <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="pt-10 opacity-30">
               <p className="text-[9px] font-black uppercase tracking-[0.4em]">Respect is Mandatory ❤️ Reaching Every Heart</p>
            </div>
          </div>

          {/* Right Column: Mission Mosaic */}
          <div className="relative group">
            <div className="grid grid-cols-2 gap-4">
              
              {/* Mosaic Item: Spark (Love) */}
              <div className="space-y-4">
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl animate-float transition-transform group-hover:scale-[1.02] duration-500">
                  <Image 
                    src={PlaceHolderImages[1].imageUrl} 
                    alt="Spark Connection" 
                    fill 
                    className="object-cover" 
                    data-ai-hint="happy couple"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-white font-black uppercase tracking-widest text-[10px]">Spark</span>
                  </div>
                </div>

                {/* Mosaic Item: Global (Mission) */}
                <div className="relative aspect-square rounded-[2.5rem] bg-slate-900 border-4 border-primary/20 flex flex-col items-center justify-center p-6 text-center animate-float [animation-delay:1.5s]">
                   <Globe className="w-10 h-10 text-primary mb-3 animate-spin-slow" />
                   <p className="text-white font-black uppercase tracking-[0.2em] text-[8px] leading-tight">
                     Unified <br/> Prosperity
                   </p>
                </div>
              </div>

              <div className="space-y-4 pt-12">
                {/* Mosaic Item: Circle (Community) */}
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl animate-float [animation-delay:0.5s] transition-transform group-hover:scale-[1.02] duration-500">
                  <Image 
                    src={PlaceHolderImages[5].imageUrl} 
                    alt="Community Circle" 
                    fill 
                    className="object-cover" 
                    data-ai-hint="community gathering"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-lg">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-white font-black uppercase tracking-widest text-[10px]">Circle</span>
                  </div>
                </div>

                {/* Mosaic Item: Idea Pool (Prosperity) */}
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl animate-float [animation-delay:1s] transition-transform group-hover:scale-[1.02] duration-500">
                  <Image 
                    src={PlaceHolderImages[0].imageUrl} 
                    alt="Prosperity Pool" 
                    fill 
                    className="object-cover" 
                    data-ai-hint="ocean calm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-lg">
                      <Waves className="w-5 h-5" />
                    </div>
                    <span className="text-white font-black uppercase tracking-widest text-[10px]">Idea Pool</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
"use client";

import Link from "next/link";
import { 
  Heart, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  Globe, 
  Ghost,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroImage from "@/components/HeroImage";

/**
 * @fileOverview Refined Welcome Gateway.
 * Centralizes the "I LOVE U" mission signature with floral background frequencies.
 */
export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <HeroImage />
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-1000">
            {/* Sacred Heart Icon Container (Above branding) */}
            <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.8rem] flex items-center justify-center shadow-2xl border border-white/20">
               <Heart className="w-8 h-8 text-primary fill-primary animate-heartbeat" />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none text-slate-900 flex items-center justify-center gap-3">
                <span className="animate-float opacity-80 text-xl md:text-3xl">❤️</span>
                <span>I LOVE <span className="gradient-text">U.</span></span>
                <div className="flex flex-col text-xs md:text-lg animate-pulse">
                  <span>✨</span>
                  <span className="ml-2">💖</span>
                </div>
              </h1>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                The Prosperity Revolution
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild className="h-14 px-8 rounded-2xl gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-all group">
                <Link href="/signup">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join the Mission
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-14 px-8 rounded-2xl border-2 bg-white/50 backdrop-blur-md font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
                <Link href="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Identify Heart
                </Link>
              </Button>
            </div>
            
            <div className="pt-6 max-w-sm mx-auto">
              <Link href="/login/guest" className="group block">
                <div className="bg-white/40 backdrop-blur-xl border border-primary/10 rounded-[1.8rem] p-5 hover:bg-white/60 transition-all shadow-lg hover:shadow-2xl active:scale-95 text-center">
                   <div className="flex items-center justify-center gap-3 mb-1">
                      <Ghost className="w-4 h-4 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Guest Explorer</span>
                   </div>
                   <p className="text-[9px] text-muted-foreground font-medium italic">
                     "Explore the vibration for 30 minutes without an identity."
                   </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce text-slate-300">
           <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary/40 to-transparent" />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 -rotate-12 translate-x-20">
           <Globe className="w-96 h-96 text-primary" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-black uppercase text-[9px] tracking-[0.2em]">
                  Mandatory Protocol
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight">
                  Respect & Love <br />Is <span className="text-primary">Mandatory.</span>
                </h2>
              </div>
              
              <p className="text-base text-muted-foreground font-medium italic leading-relaxed">
                "We are building a global community where every heartbeat fuels a miracle. Every match, every conversation, and every gift contributes to local job creation."
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                <MissionPillar 
                  icon={<Zap className="text-primary" />}
                  title="Zero Poverty"
                  desc="Eliminating world poverty through global job creation."
                />
                <MissionPillar 
                  icon={<ShieldCheck className="text-primary" />}
                  title="Safe Spaces"
                  desc="End-to-End encrypted conversations for your security."
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <TrendingDown className="absolute -bottom-4 -right-4 w-32 h-32 text-primary opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
               <div className="relative z-10 space-y-6">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Globe className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Reach Every Village</h3>
                  <p className="text-white/60 text-sm leading-relaxed font-medium">
                    Our mission is to extend prosperity to the furthest corners of the globe. By identifying your heart today, you become a partner in this revolution.
                  </p>
                  <Button asChild variant="outline" className="h-12 rounded-xl border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px]">
                    <Link href="/donate">Support the Fund <ArrowRight className="ml-2 w-4 h-4" /></Link>
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <footer className="py-10 border-t text-center">
        <div className="flex items-center justify-center gap-6 mb-4 opacity-30">
          <Sparkles className="w-4 h-4 text-primary" />
          <Heart className="w-4 h-4 text-primary fill-primary" />
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">
          Eliminating World Poverty Together ❤️ Reaching Every Heart
        </p>
      </footer>
    </div>
  );
}

function MissionPillar({ icon, title, desc }: any) {
  return (
    <div className="space-y-2">
      <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center">
        {icon}
      </div>
      <h4 className="font-black uppercase tracking-widest text-xs">{title}</h4>
      <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

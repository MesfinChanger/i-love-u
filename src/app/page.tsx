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
  TrendingDown,
  Zap,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroImage from "@/components/HeroImage";

/**
 * @fileOverview High-Fidelity Welcome Gateway.
 * Orchestrates the initial heart identification protocol for the I Love U mission.
 */
export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <HeroImage />
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-4xl space-y-8 animate-in fade-in zoom-in-95 duration-1000">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-white/90 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center shadow-2xl ring-8 ring-white/20 animate-heartbeat">
                <Heart className="w-12 h-12 text-primary fill-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] text-slate-900">
                I LOVE <br /><span className="gradient-text">U.</span>
              </h1>
              <p className="text-xl md:text-2xl font-bold uppercase tracking-[0.4em] text-slate-600/60">
                The Prosperity Revolution
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button asChild className="h-18 px-10 rounded-2xl gradient-bg font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 active:scale-95 transition-all group">
                <Link href="/signup">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join the Mission
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-18 px-10 rounded-2xl border-2 bg-white/50 backdrop-blur-md font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">
                <Link href="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Identify Heart
                </Link>
              </Button>
            </div>
            
            <div className="pt-6">
              <Link href="/login/guest" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-2">
                <Ghost className="w-3 h-3" />
                Explore as Guest
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
      <section className="py-24 px-6 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 -rotate-12 translate-x-20">
           <Globe className="w-96 h-96 text-primary" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <Badge label="Mandatory Protocol" />
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                  Respect & Love <br />Is <span className="text-primary">Mandatory.</span>
                </h2>
              </div>
              
              <p className="text-xl text-muted-foreground font-medium italic leading-relaxed">
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

            <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
               <TrendingDown className="absolute -bottom-4 -right-4 w-40 h-40 text-primary opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
               <div className="relative z-10 space-y-8">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Reach Every Village</h3>
                  <p className="text-white/60 leading-relaxed font-medium">
                    Our mission is to extend prosperity to the furthest corners of the globe. By identifying your heart today, you become a partner in this revolution.
                  </p>
                  <Button asChild variant="outline" className="h-14 rounded-xl border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px]">
                    <Link href="/donate">Support the Fund <ArrowRight className="ml-2 w-4 h-4" /></Link>
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <footer className="py-12 border-t text-center">
        <div className="flex items-center justify-center gap-6 mb-6 opacity-30">
          <Sparkles className="w-5 h-5 text-primary" />
          <Heart className="w-5 h-5 text-primary fill-primary" />
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400">
          Eliminating World Poverty Together ❤️ Reaching Every Heart
        </p>
      </footer>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-black uppercase text-[10px] tracking-[0.2em]">
      {label}
    </div>
  );
}

function MissionPillar({ icon, title, desc }: any) {
  return (
    <div className="space-y-3">
      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
        {icon}
      </div>
      <h4 className="font-black uppercase tracking-widest text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

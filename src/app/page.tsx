"use client";

import AnimatedBackground from "@/components/home/AnimatedBackground";
import {
  Heart,
  Sparkles as SparklesIcon,
  Users,
  Lightbulb,
  Globe,
  LogIn,
  UserPlus,
  Ghost
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview High-Fidelity Welcome Gateway.
 * Features the Sacred Bloom Protocol and perfectly positioned mission branding.
 */
export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">   
      <AnimatedBackground />

      <section className="
        relative z-10
        min-h-screen
        flex
        flex-col
        items-center
        justify-center
        px-6
        text-center
      ">
        {/* Sacred Heart Centered Above Branding */}
        <div className="
          w-24 h-24
          rounded-[2.5rem]
          bg-white/40
          backdrop-blur-md
          shadow-2xl
          flex
          items-center
          justify-center
          mb-8
          animate-heartbeat
          ring-8 ring-white/20
        ">
          <Heart className="
            w-12 h-12
            text-primary
            fill-primary
          "/>
        </div>

        {/* High-Fidelity Mission Signature */}
        <div className="space-y-2 mb-12">
          <h1 className="
            text-5xl
            md:text-7xl
            font-black
            tracking-tighter
            uppercase
            flex items-center justify-center gap-3
            text-slate-900
          ">
            ❤️ I LOVE U <span className="inline-flex items-center gap-1.5 text-4xl md:text-5xl">✨💖</span>
          </h1>
          <p className="
            text-xs
            md:text-sm
            font-black
            tracking-[0.5em]
            uppercase
            text-primary/60
          ">
            The Prosperity Revolution
          </p>
        </div>

        {/* Message Registry */}
        <div className="
          max-w-2xl
          bg-white/40
          backdrop-blur-xl
          rounded-[3rem]
          shadow-2xl
          p-10
          border
          border-white/50
          mb-10
        ">
          <h2 className="
            text-3xl
            font-black
            text-slate-900
            uppercase
            tracking-tight
          ">
            Identify Your Heart
          </h2>
          <p className="
            mt-4
            text-slate-600
            text-lg
            italic
            font-medium
            leading-relaxed
          ">
            "Every spark needs a signature."
            <br/>
            Connect, share moments, and build prosperity worldwide.
          </p>
        </div>

        {/* Strategic Action Pathways */}
        <div className="
          flex
          flex-col
          md:flex-row
          gap-4
          w-full
          max-w-md
          justify-center
        ">
          <Button
            asChild
            className="
              h-16
              px-10
              rounded-2xl
              gradient-bg
              font-black
              uppercase
              text-[11px]
              tracking-widest
              shadow-xl
              active:scale-95
              transition-all
              flex-1
            "
          >
            <Link href="/signup">
              <UserPlus className="w-4 h-4 mr-2" />
              Join Mission
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="
              h-16
              px-10
              rounded-2xl
              bg-white/50
              backdrop-blur-sm
              border-2
              font-black
              uppercase
              text-[11px]
              tracking-widest
              hover:bg-white
              transition-all
              flex-1
            "
          >
            <Link href="/login">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </Button>
        </div>

        {/* Guest Explorer Pathway */}
        <div className="mt-8 w-full max-w-sm">
           <Link href="/login/guest" className="group">
             <div className="p-6 rounded-[2rem] bg-slate-900 text-white flex items-center justify-between hover:bg-slate-800 transition-all shadow-lg overflow-hidden relative">
                <SparklesIcon className="absolute -right-2 -top-2 w-12 h-12 text-primary opacity-10 group-hover:rotate-12 transition-transform" />
                <div className="flex items-center gap-4 text-left">
                   <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Ghost className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                      <h4 className="font-black uppercase text-[10px] tracking-widest leading-none">Guest Explorer</h4>
                      <p className="text-[9px] text-white/50 font-medium italic mt-1.5">30-Minute Mystery Discovery</p>
                   </div>
                </div>
                <div className="text-[8px] font-black uppercase tracking-widest bg-primary/20 text-primary px-3 py-1.5 rounded-lg border border-primary/20">Launch →</div>
             </div>
           </Link>
        </div>

        {/* Respect Protocol Footer */}
        <p className="
          mt-12
          text-slate-500
          font-black
          uppercase
          text-[10px]
          tracking-[0.4em]
          opacity-50
        ">
          Respect & Love is Mandatory ❤️
        </p>
      </section>
    </main>
  );
}

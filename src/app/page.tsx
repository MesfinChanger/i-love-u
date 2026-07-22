"use client";

import AnimatedBackground from "@/components/home/AnimatedBackground";
import {
  Heart,
  Sparkles as SparklesIcon,
  LogIn,
  UserPlus,
  Ghost
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview High-Fidelity Welcome Gateway.
 * Features the Sacred Bloom Protocol and perfectly positioned mission branding.
 * Hardened to resolve "disturbed" layout ripples and ensure perfect centering.
 */
export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white flex flex-col items-center justify-center">   
      <AnimatedBackground />

      <div className="
        relative z-10
        w-full
        max-w-4xl
        flex
        flex-col
        items-center
        px-6
        py-12
        text-center
        animate-in fade-in zoom-in-95 duration-700
      ">
        {/* Sacred Heart Centered Above Branding */}
        <div className="
          w-20 h-20
          md:w-24 md:h-24
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
          transition-transform
          hover:scale-110
        ">
          <Heart className="
            w-10 h-10
            md:w-12 md:h-12
            text-primary
            fill-primary
          "/>
        </div>

        {/* High-Fidelity Mission Signature */}
        <div className="space-y-3 mb-10">
          <h1 className="
            text-4xl
            md:text-7xl
            font-black
            tracking-tighter
            uppercase
            flex items-center justify-center gap-3
            text-slate-900
          ">
            ❤️ I LOVE U <span className="inline-flex items-center gap-1.5 text-3xl md:text-5xl">✨💖</span>
          </h1>
          <div className="
            text-[10px]
            md:text-xs
            font-black
            tracking-[0.6em]
            uppercase
            text-primary/70
            bg-primary/5
            px-4
            py-1
            rounded-full
            inline-block
          ">
            The Prosperity Revolution
          </div>
        </div>

        {/* Identity Registry Box */}
        <div className="
          max-w-xl
          w-full
          bg-white/30
          backdrop-blur-xl
          rounded-[3rem]
          shadow-2xl
          p-8
          md:p-12
          border
          border-white/50
          mb-10
          transition-all
          hover:bg-white/40
        ">
          <h2 className="
            text-2xl
            md:text-3xl
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
            text-base
            md:text-lg
            italic
            font-medium
            leading-relaxed
          ">
            "Every spark needs a signature."
            <br/>
            Connect, share moments, and build prosperity worldwide.
          </p>

          {/* Strategic Action Pathways */}
          <div className="
            mt-10
            flex
            flex-col
            sm:flex-row
            gap-4
            w-full
            justify-center
          ">
            <Button
              asChild
              className="
                h-16
                px-8
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
                px-8
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
        </div>

        {/* Guest Explorer Pathway */}
        <div className="w-full max-w-sm">
           <Link href="/login/guest" className="group">
             <div className="p-6 rounded-[2.5rem] bg-slate-900 text-white flex items-center justify-between hover:bg-slate-800 transition-all shadow-2xl overflow-hidden relative border border-white/5">
                <SparklesIcon className="absolute -right-2 -top-2 w-16 h-16 text-primary opacity-10 group-hover:rotate-12 transition-transform" />
                <div className="flex items-center gap-4 text-left">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                      <Ghost className="w-6 h-6 text-primary" />
                   </div>
                   <div>
                      <h4 className="font-black uppercase text-[10px] tracking-widest leading-none">Guest Explorer</h4>
                      <p className="text-[9px] text-white/50 font-medium italic mt-2">30-Minute Mystery Discovery</p>
                   </div>
                </div>
                <div className="text-[8px] font-black uppercase tracking-widest bg-primary/20 text-primary px-3 py-2 rounded-xl border border-primary/20 group-hover:scale-105 transition-transform">
                  Launch →
                </div>
             </div>
           </Link>
        </div>

        {/* Respect Protocol Footer */}
        <p className="
          mt-16
          text-slate-500
          font-black
          uppercase
          text-[9px]
          tracking-[0.5em]
          opacity-50
        ">
          Respect & Love is Mandatory ❤️
        </p>
      </div>
    </main>
  );
}

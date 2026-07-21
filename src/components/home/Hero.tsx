"use client";

import Link from "next/link";
import { Heart, Sparkles, UserPlus, LogIn, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview High-Fidelity Mission Hero.
 * Refined with minimized typography and perfectly positioned branding icons.
 */
export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">

      <div className="text-center max-w-4xl bg-white/30 backdrop-blur-md p-10 rounded-[3rem] shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-700">

        {/* Sacred Heart Centered Above Branding */}
        <div className="
          mx-auto mb-6
          w-16 h-16
          rounded-2xl
          bg-white/10
          backdrop-blur-xl
          flex items-center justify-center
          shadow-xl
          border border-white/30
          animate-heartbeat
        ">
          <Heart
            className="
              w-8 h-8
              text-primary
              fill-primary
            "
          />
        </div>

        {/* Refined Branding: Icons repositioned next to signature, typography minimized */}
        <div className="flex items-center justify-center gap-2 mb-4">
           <h1
             className="
              text-3xl md:text-4xl
              font-black
              text-slate-900
              tracking-tighter
              uppercase
              flex items-center gap-2
            "
           >
             I LOVE U <span className="inline-flex items-center gap-1 text-2xl">❤️✨💖</span>
           </h1>
        </div>

        <div className="
          text-xs
          md:text-sm
          font-black
          bg-gradient-to-r
          from-primary
          via-secondary
          to-primary
          bg-clip-text
          text-transparent
          uppercase
          tracking-[0.4em]
          mb-8
        ">
          The Prosperity Revolution
        </div>

        <p className="
          text-slate-600
          text-base
          max-w-xl
          mx-auto
          font-medium
          italic
          leading-relaxed
          mb-10
        ">
          "Every heartbeat fuels a miracle. Every connection creates opportunity. Together we build a world of respect, love, and prosperity."
        </p>

        {/*Strategic Action Pathways */}
        <div className="
          flex
          flex-col
          md:flex-row
          gap-4
          justify-center
          items-center
        ">
          <Button
            asChild
            className="
              h-14
              px-10
              rounded-2xl
              gradient-bg
              font-black
              uppercase
              text-[10px]
              tracking-widest
              shadow-xl
              active:scale-95
              transition-all
              w-full sm:w-auto
            "
          >
            <Link href="/signup">
              <UserPlus className="mr-2 w-4 h-4"/>
              Join Mission
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="
              h-14
              px-10
              rounded-2xl
              bg-white/50
              backdrop-blur
              text-primary
              border-primary/20
              font-black
              uppercase
              text-[10px]
              tracking-widest
              hover:bg-white
              transition-all
              w-full sm:w-auto
            "
          >
            <Link href="/login">
              <LogIn className="mr-2 w-4 h-4"/>
              Identify Heart
            </Link>
          </Button>
        </div>

        {/* Guest Explorer Integration */}
        <div className="mt-10 pt-8 border-t border-dashed border-slate-200">
           <Link href="/login/guest" className="group">
             <div className="p-6 rounded-[2rem] bg-slate-900 text-white flex items-center justify-between hover:bg-slate-800 transition-all shadow-lg overflow-hidden relative">
                <Sparkles className="absolute -right-2 -top-2 w-12 h-12 text-primary opacity-10 group-hover:rotate-12 transition-transform" />
                <div className="flex items-center gap-4 text-left">
                   <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Ghost className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                      <h4 className="font-black uppercase text-[10px] tracking-widest leading-none">Guest Explorer</h4>
                      <p className="text-[9px] text-white/50 font-medium italic mt-1">30-Minute Mystery Discovery</p>
                   </div>
                </div>
                <div className="text-[8px] font-black uppercase tracking-widest bg-primary/20 text-primary px-3 py-1.5 rounded-lg">Launch →</div>
             </div>
           </Link>
        </div>

      </div>

    </section>
  );
}

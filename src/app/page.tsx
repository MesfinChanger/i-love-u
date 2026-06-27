
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  PlayCircle,
  Languages,
  Check,
  Globe
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { SUPPORTED_LANGUAGES } from '@/lib/world-data';
import { useUser } from '@/firebase';
import HeroMosaic from '@/components/HeroMosaic';

/**
 * @fileOverview The refined I LOVE U Homepage.
 * Implements the split-screen architecture (4fr 6fr) with mission-focused content
 * and a complex 12x12 visual mosaic grid.
 */
export default function Home() {
  const { user } = useUser();
  const { language, setLanguage } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="flex items-center justify-center min-h-screen bg-[#fcf9f5]">
      <Heart className="w-12 h-12 text-primary animate-heartbeat fill-primary" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f5] overflow-x-hidden selection:bg-primary/20">
      {/* HEADER */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 fill-primary text-primary animate-heartbeat" />
            <span className="font-black text-[18px] tracking-[0.4em] text-primary uppercase whitespace-nowrap">I LOVE U</span>
          </div>

          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:bg-primary/5 h-10 px-3 gap-2 rounded-full transition-colors flex items-center">
                  <Languages className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-black uppercase tracking-widest hidden sm:inline-block">{language}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl p-2 border-none shadow-2xl mr-4 max-h-80 overflow-y-auto" align="end">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.name} 
                    onClick={() => setLanguage(lang.name)}
                    className={cn(
                      "rounded-xl py-3 px-4 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-between",
                      language === lang.name ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <div className="flex flex-col">
                      <span>{lang.name}</span>
                      <span className="text-[10px] opacity-40 font-medium">{lang.native}</span>
                    </div>
                    {language === lang.name && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="lg" className="rounded-full h-11 px-8 gradient-bg font-black uppercase text-[10px] tracking-[0.1em] shadow-xl shadow-primary/20 active:scale-95 transition-all" asChild>
              <Link href={user ? "/discover" : "/login"}>Launch Spark</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN HERO CONTAINER */}
      <main className="flex-grow pt-20 flex items-center">
        <section className="container mx-auto px-6 py-10 lg:py-20 h-full max-w-[1440px]">
          <div className="grid lg:grid-cols-[4fr_6fr] gap-12 xl:gap-20 items-center min-h-[70vh]">
            
            {/* CONTENT SIDE (Left) */}
            <div className="space-y-8 text-left animate-in fade-in slide-in-from-left-4 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 font-bold text-[10px] tracking-widest border border-pink-200">
                <Heart className="w-3 h-3 fill-pink-600" /> GLOBAL COMMUNITY VERIFIED
              </div>

              <h1 className="text-6xl xl:text-[4.5rem] font-black leading-[1.1] tracking-tighter text-[#1a2530]">
                Spark <span className="text-primary">Love.</span><br />
                End <span className="text-secondary">Poverty.</span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-md">
                Connecting hearts across every city and village to create opportunities, 
                friendships, and positive change through global job creation.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="h-16 px-10 rounded-full text-base font-black gradient-bg shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group" asChild>
                  <Link href={user ? "/discover" : "/login"}>
                    <Heart className="w-5 h-5 mr-2 fill-white" />
                    Join the Movement
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-base font-bold border border-slate-200 bg-white text-[#1a2530] hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm" asChild>
                  <Link href="/donate">
                    <PlayCircle className="w-5 h-5 text-primary" />
                    Watch Our Story
                  </Link>
                </Button>
              </div>
            </div>

            {/* VISUAL MOSAIC SIDE (Right) */}
            <div className="h-full w-full">
               <HeroMosaic />
            </div>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-100 bg-white/50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-black text-[11px] tracking-[0.4em] uppercase text-slate-300">© 2026 • Reaching Every Heart</p>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
             <span>Respect is Mandatory</span>
             <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
             <span>Eliminating Poverty Globally</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ArrowRight, 
  Zap, 
  Sparkles,
  Languages,
  Check,
  Loader2,
  Lock,
  Globe,
  PlayCircle
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
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useToast } from '@/hooks/use-toast';
import HeroImage from '@/components/HeroImage';

/**
 * @fileOverview The I LOVE U Homepage.
 * Perfectly aligned with high-fidelity mission vision.
 */
export default function Home() {
  const { user } = useUser();
  const db = useFirestore();
  const { language, setLanguage, t } = useTranslation();
  
  const [mounted, setMounted] = useState(false);

  // Profile data for user context
  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Heart className="w-12 h-12 text-primary animate-heartbeat fill-primary" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* HEADER PROTOCOL */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 fill-primary text-primary animate-heartbeat" />
            <span className="font-black text-[18px] tracking-[0.4em] text-primary uppercase whitespace-nowrap">I LOVE U</span>
          </div>

          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-primary/5 h-10 px-3 gap-2 rounded-full transition-colors">
                  <Languages className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-black uppercase tracking-widest hidden sm:inline-block">{language}</span>
                </Button>
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

      {/* MAIN MISSION CORE */}
      <main className="flex-grow pt-20">
        <section className="max-w-7xl mx-auto px-6 py-12">
          
          {/* CINEMATIC HERO CONTAINER */}
          <div className="relative w-full h-[640px] overflow-hidden rounded-[40px] shadow-2xl group">
            
            {/* Rotating Global Story Layer */}
            <HeroImage />

            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />

            {/* "Alive" UI Elements */}
            <div className="absolute top-10 left-1/3 animate-bounce text-pink-500 z-20 hidden md:block">
              <Heart className="w-10 h-10 fill-current drop-shadow-lg" />
            </div>

            <div className="absolute bottom-32 right-12 animate-pulse text-yellow-400 z-20">
              <Sparkles className="w-16 h-16 drop-shadow-lg" />
            </div>

            <div className="absolute top-32 right-1/4 animate-ping text-pink-400/40 z-20">
              <Heart className="w-8 h-8 fill-current" />
            </div>

            {/* Content Layer */}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 max-w-xl z-10 text-left space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-50 text-pink-600 font-black text-[10px] uppercase tracking-widest border border-pink-100 shadow-sm">
                <Heart className="w-3.5 h-3.5 fill-current" /> GLOBAL COMMUNITY VERIFIED
              </span>

              <h1 className="text-7xl md:text-[84px] font-black leading-[0.9] tracking-tighter">
                <span className="text-slate-900 block">Spark</span>
                <span className="text-primary block">Love.</span>
                <span className="block bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">End Poverty.</span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                Connecting hearts across every city and village to create opportunities, friendships, and positive change through global job creation.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="h-16 px-10 rounded-full text-base font-black gradient-bg shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group" asChild>
                  <Link href={user ? "/discover" : "/login"}>
                    Join the Movement
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-base font-bold border-2 border-slate-100 bg-white text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm" asChild>
                  <Link href="/donate">
                    <PlayCircle className="w-5 h-5 text-primary" />
                    Watch Our Story
                  </Link>
                </Button>
              </div>
            </div>

            {/* Floating High-Fidelity Badge (Bottom Right) */}
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center p-2 z-30 transition-transform group-hover:rotate-12 duration-700 sm:flex hidden border border-slate-100">
               <div className="w-full h-full rounded-full gradient-bg flex items-center justify-center">
                  <Heart className="w-8 h-8 fill-white text-white animate-heartbeat" />
                  <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full text-primary shadow-sm border">
                     <Sparkles className="w-3 h-3" />
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* MISSION PILLARS */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Pure Respect</h3>
              <p className="text-slate-500 text-sm leading-relaxed italic">Built on mutual honor. Reaching every heart in every village with love.</p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">AI Moderated</h3>
              <p className="text-slate-500 text-sm leading-relaxed italic">Disrespect is filtered automatically. Join a community where kindness is mandatory.</p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Prosperity</h3>
              <p className="text-slate-500 text-sm leading-relaxed italic">Every connection helps fund local job creation to end global poverty forever.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 border-t border-slate-50 bg-slate-50/30">
        <div className="container mx-auto px-6 text-center space-y-6">
          <p className="font-black text-[11px] tracking-[0.4em] uppercase text-slate-300">© 2026 • Reaching Every Heart</p>
          <p className="text-[10px] font-bold italic uppercase tracking-widest opacity-40 text-slate-400">Respect & Love is Mandatory ❤️ Eliminating Poverty Globally</p>
        </div>
      </footer>
    </div>
  );
}

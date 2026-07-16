"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, PlayCircle } from 'lucide-react';
import { useUser, auth } from '@/firebase';
import HeroMosaic from '@/components/HeroMosaic';
import { Header } from '@/components/Header';

/**
 * @fileOverview Landing Page for the Prosperity Revolution.
 * Includes Step 3 diagnostic to verify authentication state during synchronization.
 */
export default function Home() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { 
    setMounted(true); 
    
    // Step 3 — Check Authentication
    // Diagnostics to verify if the heart is identified in the global bridge.
    console.log("Current User Sync Status:", auth.currentUser);
  }, []);

  if (!mounted) return <div className="flex items-center justify-center min-h-screen"><Heart className="w-12 h-12 text-primary animate-heartbeat fill-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f5] overflow-x-hidden">
      <Header />
      <main className="flex-grow flex items-center">
        <section className="container mx-auto px-6 py-10 lg:py-20 max-w-[1440px]">
          <div className="grid lg:grid-cols-[4fr_6fr] gap-12 items-center min-h-[70vh]">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
              <h1 className="text-6xl xl:text-[4.5rem] font-black leading-[1.1] tracking-tighter text-[#1a2530]">
                Spark <span className="text-primary">Love.</span><br />
                End <span className="text-secondary">Poverty.</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-md">
                Connecting hearts across every city and village to create opportunities and positive change. Respect is Mandatory. ❤️
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="h-16 px-10 rounded-full text-base font-black gradient-bg shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all" asChild>
                  <Link href={user ? "/discover" : "/login"}>Join the Movement</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-base font-bold border border-slate-200 bg-white" asChild>
                  <Link href="/donate">Watch Our Story</Link>
                </Button>
              </div>
            </div>
            <div className="h-full w-full"><HeroMosaic /></div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t bg-white/50 text-center">
        <p className="font-black text-[11px] tracking-[0.4em] uppercase text-slate-300">© 2026 • Respect is Mandatory</p>
      </footer>
    </div>
  );
}

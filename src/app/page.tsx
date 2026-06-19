"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Globe, ArrowRight, Zap, Briefcase, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

const LOVE_TRANSLATIONS = [
  { lang: "English", text: "I Love U", icon: "❤️" },
  { lang: "Spanish", text: "Te Amo", icon: "💖" },
  { lang: "French", text: "Je t'aime", icon: "✨" },
  { lang: "Japanese", text: "愛してる", icon: "🌸" },
  { lang: "Swahili", text: "Nakupenda", icon: "🦓" }
];

export default function Home() {
  const dynamicImages = useMemo(() => PlaceHolderImages.filter(img => img.id.startsWith('user-')), []);
  
  const [langIndex, setLangIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const langInterval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % LOVE_TRANSLATIONS.length);
    }, 4000);

    const imageInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % dynamicImages.length);
    }, 6000);

    return () => {
      clearInterval(langInterval);
      clearInterval(imageInterval);
    };
  }, [dynamicImages.length]);

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* Minimized Header */}
      <header className="fixed top-0 z-50 w-full bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-primary text-primary animate-heartbeat" />
            <span className="font-black text-[9px] tracking-[0.4em] text-primary uppercase">I LOVE U</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Login</Link>
            <Button size="sm" className="rounded-full h-8 px-5 gradient-bg font-black uppercase text-[7px] tracking-widest shadow-xl" asChild>
              <Link href="/login">Launch</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Maximized Hero Section */}
        <section className="relative h-[100vh] w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {mounted && dynamicImages.map((img, i) => (
              <div 
                key={img.id}
                className={cn(
                  "absolute inset-0 transition-all duration-3000 ease-in-out",
                  imageIndex === i ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-110 blur-md"
                )}
              >
                <Image 
                  src={img.imageUrl} 
                  alt="Global Heart" 
                  fill 
                  className="object-cover brightness-75"
                  priority={i === 0}
                  data-ai-hint="woman portrait"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30" />
              </div>
            ))}
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl space-y-10">
              {/* Spark Match Badge - Floating Style */}
              <div className="bg-white/90 backdrop-blur-xl px-5 py-3 rounded-full border border-primary/20 shadow-2xl inline-flex animate-bounce duration-3000">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Spark Match Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
                  Spark Love.<br/>
                  End Poverty.
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed font-medium italic drop-shadow-lg">
                  Every mysterious heart connection funds local job creation to eliminate global poverty forever. Respect is Mandatory.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <Button size="lg" className="h-20 px-14 rounded-full text-xl font-black gradient-bg shadow-[0_20px_40px_-10px_rgba(255,51,102,0.6)] hover:scale-105 transition-transform group" asChild>
                  <Link href="/login" className="flex items-center gap-4">
                    Launch Spark
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-20 px-12 rounded-full text-lg font-bold border-2 border-white/40 bg-white/20 backdrop-blur-xl hover:bg-white text-white hover:text-primary transition-all shadow-xl" asChild>
                  <Link href="/donate">Support Mission</Link>
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900 text-white shadow-2xl">
                  <Globe className="w-4 h-4 animate-spin-slow text-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {mounted ? LOVE_TRANSLATIONS[langIndex].text : "I Love U"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/70">
                   <ShieldCheck className="w-4 h-4 text-primary" />
                   18+ Requirement Active
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-white relative z-10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-black mb-24 tracking-tighter uppercase opacity-90">
              One Mission. <span className="text-primary">Pure Love.</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-slate-50 p-12 rounded-[3rem] text-left group hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-primary/5">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-8 shadow-sm">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tighter uppercase">AI Moderated</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium italic">Disrespect is filtered automatically. Join a community where kindness is the only metric.</p>
              </div>
              <div className="bg-slate-50 p-12 rounded-[3rem] text-left group hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-secondary/5">
                <div className="w-16 h-16 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary mb-8 shadow-sm">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tighter uppercase">Respect Only</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium italic">We are built on pure respect. Happiness is Mandatory ❤️ for every community.</p>
              </div>
              <div className="bg-slate-50 p-12 rounded-[3rem] text-left group hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-indigo-500/5">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 flex items-center justify-center text-indigo-500 mb-8 shadow-sm">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tighter uppercase">Prosperity</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium italic">Every connection funds local job creation. Help us eliminate global poverty forever.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 border-t bg-slate-50 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8 opacity-70">
            <Heart className="w-5 h-5 fill-primary text-primary" />
            <span className="font-black text-xs tracking-[0.4em] text-primary uppercase">I LOVE U</span>
          </div>
          <p className="font-black text-[9px] tracking-[0.3em] mb-4 uppercase text-slate-400">© 2025 Prosperity Revolution.</p>
          <p className="text-[8px] font-bold italic uppercase tracking-widest opacity-40 text-slate-400">Respect & Love is Mandatory ❤️</p>
        </div>
      </footer>
    </div>
  );
}

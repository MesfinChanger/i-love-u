"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Globe, ArrowRight, Zap, Briefcase, ShieldCheck } from 'lucide-react';
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
            <span className="font-black text-[10px] tracking-[0.4em] text-primary uppercase">I LOVE U</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Login</Link>
            <Button size="sm" className="rounded-full h-8 px-5 gradient-bg font-black uppercase text-[8px] tracking-widest shadow-xl" asChild>
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
                  className="object-cover brightness-90"
                  priority={i === 0}
                  data-ai-hint="woman portrait"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />
              </div>
            ))}
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl space-y-12">
              {/* Spark Match Badge */}
              <div className="bg-white/90 backdrop-blur-xl px-6 py-4 rounded-[2.5rem] border border-primary/20 shadow-2xl inline-flex animate-in slide-in-from-left-6 duration-1000">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white fill-white animate-heartbeat" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Spark Match Active</span>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Global Community Network</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h1 className="text-7xl lg:text-9xl font-black leading-[0.85] tracking-tighter text-slate-900 mix-blend-multiply drop-shadow-sm">
                  Spark Love.<br/>
                  End Poverty.
                </h1>
                <p className="text-2xl text-slate-800/90 max-w-2xl leading-relaxed font-medium italic drop-shadow-sm">
                  The world's most respectful dating revolution. Every mysterious heart connection funds local job creation to eliminate global poverty forever.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button size="lg" className="h-24 px-16 rounded-[3rem] text-2xl font-black gradient-bg shadow-[0_30px_60px_-15px_rgba(255,51,102,0.6)] hover:scale-105 transition-transform group" asChild>
                  <Link href="/login" className="flex items-center gap-5">
                    Launch Spark
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-24 px-14 rounded-[3rem] text-xl font-bold border-2 border-white/20 bg-white/40 backdrop-blur-2xl hover:bg-white transition-all shadow-xl" asChild>
                  <Link href="/donate">Support Mission</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8">
                <div className="inline-flex items-center gap-4 px-5 py-3 rounded-full bg-slate-900 text-white shadow-2xl">
                  <Globe className="w-5 h-5 animate-spin-slow text-secondary" />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    {mounted ? LOVE_TRANSLATIONS[langIndex].text : "I Love U"} {mounted ? LOVE_TRANSLATIONS[langIndex].icon : "❤️"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-700/70">
                   <ShieldCheck className="w-4 h-4 text-primary" />
                   Respect is Mandatory • 18+
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-40 bg-white relative z-10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-5xl font-black mb-32 tracking-tighter uppercase opacity-90">
              One Mission. <span className="text-primary">Pure Love.</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-slate-50/50 p-16 rounded-[4rem] text-left group hover:bg-white hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 border border-transparent hover:border-primary/5">
                <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary mb-10 group-hover:scale-110 transition-transform shadow-sm">
                  <Zap className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black mb-5 tracking-tighter uppercase">AI Filtered</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium italic">Our neural engine finds mysterious connections. Disrespect is filtered automatically because love is mandatory.</p>
              </div>
              <div className="bg-slate-50/50 p-16 rounded-[4rem] text-left group hover:bg-white hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 border border-transparent hover:border-secondary/5">
                <div className="w-20 h-20 rounded-3xl bg-secondary/5 flex items-center justify-center text-secondary mb-10 group-hover:scale-110 transition-transform shadow-sm">
                  <Heart className="w-10 h-10 fill-current" />
                </div>
                <h3 className="text-2xl font-black mb-5 tracking-tighter uppercase">Respect Only</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium italic">We are built on pure respect. Join a global community where kindness is the only metric of success.</p>
              </div>
              <div className="bg-slate-50/50 p-16 rounded-[4rem] text-left group hover:bg-white hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 border border-transparent hover:border-indigo-500/5">
                <div className="w-20 h-20 rounded-3xl bg-indigo-500/5 flex items-center justify-center text-indigo-500 mb-10 group-hover:scale-110 transition-transform shadow-sm">
                  <Briefcase className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black mb-5 tracking-tighter uppercase">Prosperity</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium italic">Every connection funds vocational training and local job creation. Help us eliminate global poverty forever.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t bg-slate-50 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-10 opacity-70">
            <Heart className="w-6 h-6 fill-primary text-primary" />
            <span className="font-black text-sm tracking-[0.4em] text-primary uppercase">I LOVE U</span>
          </div>
          <p className="font-black text-[10px] tracking-[0.3em] mb-4 uppercase text-slate-400">© 2025 The Prosperity Revolution.</p>
          <p className="text-[9px] font-bold italic uppercase tracking-widest opacity-40 text-slate-400">Reaching Every Community • Respect & Love is Mandatory ❤️</p>
        </div>
      </footer>
    </div>
  );
}

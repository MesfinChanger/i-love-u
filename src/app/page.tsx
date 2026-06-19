"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Globe, ArrowRight, Zap, Briefcase } from 'lucide-react';
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
    }, 5000);

    return () => {
      clearInterval(langInterval);
      clearInterval(imageInterval);
    };
  }, [dynamicImages.length]);

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* Minimized Header */}
      <header className="fixed top-0 z-50 w-full bg-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 fill-primary text-primary animate-heartbeat" />
            <span className="font-black text-[9px] tracking-[0.4em] text-primary uppercase">I LOVE U</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Login</Link>
            <Button size="sm" className="rounded-full h-7 px-4 gradient-bg font-black uppercase text-[7px] tracking-widest shadow-lg" asChild>
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
                  imageIndex === i ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-sm"
                )}
              >
                <Image 
                  src={img.imageUrl} 
                  alt="Global Heart" 
                  fill 
                  className="object-cover brightness-95"
                  priority={i === 0}
                  data-ai-hint="woman portrait"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/20" />
              </div>
            ))}
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl space-y-12">
              {/* Dynamic Badge */}
              <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-primary/10 shadow-2xl inline-flex animate-in slide-in-from-left-4 duration-1000">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white fill-white animate-heartbeat" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Spark Match</span>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none">Global Network Active</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-7xl lg:text-9xl font-black leading-[0.8] tracking-tighter text-slate-900 mix-blend-multiply">
                  Spark Love.<br/>
                  End Poverty.
                </h1>
                <p className="text-xl text-slate-800/80 max-w-xl leading-relaxed font-medium italic">
                  Join the world's most respectful community. Every connection helps eliminate world poverty through global job creation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <Button size="lg" className="h-20 px-14 rounded-[2.5rem] text-xl font-black gradient-bg shadow-[0_30px_60px_-15px_rgba(255,51,102,0.5)] hover:scale-105 transition-transform group" asChild>
                  <Link href="/login" className="flex items-center gap-4">
                    Launch Spark
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-20 px-12 rounded-[2.5rem] text-lg font-bold border-2 bg-white/50 backdrop-blur-md hover:bg-white transition-all" asChild>
                  <Link href="/donate">Support Mission</Link>
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900 text-white shadow-xl">
                  <Globe className="w-4 h-4 animate-spin-slow text-secondary" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {mounted ? LOVE_TRANSLATIONS[langIndex].text : "I Love U"} {mounted ? LOVE_TRANSLATIONS[langIndex].icon : "❤️"}
                  </span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600/60">Respect is Mandatory • 18+</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-black mb-24 tracking-tighter uppercase opacity-90">
              One Mission. <span className="text-primary">Pure Love.</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50/50 p-12 rounded-[3.5rem] text-left group hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tighter uppercase">AI Filtered</h3>
                <p className="text-slate-500 leading-relaxed font-medium italic">Our neural engine finds mysterious connections. Disrespect is filtered automatically because love is mandatory.</p>
              </div>
              <div className="bg-slate-50/50 p-12 rounded-[3.5rem] text-left group hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tighter uppercase">Respect Only</h3>
                <p className="text-slate-500 leading-relaxed font-medium italic">We are built on pure respect. Join a global community where kindness is the only metric of success.</p>
              </div>
              <div className="bg-slate-50/50 p-12 rounded-[3.5rem] text-left group hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tighter uppercase">Prosperity</h3>
                <p className="text-slate-500 leading-relaxed font-medium italic">Every connection funds vocational training and local job creation. Help us eliminate global poverty forever.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t bg-slate-50 relative z-10">
        <div className="container mx-auto px-6 text-center text-slate-400">
          <div className="flex items-center justify-center gap-2 mb-8 opacity-60">
            <Heart className="w-5 h-5 fill-primary text-primary" />
            <span className="font-black text-xs tracking-[0.3em] text-primary uppercase">I LOVE U</span>
          </div>
          <p className="font-black text-[9px] tracking-widest mb-3 uppercase">© 2025 The Prosperity Revolution.</p>
          <p className="text-[8px] font-bold italic uppercase tracking-widest opacity-40">Reaching Every Community • Respect & Love is Mandatory ❤️</p>
        </div>
      </footer>
    </div>
  );
}

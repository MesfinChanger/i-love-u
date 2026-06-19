"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      <header className="fixed top-0 z-50 w-full bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-primary text-primary animate-heartbeat" />
            <span className="font-black text-[8px] tracking-[0.4em] text-primary uppercase">I LOVE U</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[8px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">Login</Link>
            <Button size="sm" className="rounded-full h-8 px-4 gradient-bg font-black uppercase text-[7px] tracking-widest shadow-xl border border-white/10" asChild>
              <Link href="/login">Launch</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative h-[100vh] w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {mounted && dynamicImages.map((img, i) => (
              <div 
                key={img.id}
                className={cn(
                  "absolute inset-0 transition-all duration-3000 ease-in-out",
                  imageIndex === i ? "opacity-100 scale-105 blur-0" : "opacity-0 scale-100 blur-sm"
                )}
              >
                <Image 
                  src={img.imageUrl} 
                  alt="Global Heart Connection" 
                  fill 
                  className="object-cover brightness-90"
                  priority={i === 0}
                  data-ai-hint="woman portrait"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            ))}
          </div>

          <div className="container mx-auto px-6 relative z-10 pt-20">
            <div className="max-w-4xl space-y-12">
              <div className="bg-white/10 backdrop-blur-2xl px-6 py-4 rounded-[2rem] border border-white/20 shadow-2xl inline-flex animate-bounce duration-3000 group hover:bg-white/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div className="text-left">
                    <Badge variant="secondary" className="bg-white/20 text-white border-none font-black text-[10px] uppercase tracking-[0.2em] px-3 h-6">Spark Match Active</Badge>
                    <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest mt-1 ml-1">Global Community Verified</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h1 className="text-7xl lg:text-9xl font-black leading-[0.85] tracking-tighter text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                  Spark Love.<br/>
                  End Poverty.
                </h1>
                <p className="text-2xl lg:text-3xl text-white/95 max-w-2xl leading-relaxed font-medium italic drop-shadow-lg">
                  Connecting hearts across every city and village to fund local job creation. Respect is Mandatory.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button size="lg" className="h-24 px-16 rounded-[2rem] text-2xl font-black gradient-bg shadow-[0_20px_50px_-10px_rgba(255,51,102,0.7)] hover:scale-105 transition-transform group border border-white/20" asChild>
                  <Link href="/login" className="flex items-center gap-5">
                    Launch Spark
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-24 px-14 rounded-[2rem] text-xl font-bold border-2 border-white/30 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white transition-all shadow-2xl" asChild>
                  <Link href="/donate">Support Mission</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-2xl border border-white/10">
                  <Globe className="w-5 h-5 animate-spin-slow text-secondary" />
                  <span className="text-[12px] font-black uppercase tracking-[0.2em]">
                    {mounted ? LOVE_TRANSLATIONS[langIndex].text : "I Love U"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/80 drop-shadow-md">
                   <ShieldCheck className="w-5 h-5 text-primary" />
                   18+ Global Compliance
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-40 bg-white relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-32">
               <Badge className="mb-6 h-8 px-6 bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-[0.3em]">The Movement</Badge>
               <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                 Happiness is the <br/><span className="gradient-text">Only Metric.</span>
               </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: Zap, color: 'text-primary', bg: 'bg-primary/5', title: 'AI Moderated', desc: 'Disrespect is filtered automatically. Join a community where kindness is mandatory.' },
                { icon: Heart, color: 'text-secondary', bg: 'bg-secondary/5', title: 'Pure Respect', desc: 'Built on mutual honor. Reaching every rural community and global city with love.' },
                { icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', title: 'Prosperity', desc: 'Every connection funds local job creation to eliminate global poverty forever.' }
              ].map((feature, i) => (
                <div key={i} className="bg-slate-50 p-14 rounded-[4rem] text-left group hover:bg-white hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 border border-transparent hover:border-slate-100">
                  <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 shadow-sm transition-transform group-hover:rotate-6", feature.bg, feature.color)}>
                    <feature.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black mb-6 tracking-tighter uppercase">{feature.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium italic">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t bg-slate-50 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-10 opacity-70">
            <Heart className="w-4 h-4 fill-primary text-primary" />
            <span className="font-black text-[10px] tracking-[0.4em] text-primary uppercase">I LOVE U</span>
          </div>
          <p className="font-black text-[10px] tracking-[0.3em] mb-4 uppercase text-slate-400">© 2025 Prosperity Revolution • Reaching Every Heart</p>
          <p className="text-[9px] font-bold italic uppercase tracking-widest opacity-40 text-slate-400">Respect & Love is Mandatory ❤️ Eliminating Poverty Globally</p>
        </div>
      </footer>
    </div>
  );
}

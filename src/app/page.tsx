"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Globe, ArrowRight, HeartHandshake, Zap, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

const LOVE_TRANSLATIONS = [
  { lang: "English", text: "I Love U", icon: "❤️" },
  { lang: "Spanish", text: "Te Amo", icon: "💖" },
  { lang: "French", text: "Je t'aime", icon: "✨" },
  { lang: "Japanese", text: "愛してる", icon: "🌸" },
  { lang: "Swahili", text: "Nakupenda", icon: "🦓" },
  { lang: "Korean", text: "사랑해", icon: "💎" }
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
    }, 3000);

    const imageInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % dynamicImages.length);
    }, 4500);

    return () => {
      clearInterval(langInterval);
      clearInterval(imageInterval);
    };
  }, [dynamicImages.length]);

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <header className="fixed top-0 z-50 w-full bg-white/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-primary text-primary animate-heartbeat" />
            <span className="font-black text-[10px] tracking-[0.3em] text-primary uppercase">I LOVE U</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Login</Link>
            <Button size="sm" className="rounded-full h-8 px-5 gradient-bg font-black uppercase text-[8px] tracking-widest shadow-xl shadow-primary/20" asChild>
              <Link href="/login">Launch</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative min-h-[100vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {mounted && dynamicImages.map((img, i) => (
              <div 
                key={img.id}
                className={cn(
                  "absolute inset-0 transition-all duration-2000 ease-in-out",
                  imageIndex === i ? "opacity-100 scale-100" : "opacity-0 scale-110"
                )}
              >
                <Image 
                  src={img.imageUrl} 
                  alt="Global community" 
                  fill 
                  className="object-cover"
                  priority={i === 0}
                  data-ai-hint="woman portrait"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              </div>
            ))}
          </div>

          <div className="container mx-auto px-6 relative z-10 pt-20">
            <div className="max-w-2xl space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md text-primary border border-white/50 shadow-xl">
                <Globe className="w-4 h-4 animate-spin-slow text-secondary" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {mounted ? LOVE_TRANSLATIONS[langIndex].text : "I Love U"} {mounted ? LOVE_TRANSLATIONS[langIndex].icon : "❤️"}
                </span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-8xl font-black leading-[0.85] tracking-tighter text-slate-900 drop-shadow-sm">
                  Spark Love.<br/>
                  End Poverty.
                </h1>
                <p className="text-xl text-slate-800/80 max-w-lg leading-relaxed font-medium italic backdrop-blur-sm bg-white/10 rounded-2xl">
                  The world's most respectful community. Every connection helps eliminate world poverty through global job creation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-20 px-12 rounded-[2.5rem] text-xl font-black gradient-bg shadow-[0_30px_60px_-15px_rgba(255,51,102,0.6)] hover:scale-105 transition-transform group" asChild>
                  <Link href="/login" className="flex items-center gap-4">
                    Launch Spark
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-20 px-10 rounded-[2.5rem] text-lg font-bold border-2 bg-white/50 backdrop-blur-md hover:bg-white transition-all" asChild>
                  <Link href="/donate">Support Mission</Link>
                </Button>
              </div>

              <div className="flex items-center gap-4">
                 <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-primary/10 shadow-2xl animate-in slide-in-from-left-4 duration-1000">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center">
                         <Heart className="w-5 h-5 text-white fill-white animate-heartbeat" />
                       </div>
                       <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Spark Match</span>
                          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none">Global Network Active</p>
                       </div>
                    </div>
                 </div>
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600/60 drop-shadow-sm">Respect is Mandatory ❤️ 18+</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-white relative z-10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-5xl font-black mb-24 tracking-tighter uppercase opacity-90 leading-none">
              One Mission. <span className="text-primary">Pure Love.</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap className="w-8 h-8" />}
                title="AI Filtered"
                description="Our neural engine finds mysterious connections. Disrespect is filtered automatically because love is mandatory."
              />
              <FeatureCard 
                icon={<HeartHandshake className="w-8 h-8" />}
                title="Respect Only"
                description="We are built on pure respect. Join a global community where kindness is the only metric of success."
              />
              <FeatureCard 
                icon={<Briefcase className="w-8 h-8" />}
                title="Prosperity"
                description="Every connection funds vocational training and local job creation. Help us eliminate global poverty forever."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t bg-slate-50 relative z-10">
        <div className="container mx-auto px-6 text-center text-slate-400">
          <div className="flex items-center justify-center gap-2 mb-8 opacity-60">
            <Heart className="w-5 h-5 fill-primary text-primary" />
            <span className="font-black text-sm tracking-[0.2em] text-primary uppercase">I LOVE U</span>
          </div>
          <p className="font-black text-[10px] tracking-widest mb-3 uppercase">© 2025 The Prosperity Revolution.</p>
          <p className="text-[9px] font-bold italic uppercase tracking-widest opacity-40">Reaching Every Community • Respect & Love is Mandatory ❤️</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-slate-50/50 p-10 rounded-[3rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 group text-left">
      <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-4 tracking-tighter uppercase text-slate-800">{title}</h3>
      <p className="text-base text-slate-500 leading-relaxed font-medium italic">{description}</p>
    </div>
  );
}

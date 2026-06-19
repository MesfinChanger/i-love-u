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
  { lang: "German", text: "Ich liebe dich", icon: "🔥" },
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
    <div className="flex flex-col min-h-screen bg-white">
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-primary text-primary animate-heartbeat" />
            <span className="font-black text-xs tracking-[0.2em] text-primary uppercase">I LOVE U</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Login</Link>
            <Button className="rounded-full px-6 h-9 gradient-bg font-black uppercase text-[9px] tracking-widest shadow-xl shadow-primary/20" asChild>
              <Link href="/login">Join</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12 z-10 text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/5 text-primary border border-primary/10">
                <Globe className="w-4 h-4 animate-spin-slow text-secondary" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {mounted ? LOVE_TRANSLATIONS[langIndex].text : "I Love U"} {mounted ? LOVE_TRANSLATIONS[langIndex].icon : "❤️"}
                </span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tighter text-slate-900">
                  Spark Love.<br/>
                  End Poverty.
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium italic">
                  The world's most respectful community. Every connection helps eliminate world poverty through global job creation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Button size="lg" className="h-20 px-14 rounded-[2rem] text-lg font-black gradient-bg shadow-[0_25px_50px_-12px_rgba(255,51,102,0.5)] hover:scale-105 transition-transform group" asChild>
                  <Link href="/login" className="flex items-center gap-3">
                    Launch Spark
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-20 px-12 rounded-[2rem] text-lg font-bold border-2 hover:bg-muted/50 transition-colors" asChild>
                  <Link href="/donate">Support Mission</Link>
                </Button>
              </div>
              
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">Respect & Love is Mandatory ❤️ 18+ Only</p>
            </div>

            <div className="flex justify-center lg:justify-end h-full order-1 lg:order-2">
              <div className="relative w-full max-w-2xl aspect-[3/4]">
                <div className="absolute -inset-20 bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse" />
                
                <div className="relative w-full h-full rounded-[5rem] overflow-hidden shadow-[0_80px_100px_-30px_rgba(255,51,102,0.3)] border-[20px] border-white group">
                  {mounted && dynamicImages.map((img, i) => (
                    <div 
                      key={img.id}
                      className={cn(
                        "absolute inset-0 transition-all duration-1500 ease-in-out",
                        imageIndex === i ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-110"
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
                    </div>
                  ))}

                  <div className="absolute bottom-12 left-12 z-20 bg-white/95 backdrop-blur-md px-10 py-6 rounded-[3rem] border border-primary/10 shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center">
                         <Heart className="w-6 h-6 text-white fill-white animate-heartbeat" />
                       </div>
                       <div>
                          <span className="text-sm font-black uppercase tracking-widest text-primary">Global Spark</span>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Reaching Every Community</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-5xl font-black mb-24 tracking-tighter uppercase opacity-90">
              One Mission. <span className="text-primary">Pure Love.</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <FeatureCard 
                icon={<Zap className="w-10 h-10" />}
                title="AI Filtered"
                description="Our neural engine finds mysterious connections. Disrespect is filtered automatically because love is mandatory."
              />
              <FeatureCard 
                icon={<HeartHandshake className="w-10 h-10" />}
                title="Respect Only"
                description="We are built on pure respect. Join a global community where kindness is the only metric of success."
              />
              <FeatureCard 
                icon={<Briefcase className="w-10 h-10" />}
                title="Prosperity"
                description="Every connection funds vocational training and local job creation. Help us eliminate global poverty forever."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t bg-slate-50">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Heart className="w-8 h-8 fill-primary text-primary" />
            <span className="font-black text-2xl tracking-[0.1em] text-primary">I LOVE U</span>
          </div>
          <p className="font-black text-sm text-foreground tracking-tight mb-4 uppercase">© 2025 I Love U. The Prosperity Revolution.</p>
          <p className="text-[10px] font-bold italic uppercase tracking-widest opacity-60">Global Mission • Respect & Love is Mandatory ❤️</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-12 rounded-[4rem] shadow-sm hover:shadow-2xl transition-all border border-slate-100 group text-left">
      <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary mb-10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-5 tracking-tighter uppercase">{title}</h3>
      <p className="text-lg text-muted-foreground leading-relaxed font-medium italic">{description}</p>
    </div>
  );
}

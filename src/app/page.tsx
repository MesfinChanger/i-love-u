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
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear());
    
    const langInterval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % LOVE_TRANSLATIONS.length);
    }, 2500);

    const imageInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % dynamicImages.length);
    }, 4000);

    return () => {
      clearInterval(langInterval);
      clearInterval(imageInterval);
    };
  }, [dynamicImages.length]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative p-1 rounded-lg bg-primary/5">
              <Heart className="w-3.5 h-3.5 fill-primary text-primary animate-heartbeat" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-[9px] tracking-tighter text-primary uppercase">I LOVE</span>
              <span className="font-black text-[3px] tracking-[0.4em] text-muted-foreground ml-0.5 uppercase">YOU</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="font-black text-[8px] uppercase tracking-widest text-primary hover:bg-primary/5 rounded-full px-3 h-8">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="rounded-full px-5 h-8 gradient-bg hover:opacity-90 transition-opacity font-black shadow-lg shadow-primary/20 uppercase text-[8px] tracking-[0.1em]" asChild>
              <Link href="/login">Join</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-14">
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-primary/5 via-white to-white py-12 lg:py-0">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-10 z-10 text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur-3xl text-primary border border-primary/10 shadow-md">
                <Globe className="w-4 h-4 animate-spin-slow text-secondary" />
                <div className="flex flex-col items-start leading-tight">
                   <p className="text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Global community</p>
                   <span className="text-[10px] font-black transition-all duration-700 uppercase tracking-tighter shiny-text">
                    {mounted ? LOVE_TRANSLATIONS[langIndex].text : "I Love U"} {mounted ? LOVE_TRANSLATIONS[langIndex].icon : "❤️"}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-4xl lg:text-5xl font-black leading-none tracking-tighter animate-in zoom-in duration-1000">
                  <span className="shiny-text uppercase opacity-80">I Love U</span>
                </h1>
                <p className="text-[8px] lg:text-[9px] font-black tracking-[0.5em] text-primary uppercase opacity-40">
                  The AI Prosperity Revolution
                </p>
              </div>

              <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Find love while uplifting humanity. <br/>
                Every connection helps <span className="text-primary font-black underline decoration-secondary/30 underline-offset-8">eliminate world poverty</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button size="lg" className="h-16 px-12 rounded-full text-base font-black gradient-bg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform group" asChild>
                  <Link href="/login" className="flex items-center gap-3">
                    Launch Spark
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-base font-bold border-2 hover:bg-muted/50 transition-colors" asChild>
                  <Link href="/donate">Support Mission</Link>
                </Button>
              </div>
              
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-4 opacity-40">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-muted overflow-hidden relative">
                      <Image src={dynamicImages[i % dynamicImages.length].imageUrl} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest">12k+ Sparking 18-65y</p>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end h-full order-1 lg:order-2">
              <div className="relative w-full max-w-lg lg:max-w-2xl aspect-[4/5] lg:aspect-[3/4]">
                <div className="absolute -inset-10 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                
                <div className="relative w-full h-full rounded-[4rem] lg:rounded-[6rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(255,51,102,0.4)] transition-all duration-1000 border-[10px] lg:border-[16px] border-white group bg-muted">
                  {mounted && dynamicImages.map((img, i) => (
                    <div 
                      key={img.id}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-1500 ease-in-out",
                        imageIndex === i ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
                      )}
                    >
                      <Image 
                        src={img.imageUrl} 
                        alt="Global community woman" 
                        fill 
                        className="object-cover transform group-hover:scale-110 transition-transform duration-[10000ms]"
                        priority={i === 0}
                        data-ai-hint="woman portrait"
                      />
                    </div>
                  ))}

                  <div className="absolute top-8 left-8 z-20 bg-white/95 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-primary/10 shadow-2xl flex flex-col gap-0.5 animate-in slide-in-from-left-4 duration-700">
                    <div className="flex items-center gap-3">
                       <Heart className="w-6 h-6 text-primary fill-primary animate-heartbeat" />
                       <span className="text-xs font-black uppercase tracking-widest text-primary">Spark Match</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest leading-none">Global Faces • Pure Hearts</p>
                  </div>

                  <div className="absolute bottom-8 right-8 z-20 flex gap-2">
                    {dynamicImages.map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-500",
                          imageIndex === i ? "w-10 bg-white shadow-lg" : "w-1.5 bg-white/40"
                        )} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl lg:text-3xl font-black mb-16 tracking-tighter uppercase leading-none opacity-80">
              Dating with a <span className="text-primary">Human Pulse</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              <FeatureCard 
                icon={<Zap className="w-8 h-8" />}
                title="AI Powered"
                description="Our neural engine finds mysterious connections based on 'vibe' and shared culture for real happiness."
              />
              <FeatureCard 
                icon={<HeartHandshake className="w-8 h-8" />}
                title="Mandatory Respect"
                description="We are built on pure love. Disrespect is filtered by AI, ensuring a joyful space for every heart."
              />
              <FeatureCard 
                icon={<Briefcase className="w-8 h-8" />}
                title="Prosperity"
                description="Your sparks fund vocational tools. Every successful date is a win for global job creation."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-1 rounded-lg bg-primary/5">
              <Heart className="w-8 h-8 fill-primary text-primary animate-heartbeat" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-2xl tracking-tighter text-primary">I LOVE</span>
              <span className="font-black text-[7px] tracking-[0.4em] text-muted-foreground uppercase">YOU</span>
            </div>
          </div>
          <p className="font-black text-base text-foreground tracking-tight mb-3">© {mounted ? currentYear : "..."} I Love U. Prosperity Revolution.</p>
          <p className="text-[10px] font-medium italic uppercase tracking-widest opacity-60">Respect and Love is Mandatory ❤️ 18-65 Only</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-primary/10 group text-left relative overflow-hidden">
      <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">{title}</h3>
      <p className="text-base text-muted-foreground leading-relaxed font-medium">{description}</p>
    </div>
  );
}

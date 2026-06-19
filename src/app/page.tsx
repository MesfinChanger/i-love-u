"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Globe, Briefcase, TrendingDown, ArrowRight, Star, HeartHandshake, Zap } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

const LOVE_TRANSLATIONS = [
  { lang: "English", text: "I Love U", icon: "❤️" },
  { lang: "Spanish", text: "Te Amo", icon: "💖" },
  { lang: "French", text: "Je t'aime", icon: "✨" },
  { lang: "Japanese", text: "愛してる", icon: "🌸" },
  { lang: "German", text: "Ich liebe dich", icon: "🔥" },
  { lang: "Italian", text: "Ti amo", icon: "🌹" },
  { lang: "Portuguese", text: "Eu te amo", icon: "💘" },
  { lang: "Korean", text: "사랑해", icon: "💎" },
  { lang: "Arabic", text: "أحبك", icon: "🌙" },
  { lang: "Hindi", text: "मैं तुमसे प्यार करता हूँ", icon: "🪔" },
  { lang: "Swahili", text: "Nakupenda", icon: "🦓" },
  { lang: "Zulu", text: "Ngiyakuthanda", icon: "🦁" },
  { lang: "Bengali", text: "আমি তোমাকে ভালোবাসি", icon: "🐅" },
  { lang: "Greek", text: "Σ' αγαπώ", icon: "🏺" }
];

export default function Home() {
  const dynamicImages = useMemo(() => PlaceHolderImages.filter(img => img.id.startsWith('user-') || img.id === 'landing-hero'), []);
  
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
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative shiny-icon p-1.5 rounded-xl bg-primary/5">
              <Heart className="w-8 h-8 fill-primary text-primary animate-heartbeat" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-tighter text-primary">I LOVE</span>
              <span className="font-black text-[8px] tracking-[0.4em] text-muted-foreground ml-0.5 uppercase">YOU</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Button variant="ghost" asChild className="font-black text-[10px] uppercase tracking-widest text-primary hover:bg-primary/5 rounded-full px-6">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="rounded-full px-8 h-10 gradient-bg hover:opacity-90 transition-opacity font-black shadow-xl shadow-primary/20 uppercase text-[10px] tracking-[0.2em]" asChild>
              <Link href="/login">Join the Revolution</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/95 backdrop-blur-3xl text-primary border border-primary/10 shadow-lg relative overflow-hidden group">
                <Globe className="w-6 h-6 animate-spin-slow text-secondary" />
                <div className="flex flex-col items-start leading-tight">
                   <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/60">Global Mission</p>
                   <span className="text-xl font-black transition-all duration-700 uppercase tracking-tighter shiny-text">
                    {mounted ? LOVE_TRANSLATIONS[langIndex].text : "I Love U"} {mounted ? LOVE_TRANSLATIONS[langIndex].icon : "❤️"}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-7xl lg:text-[8rem] font-black leading-none tracking-tighter animate-in zoom-in duration-1000">
                  <span className="shiny-text">I LOVE U</span>
                </h1>
                
                <div className="flex flex-col gap-2">
                  <p className="text-xs lg:text-sm font-black tracking-[0.6em] text-primary uppercase opacity-80">
                    The AI Dating Revolution
                  </p>
                </div>
              </div>

              <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Find Your Heart. Uplifting Worlds. <br/>
                Your happiness ends poverty through <span className="text-primary font-black underline decoration-secondary/30 underline-offset-8">Global Job Creation</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Button size="lg" className="h-16 px-12 rounded-full text-lg font-black gradient-bg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform group" asChild>
                  <Link href="/login" className="flex items-center gap-4">
                    Launch Your Spark
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-lg font-bold border-2 hover:bg-muted/50 transition-colors" asChild>
                  <Link href="/donate">Support Mission</Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <div className="absolute -inset-20 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
                
                {/* Large Dynamic Hero Image */}
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-1000 border-[12px] border-white group bg-muted">
                  {mounted && dynamicImages.map((img, i) => (
                    <div 
                      key={img.id}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                        imageIndex === i ? "opacity-100 z-10" : "opacity-0 z-0"
                      )}
                    >
                      <Image 
                        src={img.imageUrl} 
                        alt="Dynamic Community Spark" 
                        fill 
                        className="object-cover transform group-hover:scale-110 transition-transform duration-10000"
                        priority={i === 0}
                        data-ai-hint={img.imageHint}
                      />
                    </div>
                  ))}

                  {/* Minimized Float Badge on Pic */}
                  <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-primary/10 shadow-xl scale-100 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <Heart className="w-4 h-4 text-primary fill-primary animate-heartbeat" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary">Spark Match</span>
                    </div>
                    <p className="text-[7px] text-muted-foreground font-black uppercase tracking-widest leading-none">Connect with Purpose</p>
                  </div>

                  <div className="absolute bottom-6 right-6 z-20 flex gap-1">
                    {dynamicImages.map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-500",
                          imageIndex === i ? "w-6 bg-white" : "w-1.5 bg-white/40"
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
            <h2 className="text-3xl lg:text-4xl font-black mb-16 tracking-tighter uppercase leading-none">
              Dating with a <span className="text-primary">Human Pulse</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              <FeatureCard 
                icon={<Zap className="w-8 h-8" />}
                title="AI Powered Matching"
                description="Our neural engine finds mysterious connections based on shared cultural interests and your 'vibe' for real happiness."
              />
              <FeatureCard 
                icon={<HeartHandshake className="w-8 h-8" />}
                title="Respect is Mandatory"
                description="We are a dating community built on pure love. Disrespect is filtered by AI, ensuring a joyful space for every heart."
              />
              <FeatureCard 
                icon={<Briefcase className="w-8 h-8" />}
                title="Love Creates Jobs"
                description="Your sparks fund vocational tools for entrepreneurs. Every successful date is a win for global prosperity."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="p-2 rounded-xl bg-primary/5">
              <Heart className="w-10 h-10 fill-primary text-primary animate-heartbeat" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-2xl tracking-tighter text-primary">I LOVE</span>
              <span className="font-black text-[7px] tracking-[0.5em] text-muted-foreground uppercase">YOU</span>
            </div>
          </div>
          <p className="font-black text-base text-foreground tracking-tight mb-3">© {mounted ? currentYear : "..."} I Love U. The Global Dating & Prosperity Revolution.</p>
          <p className="text-[10px] font-medium italic mb-8">Respect and Love is Mandatory ❤️ Ending World Poverty Together.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-primary/10 group text-left relative overflow-hidden">
      <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">{title}</h3>
      <p className="text-base text-muted-foreground leading-relaxed font-medium">{description}</p>
    </div>
  );
}

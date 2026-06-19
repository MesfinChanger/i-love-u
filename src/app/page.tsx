
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Globe, Briefcase, TrendingDown, ArrowRight, Star, HeartHandshake, Zap } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  const heroImage = PlaceHolderImages.find(img => img.id === 'landing-hero');
  const [langIndex, setLangIndex] = useState(0);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear());
    const interval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % LOVE_TRANSLATIONS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative shiny-icon p-3 rounded-[1.8rem] bg-primary/5">
              <Heart className="w-20 h-20 fill-primary text-primary animate-heartbeat" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-5xl tracking-tighter text-primary">I LOVE</span>
              <span className="font-black text-lg tracking-[0.5em] text-muted-foreground ml-1">YOU</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Button variant="ghost" asChild className="font-black text-xs uppercase tracking-widest text-primary hover:bg-primary/5 rounded-full px-6">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="rounded-full px-10 h-14 gradient-bg hover:opacity-90 transition-opacity font-black shadow-xl shadow-primary/20 uppercase text-xs tracking-[0.2em]" asChild>
              <Link href="/login">Join the Revolution</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24">
        <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12 text-center lg:text-left z-10">
              {/* Maximized Language Bar */}
              <div className="inline-flex items-center gap-8 px-12 py-8 rounded-[3.5rem] bg-white/95 backdrop-blur-3xl text-primary border-4 border-primary/10 shadow-[0_30px_100px_-10px_rgba(255,51,102,0.2)] relative overflow-hidden group w-full lg:w-auto">
                <Globe className="w-12 h-12 animate-spin-slow text-secondary" />
                <div className="flex flex-col items-start leading-tight">
                   <p className="text-xs font-black uppercase tracking-[0.5em] text-muted-foreground/60 mb-2">Global Mission Reach</p>
                   <span className="text-3xl lg:text-5xl font-black transition-all duration-700 ease-in-out uppercase tracking-tighter shiny-text">
                    {mounted ? LOVE_TRANSLATIONS[langIndex].text : "I Love U"} {mounted ? LOVE_TRANSLATIONS[langIndex].icon : "❤️"}
                  </span>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                   <Sparkles className="w-10 h-10" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-[18vw] lg:text-[15rem] font-black leading-none tracking-tighter animate-in zoom-in duration-1000">
                  <span className="shiny-text drop-shadow-[0_20px_40px_rgba(255,51,102,0.3)]">I LOVE U</span>
                </h1>
                <div className="flex flex-col gap-2 ml-4">
                  <p className="text-sm lg:text-lg font-black tracking-[0.6em] text-primary uppercase opacity-80">
                    The AI Dating Revolution
                  </p>
                  <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground uppercase opacity-40">
                    U + Love = Prosperity
                  </p>
                </div>
              </div>

              <p className="text-3xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Find Your Heart. Uplifting Worlds. <br/>
                The world's most attractive dating platform with a mandatory mission to <span className="text-primary font-black underline decoration-secondary/30 underline-offset-8">Eliminate Poverty Forever</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start">
                <Button size="lg" className="h-24 px-20 rounded-full text-2xl font-black gradient-bg shadow-2xl shadow-primary/40 hover:scale-105 transition-transform group" asChild>
                  <Link href="/login" className="flex items-center gap-4">
                    Launch Your Spark
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-24 px-16 rounded-full text-2xl font-bold border-4 hover:bg-muted/50 transition-colors" asChild>
                  <Link href="/donate">Support Mission</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                <Star className="w-5 h-5 fill-secondary text-secondary animate-pulse" />
                Dating that Dismantles Poverty
                <Star className="w-5 h-5 fill-secondary text-secondary animate-pulse" />
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm lg:max-w-md">
                <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
                
                {/* Minimized Spark Match Badge Overlay */}
                <div className="absolute -top-8 -left-8 z-20 inline-flex items-center gap-3 bg-white/95 backdrop-blur-3xl p-4 pr-8 rounded-[2rem] border-2 border-white shadow-xl animate-in zoom-in-50 duration-1000">
                  <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <Heart className="w-6 h-6 fill-white animate-heartbeat" />
                  </div>
                  <div className="text-left leading-none">
                    <p className="font-black text-lg tracking-tighter">Spark Match</p>
                    <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60 mt-1">Connect with Purpose</p>
                  </div>
                </div>
                
                <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] rotate-3 hover:rotate-0 transition-transform duration-1000 border-[15px] border-white">
                  {heroImage && (
                    <Image 
                      src={heroImage.imageUrl} 
                      alt="Finding Love on I Love U" 
                      fill 
                      className="object-cover"
                      priority
                      data-ai-hint="happy couple"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-6xl font-black mb-20 tracking-tighter uppercase leading-none">
              Dating with a <span className="text-primary">Human Pulse</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <FeatureCard 
                icon={<Zap className="w-14 h-14" />}
                title="AI Powered Matching"
                description="Our neural engine finds mysterious connections based on shared cultural interests and your 'vibe' for real happiness."
              />
              <FeatureCard 
                icon={<HeartHandshake className="w-14 h-14" />}
                title="Respect is Mandatory"
                description="We are a dating community built on pure love. Disrespect is filtered by AI, ensuring a joyful space for every heart."
              />
              <FeatureCard 
                icon={<Briefcase className="w-14 h-14" />}
                title="Love Creates Jobs"
                description="Your sparks fund vocational tools for entrepreneurs. Every successful date is a win for global prosperity and ending poverty."
              />
            </div>
          </div>
        </section>

        <section className="py-40 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-primary/10 opacity-30 pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-5xl mx-auto space-y-16">
              <h2 className="text-7xl lg:text-[10rem] font-black tracking-tighter uppercase leading-[0.8] mb-8">
                Love is the <br/>
                <span className="shiny-text">Ultimate Cure</span>
              </h2>
              <p className="text-3xl text-white/70 leading-relaxed font-medium max-w-3xl mx-auto">
                Join the platform where your happiness ends world poverty. By connecting the world's hearts, we build sustainable livelihoods in every village, city, and rural community.
              </p>
              <div className="pt-8">
                <Button size="lg" className="h-24 px-20 rounded-full text-2xl font-black gradient-bg shadow-2xl shadow-primary/40 hover:scale-105 transition-transform group" asChild>
                  <Link href="/login">Find Your Spark Room</Link>
                </Button>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 pt-10">
                A Mission of Love and Prosperity • Reaching Every Heart
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-32 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="p-4 rounded-[2rem] bg-primary/5">
              <Heart className="w-24 h-24 fill-primary text-primary animate-heartbeat" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-6xl tracking-tighter text-primary">I LOVE</span>
              <span className="font-black text-2xl tracking-[0.5em] text-muted-foreground">YOU</span>
            </div>
          </div>
          <p className="font-black text-xl text-foreground tracking-tight mb-4">© {mounted ? currentYear : "..."} I Love U. The Global Dating & Prosperity Revolution.</p>
          <p className="text-sm font-medium italic mb-10">Respect and Love is Mandatory ❤️ Ending World Poverty Together.</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-[11px] font-black uppercase tracking-[0.4em]">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Shield</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Dating Pledge</Link>
            <Link href="/donate" className="hover:text-primary transition-colors">Mission Hub</Link>
            <Link href="/profile" className="hover:text-primary transition-colors">Heart Profile</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-16 rounded-[5rem] shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-primary/10 group text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
         {icon}
      </div>
      <div className="w-28 h-28 rounded-[2.5rem] bg-accent flex items-center justify-center text-primary mb-12 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-4xl font-black mb-8 tracking-tighter">{title}</h3>
      <p className="text-xl text-muted-foreground leading-relaxed font-medium">{description}</p>
    </div>
  );
}

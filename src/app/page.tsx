"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Globe, Briefcase, TrendingDown, ArrowRight, Star, HeartHandshake, HandHelping } from 'lucide-react';
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
  { lang: "Hindi", text: "मैं तुमसे प्यार करता हूँ", icon: "🪔" }
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'landing-hero');
  const [langIndex, setLangIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % LOVE_TRANSLATIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative shiny-icon p-2 rounded-2xl bg-primary/5">
              <Heart className="w-16 h-16 fill-primary text-primary animate-pulse" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-4xl tracking-tighter text-primary">I LOVE</span>
              <span className="font-black text-base tracking-[0.4em] text-muted-foreground">YOU</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="font-bold text-xs uppercase tracking-widest">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="rounded-full px-8 h-12 gradient-bg hover:opacity-90 transition-opacity font-bold shadow-lg uppercase text-xs tracking-widest" asChild>
              <Link href="/login">Join the Revolution</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24">
        <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm text-primary text-xs font-black border border-primary/10 shadow-sm">
                <Globe className="w-4 h-4 animate-spin-slow" />
                <span className="transition-all duration-500 ease-in-out uppercase tracking-[0.2em]">
                  {LOVE_TRANSLATIONS[langIndex].text} {LOVE_TRANSLATIONS[langIndex].icon}
                </span>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-[18vw] lg:text-[14rem] font-black leading-none tracking-tighter animate-in zoom-in duration-1000">
                  <span className="shiny-text drop-shadow-[0_20px_40px_rgba(255,51,102,0.4)]">I LOVE U</span>
                </h1>
                <p className="text-lg lg:text-xl font-black tracking-[0.4em] text-muted-foreground uppercase opacity-60">
                  U + Love = <span className="text-primary/70">Prosperity</span>
                </p>
              </div>

              <p className="text-2xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                Connect Hearts. Uplifting Worlds. <br/>
                We are on a mandatory mission to <span className="text-primary font-black underline decoration-primary/20">Eliminate Poverty</span> through global job creation. 
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Button size="lg" className="h-20 px-16 rounded-full text-xl font-black gradient-bg shadow-2xl shadow-primary/40 hover:scale-105 transition-transform group" asChild>
                  <Link href="/login" className="flex items-center gap-3">
                    Spark Love Free
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-20 px-12 rounded-full text-xl font-bold border-2 hover:bg-muted/50 transition-colors" asChild>
                  <Link href="/donate">U can Help</Link>
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                Ending Hardship Worldwide
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
              <div className="relative aspect-square rounded-[5rem] overflow-hidden shadow-[0_40px_100px_-15px_rgba(0,0,0,0.3)] rotate-3 hover:rotate-0 transition-transform duration-1000 border-[20px] border-white">
                {heroImage && (
                  <Image 
                    src={heroImage.imageUrl} 
                    alt="Prosperity through Love" 
                    fill 
                    className="object-cover"
                    priority
                  />
                )}
              </div>
              <div className="absolute -bottom-12 -left-12 bg-white p-8 rounded-[3rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] border flex items-center gap-6 animate-bounce">
                <div className="w-20 h-20 rounded-[2rem] gradient-bg flex items-center justify-center text-white shadow-xl shiny-icon">
                  <TrendingDown className="w-12 h-12" />
                </div>
                <div>
                  <p className="font-black text-2xl tracking-tighter">End Poverty</p>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Global Job Mission</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-black mb-16 tracking-tighter uppercase">Why I Love U?</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <FeatureCard 
                icon={<HeartHandshake className="w-12 h-12" />}
                title="Respect is Mandatory"
                description="We are a community built on pure love. Any sign of disrespect is filtered by AI, ensuring a safe, joyful space for every heart."
              />
              <FeatureCard 
                icon={<Briefcase className="w-12 h-12" />}
                title="Create Jobs"
                description="We don't just give help; we create opportunities. Your involvement funds vocational tools for entrepreneurs in rural and city areas."
              />
              <FeatureCard 
                icon={<HandHelping className="w-12 h-12" />}
                title="Eliminate Hardship"
                description="Our ultimate KPI is the number of families we lift out of poverty. Every connection here is a spark for global prosperity."
              />
            </div>
          </div>
        </section>

        <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-primary/5 opacity-20 pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-12">
              <h2 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase leading-none">
                Love is the <br/>
                <span className="shiny-text">Ultimate Cure</span>
              </h2>
              <p className="text-2xl text-white/70 leading-relaxed font-medium max-w-2xl mx-auto">
                By connecting the world's hearts, we unlock the resources to build sustainable livelihoods in every village and city. Join the platform where your happiness ends world poverty.
              </p>
              <div className="pt-8">
                <Button size="lg" className="h-20 px-16 rounded-full text-xl font-black gradient-bg shadow-2xl shadow-primary/40 hover:scale-105 transition-transform group" asChild>
                  <Link href="/login">Launch Your Spark</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Heart className="w-20 h-20 fill-primary text-primary" />
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-5xl tracking-tighter text-primary">I LOVE</span>
              <span className="font-black text-xl tracking-[0.4em] text-muted-foreground">YOU</span>
            </div>
          </div>
          <p className="font-black text-lg text-foreground tracking-tight">© {new Date().getFullYear()} I Love U. Ending world poverty through the power of connection.</p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-8 text-[10px] font-black uppercase tracking-[0.3em]">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Shield</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Respect Pledge</Link>
            <Link href="/donate" className="hover:text-primary transition-colors">Mission Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-12 rounded-[4rem] shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-primary/10 group text-left">
      <div className="w-24 h-24 rounded-[2rem] bg-muted/30 flex items-center justify-center text-primary mb-10 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-3xl font-black mb-6 tracking-tighter">{title}</h3>
      <p className="text-lg text-muted-foreground leading-relaxed font-medium">{description}</p>
    </div>
  );
}

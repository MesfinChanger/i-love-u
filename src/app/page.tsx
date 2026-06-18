"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, MessageCircle, ShieldCheck, Zap, Globe, Smile, MapPin, HandHeart, Briefcase, TrendingDown } from 'lucide-react';
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "I Love U",
    "url": "https://spark-dating.web.app",
    "description": "I Love U: AI-powered dating and cultural exchange dedicated to eliminating poverty through global job creation.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://spark-dating.web.app/discover?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-12 h-12 fill-primary text-primary animate-pulse" />
            <div className="flex flex-col leading-none">
              <span className="font-black text-3xl tracking-tighter text-primary">I LOVE</span>
              <span className="font-black text-sm tracking-[0.4em] text-muted-foreground">YOU</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="font-bold">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="rounded-full px-8 h-12 gradient-bg hover:opacity-90 transition-opacity font-bold shadow-lg" asChild>
              <Link href="/login">Join Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24">
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-primary/10 text-primary text-base font-black border border-primary/20 shadow-sm">
                <Globe className="w-5 h-5 animate-spin-slow" />
                <span className="transition-all duration-500 ease-in-out min-w-[180px] uppercase tracking-widest">
                  {LOVE_TRANSLATIONS[langIndex].text} {LOVE_TRANSLATIONS[langIndex].icon}
                </span>
              </div>
              <h1 className="text-7xl lg:text-9xl font-black leading-tight tracking-tighter">
                Eliminate <br />
                <span className="gradient-text">Poverty</span>
              </h1>
              <p className="text-2xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                Our mission is to reach every community and end economic hardship. We use our platform to drive **global job creation**, building sustainable futures for rural and urban areas worldwide.
                <span className="block font-black text-primary mt-6 uppercase tracking-[0.3em] text-xs">Poverty Elimination is Mandatory ❤️</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Button size="lg" className="h-20 px-16 rounded-full text-xl font-black gradient-bg shadow-2xl shadow-primary/40 hover:scale-105 transition-transform" asChild>
                  <Link href="/login">Start Loving Free</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-20 px-12 rounded-full text-xl font-bold border-2" asChild>
                  <Link href="/donate">Support Our Mission</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
              <div className="relative aspect-square rounded-[5rem] overflow-hidden shadow-[0_40px_100px_-15px_rgba(0,0,0,0.3)] rotate-3 hover:rotate-0 transition-transform duration-1000 border-[20px] border-white">
                {heroImage && (
                  <Image 
                    src={heroImage.imageUrl} 
                    alt="Ending World Poverty" 
                    fill 
                    className="object-cover"
                    priority
                    data-ai-hint="prosperous diverse communities"
                  />
                )}
              </div>
              <div className="absolute -bottom-12 -left-12 bg-white p-8 rounded-[3rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] border flex items-center gap-6 animate-bounce">
                <div className="w-20 h-20 rounded-[2rem] gradient-bg flex items-center justify-center text-white shadow-xl">
                  <TrendingDown className="w-12 h-12" />
                </div>
                <div>
                  <p className="font-black text-2xl tracking-tighter">Ending Poverty</p>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Global Economic Growth</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-accent/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-black mb-16 tracking-tighter">A Mission to Change the World</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <FeatureCard 
                icon={<Globe className="w-12 h-12" />}
                title="Global Outreach"
                description="We strive to reach every remote village and bustling city center to identify and solve economic challenges through connection."
              />
              <FeatureCard 
                icon={<Briefcase className="w-12 h-12" />}
                title="Jobs, Not Just Help"
                description="We believe in sustainable livelihoods. Our platform funds vocational training and tools that help people lift themselves out of poverty."
              />
              <FeatureCard 
                icon={<HandHeart className="w-12 h-12" />}
                title="Eliminate Poverty"
                description="Our ultimate goal is a world without economic suffering. Every Spark connection is an investment in this global mission."
              />
            </div>
          </div>
        </section>

        <section className="py-24 bg-white border-y overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl font-black tracking-tighter uppercase">Building a World Free from Poverty</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                From rural crafts to city services, **I Love U** provides the bridge. By connecting people and funding jobs, we are dismantling the barriers of poverty one community at a time.
              </p>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-8 bg-muted/20 rounded-[2rem] text-center border border-dashed">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h4 className="font-black uppercase tracking-widest text-sm">Rural Prosperity</h4>
                 </div>
                 <div className="p-8 bg-muted/20 rounded-[2rem] text-center border border-dashed">
                    <Briefcase className="w-8 h-8 text-secondary mx-auto mb-4" />
                    <h4 className="font-black uppercase tracking-widest text-sm">City Opportunity</h4>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Heart className="w-16 h-16 fill-primary text-primary" />
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-4xl tracking-tighter text-primary">I LOVE</span>
              <span className="font-black text-base tracking-[0.4em] text-muted-foreground">YOU</span>
            </div>
          </div>
          <p className="font-black text-lg text-foreground tracking-tight">© {new Date().getFullYear()} I Love U. A global mission to eliminate poverty through job creation.</p>
          <div className="flex justify-center gap-10 mt-8 text-xs font-black uppercase tracking-[0.3em]">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/donate" className="hover:text-primary transition-colors">Eliminate Poverty Mission</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-12 rounded-[4rem] shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-primary/10 group text-left">
      <div className="w-24 h-24 rounded-[2rem] bg-accent flex items-center justify-center text-primary mb-10 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-3xl font-black mb-6 tracking-tighter">{title}</h3>
      <p className="text-lg text-muted-foreground leading-relaxed font-medium">{description}</p>
    </div>
  );
}

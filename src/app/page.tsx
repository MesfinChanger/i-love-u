
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, MessageCircle, ShieldCheck, Zap, Globe, Smile } from 'lucide-react';
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
    "name": "I Love U Dating",
    "url": "https://spark-dating.web.app",
    "description": "I Love U: AI-powered dating and cultural exchange with a mandatory respect policy.",
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
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Heart className="w-8 h-8 fill-primary text-primary" />
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-tighter text-primary">I LOVE</span>
              <span className="font-black text-[10px] tracking-[0.4em] text-muted-foreground">YOU</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="rounded-full px-6 gradient-bg hover:opacity-90 transition-opacity" asChild>
              <Link href="/login">Join Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-black border border-primary/20 shadow-sm">
                <Globe className="w-4 h-4 animate-spin-slow" />
                <span className="transition-all duration-500 ease-in-out min-w-[150px] uppercase tracking-widest">
                  {LOVE_TRANSLATIONS[langIndex].text} {LOVE_TRANSLATIONS[langIndex].icon}
                </span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-black leading-tight tracking-tighter">
                Find Your <br />
                <span className="gradient-text">True Happiness</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                Connect with hearts that beat like yours. I Love U is the community where every connection is rooted in joy.
                <span className="block font-black text-primary mt-4 uppercase tracking-[0.2em] text-[10px]">Respect & Love is Mandatory ❤️</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="h-16 px-12 rounded-full text-lg font-black gradient-bg shadow-2xl shadow-primary/40 hover:scale-105 transition-transform" asChild>
                  <Link href="/login">Start Loving Free</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-lg font-bold border-2" asChild>
                  <Link href="/login">Our Mission</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
              <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 border-[16px] border-white">
                {heroImage && (
                  <Image 
                    src={heroImage.imageUrl} 
                    alt="Happy People" 
                    fill 
                    className="object-cover"
                    priority
                    data-ai-hint="happy couple"
                  />
                )}
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-2xl border flex items-center gap-4 animate-bounce">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg">
                  <Heart className="w-8 h-8 fill-white" />
                </div>
                <div>
                  <p className="font-black text-lg tracking-tighter">It's a Connection!</p>
                  <p className="text-xs text-muted-foreground font-medium">Happiness found with Alex</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-accent/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-black mb-12 tracking-tighter">Designed for Real Happiness</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Heart className="w-8 h-8 fill-primary" />}
                title="Respect is Mandatory"
                description="We are built on kindness. Disrespect is never an option; love for all members is our first law."
              />
              <FeatureCard 
                icon={<Sparkles className="w-8 h-8" />}
                title="AI Happiness Bridge"
                description="Smart icebreakers and cultural exchange tools to help you find meaning in every conversation."
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-8 h-8" />}
                title="Verified Safe Space"
                description="Strict 18+ verification and real-time AI moderation to ensure your joy is never interrupted."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-1 mb-6">
            <Heart className="w-8 h-8 fill-primary text-primary" />
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-xl tracking-tighter text-primary">I LOVE</span>
              <span className="font-black text-[10px] tracking-[0.4em] text-muted-foreground">YOU</span>
            </div>
          </div>
          <p className="font-bold text-sm">© {new Date().getFullYear()} I Love U. A 100% free community for finding true happiness.</p>
          <div className="flex justify-center gap-6 mt-6 text-[10px] font-black uppercase tracking-[0.2em]">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/donate" className="hover:text-primary transition-colors">Support Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-primary/10 group text-left">
      <div className="w-20 h-20 rounded-[1.5rem] bg-accent flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tighter">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-medium">{description}</p>
    </div>
  );
}

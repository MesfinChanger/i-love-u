
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, MessageCircle, ShieldCheck, Zap, Globe } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const LOVE_TRANSLATIONS = [
  { lang: "English", text: "Spark Love", icon: "❤️" },
  { lang: "Spanish", text: "Chispa de Amor", icon: "💖" },
  { lang: "French", text: "Étincelle d'Amour", icon: "✨" },
  { lang: "Japanese", text: "愛の火花", icon: "🌸" },
  { lang: "German", text: "Funke der Liebe", icon: "🔥" },
  { lang: "Italian", text: "Scintilla d'Amore", icon: "🌹" },
  { lang: "Portuguese", text: "Faísca de Amor", icon: "💘" },
  { lang: "Korean", text: "사랑의 불꽃", icon: "💎" }
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
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-primary">
            <Heart className="w-8 h-8 fill-primary" />
            <span>SPARK</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="rounded-full px-6 gradient-bg hover:opacity-90 transition-opacity" asChild>
              <Link href="/login">Join Now</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                <Globe className="w-4 h-4 animate-spin-slow" />
                <span className="transition-all duration-500 ease-in-out">
                  {LOVE_TRANSLATIONS[langIndex].text} {LOVE_TRANSLATIONS[langIndex].icon}
                </span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-black leading-tight tracking-tighter">
                Find Your <br />
                <span className="gradient-text">Perfect Match</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Connect with people who share your sparks. Real connections, AI-powered matching, and safe messaging in any language.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="h-14 px-10 rounded-full text-lg font-bold gradient-bg shadow-xl shadow-primary/20" asChild>
                  <Link href="/login">Start Matching</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-full text-lg font-bold border-2" asChild>
                  <Link href="/login">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border-[12px] border-white">
                {heroImage && (
                  <Image 
                    src={heroImage.imageUrl} 
                    alt="Couple" 
                    fill 
                    className="object-cover"
                    priority
                  />
                )}
              </div>
              {/* Floating Match Card Mock */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-bounce">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">It's a Spark!</p>
                  <p className="text-xs text-muted-foreground">You and Alex liked each other</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-accent/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl font-black mb-4">Why Spark is Different</h2>
              <p className="text-muted-foreground text-lg">We use advanced technology to ensure you find meaningful connections, not just swipes.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap className="w-8 h-8" />}
                title="AI Matching"
                description="Our neural networks analyze interests and personality traits to suggest highly compatible matches."
              />
              <FeatureCard 
                icon={<MessageCircle className="w-8 h-8" />}
                title="Smart Chat"
                description="Get AI-generated icebreakers based on your match's profile to never run out of things to say."
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-8 h-8" />}
                title="Verified Only"
                description="Strict photo verification process ensures every profile you see is the real deal."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 font-black text-2xl text-primary mb-6">
            <Heart className="w-6 h-6 fill-primary" />
            <span>SPARK</span>
          </div>
          <p>© {new Date().getFullYear()} Spark Dating. Made with love for real people.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow border border-transparent hover:border-primary/10 group">
      <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

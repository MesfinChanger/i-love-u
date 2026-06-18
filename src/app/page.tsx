"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, MessageCircle, ShieldCheck, Zap, Globe, Smile } from 'lucide-react';
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
  { lang: "Korean", text: "사랑의 불꽃", icon: "💎" },
  { lang: "Arabic", text: "شرارة الحب", icon: "🌙" },
  { lang: "Hindi", text: "प्यार की चिंगारी", icon: "🪔" }
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
              <Link href="/login">Join Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                <Globe className="w-4 h-4 animate-spin-slow" />
                <span className="transition-all duration-500 ease-in-out min-w-[150px]">
                  {LOVE_TRANSLATIONS[langIndex].text} {LOVE_TRANSLATIONS[langIndex].icon}
                </span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-black leading-tight tracking-tighter">
                Find Your <br />
                <span className="gradient-text">Perfect Match</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Connect with people who share your sparks. Real connections, AI-powered matching, and safe messaging. 
                <span className="block font-bold text-primary mt-2 uppercase tracking-widest text-xs">Respect & Love is Mandatory ❤️</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="h-14 px-10 rounded-full text-lg font-bold gradient-bg shadow-xl shadow-primary/20" asChild>
                  <Link href="/login">Start Matching Free</Link>
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
                    data-ai-hint="happy couple"
                  />
                )}
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-bounce">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">It's a Spark!</p>
                  <p className="text-xs text-muted-foreground">You and Alex matched</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-accent/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-black mb-12">Designed for Real People</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Smile className="w-8 h-8" />}
                title="Respect Mandatory"
                description="We prioritize kindness. Disrespect is not allowed; love and respect for all members is required."
              />
              <FeatureCard 
                icon={<MessageCircle className="w-8 h-8" />}
                title="Free Smart Chat"
                description="Personalized icebreakers to help you start conversations without any hidden costs."
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-8 h-8" />}
                title="18+ Verified"
                description="A strictly adult-only space with AI-moderated content for your safety and peace of mind."
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
          <p>© {new Date().getFullYear()} Spark Dating. A 100% free community for everyone.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-primary/10 group">
      <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

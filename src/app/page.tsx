
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Globe, 
  ArrowRight, 
  Zap, 
  Briefcase, 
  ShieldCheck, 
  Sparkles,
  Languages,
  Check,
  Loader2,
  Camera,
  TrendingUp,
  MessageCircle,
  Star,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { SUPPORTED_LANGUAGES } from '@/lib/world-data';
import { useUser, useFirestore, useDoc, useFirebaseApp } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useToast } from '@/hooks/use-toast';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1600",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1600",
];

export default function Home() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const app = useFirebaseApp();
  const router = useRouter();
  const { toast } = useToast();
  const { language, setLanguage, t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [langIndex, setLangIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState('');
  const [heroImage, setHeroImage] = useState("");
  const [pageOwnerId, setPageOwnerId] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Profile data for Admin check
  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  // Load Settings
  useEffect(() => {
    if (!db) return;
    const loadSettings = async () => {
      const docRef = doc(db, "siteSettings", "homepage");
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        setHeroImage(data.heroImageUrl || "");
        setPageOwnerId(data.ownerId || "");
      }
    };
    loadSettings();
  }, [db]);

  const canEdit = profile?.isAdmin || (user?.uid === pageOwnerId && pageOwnerId !== "");

  // Immediate Policy Bridge Protocol
  useEffect(() => {
    if (user && !userLoading) {
      const hasAccepted = localStorage.getItem('iloveu_policy_accepted') === 'true';
      if (hasAccepted) {
        router.push('/discover');
      } else {
        router.push('/policy/agree');
      }
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear().toString());
    
    const imageInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => {
      clearInterval(imageInterval);
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !app || !db) return;

    setIsUploading(true);
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `hero-images/${Date.now()}-${file.name}`);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "siteSettings", "homepage"), {
        heroImageUrl: url,
        updatedAt: serverTimestamp(),
      });

      setHeroImage(url);
      toast({ title: "Hero Updated", description: "The vision has been updated globally. ✨" });
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not update hero image." });
    } finally {
      setIsUploading(false);
    }
  };

  if (!mounted) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Heart className="w-12 h-12 text-primary animate-heartbeat fill-primary" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-10 h-10 fill-primary text-primary animate-heartbeat" />
            <span className="font-black text-[16px] tracking-[0.5em] text-primary uppercase ml-1">I LOVE U</span>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-primary/5 h-10 px-3 gap-2 rounded-full transition-colors" aria-label="Select Language">
                  <Languages className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl p-2 border-none shadow-2xl mr-4 max-h-80 overflow-y-auto" align="end">
                {(SUPPORTED_LANGUAGES || []).map((lang) => (
                  <DropdownMenuItem 
                    key={lang.name} 
                    onClick={() => setLanguage(lang.name)}
                    className={cn(
                      "rounded-xl py-3 px-4 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-between",
                      language === lang.name ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="flex-grow">{lang.name}</span>
                      <span className="text-[10px] opacity-40 font-medium">{lang.native}</span>
                    </div>
                    {language === lang.name && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors hidden sm:block">Login</Link>
            <Button size="sm" className="rounded-full h-10 px-6 gradient-bg font-black uppercase text-[9px] tracking-widest shadow-xl" asChild>
              <Link href="/login">Launch Spark</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* LEFT CONTENT */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-pink-100 text-pink-600 font-black text-[10px] uppercase tracking-widest shadow-sm">
                ❤️ GLOBAL COMMUNITY VERIFIED
              </div>

              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                  <span className="text-slate-900">Spark </span>
                  <span className="text-primary">Love.</span>
                  <br />
                  <span className="gradient-text">End Poverty.</span>
                </h1>

                <p className="mt-6 text-xl text-slate-600 max-w-xl leading-relaxed font-medium">
                  Connecting hearts across every city and village to create opportunities, friendships, and positive change through global job creation.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <Button size="lg" className="h-20 px-10 rounded-[2rem] text-xl font-black gradient-bg shadow-2xl shadow-primary/20 hover:scale-105 transition-transform group" asChild>
                  <Link href="/login" className="flex items-center gap-3">
                    Launch Spark 🚀
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button variant="outline" size="lg" className="h-20 px-10 rounded-[2rem] text-xl font-bold border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all" asChild>
                  <Link href="/donate">Support Mission</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
                <StatCard number="18.2K+" label="Members" icon={Users} />
                <StatCard number="192" label="Countries" icon={Globe} />
                <StatCard number="47.6K+" label="Moments" icon={MessageCircle} />
                <StatCard number="12.3K+" label="Jobs" icon={Briefcase} />
              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="relative group">
              {canEdit && (
                <div className="absolute top-4 right-4 z-30">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button 
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="rounded-full h-10 px-4 bg-white/90 backdrop-blur-md shadow-xl text-[10px] font-black uppercase tracking-widest gap-2"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                    Change Photo
                  </Button>
                </div>
              )}

              <div className="overflow-hidden rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] bg-slate-100 aspect-[4/5] relative">
                <Image 
                  src={heroImage || HERO_IMAGES[imageIndex]} 
                  alt="Global Community Vision" 
                  fill 
                  className="object-cover transition-all duration-1000 ease-in-out group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Floating Cards */}
              <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white/50 animate-bounce duration-[5000ms] hover:animate-none transition-all">
                <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-1">Live Community</p>
                <div className="text-4xl font-black tracking-tighter">18.2K+</div>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-green-600 font-black text-[10px] uppercase tracking-widest">Online Now</span>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white/50 transition-transform hover:scale-110">
                <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-1">Global Impact</p>
                <div className="text-4xl font-black tracking-tighter">192</div>
                <div className="flex items-center gap-2 mt-1">
                   <Globe className="w-4 h-4 text-blue-500 animate-spin-slow" />
                   <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Countries Reach</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RESPECT BANNER */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-pink-50 via-white to-orange-50 rounded-[4rem] p-12 md:p-20 flex flex-col md:flex-row justify-between items-center gap-10 border border-primary/5 shadow-inner">
            <div className="text-center md:text-left space-y-4">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                 <ShieldCheck className="w-10 h-10 text-primary" />
                 <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                   Respect is <span className="text-primary">Mandatory.</span>
                 </h2>
              </div>
              <p className="text-slate-600 text-xl font-medium italic max-w-xl">
                "We celebrate kindness, inclusion, and positive connections in every city and village."
              </p>
            </div>

            <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-2 font-black uppercase text-xs tracking-widest gap-2 group" asChild>
              <Link href="/policy/agree">
                Read Full Policy
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t bg-slate-50">
        <div className="container mx-auto px-6 text-center space-y-6">
          <div className="flex items-center justify-center gap-3 opacity-70">
            <Heart className="w-10 h-10 fill-primary text-primary" />
            <span className="font-black text-[12px] tracking-[0.5em] text-primary uppercase">I LOVE U</span>
          </div>
          <div className="space-y-1">
            <p className="font-black text-[10px] tracking-[0.3em] uppercase text-slate-400">© {currentYear} • Reaching Every Heart</p>
            <p className="text-[9px] font-bold italic uppercase tracking-widest opacity-40 text-slate-400">Respect & Love is Mandatory ❤️ Eliminating Poverty Globally</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ number, label, icon: Icon }: { number: string; label: string; icon: any }) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] border border-slate-50 p-6 space-y-2 group hover:scale-105 transition-transform duration-500">
      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-2 group-hover:rotate-6 transition-transform">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-3xl font-black tracking-tighter text-primary">{number}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
    </div>
  );
}


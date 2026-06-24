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
  Camera
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { SUPPORTED_LANGUAGES } from '@/lib/world-data';
import { useUser, useFirestore, useDoc, useFirebaseApp } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useToast } from '@/hooks/use-toast';

const LOVE_TRANSLATIONS = [
  { lang: "English", text: "I Love U", icon: "❤️" },
  { lang: "Spanish", text: "Te Amo", icon: "💖" },
  { lang: "French", text: "Je t'aime", icon: "✨" },
  { lang: "Japanese", text: "愛してる", icon: "🌸" },
  { lang: "Swahili", text: "Nakupenda", icon: "🦓" }
];

export default function Home() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const app = useFirebaseApp();
  const router = useRouter();
  const { toast } = useToast();
  const { language, setLanguage, t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const dynamicImages = useMemo(() => (PlaceHolderImages || []).filter(img => img.id.startsWith('user-')), []);
  
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
    
    const langInterval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % LOVE_TRANSLATIONS.length);
    }, 4000);

    const imageInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % (dynamicImages.length || 1));
    }, 6000);

    return () => {
      clearInterval(langInterval);
      clearInterval(imageInterval);
    };
  }, [dynamicImages.length]);

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

  const heroTitle = useMemo(() => t('home.heroTitle') || "Spark Love. End Poverty.", [t]);
  const metricTitle = useMemo(() => t('home.metricTitle') || "Happiness is the Only Metric.", [t]);

  if (!mounted) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Heart className="w-12 h-12 text-primary animate-heartbeat fill-primary" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <header className="fixed top-0 z-50 w-full bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-10 h-10 fill-primary text-primary animate-heartbeat" />
            <span className="font-black text-[16px] tracking-[0.5em] text-primary uppercase ml-1">I LOVE U</span>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10 h-10 px-3 gap-2 rounded-full transition-colors bg-black/20 backdrop-blur-md" aria-label="Select Language">
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

            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors hidden sm:block">Login</Link>
            <Button size="sm" className="rounded-full h-10 px-6 gradient-bg font-black uppercase text-[9px] tracking-widest shadow-xl border border-white/10" asChild>
              <Link href="/login">{t('login.launch')}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative h-[100vh] w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* Dynamic Hero Image with Fallback Carousel */}
            {heroImage ? (
              <div className="absolute inset-0 scale-105">
                <Image 
                  src={heroImage} 
                  alt="Dynamic Hero" 
                  fill 
                  className="object-cover brightness-75"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
            ) : (
              (dynamicImages || []).map((img, i) => (
                <div 
                  key={img.id}
                  className={cn(
                    "absolute inset-0 transition-all duration-[3000ms] ease-in-out",
                    imageIndex === i ? "opacity-100 scale-105 blur-0" : "opacity-0 scale-100 blur-sm"
                  )}
                >
                  <Image 
                    src={img.imageUrl} 
                    alt="Global Heart Connection" 
                    fill 
                    className="object-cover brightness-90"
                    priority={i === 0}
                    data-ai-hint="woman portrait"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              ))
            )}
          </div>

          <div className="container mx-auto px-6 relative z-10 pt-20">
            {/* Admin Controls */}
            {canEdit && (
              <div className="absolute top-0 right-6 z-20 flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-white/90 text-slate-900 hover:bg-white rounded-full px-6 h-12 shadow-2xl font-black uppercase text-[10px] tracking-widest gap-2 backdrop-blur-md"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  Change Global Vision
                </Button>
              </div>
            )}

            <div className="max-w-4xl space-y-12">
              <div className="bg-white/10 backdrop-blur-2xl px-6 py-4 rounded-[2rem] border border-white/20 shadow-2xl inline-flex animate-bounce duration-[3000ms] group hover:bg-white/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div className="text-left">
                    <Badge variant="secondary" className="bg-white/20 text-white border-none font-black text-[10px] uppercase tracking-[0.2em] px-3 h-6">Spark Match Active</Badge>
                    <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest mt-1 ml-1">Global Community Verified</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h1 className="text-7xl lg:text-9xl font-black leading-[0.85] tracking-tighter text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                  {(heroTitle || "").split('.').filter(p => p.trim()).map((part, i) => (
                    <span key={i}>{part.trim()}.<br/></span>
                  ))}
                </h1>
                <p className="text-2xl lg:text-3xl text-white/95 max-w-2xl leading-relaxed font-medium italic drop-shadow-lg">
                  {t('home.heroSubtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button size="lg" className="h-24 px-16 rounded-[2rem] text-2xl font-black gradient-bg shadow-[0_20px_50px_-10px_rgba(255,51,102,0.7)] hover:scale-105 transition-transform group border border-white/20" asChild>
                  <Link href="/login" className="flex items-center gap-5">
                    {t('home.launchButton')}
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-24 px-14 rounded-[2rem] text-xl font-bold border-2 border-white/30 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white transition-all shadow-2xl" asChild>
                  <Link href="/donate">{t('home.supportButton')}</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-2xl border border-white/10">
                  <Globe className="w-5 h-5 animate-spin-slow text-secondary" />
                  <span className="text-[12px] font-black uppercase tracking-[0.2em]">
                    {LOVE_TRANSLATIONS[langIndex].text}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/80 drop-shadow-md">
                   <ShieldCheck className="w-5 h-5 text-primary" />
                   {t('home.compliance')}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-40 bg-white relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-32">
               <Badge className="mb-6 h-8 px-6 bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-[0.3em]">{t('home.movementTitle')}</Badge>
               <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                 {(metricTitle || "").split(' ').map((word, i) => (
                   <span key={i} className={word === 'Only' || word === 'Metric.' || word === 'መለኪያ' ? 'gradient-text' : ''}>{word}{' '}</span>
                 ))}
               </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: Zap, color: 'text-primary', bg: 'bg-primary/5', title: t('home.featureAiTitle'), desc: t('home.featureAiDesc') },
                { icon: Heart, color: 'text-secondary', bg: 'bg-secondary/5', title: t('home.featureRespectTitle'), desc: t('home.featureRespectDesc') },
                { icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', title: t('home.featureProsperityTitle'), desc: t('home.featureProsperityDesc') }
              ].map((feature, i) => (
                <div key={i} className="bg-slate-50 p-14 rounded-[4rem] text-left group hover:bg-white hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 border border-transparent hover:border-slate-100">
                  <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 shadow-sm transition-transform group-hover:rotate-6", feature.bg, feature.color)}>
                    <feature.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black mb-6 tracking-tighter uppercase">{feature.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium italic">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t bg-slate-50 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-10 opacity-70">
            <Heart className="w-10 h-10 fill-primary text-primary" />
            <span className="font-black text-[12px] tracking-[0.4em] text-primary uppercase">I LOVE U</span>
          </div>
          <p className="font-black text-[10px] tracking-[0.3em] mb-4 uppercase text-slate-400">© {currentYear} • {t('home.footerCopyright')}</p>
          <p className="text-[9px] font-bold italic uppercase tracking-widest opacity-40 text-slate-400">{t('home.footerTagline')}</p>
        </div>
      </footer>
    </div>
  );
}
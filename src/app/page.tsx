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
  Users,
  Target,
  ShoppingBag,
  Lock,
  UserCheck
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
import { doc, onSnapshot, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';
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
  const [ownerNickname, setOwnerNickname] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Profile data for Admin check
  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userRef);

  // Real-time Vision Guardianship
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, "siteSettings", "homepage"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setHeroImage(data.heroImageUrl || "");
        setPageOwnerId(data.ownerId || "");
        setOwnerNickname(data.ownerNickname || "A Guardian");
      }
    });
    return () => unsub();
  }, [db]);

  // Use role === 'admin' for authority
  const canEdit = profile?.role === 'admin' || (user?.uid === pageOwnerId && pageOwnerId !== "");
  const isOwner = user?.uid === pageOwnerId;
  const isUnowned = !pageOwnerId || pageOwnerId === "";

  useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear().toString());
    
    const imageInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(imageInterval);
  }, []);

  const handleClaimOwnership = async () => {
    if (!user || !db || isClaiming) return;
    setIsClaiming(true);
    try {
      await setDoc(doc(db, "siteSettings", "homepage"), {
        ownerId: user.uid,
        ownerNickname: profile?.publicNickname || profile?.displayName || "Mystery Guardian",
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast({ title: "Guardianship Claimed", description: "You are now the Sovereign Guardian of this vision. ✨" });
    } catch (err) {
      toast({ variant: "destructive", title: "Claim Failed", description: "This vision is already protected." });
    } finally {
      setIsClaiming(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !app || !db || !canEdit) return;

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
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-10 h-10 fill-primary text-primary animate-heartbeat" />
            <span className="font-black text-[16px] tracking-[0.5em] text-primary uppercase ml-1">I LOVE U</span>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-primary/5 h-10 px-3 gap-2 rounded-full transition-colors">
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

            {user ? (
               <Button size="sm" className="rounded-full h-10 px-6 gradient-bg font-black uppercase text-[9px] tracking-widest shadow-xl" asChild>
                <Link href="/discover">Back to Hearts</Link>
               </Button>
            ) : (
              <Button size="sm" className="rounded-full h-10 px-6 gradient-bg font-black uppercase text-[9px] tracking-widest shadow-xl" asChild>
                <Link href="/login">Launch Spark</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
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
                  <Link href={user ? "/discover" : "/login"} className="flex items-center gap-3">
                    {user ? "Discover Hearts ✨" : "Launch Spark 🚀"}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-20 px-10 rounded-[2rem] text-xl font-bold border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all" asChild>
                  <Link href="/donate">Support Mission</Link>
                </Button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
                 {isUnowned && user && (
                    <Button 
                      onClick={handleClaimOwnership} 
                      disabled={isClaiming}
                      className="rounded-full h-10 px-6 bg-slate-900 text-white shadow-2xl text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-black transition-all"
                    >
                      {isClaiming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4 text-primary" />}
                      Claim Guardianship
                    </Button>
                 )}
                 {!isUnowned && !isOwner && (
                    <Badge className="bg-slate-900/90 text-white backdrop-blur-md border-none px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                       <Lock className="w-3.5 h-3.5 text-primary" />
                       Vision Protected by {ownerNickname}
                    </Badge>
                 )}
                 {isOwner && (
                    <Badge className="bg-primary text-white border-none px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                       <UserCheck className="w-3.5 h-3.5" />
                       You are the Guardian
                    </Badge>
                 )}
              </div>

              {canEdit && (
                <div className="absolute top-4 right-4 z-30">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="rounded-full h-10 px-4 bg-white/90 backdrop-blur-md shadow-xl text-[10px] font-black uppercase tracking-widest gap-2">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                    Change Photo
                  </Button>
                </div>
              )}

              <div className="overflow-hidden rounded-[3rem] shadow-[0_40px_100px_-10px_rgba(0,0,0,0.2)] bg-slate-100 aspect-[4/5] relative">
                <Image src={heroImage || HERO_IMAGES[imageIndex]} alt="Global Community Vision" fill className="object-cover transition-all duration-1000 ease-in-out group-hover:scale-105" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t bg-slate-50">
        <div className="container mx-auto px-6 text-center space-y-6 pt-10">
          <p className="font-black text-[10px] tracking-[0.3em] uppercase text-slate-400">© {currentYear} • Reaching Every Heart</p>
          <p className="text-[9px] font-bold italic uppercase tracking-widest opacity-40 text-slate-400">Respect & Love is Mandatory ❤️ Eliminating Poverty Globally</p>
        </div>
      </footer>
    </div>
  );
}
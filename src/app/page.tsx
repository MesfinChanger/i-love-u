"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ArrowRight, 
  Zap, 
  Sparkles,
  Languages,
  Check,
  Loader2,
  Camera,
  Star,
  Lock,
  UserCheck,
  Globe
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { SUPPORTED_LANGUAGES } from '@/lib/world-data';
import { useUser, useFirestore, useDoc, useFirebaseApp } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useToast } from '@/hooks/use-toast';
import HeroImage from '@/components/HeroImage';

/**
 * @fileOverview The I LOVE U Homepage.
 * Perfectly aligned with the mission vision: multicultural unity, high-impact typography,
 * and the Sovereign Authority Protocol.
 */
export default function Home() {
  const { user } = useUser();
  const db = useFirestore();
  const app = useFirebaseApp();
  const { toast } = useToast();
  const { language, setLanguage, t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [heroImage, setHeroImage] = useState("");
  const [pageOwnerId, setPageOwnerId] = useState("");
  const [ownerNickname, setOwnerNickname] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Profile data for Sovereign/Admin check
  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userRef);

  // Real-time Vision Guardianship Listener
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

  const canEdit = profile?.role === 'admin' || (user?.uid === pageOwnerId && pageOwnerId !== "");
  const isOwner = user?.uid === pageOwnerId;
  const isUnowned = !pageOwnerId || pageOwnerId === "";

  useEffect(() => {
    setMounted(true);
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
      toast({ title: "Guardianship Claimed", description: "You now protect the global vision. ✨" });
    } catch (err) {
      toast({ variant: "destructive", title: "Claim Failed", description: "The seat is already occupied." });
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
      toast({ title: "Vision Updated", description: "The global heartbeat has synchronized. ✨" });
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not change the vision." });
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
      {/* HEADER PROTOCOL */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 fill-primary text-primary animate-heartbeat" />
            <span className="font-black text-[18px] tracking-[0.4em] text-primary uppercase whitespace-nowrap">I LOVE U</span>
          </div>

          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-primary/5 h-10 px-3 gap-2 rounded-full transition-colors">
                  <Languages className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-black uppercase tracking-widest hidden sm:inline-block">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl p-2 border-none shadow-2xl mr-4 max-h-80 overflow-y-auto" align="end">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.name} 
                    onClick={() => setLanguage(lang.name)}
                    className={cn(
                      "rounded-xl py-3 px-4 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-between",
                      language === lang.name ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <div className="flex flex-col">
                      <span>{lang.name}</span>
                      <span className="text-[10px] opacity-40 font-medium">{lang.native}</span>
                    </div>
                    {language === lang.name && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="lg" className="rounded-full h-11 px-8 gradient-bg font-black uppercase text-[10px] tracking-[0.1em] shadow-xl shadow-primary/20 active:scale-95 transition-all" asChild>
              <Link href={user ? "/discover" : "/login"}>Launch Spark</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN MISSION CORE */}
      <main className="flex-grow pt-20">
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            <div className="space-y-10 text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-50 text-pink-500 font-black text-[10px] uppercase tracking-widest border border-pink-100 shadow-sm animate-in fade-in slide-in-from-left-4 duration-700">
                <Heart className="w-3 h-3 fill-current" /> GLOBAL COMMUNITY VERIFIED
              </div>

              <div className="space-y-6">
                <h1 className="text-7xl md:text-[92px] font-black leading-[0.85] tracking-tight">
                  <span className="text-slate-900 block">Spark</span>
                  <span className="text-primary block">Love.</span>
                  <span className="block bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 bg-clip-text text-transparent">End Poverty.</span>
                </h1>
                <p className="mt-8 text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
                  Connecting hearts across every city and village to create opportunities, friendships, and positive change through global job creation.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="h-16 px-8 rounded-2xl text-base font-black gradient-bg shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group" asChild>
                  <Link href={user ? "/discover" : "/login"}>
                    Discover Hearts ✨
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-8 rounded-2xl text-base font-bold border-2 border-slate-100 text-slate-400 hover:bg-slate-50 transition-all" asChild>
                  <Link href="/donate">Support Mission</Link>
                </Button>
              </div>
            </div>

            {/* DYNAMIC COLLAGE HERO */}
            <div className="relative">
              <div className="absolute top-6 left-6 z-40 flex flex-col gap-2">
                 {isUnowned && user && (
                    <Button 
                      onClick={handleClaimOwnership} 
                      disabled={isClaiming}
                      className="rounded-full h-10 px-6 bg-slate-900 text-white shadow-2xl text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-black transition-all"
                    >
                      {isClaiming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4 text-primary" />}
                      Claim Guardianship
                    </Button>
                 )}
                 {!isUnowned && !isOwner && (
                    <Badge className="bg-slate-900/90 text-white backdrop-blur-md border-none px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                       <Lock className="w-3.5 h-3.5 text-primary" />
                       Protected by {ownerNickname}
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
                <div className="absolute top-6 right-6 z-40">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="rounded-full h-10 px-4 bg-white/90 backdrop-blur-md shadow-xl text-[10px] font-black uppercase tracking-widest gap-2">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                    Change Photo
                  </Button>
                </div>
              )}

              {/* Cinematic Transition Component */}
              <div className="relative group">
                <HeroImage overrideUrl={heroImage} />
                
                {/* Floating UI Elements from reference */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center p-2 z-30 transition-transform group-hover:rotate-12 duration-700 sm:flex hidden">
                   <div className="w-full h-full rounded-full gradient-bg flex items-center justify-center">
                      <Heart className="w-8 h-8 fill-white text-white animate-heartbeat" />
                      <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full text-primary shadow-sm border">
                         <Sparkles className="w-3 h-3" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 border-t border-slate-50 bg-slate-50/30">
        <div className="container mx-auto px-6 text-center space-y-6">
          <p className="font-black text-[11px] tracking-[0.4em] uppercase text-slate-300">© 2026 • Reaching Every Heart</p>
          <p className="text-[10px] font-bold italic uppercase tracking-widest opacity-40 text-slate-400">Respect & Love is Mandatory ❤️ Eliminating Poverty Globally</p>
        </div>
      </footer>
    </div>
  );
}

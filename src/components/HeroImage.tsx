'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Heart, Sparkles, Star, Globe } from "lucide-react";

/**
 * @fileOverview Cinematic Hero Component.
 * Implements a rotating global story of world children and multicultural unity.
 * Hardened to prevent hydration mismatches.
 */

const heroImages = [
  PlaceHolderImages.find(img => img.id === 'hero-world-1')?.imageUrl || "https://picsum.photos/seed/world1/1200/1600",
  PlaceHolderImages.find(img => img.id === 'hero-world-2')?.imageUrl || "https://picsum.photos/seed/world2/1200/1600",
  PlaceHolderImages.find(img => img.id === 'hero-world-3')?.imageUrl || "https://picsum.photos/seed/world3/1200/1600",
  PlaceHolderImages.find(img => img.id === 'hero-world-4')?.imageUrl || "https://picsum.photos/seed/world4/1200/1600",
  PlaceHolderImages.find(img => img.id === 'hero-world-5')?.imageUrl || "https://picsum.photos/seed/world5/1200/1600",
  PlaceHolderImages.find(img => img.id === 'hero-world-6')?.imageUrl || "https://picsum.photos/seed/world6/1200/1600",
  PlaceHolderImages.find(img => img.id === 'hero-world-7')?.imageUrl || "https://picsum.photos/seed/world7/1200/1600",
  PlaceHolderImages.find(img => img.id === 'hero-world-8')?.imageUrl || "https://picsum.photos/seed/world8/1200/1600",
  PlaceHolderImages.find(img => img.id === 'hero-world-9')?.imageUrl || "https://picsum.photos/seed/world9/1200/1600",
  PlaceHolderImages.find(img => img.id === 'hero-world-10')?.imageUrl || "https://picsum.photos/seed/world10/1200/1600",
];

export default function HeroImage({ overrideUrl }: { overrideUrl?: string }) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Hydration Guard: Ensure we don't render motion elements until client-side mount
  if (!mounted) {
    return <div className="relative h-[620px] w-full bg-slate-100 rounded-[3rem] animate-pulse" />;
  }

  // Use override (from Sovereign Guardian) or the rotating story
  const displayUrl = overrideUrl && overrideUrl !== "" ? overrideUrl : heroImages[index];

  return (
    <div className="relative h-[620px] w-full overflow-hidden rounded-[3rem] shadow-2xl bg-slate-100 group">
      
      <AnimatePresence mode="wait">
        <motion.img
          key={displayUrl}
          src={displayUrl}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
          alt="World Children - Global Mission"
          data-ai-hint="world children"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"/>

      {/* Make it Feel Alive - Floating Elements */}
      <div className="absolute top-10 left-10 animate-bounce text-pink-500 z-20">
        <Heart className="w-10 h-10 fill-current drop-shadow-[0_0_15px_rgba(255,51,102,0.5)]" />
      </div>

      <div className="absolute bottom-40 right-10 animate-pulse text-yellow-400 z-20">
        <Sparkles className="w-12 h-12 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
      </div>

      <div className="absolute top-32 right-20 animate-ping text-pink-400/40 z-20">
        <Heart className="w-8 h-8 fill-current" />
      </div>

      {/* Overlay Text Architecture */}
      <div className="absolute bottom-12 left-10 right-10 text-white z-30 space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
            Love Knows <br/><span className="text-primary">No Borders.</span>
          </h2>
          <p className="mt-4 text-lg md:text-xl font-medium italic text-white/80 leading-relaxed max-w-md">
            "Together we can end poverty through kindness, opportunity, and human connection."
          </p>
        </motion.div>
      </div>

      {/* Activity Status */}
      <div className="absolute top-6 right-6 z-30">
        <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
          <Globe className="w-3 h-3 text-white" />
          <span className="text-[9px] font-black uppercase text-white tracking-[0.2em]">Global Unity Protocol</span>
        </div>
      </div>
    </div>
  );
}

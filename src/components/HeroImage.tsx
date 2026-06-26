'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Heart, Sparkles, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Cinematic Hero Component.
 * Implements a rotating global story of multicultural unity and love.
 * Hardened to match the high-fidelity collage aesthetic with rounded corners and floating elements.
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
    if (!overrideUrl) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [overrideUrl]);

  if (!mounted) {
    return <div className="relative h-[580px] w-full bg-slate-50 rounded-[3rem] animate-pulse shadow-xl" />;
  }

  const displayUrl = overrideUrl && overrideUrl !== "" ? overrideUrl : heroImages[index];

  return (
    <div className="relative h-[580px] w-full overflow-hidden rounded-[3.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.15)] bg-slate-50">
      
      <AnimatePresence mode="wait">
        <motion.img
          key={displayUrl}
          src={displayUrl}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
          alt="Global Community Story"
        />
      </AnimatePresence>

      {/* Dynamic Ambiance Layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"/>

      {/* Floating Elements (Alive Protocol) */}
      <div className="absolute top-10 left-10 animate-bounce text-pink-500 z-20">
        <Heart className="w-10 h-10 fill-current drop-shadow-2xl" />
      </div>

      <div className="absolute bottom-32 right-12 animate-pulse text-yellow-400 z-20">
        <Sparkles className="w-14 h-14 drop-shadow-2xl" />
      </div>

      <div className="absolute top-40 right-20 animate-ping text-pink-400/30 z-20">
        <Heart className="w-8 h-8 fill-current" />
      </div>

      {/* Cinematic Text Architecture */}
      <div className="absolute bottom-12 left-12 right-12 text-white z-30 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] drop-shadow-lg">
            Love Knows <br/><span className="text-primary">No Borders.</span>
          </h2>
          <p className="mt-4 text-xl font-medium italic text-white/90 leading-relaxed max-w-md drop-shadow-md">
            "Together we can end poverty through kindness, opportunity, and human connection."
          </p>
        </motion.div>
      </div>

      {/* Global Status Protocol */}
      <div className="absolute top-8 right-8 z-30">
        <div className="bg-black/20 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-3 shadow-2xl">
          <Globe className="w-4 h-4 text-white animate-spin-slow" />
          <span className="text-[10px] font-black uppercase text-white tracking-[0.25em]">Universal Unity</span>
        </div>
      </div>
    </div>
  );
}

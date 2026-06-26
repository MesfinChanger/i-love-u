
'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Globe } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * @fileOverview Cinematic Dynamic Hero Component.
 * Features a rotating global story with "Alive" UI elements.
 * Integrates Sovereign Authority override.
 */

export default function HeroImage({ overrideUrl }: { overrideUrl?: string }) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Define the Global Story Gallery from placeholders
  const gallery = [
    PlaceHolderImages.find(img => img.id === 'world-1')?.imageUrl || "",
    PlaceHolderImages.find(img => img.id === 'world-2')?.imageUrl || "",
    PlaceHolderImages.find(img => img.id === 'world-3')?.imageUrl || "",
    PlaceHolderImages.find(img => img.id === 'world-4')?.imageUrl || "",
    PlaceHolderImages.find(img => img.id === 'world-5')?.imageUrl || "",
  ].filter(url => url !== "");

  useEffect(() => {
    setMounted(true);
    // Only rotate if there is no Sovereign override
    if (overrideUrl) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % gallery.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [overrideUrl, gallery.length]);

  if (!mounted) return null;

  // Use override if provided, otherwise use current gallery index
  const currentImage = overrideUrl && overrideUrl !== "" ? overrideUrl : gallery[index];

  return (
    <div className="relative h-[620px] w-full overflow-hidden rounded-[40px] shadow-2xl group">
      
      {/* Dynamic Image Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={currentImage}
            alt="Global Prosperity Vision"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Ambiance Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

      {/* Alive UI Layer - Floating Protocol */}
      <div className="absolute top-10 left-10 animate-bounce text-pink-500 z-20 drop-shadow-2xl">
        <Heart className="w-10 h-10 fill-current" />
      </div>

      <div className="absolute bottom-32 right-12 animate-pulse text-yellow-400 z-20 drop-shadow-2xl">
        <Sparkles className="w-14 h-14" />
      </div>

      <div className="absolute top-32 right-20 animate-ping text-pink-400/40 z-20">
        <Heart className="w-8 h-8 fill-current" />
      </div>

      {/* Mission Overlay Text */}
      <div className="absolute bottom-12 left-12 text-white z-30 max-w-lg text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
           <Globe className="w-3 h-3 text-primary" />
           <span className="text-[10px] font-black uppercase tracking-widest">Global Story {overrideUrl ? "(Sovereign)" : `#${index + 1}`}</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] drop-shadow-2xl">
          Love Knows <br/>No Borders
        </h2>
        <p className="text-xl font-medium italic text-white/80 leading-relaxed drop-shadow-md">
          Together we can end poverty through kindness, opportunity, and human connection.
        </p>
      </div>

      {/* Narrative Progress Bar (only show if rotating) */}
      {!overrideUrl && (
        <div className="absolute bottom-0 left-0 h-1.5 bg-primary/20 w-full z-40">
           <motion.div 
             key={index}
             initial={{ width: "0%" }}
             animate={{ width: "100%" }}
             transition={{ duration: 5, ease: "linear" }}
             className="h-full bg-primary shadow-[0_0_10px_rgba(255,51,102,0.8)]"
           />
        </div>
      )}
    </div>
  );
}

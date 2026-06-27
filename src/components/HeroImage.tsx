
'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview Cinematic Dynamic Hero Component.
 * Features a rotating global story using high-fidelity assets.
 * Implements the "Alive" UI layer with floating hearts and sparkles.
 */
const heroImageIds = [
  "landing-hero",
  "world-1",
  "world-2",
  "world-3",
  "world-4",
  "world-5",
  "world-6",
];

export default function HeroImage() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImageIds.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return (
    <div className="absolute inset-0 w-full h-full bg-slate-100 animate-pulse rounded-[40px]" />
  );

  const currentImage = PlaceHolderImages.find(img => img.id === heroImageIds[index]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={heroImageIds[index]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {currentImage && (
            <Image
              src={currentImage.imageUrl}
              alt={currentImage.description}
              fill
              priority
              className="object-cover"
              data-ai-hint={currentImage.imageHint}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent pointer-events-none" />

      {/* "Alive" Decorative UI Elements */}
      <div className="absolute top-10 left-10 animate-bounce text-pink-500 text-3xl z-20" aria-hidden="true">❤️</div>
      <div className="absolute bottom-20 right-10 animate-pulse text-yellow-400 text-4xl z-20" aria-hidden="true">✨</div>
      <div className="absolute top-32 right-20 animate-ping text-pink-400 z-20" aria-hidden="true">💖</div>
      
      {/* Floating Mission Hint */}
      <div className="absolute bottom-12 left-12 z-20 text-slate-900 drop-shadow-sm hidden sm:block">
         <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Love Knows No Borders</h2>
         <p className="mt-3 text-xl font-bold opacity-70 max-w-lg italic">
           Together we end poverty through connection.
         </p>
      </div>
    </div>
  );
}

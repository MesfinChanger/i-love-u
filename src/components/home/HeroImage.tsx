'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview High-Fidelity Hero Image Protocol.
 * Optimizes the initial Home Page paint by bypassing the entry animation 
 * on the first slide while preserving high-quality transitions for the mission story.
 * Hardened with mount protection to prevent hydration hangs.
 */
const heroFlowerIds = [
  "flower-roses",
  "flower-lilies",
  "flower-sunflowers",
  "flower-tulips",
  "flower-orchids",
  "flower-lotus",
];

export default function HeroImage() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // We flip the first load flag after the initial image has had time to hydrate
    // This ensures that the key-based entry animation only triggers on slide 2+
    const timer = setInterval(() => {
      setIsFirstLoad(false);
      setIndex((prev) => (prev + 1) % heroFlowerIds.length);
    }, 8000); // 8 seconds per bloom for a calmer vibration

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return (
    <div className="absolute inset-0 w-full h-full bg-slate-50 animate-pulse" />
  );

  const currentImage = PlaceHolderImages.find(img => img.id === heroFlowerIds[index]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={heroFlowerIds[index]}
          // Protocol: Disable entry animation for the initial LCP paint to ensure instant visibility
          initial={isFirstLoad ? false : { opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {currentImage && (
            <Image
              src={currentImage.imageUrl}
              alt={currentImage.description}
              fill
              priority={isFirstLoad} // High-priority for the initial hero paint
              className="object-cover"
              data-ai-hint={currentImage.imageHint}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Overlays for Readability & Depth */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/90 pointer-events-none" />
      
      {/* Light vignetting - Standardized via global utility */}
      <div className="absolute inset-0 mission-vignette pointer-events-none" />
    </div>
  );
}

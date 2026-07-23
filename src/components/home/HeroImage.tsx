'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview High-Fidelity Hero Image Protocol.
 * Hardened with staggered hydration and explicit LCP prioritization.
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
    // Mission Stability: Stagger mount state to allow browser to finish initial paint
    const frame = setTimeout(() => setMounted(true), 0);
    
    const timer = setInterval(() => {
      setIsFirstLoad(false);
      setIndex((prev) => (prev + 1) % heroFlowerIds.length);
    }, 8000);

    return () => {
      clearTimeout(frame);
      clearInterval(timer);
    };
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
              priority={index === 0}
              className="object-cover"
              data-ai-hint={currentImage.imageHint}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/90 pointer-events-none" />
      <div className="absolute inset-0 mission-vignette pointer-events-none" />
    </div>
  );
}

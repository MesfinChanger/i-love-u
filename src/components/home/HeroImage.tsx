'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview Cinematic Dynamic Hero Component featuring Floral Frequencies.
 * Features a rotating global story of vibrant flowers to represent the beauty of love.
 * Implements the "Alive" UI layer for the Sacred Bloom Protocol.
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

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroFlowerIds.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return (
    <div className="absolute inset-0 w-full h-full bg-slate-100 animate-pulse" />
  );

  const currentImage = PlaceHolderImages.find(img => img.id === heroFlowerIds[index]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={heroFlowerIds[index]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
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
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/80 pointer-events-none" />
    </div>
  );
}

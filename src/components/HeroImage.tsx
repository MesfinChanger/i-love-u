'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview Cinematic Dynamic Hero Component featuring Attractive Places.
 * Features a rotating global story of iconic locations across the world.
 * Implements the "Alive" UI layer.
 */
const heroPlaceIds = [
  "place-tropical",
  "place-europe",
  "place-asia",
  "place-modern",
  "place-safari",
  "place-landscape",
];

export default function HeroImage() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroPlaceIds.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return (
    <div className="absolute inset-0 w-full h-full bg-slate-100 animate-pulse rounded-[40px]" />
  );

  const currentImage = PlaceHolderImages.find(img => img.id === heroPlaceIds[index]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={heroPlaceIds[index]}
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
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/30 to-transparent pointer-events-none" />
    </div>
  );
}

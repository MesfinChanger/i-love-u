'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/**
 * @fileOverview Cinematic Dynamic Hero Component.
 * Features a rotating global story using local high-fidelity assets.
 * Implements the "Alive" UI layer with floating hearts and sparkles.
 */
const images = [
  "/images/hero/global-community-hero.jpg",
  "/images/hero/world1.jpg",
  "/images/hero/world2.jpg",
  "/images/hero/world3.jpg",
  "/images/hero/world4.jpg",
  "/images/hero/world5.jpg",
  "/images/hero/world6.jpg",
];

export default function HeroImage() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return (
    <div className="absolute inset-0 w-full h-full bg-slate-100 animate-pulse" />
  );

  return (
    <div className="absolute inset-0 w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[index]}
            alt="Global Prosperity Narrative"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

      {/* "Alive" Decorative UI Elements */}
      <div className="absolute top-10 left-10 animate-bounce text-pink-500 text-3xl z-20" aria-hidden="true">❤️</div>
      <div className="absolute bottom-20 right-10 animate-pulse text-yellow-400 text-4xl z-20" aria-hidden="true">✨</div>
      <div className="absolute top-32 right-20 animate-ping text-pink-400 z-20" aria-hidden="true">💖</div>
      
      {/* Floating Action Hint */}
      <div className="absolute bottom-10 left-10 z-20 text-white drop-shadow-xl hidden sm:block">
         <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Love Knows No Borders</h2>
         <p className="mt-3 text-xl font-medium opacity-90 max-w-lg">
           Together we can end poverty through kindness, opportunity, and human connection.
         </p>
      </div>
    </div>
  );
}

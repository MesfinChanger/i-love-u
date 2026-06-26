'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * @fileOverview Cinematic Dynamic Hero Component.
 * Features a rotating global story using framer-motion for high-fidelity transitions.
 */
export default function HeroImage() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const images = [
    PlaceHolderImages.find(img => img.id === 'world-1')?.imageUrl || "",
    PlaceHolderImages.find(img => img.id === 'world-2')?.imageUrl || "",
    PlaceHolderImages.find(img => img.id === 'world-3')?.imageUrl || "",
    PlaceHolderImages.find(img => img.id === 'world-4')?.imageUrl || "",
    PlaceHolderImages.find(img => img.id === 'world-5')?.imageUrl || "",
    PlaceHolderImages.find(img => img.id === 'world-6')?.imageUrl || "",
  ].filter(url => url !== "");

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  if (!mounted || images.length === 0) return null;

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
            data-ai-hint="global community"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
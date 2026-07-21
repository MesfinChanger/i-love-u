"use client";

import HeroImage from "./HeroImage";
import FloatingFlowers from "./FloatingFlowers";
import FloatingHearts from "./FloatingHearts";
import Sparkles from "./Sparkles";

/**
 * @fileOverview Sacred Bloom Background Registry.
 * Implements the image-based floral background while maintaining subtle particle overlays.
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      
      {/* High-Fidelity Floral Slider */}
      <HeroImage />

      {/* Subtle particle layer */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <FloatingFlowers />
        <FloatingHearts />
        <Sparkles />
      </div>

    </div>
  );
}

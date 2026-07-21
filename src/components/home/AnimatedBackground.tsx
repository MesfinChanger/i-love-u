"use client";

import HeroImage from "./HeroImage";
import Sparkles from "./Sparkles";

/**
 * @fileOverview High-Fidelity Animated Background Registry.
 * Synchronized to provide a cinematic floral experience for the Prosperity Revolution.
 * Implements the Sacred Bloom Protocol with floral frequencies and stable particle layers.
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* Primary Visual Frequency: Rotating Global Flowers */}
      <HeroImage />
      
      {/* Secondary Atmosphere: Hydration-Safe Sparkles */}
      <Sparkles />
    </div>
  );
}

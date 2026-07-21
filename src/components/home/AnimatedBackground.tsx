"use client";

import HeroImage from "./HeroImage";
import FloatingFlowers from "./FloatingFlowers";
import FloatingHearts from "./FloatingHearts";
import Sparkles from "./Sparkles";

/**
 * @fileOverview High-Fidelity Animated Background Registry.
 * Synchronized with the Sacred Bloom Protocol to ensure the background is 
 * exclusively composed of high-vibration flower frequencies.
 */
export default function AnimatedBackground() {
  return (
    <div
      className="
        fixed
        inset-0
        z-0
        overflow-hidden
        pointer-events-none
      "
    >
      {/* Sacred Bloom Layer: The primary visual frequency using rotating floral imagery */}
      <HeroImage />

      {/* Particle & Decorative Layers for depth and mission atmosphere */}
      <FloatingFlowers />
      <FloatingHearts />
      <Sparkles />
    </div>
  );
}

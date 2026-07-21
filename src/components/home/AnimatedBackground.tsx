"use client";

import HeroImage from "./HeroImage";
import Sparkles from "./Sparkles";

/**
 * @fileOverview High-Fidelity Animated Background Registry.
 * Consolidates the Sacred Bloom slideshow and Sparkle particles.
 * Removed redundant floating layers to eliminate visual overlap.
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      <HeroImage />
      <Sparkles />
    </div>
  );
}

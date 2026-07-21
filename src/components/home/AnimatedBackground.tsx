"use client";

import HeroImage from "./HeroImage";
import Sparkles from "./Sparkles";

/**
 * @fileOverview High-Fidelity Animated Background Registry.
 * Synchronized with the Sacred Bloom Protocol to ensure the background is 
 * exclusively composed of high-vibration flower frequencies.
 * This component has been stabilized to remove redundant layers and scenes.
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

      {/* Particle Layer for depth and mission atmosphere */}
      <Sparkles />
    </div>
  );
}

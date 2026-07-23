"use client";

import HeroImage from "./HeroImage";
import Sparkles from "./Sparkles";

/**
 * @fileOverview High-Fidelity Animated Background Registry.
 * Consolidates the Sacred Bloom slideshow and Sparkle particles into a single stable layer.
 * Updated z-index to 0 to ensure visibility above body background but behind content (z-10).
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-white">
      {/* Primary Visual Frequency: Global Flower Slideshow */}
      <HeroImage />
      
      {/* "Alive" UI Particle Layer */}
      <Sparkles />
      
      {/* Universal Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/95 pointer-events-none" />
      
      {/* Cinematic Vignette - Moved to globals.css for JIT stability */}
      <div className="absolute inset-0 mission-vignette pointer-events-none" />
    </div>
  );
}

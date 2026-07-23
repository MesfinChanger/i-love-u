"use client";

import HeroImage from "./HeroImage";
import Sparkles from "./Sparkles";

/**
 * @fileOverview High-Fidelity Animated Background Registry.
 * Consolidates the Sacred Bloom slideshow and Sparkle particles into a single stable layer.
 * Hardened to prevent layout hangs and ensure depth behind the mission gateway.
 * Replaced spaces with underscores in radial-gradient classes for hydration stability.
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* Primary Visual Frequency: Global Flower Slideshow */}
      <HeroImage />
      
      {/* "Alive" UI Particle Layer */}
      <Sparkles />
      
      {/* Universal Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/95 pointer-events-none" />
      
      {/* Cinematic Vignette - Underscores for Tailwind spaces */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)] pointer-events-none" />
    </div>
  );
}

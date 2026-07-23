
"use client";

import { useEffect, useRef } from "react";
import SceneManager from "./SceneManager";
import Sparkles from "./Sparkles";

/**
 * @fileOverview High-Fidelity Animated Background Registry.
 * Consolidates Nature Scenes, Sparkles, and Bird Song Audio.
 */
export default function AnimatedBackground() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Protocol: Nature sounds should ideally start after user interaction,
    // but we'll try to play it muted/autostart for atmosphere.
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Low ambient volume
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-white">
      {/* Nature Scenes Layer */}
      <SceneManager />
      
      {/* "Alive" UI Particle Layer */}
      <Sparkles />
      
      {/* Birds' Song Audio Protocol */}
      <audio 
        ref={audioRef}
        autoPlay 
        loop 
        playsInline
        src="https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-chirping-1212.mp3"
      />

      {/* Universal Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/95 pointer-events-none" />
      
      {/* Cinematic Vignette Utility Registry */}
      <div className="absolute inset-0 mission-vignette pointer-events-none" />
    </div>
  );
}

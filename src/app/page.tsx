"use client";

import AnimatedBackground from "@/components/home/AnimatedBackground";

/**
 * @fileOverview Isolation Test 1: Animated Background.
 * Determines if the rendering hang is caused by the floral slideshow or particle effects.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter text-slate-900">
          I LOVE U
        </h1>
        <p className="text-xl font-bold text-primary uppercase tracking-[0.4em]">
          Isolation Protocol: Step 1
        </p>
      </div>
    </main>
  );
}

"use client";

import AnimatedBackground from "@/components/home/AnimatedBackground";

/**
 * @fileOverview Isolation Test 1: Animated Background.
 * Injected with runtime visibility diagnostics.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* DIAGNOSTIC MARKER 5: HOME_OK */}
      <div id="diag-home-ok" className="fixed top-0 left-64 z-[9999] bg-black text-white text-[8px] px-2 py-0.5 pointer-events-none opacity-50">HOME_OK</div>
      
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

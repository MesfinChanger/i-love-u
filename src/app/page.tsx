"use client";

import Hero from "@/components/home/Hero";
import AnimatedBackground from "@/components/home/AnimatedBackground";
import MissionCards from "@/components/home/MissionCards";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <AnimatedBackground />

      <div className="relative z-10">
        <Hero />
        <MissionCards />
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from 'react';

/**
 * @fileOverview Hydration-Safe Sparkles Component.
 * Orchestrates a delicate layer of shimmering particles to represent high-vibration energy.
 * Uses useEffect to pre-calculate random positions, sizes, and delays on the client only.
 * Resolves Next.js hydration mismatches by ensuring server and client HTML match initially.
 */
export default function Sparkles() {
  const [dots, setDots] = useState<{ left: string; top: string; size: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate particle parameters only on the client after hydration
    const newDots = Array.from({ length: 60 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 12 + 8}px`,
      delay: `${Math.random() * 5}s`,
    }));
    setDots(newDots);
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute text-yellow-200 animate-pulse opacity-40"
          style={{
            left: dot.left,
            top: dot.top,
            fontSize: dot.size,
            animationDelay: dot.delay,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
}

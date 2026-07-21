'use client';

import React, { useState, useEffect } from 'react';

/**
 * @fileOverview High-Fidelity Sparkles Component.
 * Implements the Hydration Stabilization Protocol to avoid Math.random() mismatches.
 * Pre-calculates positions on the client side only to ensure build integrity.
 */
export default function Sparkles() {
  const [sparkles, setSparkles] = useState<any[]>([]);

  useEffect(() => {
    // Pre-calculate positions on the client to avoid hydration mismatch
    const count = 40;
    const items = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 10 + 5}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 4 + 3}s`,
    }));
    setSparkles(items);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute text-primary/20 animate-pulse"
          style={{
            left: s.left,
            top: s.top,
            fontSize: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
}

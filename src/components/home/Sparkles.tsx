'use client';

import React, { useState, useEffect, useMemo } from 'react';

/**
 * @fileOverview High-Fidelity Sparkles Component.
 * Optimized with the Hydration Efficiency Protocol to minimize main-thread noise.
 * Particles are generated client-side only to preserve random visual integrity without hydration mismatches.
 */
const Sparkles = React.memo(function Sparkles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sparkles = useMemo(() => {
    if (!mounted) return [];
    
    // Stable random seed generated only once on the client
    const count = 40;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 10 + 5}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 4 + 3}s`,
    }));
  }, [mounted]);

  if (!mounted) return null;

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
});

export default Sparkles;

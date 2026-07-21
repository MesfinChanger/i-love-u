"use client";

import { useEffect, useState } from 'react';

/**
 * @fileOverview High-Fidelity Particle Layer.
 * Hardened with the Hydration Stabilization Protocol.
 * Ensures random visual attributes are only generated on the client to prevent SSR mismatches.
 */

interface Sparkle {
  left: string;
  top: string;
  fontSize: string;
  animationDelay: string;
}

export default function Sparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prosperity Protocol: Generate stable random positions once on the client
    const generated = Array.from({ length: 60 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${5 + Math.random() * 12}px`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setSparkles(generated);
  }, []);

  // Registry Guard: Defer rendering until hydrated to prevent mismatch
  if (!mounted) return null;

  return (
    <>
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="absolute text-yellow-200 animate-pulse pointer-events-none"
          style={{
            left: s.left,
            top: s.top,
            fontSize: s.fontSize,
            animationDelay: s.animationDelay
          }}
        >
          ✨
        </div>
      ))}
    </>
  );
}

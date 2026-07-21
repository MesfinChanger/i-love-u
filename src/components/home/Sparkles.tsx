"use client";

import { useEffect, useState } from 'react';

/**
 * @fileOverview Hydration-Safe Sparkles Component.
 * Pre-calculates random positions on the client to avoid server/client mismatches (Hydration Error Fix).
 */
export default function Sparkles() {
  const [items, setItems] = useState<{ left: string; top: string; size: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate sparkle parameters only on the client after hydration
    const newItems = Array.from({ length: 40 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 15 + 5}px`,
      delay: `${Math.random() * 5}s`,
    }));
    setItems(newItems);
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {items.map((style, i) => (
        <div
          key={i}
          className="absolute text-yellow-200 animate-pulse"
          style={{
            left: style.left,
            top: style.top,
            fontSize: style.size,
            animationDelay: style.delay,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

/**
 * @fileOverview Hydration-Safe Floating Hearts Component.
 * Orchestrates a gentle ascent of heart icons to represent the platform's vibration.
 */
export default function FloatingHearts() {
  const [hearts, setHearts] = useState<{ left: string; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate heart parameters only on the client after hydration
    const newHearts = Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {hearts.map((style, i) => (
        <div
          key={i}
          className="absolute bottom-[-50px] text-primary/20 animate-float"
          style={{
            left: style.left,
            animationDuration: `${style.duration}s`,
            animationDelay: `${style.delay}s`,
          }}
        >
          <Heart size={style.size} fill="currentColor" />
        </div>
      ))}
    </div>
  );
}

'use client';

import Image from "next/image";
import { Heart, Sparkles } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * @fileOverview Cinematic Hero Component.
 * Optimized with next/image fill property and high-fidelity mission overlays.
 */
interface HeroImageProps {
  overrideUrl?: string;
}

export default function HeroImage({ overrideUrl }: HeroImageProps) {
  // Reference the "World Children" placeholder image for mission alignment
  const worldChildren = PlaceHolderImages.find(img => img.id === 'hero-world-10');
  const imageUrl = overrideUrl && overrideUrl !== "" ? overrideUrl : (worldChildren?.imageUrl || "https://picsum.photos/seed/world-children/1200/1600");

  return (
    <div className="relative h-[620px] overflow-hidden rounded-[40px] shadow-2xl group">
      
      {/* High-Fidelity Hero Image */}
      <Image
        src={imageUrl}
        alt="People from around the world helping and loving one another"
        fill
        priority
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        data-ai-hint="children together"
      />

      {/* Cinematic Ambiance Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

      {/* Alive UI Elements - Floating Protocol */}
      <div className="absolute top-10 left-10 animate-bounce text-pink-500 z-20">
        <Heart className="w-10 h-10 fill-current drop-shadow-2xl" />
      </div>

      <div className="absolute bottom-20 right-10 animate-pulse text-yellow-400 z-20">
        <Sparkles className="w-14 h-14 drop-shadow-2xl" />
      </div>

      <div className="absolute top-32 right-20 animate-ping text-pink-400/40 z-20">
        <Heart className="w-8 h-8 fill-current" />
      </div>

      {/* Mission Overlay Text */}
      <div className="absolute bottom-10 left-10 text-white z-30 max-w-lg text-left">
        <h2 className="text-5xl font-black tracking-tighter uppercase leading-none drop-shadow-lg">
          Love Knows <br/>No Borders
        </h2>
        <p className="mt-4 text-xl font-medium italic text-white/90 leading-relaxed drop-shadow-md">
          Together we can end poverty through kindness, opportunity, and human connection.
        </p>
      </div>

    </div>
  );
}

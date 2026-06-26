'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, Sparkles, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Cinematic Hero Component.
 * Implements the "World Children" vision with a simplified, high-fidelity structure.
 * Features floating "Alive" elements and mission-aligned overlay text.
 */
export default function HeroImage({ overrideUrl }: { overrideUrl?: string }) {
  // Reference the "World Children" placeholder image
  const worldChildren = PlaceHolderImages.find(img => img.id === 'hero-world-10');
  const imageUrl = overrideUrl && overrideUrl !== "" ? overrideUrl : (worldChildren?.imageUrl || "https://picsum.photos/seed/world-children/1200/1600");

  return (
    <div className="relative overflow-hidden rounded-[40px] shadow-2xl bg-slate-50 group">
      
      {/* High-Fidelity Hero Image */}
      <div className="relative w-full h-[620px]">
        <Image
          src={imageUrl}
          alt="People from around the world helping and loving one another"
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          data-ai-hint="children together"
        />
      </div>

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

      {/* Global Status Protocol */}
      <div className="absolute top-8 right-8 z-30">
        <div className="bg-black/20 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-3 shadow-2xl">
          <Globe className="w-4 h-4 text-white animate-spin-slow" />
          <span className="text-[10px] font-black uppercase text-white tracking-[0.25em]">Universal Unity</span>
        </div>
      </div>
    </div>
  );
}

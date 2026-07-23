"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview Forest Scene.
 * Rooted in growth and the mandtory respect for all life.
 */
export default function ForestScene() {
  const image = PlaceHolderImages.find(img => img.id === "nature-forest");

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {image && (
        <Image
          src={image.imageUrl}
          alt={image.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={image.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-900/20 via-transparent to-white/10" />
      <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay" />
    </div>
  );
}

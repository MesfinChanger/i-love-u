
"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview Flower Farm Scene.
 * High-fidelity visual frequency for the Prosperity Revolution.
 */
export default function FlowerScene() {
  const image = PlaceHolderImages.find(img => img.id === "nature-flower-farm");

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {image && (
        <Image
          src={image.imageUrl}
          alt={image.description}
          fill
          className="object-cover"
          data-ai-hint={image.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/20" />
      <div className="absolute inset-0 bg-pink-500/5 mix-blend-overlay" />
    </div>
  );
}

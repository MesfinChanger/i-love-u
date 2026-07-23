
"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview Waterfall Scene.
 * Representing the flowing energy of love and prosperity.
 */
export default function WaterfallScene() {
  const image = PlaceHolderImages.find(img => img.id === "nature-waterfall");

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
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-white/40" />
      <div className="absolute inset-0 bg-cyan-500/5 mix-blend-soft-light" />
    </div>
  );
}

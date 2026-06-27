
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * @fileOverview High-Fidelity Community Collage Mosaic.
 * Features a dynamic 12-column grid showing global prosperity in action.
 */
export default function GlobalCommunityCollage() {
  const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

  const images = [
    { id: 'collage-1', span: 'col-span-3', h: 'h-64' },
    { id: 'collage-2', span: 'col-span-4', h: 'h-64' },
    { id: 'collage-3', span: 'col-span-3', h: 'h-64' },
    { id: 'collage-4', span: 'col-span-2', h: 'h-64' },
    { id: 'collage-5', span: 'col-span-3', h: 'h-80' },
    { id: 'collage-6', span: 'col-span-6', h: 'h-80' },
    { id: 'collage-7', span: 'col-span-3', h: 'h-80' },
    { id: 'collage-8', span: 'col-span-4', h: 'h-56' },
    { id: 'collage-9', span: 'col-span-4', h: 'h-56' },
    { id: 'collage-10', span: 'col-span-4', h: 'h-56' },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 rounded-[40px] overflow-hidden">
      {images.map((img, idx) => {
        const data = getImage(img.id);
        if (!data) return null;
        return (
          <div key={idx} className={`${img.span} ${img.h} relative rounded-[2rem] overflow-hidden shadow-lg group bg-slate-100`}>
            <Image 
              src={data.imageUrl} 
              alt={data.description} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110" 
              data-ai-hint={data.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      })}
    </div>
  );
}

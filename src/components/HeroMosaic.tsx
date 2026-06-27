
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Complex Image Mosaic Grid Component featuring Attractive Places.
 * Implements a precise 12x12 grid layout representing the global mission.
 */
export default function HeroMosaic() {
  const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

  const mosaicItems = [
    { id: 'place-tropical', className: 'col-span-4 row-span-3' },
    { id: 'place-europe', className: 'col-start-5 col-span-4 row-span-3' },
    { id: 'place-asia', className: 'col-start-9 col-span-4 row-span-3' },
    { id: 'place-resort', className: 'col-start-3 col-span-6 row-start-4 row-span-5 rounded-[2rem]' },
    { id: 'place-modern', className: 'col-start-9 col-span-4 row-start-4 row-span-4' },
    { id: 'place-safari', className: 'col-start-1 col-span-2 row-start-4 row-span-9' },
    { id: 'place-cliff', className: 'col-start-3 col-span-3 row-start-9 row-span-4' },
    { id: 'place-city', className: 'col-start-6 col-span-3 row-start-9 row-span-4' },
    { id: 'place-landscape', className: 'col-start-9 col-span-4 row-start-8 row-span-5' },
  ];

  return (
    <div className="grid grid-cols-12 grid-rows-12 gap-3 h-full min-h-[500px] lg:min-h-0 w-full animate-in fade-in zoom-in-95 duration-1000">
      {mosaicItems.map((item, idx) => {
        const data = getImage(item.id);
        if (!data) return null;
        return (
          <div 
            key={idx} 
            className={cn(
              "relative overflow-hidden shadow-lg group bg-slate-100 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:z-10",
              item.className,
              item.id === 'place-resort' ? 'rounded-[2.5rem]' : 'rounded-2xl'
            )}
          >
            <Image 
              src={data.imageUrl} 
              alt={data.description} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint={item.id.replace('place-', '').replace('-', ' ')}
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        );
      })}
    </div>
  );
}


'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Complex Image Mosaic Grid Component.
 * Implements a precise 12x12 grid layout based on the design specifications.
 */
export default function HeroMosaic() {
  const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

  const mosaicItems = [
    { id: 'mosaic-planting', className: 'col-span-4 row-span-3' },
    { id: 'mosaic-volunteers', className: 'col-start-5 col-span-4 row-span-3' },
    { id: 'mosaic-beach', className: 'col-start-9 col-span-4 row-span-3' },
    { id: 'mosaic-globe-center', className: 'col-start-3 col-span-6 row-start-4 row-span-5 rounded-[2rem]' },
    { id: 'mosaic-food-bank', className: 'col-start-9 col-span-4 row-start-4 row-span-4' },
    { id: 'mosaic-overlook', className: 'col-start-1 col-span-2 row-start-4 row-span-9' },
    { id: 'mosaic-circle', className: 'col-start-3 col-span-3 row-start-9 row-span-4' },
    { id: 'mosaic-hands', className: 'col-start-6 col-span-3 row-start-9 row-span-4' },
    { id: 'mosaic-smiling', className: 'col-start-9 col-span-4 row-start-8 row-span-5' },
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
              item.id === 'mosaic-globe-center' ? 'rounded-[2.5rem]' : 'rounded-2xl'
            )}
          >
            <Image 
              src={data.imageUrl} 
              alt={data.description} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint={item.id.replace('mosaic-', '').replace('-', ' ')}
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        );
      })}
    </div>
  );
}

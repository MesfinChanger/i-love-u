
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * @fileOverview High-Fidelity Community Collage.
 * Features a dynamic grid of mission-aligned visuals showing global prosperity.
 */
export default function GlobalCommunityCollage() {
  const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

  return (
    <div className="grid grid-cols-12 gap-4 rounded-[40px] overflow-hidden">
      {/* Row 1 */}
      <div className="col-span-3 h-64 relative rounded-3xl overflow-hidden shadow-lg group">
        <Image src={getImage('collage-1')} alt="Volunteers" fill className="object-cover transition-transform group-hover:scale-110" />
      </div>
      <div className="col-span-4 h-64 relative rounded-3xl overflow-hidden shadow-lg group">
        <Image src={getImage('collage-2')} alt="Friends" fill className="object-cover transition-transform group-hover:scale-110" />
      </div>
      <div className="col-span-3 h-64 relative rounded-3xl overflow-hidden shadow-lg group">
        <Image src={getImage('collage-3')} alt="Donation" fill className="object-cover transition-transform group-hover:scale-110" />
      </div>
      <div className="col-span-2 h-64 relative rounded-3xl overflow-hidden shadow-lg group">
        <Image src={getImage('collage-4')} alt="Beach" fill className="object-cover transition-transform group-hover:scale-110" />
      </div>

      {/* Row 2 */}
      <div className="col-span-3 h-80 relative rounded-3xl overflow-hidden shadow-xl group">
        <Image src={getImage('collage-5')} alt="Elderly Support" fill className="object-cover transition-transform group-hover:scale-110" />
      </div>
      <div className="col-span-6 h-80 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 group">
        <Image src={getImage('collage-6')} alt="Global Community" fill className="object-cover transition-transform group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="col-span-3 h-80 relative rounded-3xl overflow-hidden shadow-xl group">
        <Image src={getImage('collage-7')} alt="Food Support" fill className="object-cover transition-transform group-hover:scale-110" />
      </div>

      {/* Row 3 */}
      <div className="col-span-4 h-56 relative rounded-3xl overflow-hidden shadow-md group">
        <Image src={getImage('collage-8')} alt="Circle" fill className="object-cover transition-transform group-hover:scale-110" />
      </div>
      <div className="col-span-4 h-56 relative rounded-3xl overflow-hidden shadow-md group">
        <Image src={getImage('collage-9')} alt="Unity" fill className="object-cover transition-transform group-hover:scale-110" />
      </div>
      <div className="col-span-4 h-56 relative rounded-3xl overflow-hidden shadow-md group">
        <Image src={getImage('collage-10')} alt="Celebration" fill className="object-cover transition-transform group-hover:scale-110" />
      </div>
    </div>
  );
}

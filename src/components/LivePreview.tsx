
"use client";

import { useEffect, useState } from 'react';
import { Smartphone, RefreshCw, Layers, LayoutTemplate } from 'lucide-react';
import { FlutterTemplate } from '@/lib/templates';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export function LivePreview({ template }: { template: FlutterTemplate }) {
  const [isRotating, setIsRotating] = useState(false);
  const image = PlaceHolderImages.find(img => img.id === template.imageKey);

  const handleRefresh = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 800);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-[320px] mb-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Smartphone className="w-4 h-4" />
          Mobile Preview
        </div>
        <button 
          onClick={handleRefresh}
          className={`p-2 rounded-full hover:bg-white/50 transition-colors ${isRotating ? 'animate-spin' : ''}`}
        >
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="relative w-[320px] h-[640px] bg-neutral-900 rounded-[3rem] p-4 shadow-[0_0_0_8px_#171717,0_32px_64px_-16px_rgba(0,0,0,0.3)] border-[8px] border-neutral-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-b-2xl z-20"></div>
        
        <div className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden">
          <div className="h-full w-full relative">
             {/* Mock App UI */}
             <div className="absolute inset-0 flex flex-col">
                <div className="h-16 bg-white border-b px-4 flex items-center justify-between pt-6">
                  <div className="font-bold text-lg text-primary">{template.name}</div>
                  <div className="flex gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-neutral-100" />
                    <div className="w-4 h-4 rounded-full bg-neutral-100" />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  {image && (
                    <Image 
                      src={image.imageUrl} 
                      alt="Preview screen" 
                      fill 
                      className="object-cover opacity-90"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-4 w-3/4 bg-neutral-100 rounded mb-2" />
                    <div className="h-4 w-1/2 bg-neutral-100 rounded" />
                  </div>
                </div>
                <div className="h-14 bg-white border-t flex justify-around items-center px-4">
                  <LayoutTemplate className="w-5 h-5 text-primary" />
                  <Layers className="w-5 h-5 text-neutral-300" />
                  <Smartphone className="w-5 h-5 text-neutral-300" />
                </div>
             </div>
          </div>
        </div>
        
        {/* Side buttons */}
        <div className="absolute -right-2 top-24 w-1 h-12 bg-neutral-800 rounded-l" />
        <div className="absolute -left-2 top-24 w-1 h-20 bg-neutral-800 rounded-r" />
      </div>
      
      <p className="text-xs text-muted-foreground text-center max-w-[280px]">
        Interactively testing the UI components of {template.name} on a simulated Android/iOS environment.
      </p>
    </div>
  );
}

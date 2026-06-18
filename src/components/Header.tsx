
'use client';

import Link from 'next/link';
import { Heart, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DonationDialog } from '@/components/DonationDialog';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md" role="banner">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 group" aria-label="I Love U Home">
          <div className="relative">
            <Heart className="w-8 h-8 fill-primary text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-1 h-1 bg-white rounded-full mt-[-2px] ml-[-3px]" />
               <div className="w-1 h-1 bg-white rounded-full mt-[-2px] ml-[3px]" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-xl tracking-tighter text-primary">I LOVE</span>
            <span className="font-black text-xs tracking-[0.3em] text-muted-foreground ml-0.5">YOU</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-1">
          <DonationDialog />
          <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Search profiles">
            <Search className="w-5 h-5" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground relative" aria-label="View notifications">
            <Bell className="w-5 h-5" aria-hidden="true" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}

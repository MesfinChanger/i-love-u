'use client';

import Link from 'next/link';
import { Heart, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DonationDialog } from '@/components/DonationDialog';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md" role="banner">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" aria-label="I Love U Home">
          <div className="relative shiny-icon p-2 rounded-xl bg-primary/5">
            <Heart className="w-14 h-14 fill-primary text-primary transition-transform group-hover:scale-110 animate-pulse" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full mt-[-4px] ml-[-5px]" />
               <div className="w-2 h-2 bg-white rounded-full mt-[-4px] ml-[5px]" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-3xl tracking-tighter text-primary">I LOVE</span>
            <span className="font-black text-sm tracking-[0.4em] text-muted-foreground ml-1">YOU</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-2">
          <DonationDialog />
          <Button variant="ghost" size="icon" className="text-muted-foreground w-12 h-12" aria-label="Search profiles">
            <Search className="w-6 h-6" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground relative w-12 h-12" aria-label="View notifications">
            <Bell className="w-6 h-6" aria-hidden="true" />
            <span className="absolute top-3 right-3 w-3 h-3 bg-primary rounded-full border-2 border-white" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}

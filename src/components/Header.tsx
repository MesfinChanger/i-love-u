'use client';

import Link from 'next/link';
import { Heart, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DonationDialog } from '@/components/DonationDialog';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md" role="banner">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" aria-label="I Love U Home">
          <div className="relative shiny-icon p-1.5 rounded-lg bg-primary/5">
            <Heart className="w-10 h-10 fill-primary text-primary transition-transform group-hover:scale-110 animate-pulse" aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-xl tracking-tighter text-primary">I LOVE</span>
            <span className="font-black text-[6px] tracking-[0.4em] text-muted-foreground ml-0.5">YOU</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-2">
          <DonationDialog />
          <Button variant="ghost" size="icon" className="text-muted-foreground w-10 h-10" aria-label="Search profiles">
            <Search className="w-5 h-5" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground relative w-10 h-10" aria-label="View notifications">
            <Bell className="w-5 h-5" aria-hidden="true" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}

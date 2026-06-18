'use client';

import Link from 'next/link';
import { Heart, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md" role="banner">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-primary" aria-label="Spark Home">
          <Heart className="w-8 h-8 fill-primary" aria-hidden="true" />
          <span>SPARK</span>
        </Link>
        
        <div className="flex items-center gap-2">
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

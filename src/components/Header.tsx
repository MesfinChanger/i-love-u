
"use client";

import Link from 'next/link';
import { Layout, Search, Heart, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Layout className="w-5 h-5" />
          </div>
          <span className="font-headline">FlutterFlow Kit</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/templates" className="text-sm font-medium hover:text-primary transition-colors">Templates</Link>
          <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
          <Link href="/#ai" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent" />
            AI Generator
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex">Sign In</Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
}

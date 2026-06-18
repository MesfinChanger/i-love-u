'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Heart, User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/discover', icon: Sparkles, label: 'Discover' },
    { href: '/matches', icon: Heart, label: 'Matches' },
    { href: '/shop', icon: ShoppingBag, label: 'Shop' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t py-2 px-6 flex justify-around items-center z-50" role="navigation" aria-label="Main Navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/matches' && pathname?.startsWith('/matches')) || (item.href === '/shop' && pathname?.startsWith('/shop'));
        return (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            asChild
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-col gap-1 h-auto py-2",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Link href={item.href} aria-label={item.label}>
              <item.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

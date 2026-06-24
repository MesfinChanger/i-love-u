
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Heart, User, ShoppingBag, Globe2, Search, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from './providers/LanguageProvider';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: '/', icon: Home, label: t('nav.home') },
    { href: '/discover', icon: Sparkles, label: t('nav.discover') },
    { href: '/search', icon: Search, label: t('nav.search') },
    { href: '/community', icon: Globe2, label: t('nav.global') },
    { href: '/matches', icon: Heart, label: t('nav.matches') },
    { href: '/shop', icon: ShoppingBag, label: t('nav.shop') },
    { href: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t py-2 px-4 flex justify-around items-center z-50" role="navigation" aria-label="Main Navigation">
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
              "flex flex-col gap-1 h-auto py-2 px-1 flex-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Link href={item.href} aria-label={item.label}>
              <item.icon className={cn("w-5 h-5", isActive && "fill-primary/20")} aria-hidden="true" />
              <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

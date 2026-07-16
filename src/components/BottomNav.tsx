'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', emoji: "🏠", label: "Home" },
    { href: '/spark', emoji: "❤️", label: "Spark" },
    { href: '/circle', emoji: "🤝", label: "Circle" },
    { href: '/shopping', emoji: "🛒", label: "Shopping" },
    { href: '/ideas', emoji: "💡", label: "Ideas" },
    { href: '/messages', emoji: "💬", label: "Messages" },
    { href: '/profile', emoji: "👤", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t py-2 px-4 flex justify-around items-center z-50" role="navigation" aria-label="Main Navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
        return (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              "flex flex-col gap-1 h-auto py-2 px-1 flex-1 transition-all active:scale-95",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Link href={item.href} aria-label={item.label}>
              <span className="text-lg leading-none">{item.emoji}</span>
              <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

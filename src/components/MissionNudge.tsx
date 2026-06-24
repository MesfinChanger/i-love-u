'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, TrendingDown, X, Globe } from 'lucide-react';
import Link from 'next/link';

/**
 * @fileOverview Dynamic Mission Nudge Protocol.
 * Periodic reminder of the "End Poverty" mission, appearing every 20 minutes on core pages.
 */
export function MissionNudge() {
  const { user } = useUser();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 20 Minutes in milliseconds
  const NUDGE_INTERVAL = 20 * 60 * 1000; 
  const STORAGE_KEY = 'iloveu_last_mission_nudge';

  const targetPages = ['/discover', '/community', '/matches'];
  const isTargetPage = targetPages.some(p => pathname === p || pathname?.startsWith(p + '/'));

  useEffect(() => {
    setMounted(true);
    if (!user || !isTargetPage) {
      setIsVisible(false);
      return;
    }

    const checkNudge = () => {
      const lastNudge = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();

      if (!lastNudge || now - parseInt(lastNudge) > NUDGE_INTERVAL) {
        setIsVisible(true);
      }
    };

    // Check immediately and then every minute
    checkNudge();
    const interval = setInterval(checkNudge, 60000);

    return () => clearInterval(interval);
  }, [user, pathname, isTargetPage, NUDGE_INTERVAL]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const handleSupport = () => {
    handleDismiss();
  };

  if (!mounted || !user || !isVisible || !isTargetPage) return null;

  return (
    <div className="fixed bottom-28 left-6 right-6 z-[60] sm:bottom-24 sm:left-auto sm:right-10 sm:w-80 animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 shadow-2xl border border-primary/20 relative overflow-hidden group">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
          <TrendingDown className="w-20 h-20 text-primary" />
        </div>

        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1"
          aria-label="Dismiss nudge"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/30 animate-pulse">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest text-primary leading-none">Mission Update</h4>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 mt-1">End Poverty Revolution</p>
          </div>
        </div>

        <p className="text-xs text-white/80 leading-relaxed font-medium italic mb-6">
          "Every match is a miracle." Help us reach the next village. Your 0.25 contribution creates a global job today. ❤️
        </p>

        <Button 
          asChild 
          onClick={handleSupport}
          className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-secondary/20 transition-all active:scale-95"
        >
          <Link href="/donate">
            <Sparkles className="w-4 h-4 mr-2" />
            Support Mission
          </Link>
        </Button>

        <div className="mt-4 flex items-center justify-center gap-2 opacity-20">
           <Globe className="w-3 h-3" />
           <p className="text-[7px] font-black uppercase tracking-widest">Mandatory Love • Prosperity</p>
        </div>
      </div>
    </div>
  );
}

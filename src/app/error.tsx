'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, RefreshCw, ShieldAlert, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * @fileOverview Global Error Boundary for the Prosperity Revolution.
 * Designed to catch unexpected crashes and provide a mission-aligned recovery path.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for community maintenance
    console.error('Self-Maintenance Triggered:', error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-white text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 relative">
        <Heart className="w-12 h-12 text-primary fill-primary/5 animate-pulse" />
        <ShieldAlert className="absolute -top-2 -right-2 w-8 h-8 text-amber-500 bg-white rounded-full p-1 border shadow-sm" />
      </div>
      
      <div className="max-w-md space-y-4 mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">System Reflection</h1>
        <p className="text-lg text-muted-foreground font-medium italic leading-relaxed">
          "Even the brightest spark needs a moment of rest." The Prosperity Network encountered an unexpected ripple.
        </p>
        <div className="p-4 bg-muted/30 rounded-2xl border border-dashed text-[10px] text-muted-foreground font-mono break-all opacity-60">
          Error: {error.message || "Unknown Connection Interruption"}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Button 
          onClick={() => reset()} 
          className="h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-xs flex-1 shadow-xl shadow-primary/20 transition-transform active:scale-95"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Restore Connection
        </Button>
        <Button 
          variant="outline" 
          asChild
          className="h-16 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] flex-1"
        >
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Home Base
          </Link>
        </Button>
      </div>

      <p className="mt-12 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
        Happiness is Mandatory ❤️ Self-Maintaining Prosperity
      </p>
    </div>
  );
}

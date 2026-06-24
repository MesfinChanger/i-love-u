'use client';

import { useUser } from '@/firebase';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * @fileOverview A persistent reminder for guests to join the "I Love U" community.
 * Optimized with local storage persistence to remember dismissal.
 */
export function RegistrationReminder() {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only show if not previously dismissed by the user
    const isHidden = localStorage.getItem('iloveu_registration_reminder_hidden') === 'true';
    if (!isHidden) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('iloveu_registration_reminder_hidden', 'true');
  };

  // Don't show if auth is loading, user is logged in, they are on the login page, or it was dismissed
  if (!mounted || loading || user || pathname === '/login' || pathname === '/policy/agree') return null;
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-500 md:bottom-10 md:left-auto md:right-10 md:w-96">
      <div className="bg-white/95 backdrop-blur-xl border-2 border-primary/20 p-6 rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(255,51,102,0.3)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDismiss} 
            className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Hide reminder"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
            <Heart className="w-6 h-6 fill-white animate-heartbeat" />
          </div>
          <div>
            <h4 className="font-black text-lg tracking-tighter text-primary leading-tight flex items-center gap-1.5">
              Join the Spark
              <Sparkles className="w-3.5 h-3.5" />
            </h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prosperity for every heart</p>
          </div>
        </div>
        
        <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium italic">
          "Your happiness builds lives." Register now to start connecting and help us eliminate global poverty through global job creation.
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="rounded-2xl h-12 gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/10">
            <Link href="/login">Launch Spark</Link>
          </Button>
          <Button variant="outline" asChild className="rounded-2xl h-12 border-2 font-black uppercase text-[10px] tracking-widest hover:bg-primary/5 transition-colors">
            <Link href="/donate">Support Mission</Link>
          </Button>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-2 opacity-30">
           <div className="h-px w-8 bg-muted-foreground" />
           <p className="text-[8px] font-black uppercase tracking-widest">Respect & Love is Mandatory</p>
           <div className="h-px w-8 bg-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

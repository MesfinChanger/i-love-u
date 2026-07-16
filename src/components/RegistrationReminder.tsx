
'use client';

import { useUser } from '@/firebase';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, X, Sparkles, TrendingDown, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * @fileOverview Vibrant Registration Reminder.
 * Optimized with high-fidelity visuals to encourage guest hearts to join the permanent mission.
 */
export function RegistrationReminder() {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only show if not previously dismissed by the user in this session
    const isHidden = localStorage.getItem('iloveu_registration_reminder_hidden') === 'true';
    if (!isHidden) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('iloveu_registration_reminder_hidden', 'true');
  };

  // Logic: Show if user is anonymous (Guest) or not logged in at all.
  const isGuest = user?.isAnonymous;
  const showNudge = !user || isGuest;

  // Don't show if auth is loading, they are on auth pages, or it was dismissed
  if (!mounted || loading || !showNudge || pathname === '/login' || pathname === '/policy/agree') return null;
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-700 md:bottom-10 md:left-auto md:right-10 md:w-[400px]">
      <div className="bg-white/95 backdrop-blur-2xl border-2 border-primary/20 p-8 rounded-[3rem] shadow-[0_40px_100px_-10px_rgba(255,51,102,0.3)] relative overflow-hidden group">
        
        {/* Background Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

        <div className="absolute top-4 right-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDismiss} 
            className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
            aria-label="Hide invitation"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-5 mb-6">
          <div className="relative shrink-0">
             <div className="w-16 h-16 rounded-[1.8rem] gradient-bg flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform duration-500">
                <Heart className="w-8 h-8 fill-white animate-heartbeat" />
             </div>
             <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md text-secondary border border-secondary/20">
                <Sparkles className="w-3.5 h-3.5" />
             </div>
          </div>
          <div>
            <h4 className="font-black text-2xl tracking-tighter text-slate-900 leading-none">
              {isGuest ? 'Join the' : 'Start Your'} <span className="text-primary">Journey.</span>
            </h4>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1.5">Reaching Every Heart</p>
          </div>
        </div>
        
        <p className="text-base text-slate-600 leading-relaxed mb-8 font-medium italic">
          {isGuest 
            ? '"Guests explore, but members prosper." Create a permanent identity to secure your matches and support global job creation. ❤️'
            : '"Your happiness builds lives." Register now to connect with respectful hearts and help us end world poverty together. ❤️'}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <Button asChild className="h-16 rounded-2xl gradient-bg font-black uppercase tracking-[0.1em] text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group/btn">
            <Link href="/login" className="flex items-center gap-2">
              Launch Spark
              <Sparkles className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            asChild 
            className="h-16 rounded-2xl border-2 border-slate-100 font-black uppercase tracking-[0.1em] text-[10px] hover:bg-slate-50 transition-all active:scale-95"
          >
            <Link href="/donate" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              Support Mission
            </Link>
          </Button>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-3 opacity-20">
           <Globe className="w-4 h-4" />
           <p className="text-[9px] font-black uppercase tracking-[0.4em] whitespace-nowrap">Respect & Love is Mandatory</p>
           <Globe className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

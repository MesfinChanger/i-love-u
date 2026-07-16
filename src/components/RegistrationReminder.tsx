'use client';

import { useUser } from '@/firebase';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, X, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export function RegistrationReminder() {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isHidden = localStorage.getItem('iloveu_registration_reminder_hidden') === 'true';
    if (!isHidden) setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('iloveu_registration_reminder_hidden', 'true');
  };

  const isGuest = user?.isAnonymous;
  const showNudge = !user || isGuest;

  if (!mounted || loading || !showNudge || pathname === '/login' || pathname === '/policy/agree') return null;
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-700 md:bottom-10 md:left-auto md:right-10 md:w-[400px]">
      <div className="bg-white/95 backdrop-blur-2xl border-2 border-primary/20 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <button onClick={handleDismiss} className="absolute top-4 right-4 text-muted-foreground hover:text-primary"><X className="w-4 h-4" /></button>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-[1.8rem] gradient-bg flex items-center justify-center text-white shadow-xl">
             <Heart className="w-8 h-8 fill-white animate-heartbeat" />
          </div>
          <div>
            <h4 className="font-black text-2xl tracking-tighter text-slate-900 leading-none">Start Your <span className="text-primary">Journey.</span></h4>
            <p className="text-[10px] font-black uppercase text-muted-foreground mt-1.5">Identity Ripple Protocol</p>
          </div>
        </div>
        <p className="text-base text-slate-600 leading-relaxed mb-8 font-medium italic">"Every spark needs a permanent home." Join the mission to end world poverty today. ❤️</p>
        <Button asChild className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl active:scale-95 transition-all">
          <Link href="/login" className="flex items-center gap-2"><Zap className="w-4 h-4" /> Join Mission</Link>
        </Button>
      </div>
    </div>
  );
}

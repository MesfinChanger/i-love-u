'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';

/**
 * @fileOverview Guest Explorer Timer.
 * Displays remaining session time for anonymous hearts.
 */
export default function GuestNotice() {
  const { user } = useUser();
  const [minutes, setMinutes] = useState(30);

  useEffect(() => {
    if (!user?.isAnonymous) return;

    const timer = setInterval(() => {
      setMinutes((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000);

    return () => clearInterval(timer);
  }, [user]);

  if (!user?.isAnonymous) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 rounded-[2rem] border border-primary/20 shadow-xl text-center animate-in slide-in-from-bottom-5">
      <div className="flex flex-col items-center gap-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">🌎 Guest Explorer</p>
        <p className="text-sm font-medium italic">
          You have <span className="font-bold text-white not-italic">{minutes}</span> minutes remaining.
        </p>
        <p className="text-[8px] font-bold uppercase text-white/40 tracking-tight mt-1">
          Create your identity to unlock full connection.
        </p>
      </div>
    </div>
  );
}

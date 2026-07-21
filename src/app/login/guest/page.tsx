"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { Loader2, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createGuestSession } from "@/services/guest/guestSession.service";

/**
 * @fileOverview Guest Authentication Gateway.
 * Handles the anonymous sign-in logic and launches the 30-minute high-fidelity session via the centralized service.
 * Refactored to utilize a single security gate protocol.
 */
export default function GuestLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function launchGuestSession() {
      try {
        if (!auth) throw new Error("Authentication bridge not initialized.");
        
        const result = await signInAnonymously(auth);
        
        if (mounted) {
          /**
           * Unified Security Gate.
           * Registers the session and initializes the permissions registry in one call.
           */
          await createGuestSession(result.user.uid);

          toast({ title: "Welcome Guest Heart ❤️", description: "Identity synchronized with the mission." });
          router.replace('/dashboard');
        }
      } catch (err: any) {
        if (mounted) {
          console.error("Guest login error:", err);
          setError(err.message || "Unable to enter as guest");
          toast({ variant: "destructive", title: "Access Ripple", description: err.message });
        }
      }
    }

    launchGuestSession();
    return () => { mounted = false; };
  }, [router, toast]);

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-red-500 opacity-20" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-red-600">Access Ripple</h1>
        <p className="mt-2 text-muted-foreground italic font-medium max-w-xs">{error}</p>
        <button onClick={() => router.push('/')} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest">
          Return Home
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-pink-50 text-center">
      <div className="space-y-6 animate-pulse">
        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mx-auto ring-8 ring-pink-50">
          <Heart className="w-12 h-12 text-pink-500 fill-pink-500 animate-heartbeat" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Synchronizing</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-600">Prosperity Bridge Active</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-xs font-bold italic text-muted-foreground">Identifying your heart...</span>
        </div>
      </div>
    </main>
  );
}

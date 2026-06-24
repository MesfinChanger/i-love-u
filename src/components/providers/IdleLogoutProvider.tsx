
'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useUser, useAuth, useFirestore, useDoc } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview High-Security Idle Timeout Monitor.
 * Automatically signs out hearts after a period of inactivity to protect E2EE keys.
 */
export function IdleLogoutProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(userRef);

  // Default to 5 minutes (300 seconds) if not set
  const timeoutInSeconds = profile?.idleTimeout || 300;

  const handleLogout = useCallback(async () => {
    if (auth && user) {
      try {
        await signOut(auth);
        toast({
          title: "Session Expired",
          description: "Signed out for your security due to inactivity. ❤️",
        });
      } catch (e) {
        console.error("Idle Logout Ripple:", e);
      }
    }
  }, [auth, user, toast]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (user) {
      timerRef.current = setTimeout(handleLogout, timeoutInSeconds * 1000);
    }
  }, [user, timeoutInSeconds, handleLogout]);

  useEffect(() => {
    if (!user) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => resetTimer();

    events.forEach(event => window.addEventListener(event, handleActivity));
    
    // Initial start
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, resetTimer]);

  return <>{children}</>;
}

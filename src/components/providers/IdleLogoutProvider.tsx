'use client';

import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';

import {
  useUser,
  useAuth,
  useFirestore,
  useDoc
} from '@/firebase';

import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';

import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useToast } from '@/hooks/use-toast';

/**
 * High-Security Idle Timeout Monitor.
 * Hardened to prevent hydration event listener loops.
 */
export function IdleLogoutProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);

  // Memoize timeout to ensure stable effect dependencies
  const timeoutInSeconds = useMemo(() => profile?.idleTimeout || 600, [profile?.idleTimeout]);

  const handleLogout = useCallback(async () => {
    if (!auth || !user) return;
    try {
      await signOut(auth);
      toast({
        title: "Session Expired",
        description: "You were signed out for your security. ❤️",
      });
    } catch(error) {
      console.error("Security Monitor: Idle logout ripple:", error);
    }
  }, [auth, user, toast]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (user && auth) {
      timerRef.current = setTimeout(handleLogout, timeoutInSeconds * 1000);
    }
  }, [user, auth, timeoutInSeconds, handleLogout]);

  useEffect(() => {
    if (!user || !auth) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    const handleActivity = () => resetTimer();

    events.forEach(event => window.addEventListener(event, handleActivity));

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, auth, timeoutInSeconds, resetTimer]);

  return <>{children}</>;
}

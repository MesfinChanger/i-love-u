'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview Resilient User Hook.
 * Hardened to handle missing Auth instances without throwing TypeErrors.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is null (Safe-Mode), we can't listen for state changes
    if (!auth) {
      setLoading(false);
      return;
    }

    try {
      // Defensive check to ensure auth instance is valid for modular SDK
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      }, (error) => {
        console.warn("I Love U: Auth observer error handled.", error);
        setLoading(false);
      });
      
      return () => unsubscribe();
    } catch (e) {
      console.warn("I Love U: Auth state listener bypass:", e);
      setLoading(false);
    }
  }, [auth]);

  return { user, loading };
}

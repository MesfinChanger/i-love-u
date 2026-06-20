'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview Resilient User Hook.
 * Hardened to handle missing Auth instances gracefully during initialization.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is not yet available, we wait in loading state
    if (!auth) {
      // Small timeout to prevent permanent hang
      const timer = setTimeout(() => {
        setLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      }, (error) => {
        console.error("I Love U: Auth observer ripple:", error);
        setLoading(false);
      });
      
      return () => unsubscribe();
    } catch (e) {
      console.warn("I Love U: Auth listener subscription pending:", e);
      setLoading(false);
    }
  }, [auth]);

  return { user, loading };
}

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
      // Small timeout to allow platform a moment to initialize
      const timer = setTimeout(() => {
        if (!auth) setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      }, (error) => {
        console.error("I Love U: Auth observer error:", error);
        setLoading(false);
      });
      
      return () => unsubscribe();
    } catch (e) {
      console.warn("I Love U: Auth listener subscription failed:", e);
      setLoading(false);
    }
  }, [auth]);

  return { user, loading };
}

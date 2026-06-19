'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview Resilient User Hook.
 * Hardened to handle missing Auth instances gracefully.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is not yet available, we stay in loading state
    if (!auth) {
      // Small timeout to prevent immediate flickering if it's just a initialization ripple
      const timer = setTimeout(() => {
        if (!auth) setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    }, (error) => {
      console.error("I Love U: Auth observer error:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}

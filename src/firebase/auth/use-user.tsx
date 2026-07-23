'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview High-Fidelity Auth Hook.
 * Hardened to handle uninitialized authentication bridges gracefully.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || typeof onAuthStateChanged !== 'function') {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
      (error) => {
        console.error("Auth Bridge: Sync Ripple:", error);
        setLoading(false);
      }
    );

    // Safety timeout to prevent retrieving hang
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [auth, loading]);

  return {
    user,
    loading
  };
}

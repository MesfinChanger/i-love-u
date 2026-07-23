'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview High-Fidelity Auth Hook.
 * Hardened to prevent hydration re-run loops by batching state updates
 * and ensuring stable initialization.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Protocol: If auth bridge is missing, immediately resolve loading to prevent page hangs
    if (!auth || typeof onAuthStateChanged !== 'function') {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (isMounted) {
          // Batching the updates to prevent redundant rendering cycles
          setUser(firebaseUser);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Auth Bridge: Sync Ripple:", error);
        if (isMounted) setLoading(false);
      }
    );

    // Safety timeout to prevent infinite "retrieving" state in restricted networks
    const timer = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
      unsubscribe();
      clearTimeout(timer);
    };
  }, [auth]);

  return {
    user,
    loading
  };
}

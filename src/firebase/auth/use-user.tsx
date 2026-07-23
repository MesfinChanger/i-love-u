'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview High-Fidelity Auth Hook.
 * Hardened to handle uninitialized authentication bridges gracefully.
 * Stabilized to prevent hydration re-run loops.
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

    // Safety timeout to prevent infinite "retrieving" state in restricted networks
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
    // loading is removed from dependencies to prevent redundant hydration re-runs
  }, [auth]);

  return {
    user,
    loading
  };
}

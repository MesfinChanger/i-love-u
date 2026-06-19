'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview Hook to access the current authenticated user.
 * Hardened to handle modular Firebase instances safely.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Modular check: Ensure auth is a valid instance from the SDK
    if (!auth) {
      setLoading(false);
      return;
    }

    try {
      return onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
    } catch (e) {
      console.warn("Auth state listener failed (Likely invalid config):", e);
      setLoading(false);
    }
  }, [auth]);

  return { user, loading };
}

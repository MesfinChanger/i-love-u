'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview Resilient User Hook.
 * Hardened to handle modular Firebase instances safely without throwing TypeErrors.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Modular check: Ensure auth is a valid instance before subscribing
    if (!auth || typeof auth.onAuthStateChanged !== 'undefined') {
      // In Modular SDK v9+, methods like onAuthStateChanged are standalone functions
      // The presence of the auth object is the correct gate.
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    try {
      // We use the standalone method from firebase/auth
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
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

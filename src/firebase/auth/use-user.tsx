'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview High-Fidelity Auth Hook with Runtime Tracing.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.time('📡 Auth_Listener_Sync');
    
    if (!auth || typeof onAuthStateChanged !== 'function') {
      console.warn("Auth Bridge: Bridge not ready or invalid instance.");
      setLoading(false);
      console.timeEnd('📡 Auth_Listener_Sync');
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
        console.timeEnd('📡 Auth_Listener_Sync');
      },
      (error) => {
        console.error("Auth Bridge: Sync Ripple:", error);
        setLoading(false);
        console.timeEnd('📡 Auth_Listener_Sync');
      }
    );

    // Safety timeout to prevent retrieving hang
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("Auth Bridge: Sync timed out after 5s.");
        setLoading(false);
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [auth]);

  return {
    user,
    loading
  };
}

'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * @fileOverview Client-side wrapper for the Firebase Provider.
 * Circular dependency resolved by refactoring barrel exports.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // Use useMemo to ensure initialization only happens once on the client
  const instances = useMemo(() => initializeFirebase(), []);
  
  return (
    <FirebaseProvider 
      app={instances.app} 
      db={instances.db} 
      auth={instances.auth} 
      storage={instances.storage}
    >
      {children}
    </FirebaseProvider>
  );
}

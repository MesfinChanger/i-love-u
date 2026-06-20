/**
 * @fileOverview Client-side Firebase Provider.
 * Imports initialization logic from init.ts to avoid barrel circularity.
 */
'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
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

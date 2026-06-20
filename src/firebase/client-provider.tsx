/**
 * @fileOverview Client-side Firebase Provider.
 * Direct relative imports to prevent circular dependency loops.
 */
'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
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

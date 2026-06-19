'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer.
 * Standardized boot sequence for the Prosperity Revolution.
 */
export function initializeFirebase(): { 
  app: FirebaseApp | null; 
  db: Firestore | null; 
  auth: Auth | null;
  storage: FirebaseStorage | null;
} {
  // SSR Safety
  if (typeof window === 'undefined') {
    return { app: null, db: null, auth: null, storage: null };
  }

  // Basic check to prevent early initialization crashes
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('YOUR_')) {
    console.warn("I Love U: Firebase credentials not detected or are placeholders. Waiting for provisioning...");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services with safety checks
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  } catch (error) {
    console.error("I Love U: Core Platform initialization failure:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

// Barrel exports for convenient access
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './storage/use-storage';
export * from './provider';
export * from './client-provider';

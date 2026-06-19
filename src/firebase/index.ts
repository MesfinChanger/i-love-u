'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Standard Firebase Initializer with Safety Guards.
 * Hardened to prevent root-level crashes while allowing services to boot when ready.
 */
export function initializeFirebase(): { 
  app: FirebaseApp | null; 
  db: Firestore | null; 
  auth: Auth | null;
  storage: FirebaseStorage | null;
} {
  // SSR Safety: Do not initialize on the server
  if (typeof window === 'undefined') {
    return { app: null, db: null, auth: null, storage: null };
  }

  // If no API Key is provided, we return null to allow the UI to show a "Safe Mode" or setup guide
  if (!firebaseConfig.apiKey) {
    console.warn("I Love U: Firebase API Key is missing. Check your environment variables.");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services with individual safety wrappers
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  } catch (error) {
    console.error("I Love U: Platform initialization failure:", error);
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

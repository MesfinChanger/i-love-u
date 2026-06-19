'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer.
 * Hardened to prevent crashes while allowing services to boot when ready.
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

  // Configuration Gate: Ensure we have at least a plausible API key
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.length < 10) {
    console.warn("I Love U: Firebase is not yet provisioned. Regional bridge is initializing...");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services with individual safety guards
    let db: Firestore | null = null;
    let auth: Auth | null = null;
    let storage: FirebaseStorage | null = null;

    try {
      db = getFirestore(app);
    } catch (e) {
      console.error("Firestore Init Error:", e);
    }

    try {
      auth = getAuth(app);
    } catch (e) {
      console.error("Auth Init Error:", e);
    }

    try {
      storage = getStorage(app);
    } catch (e) {
      console.error("Storage Init Error:", e);
    }
    
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

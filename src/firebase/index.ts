'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer with Google Cloud Storage.
 * Hardened to prevent root-level crashes when API keys are invalid.
 * Returns null for services if initialization fails, allowing the UI to show a "safe-mode".
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

  // Defensive Check: Ensure the API key is not a literal placeholder or empty
  const hasValidConfig = 
    typeof firebaseConfig.apiKey === 'string' && 
    firebaseConfig.apiKey.length > 0 && 
    !firebaseConfig.apiKey.includes('YOUR_');

  if (!hasValidConfig) {
    console.warn("I Love U: Safe-Mode active. Firebase API key is missing or invalid. Demo Access enabled in UI.");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    let db: Firestore | null = null;
    let auth: Auth | null = null;
    let storage: FirebaseStorage | null = null;

    try {
      db = getFirestore(app);
    } catch (e) {
      console.warn("I Love U: Firestore boot-failure handled safely.");
    }

    try {
      auth = getAuth(app);
    } catch (e) {
      console.warn("I Love U: Authentication boot-failure handled safely.");
    }

    try {
      storage = getStorage(app);
    } catch (e) {
      console.warn("I Love U: Storage boot-failure handled safely.");
    }
    
    return { app, db, auth, storage };
  } catch (error) {
    console.error("I Love U: Platform root initialization critical failure:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

// Direct imports to prevent circular dependency issues in Next.js 15
export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './storage/use-storage';

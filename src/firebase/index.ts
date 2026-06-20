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

  // Basic check for presence of API key
  if (!firebaseConfig.apiKey) {
    console.warn("I Love U: Regional bridge waiting for credentials...");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services with safety checks
    let db: Firestore | null = null;
    let auth: Auth | null = null;
    let storage: FirebaseStorage | null = null;

    try { db = getFirestore(app); } catch (e) { console.error("Firestore init failed:", e); }
    try { auth = getAuth(app); } catch (e) { console.error("Auth init failed:", e); }
    try { storage = getStorage(app); } catch (e) { console.error("Storage init failed:", e); }
    
    return { app, db, auth, storage };
  } catch (error) {
    console.error("I Love U: Core Platform initialization failure:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

// Re-export hooks and providers directly to avoid cyclic dependencies in barrel files
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './storage/use-storage';
export * from './provider';

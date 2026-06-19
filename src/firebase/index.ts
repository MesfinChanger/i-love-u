'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer.
 * Standardized boot sequence for the Prosperity Revolution.
 * Hardened to prevent crashes if environment variables are not yet ready.
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

  // Basic check to prevent early initialization crashes with invalid keys
  const hasValidKey = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10;
  
  if (!hasValidKey) {
    console.warn("I Love U: Firebase API key is missing or invalid. Waiting for platform provisioning...");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services with safety checks
    // We wrap each in a try-catch to prevent a single service failure from breaking the app
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

// Barrel exports for convenient access
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './storage/use-storage';
export * from './provider';
export * from './client-provider';

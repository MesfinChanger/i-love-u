'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Standard Firebase Initializer with Safety Guards.
 * Hardened to prevent root-level crashes when API keys are missing or invalid.
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

  // Defensive Check: Validate basic config existence before any SDK calls
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "") {
    console.warn("I Love U: Firebase API Key is missing. System operating in limited mode.");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    // 1. Initialize App
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // 2. Initialize individual services with extreme caution
    let db: Firestore | null = null;
    let auth: Auth | null = null;
    let storage: FirebaseStorage | null = null;

    try {
      db = getFirestore(app);
    } catch (e) {
      console.warn("I Love U: Firestore initialization failed.", e);
    }

    try {
      // Auth initialization is where invalid API keys usually trigger crashes
      auth = getAuth(app);
    } catch (e) {
      console.warn("I Love U: Auth initialization failed (Invalid API Key).", e);
    }

    try {
      storage = getStorage(app);
    } catch (e) {
      console.warn("I Love U: Storage initialization failed.", e);
    }
    
    return { app, db, auth, storage };
  } catch (error) {
    console.error("I Love U: Platform initialization critical failure:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

// Barrel exports
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './storage/use-storage';
export * from './provider';
export * from './client-provider';

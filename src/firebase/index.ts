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

  // Defensive Check: Validate basic config existence
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('YOUR_API_KEY') || firebaseConfig.apiKey === "") {
    console.warn("I Love U: Firebase API Key is missing. System operating in limited mode.");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services individually with safety wrappers
    let db: Firestore | null = null;
    let auth: Auth | null = null;
    let storage: FirebaseStorage | null = null;

    try {
      db = getFirestore(app);
    } catch (e) {
      console.warn("I Love U: Firestore initialization deferred.", e);
    }

    try {
      auth = getAuth(app);
    } catch (e) {
      console.warn("I Love U: Auth initialization deferred.", e);
    }

    try {
      storage = getStorage(app);
    } catch (e) {
      console.warn("I Love U: Storage initialization deferred.", e);
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

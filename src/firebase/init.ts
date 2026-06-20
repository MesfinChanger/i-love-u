'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Core Firebase Initializer.
 * Separated to prevent circular dependencies in the barrel file.
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

  // Check if we have a valid-looking API key
  const hasValidKey = firebaseConfig.apiKey && 
                      firebaseConfig.apiKey.length > 10 && 
                      !firebaseConfig.apiKey.includes('YOUR_');

  if (!hasValidKey) {
    console.warn("I Love U: Regional bridge waiting for valid credentials...");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services with safety guards
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  } catch (error) {
    console.error("I Love U: Platform initialization failure:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

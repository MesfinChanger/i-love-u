'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Core Firebase Initializer.
 * Separated to prevent circular dependencies and handle initialization ripples.
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

  // Strict key validation to prevent SDK crashes with placeholders or invalid keys
  const hasValidKey = firebaseConfig.apiKey && 
                      firebaseConfig.apiKey.length > 20 && 
                      !firebaseConfig.apiKey.includes('YOUR_') &&
                      !firebaseConfig.apiKey.includes('NEXT_PUBLIC_');

  if (!hasValidKey) {
    console.warn("I Love U: Regional bridge waiting for valid credentials...");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services independently to isolate failures
    let db: Firestore | null = null;
    let auth: Auth | null = null;
    let storage: FirebaseStorage | null = null;

    try { db = getFirestore(app); } catch (e) { console.warn("Firestore init ripple:", e); }
    try { auth = getAuth(app); } catch (e) { console.warn("Auth init ripple:", e); }
    try { storage = getStorage(app); } catch (e) { console.warn("Storage init ripple:", e); }
    
    return { app, db, auth, storage };
  } catch (error) {
    console.error("I Love U: Platform initialization failure:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Core Firebase Initializer.
 * Only attempts to boot services if valid credentials (non-placeholder) are detected.
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

  // Final gate: If API Key is missing or too short, we stay in standby.
  const isReady = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 20;

  if (!isReady) {
    console.warn("I Love U: Regional bridge is in standby. Waiting for secure credentials.");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    console.log("I Love U: Regional bridge established successfully! ❤️");
    return { app, db, auth, storage };
  } catch (error: any) {
    console.error("I Love U: Initialization ripple:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

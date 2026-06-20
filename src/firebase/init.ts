'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer.
 * Transitions from null to active services as soon as credentials propagate.
 */
export function initializeFirebase(): { 
  app: FirebaseApp | null; 
  db: Firestore | null; 
  auth: Auth | null;
  storage: FirebaseStorage | null;
} {
  if (typeof window === 'undefined') {
    return { app: null, db: null, auth: null, storage: null };
  }

  // Check if we have a structurally valid API key (Firebase keys are long and don't match variable names)
  const isKeyReady = firebaseConfig.apiKey && 
                     firebaseConfig.apiKey.length > 20 && 
                     !firebaseConfig.apiKey.includes("NEXT_PUBLIC_");

  if (!isKeyReady) {
    console.warn("I Love U: Waiting for regional bridge credentials... ❤️");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  } catch (error: any) {
    console.error("I Love U: Regional bridge ripple:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

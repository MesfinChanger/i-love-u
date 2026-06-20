'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer.
 * Only boots services when a legitimate, provisioned API key is detected.
 * This prevents runtime crashes while the cloud environment is initializing.
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

  const apiKey = firebaseConfig.apiKey;
  
  // High-integrity key check: Real Firebase keys typically start with "AIza" 
  // and are approximately 39-40 characters long.
  const isKeyReady = apiKey && 
                     apiKey.startsWith("AIza") && 
                     apiKey.length > 30;

  if (!isKeyReady) {
    // Platform is in "Regional Bridge Initializing" mode
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  } catch (error: any) {
    console.error("I Love U: Regional bridge initialization ripple:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

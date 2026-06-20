'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer.
 * Strictly gates initialization to prevent "Invalid API Key" crashes while
 * credentials are still propagating in the cloud project.
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
  
  // Standard Firebase API keys start with "AIza" and are roughly 39-40 chars long.
  // We check for presence and prefix to ensure the bridge is ready.
  const isKeyReady = apiKey && 
                     apiKey.startsWith("AIza") && 
                     apiKey.length > 20;

  if (!isKeyReady) {
    // Platform is in "Regional Bridge Initializing" mode.
    // We return nulls to trigger the UI's built-in safety standbys.
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  } catch (error: any) {
    console.warn("I Love U: Regional bridge standby due to init ripple:", error.message);
    return { app: null, db: null, auth: null, storage: null };
  }
}

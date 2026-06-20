'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Core Firebase Initializer.
 * Resilient to missing or partially provisioned environment variables.
 * Prevents initialization with invalid or placeholder API keys.
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

  // Basic validation to prevent SDK from crashing on invalid keys.
  // Standard Firebase keys are usually 39 characters. We check for a minimum length
  // to ensure we aren't passing empty strings or short placeholders.
  const isKeyValid = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 20;

  if (!isKeyValid) {
    console.warn("I Love U: Firebase credentials not detected or invalid. Regional bridge is on standby.");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services individually with fallback
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  } catch (error) {
    console.error("I Love U: Platform initialization ripple:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

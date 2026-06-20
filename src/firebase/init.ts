'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Core Firebase Initializer.
 * Resilient to missing or partially provisioned environment variables.
 * Prevents initialization with invalid or placeholder API keys to avoid runtime crashes.
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
  // and absence of placeholder text to ensure we aren't passing bunk data to the SDK.
  const isKeyValid = firebaseConfig.apiKey && 
                     firebaseConfig.apiKey.length > 20 && 
                     !firebaseConfig.apiKey.includes('NEXT_PUBLIC_');

  if (!isKeyValid) {
    console.warn("I Love U Platform: Valid credentials not yet detected. Regional bridge is on standby.");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services individually
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  } catch (error: any) {
    // If the error is specifically about API key format during initializeApp
    if (error?.message?.toLowerCase().includes('api-key')) {
       console.error("I Love U Platform: API Key rejection ripple detected.");
       return { app: null, db: null, auth: null, storage: null };
    }
    console.error("I Love U Platform: Initialization ripple:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

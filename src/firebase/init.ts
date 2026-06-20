import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer.
 * Hardened to only boot services if legitimate production credentials are present.
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
  
  // Real Firebase API keys start with 'AIza' and are typically 39 characters.
  // We use a strict check to prevent booting with invalid/placeholder credentials.
  const isKeyValid = apiKey && 
                     apiKey.startsWith("AIza") && 
                     apiKey.length >= 35;

  if (!isKeyValid) {
    // Return null services to trigger mission-aligned 'Standby' mode in UI
    // instead of allowing the Firebase SDK to throw auth/api-key-not-valid.
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  } catch (error: any) {
    console.warn("I Love U: Initialization standby. Waiting for regional credentials.");
    return { app: null, db: null, auth: null, storage: null };
  }
}

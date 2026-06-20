import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer.
 * Hardened to only boot services if legitimate credentials are present.
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
  
  // Integrity check: Firebase keys standardly start with 'AIza' and are ~39 chars.
  // This prevents 'auth/api-key-not-valid' technical exceptions during regional bridge stabilization.
  const isKeyValid = apiKey && 
                     apiKey.startsWith("AIza") && 
                     apiKey.length > 30;

  if (!isKeyValid) {
    // Return null services to trigger mission-aligned 'Standby' mode in UI
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

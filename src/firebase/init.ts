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
  
  // High-integrity structural check for Firebase API Keys
  // Valid keys typically start with 'AIza' and are significantly long
  const isKeyValid = !!(apiKey && 
                     apiKey.startsWith("AIza") && 
                     apiKey.length > 20 && 
                     !apiKey.includes("PLACEHOLDER") &&
                     !apiKey.includes("REPLACE_WITH") &&
                     !apiKey.includes("NEXT_PUBLIC_"));

  if (!isKeyValid) {
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  } catch (error: any) {
    return { app: null, db: null, auth: null, storage: null };
  }
}
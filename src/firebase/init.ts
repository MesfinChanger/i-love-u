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
  
  // Basic validation to check if the key is not a literal placeholder or empty.
  // Real keys are usually substitute strings by the build system.
  const isKeyValid = apiKey && 
                     apiKey.length > 0 && 
                     !apiKey.includes("NEXT_PUBLIC_") && 
                     apiKey !== "undefined";

  if (!isKeyValid) {
    // Return null services to trigger 'Standby' mode in UI instead of crashing SDK
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

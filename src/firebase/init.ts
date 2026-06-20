import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer.
 * Only initializes services if a structurally valid API key is present.
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
  
  // High-integrity check: Firebase keys standardly start with 'AIza'
  const isKeyValid = apiKey && 
                     apiKey.startsWith("AIza") && 
                     apiKey.length > 20;

  if (!isKeyValid) {
    // Return null services to trigger 'Regional Bridge Initializing' standby mode in UI
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  } catch (error: any) {
    console.warn("I Love U: Initialization ripple detected:", error.message);
    return { app: null, db: null, auth: null, storage: null };
  }
}
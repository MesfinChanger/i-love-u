import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer.
 * Hardened to only boot services if production credentials are present.
 * Returns null instances during the "Provisioning" phase to prevent runtime crashes.
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
  
  // Basic structural check for Firebase API Keys to detect placeholders
  const isKeyValid = !!(apiKey && 
                     apiKey.length > 10 && 
                     !apiKey.includes("PLACEHOLDER") &&
                     !apiKey.includes("REPLACE_WITH") &&
                     !apiKey.includes("YOUR_"));

  if (!isKeyValid) {
    console.warn("I Love U: Regional Bridge is waiting for a valid NEXT_PUBLIC_FIREBASE_API_KEY to reach the cloud.");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  } catch (error: any) {
    console.error("I Love U: Critical Bridge Failure:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

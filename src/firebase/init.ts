import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer.
 * Hardened to only boot services if production credentials are present.
 * Exports direct instances for auth, db, and storage as requested.
 */

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== 'undefined') {
  const apiKey = firebaseConfig.apiKey;
  const isKeyValid = !!(apiKey && 
                     apiKey.length > 10 && 
                     !apiKey.includes("PLACEHOLDER") &&
                     !apiKey.includes("REPLACE_WITH") &&
                     !apiKey.includes("YOUR_"));

  if (isKeyValid) {
    try {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      storage = getStorage(app);
    } catch (error: any) {
      console.error("I Love U: Critical Bridge Failure:", error);
    }
  } else {
    console.warn("I Love U: Regional Bridge is waiting for a valid NEXT_PUBLIC_FIREBASE_API_KEY.");
  }
}

export { app, db, auth, storage };

export function initializeFirebase() {
  return { app, db, auth, storage };
}

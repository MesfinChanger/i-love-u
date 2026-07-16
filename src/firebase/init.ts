import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Resilient Firebase Initializer.
 * Exports direct instances for auth, db, and storage as requested.
 */

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

const apiKey = firebaseConfig.apiKey;
const isKeyValid = !!(apiKey && 
                   apiKey.length > 10 && 
                   !apiKey.includes("PLACEHOLDER") &&
                   !apiKey.includes("REPLACE_WITH") &&
                   !apiKey.includes("YOUR_"));

if (typeof window !== 'undefined' && isKeyValid) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (error: any) {
    console.error("I Love U: Critical Bridge Failure:", error);
  }
}

export { app, db, auth, storage };

export function initializeFirebase() {
  return { app, db, auth, storage };
}

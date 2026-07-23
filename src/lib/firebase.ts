import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

/**
 * @fileOverview Hardened Firebase Initialization Protocol.
 * Synchronized with the Resilience Protocol to prevent crashes if env vars are missing.
 * Fix: Replaced empty object traps with explicit nulls to prevent runtime deadlocks.
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Credential Shield: Ensure config is valid before initializing
const isConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    if (isConfigValid) {
      try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        console.log("Mission Control: Firebase Bridge Established. ✨");
      } catch (e) {
        console.error("Mission Control: Initialization Ripple:", e);
      }
    } else {
      console.warn("Mission Control: Configuration missing. Bridge in restricted mode. ❤️");
    }
  } else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
}

// Type casting for legacy exports, but values are now safely null if invalid
export { app as app, auth as auth, db as db, storage as storage };

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

/**
 * @fileOverview Hardened Firebase Initialization Protocol.
 * Synchronized with the Resilience Protocol to prevent crashes if env vars are missing during SSR.
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

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (!getApps().length) {
  if (isConfigValid) {
    app = initializeApp(firebaseConfig);
  } else {
    // Fallback for SSR / Building phase to prevent 500 errors
    app = { name: '[DEFAULT]', options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
  }
} else {
  app = getApp();
}

// Initialize services with safe defaults if app is a placeholder
auth = isConfigValid ? getAuth(app) : {} as Auth;
db = isConfigValid ? getFirestore(app) : {} as Firestore;
storage = isConfigValid ? getStorage(app) : {} as FirebaseStorage;

export { app, auth, db, storage };

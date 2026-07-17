/**
 * @fileOverview High-Fidelity Firebase Bridge.
 * Explicitly exports the 'app' instance for universal initialization synchronization.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  Auth
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "@/firebase/config";

// Singleton initialization protocol
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Session Resilience Protocol
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Auth Persistence Ripple:", error);
  });
} else {
  // Server-side initialization
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

// Ensure all instances are exported for the bridge
export { app, auth, db, storage };

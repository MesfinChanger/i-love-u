import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * @fileOverview Resilient Firebase Initializer.
 * Synchronized with the requested direct instance export protocol.
 */

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

const apiKey = firebaseConfig.apiKey;
const isKeyValid = !!(
  apiKey &&
  apiKey.length > 10 &&
  !apiKey.includes("PLACEHOLDER") &&
  !apiKey.includes("REPLACE_WITH") &&
  !apiKey.includes("YOUR_")
);

if (typeof window !== "undefined" && isKeyValid) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("I LOVE U: Critical Bridge Failure:", error);
  }
}

export { auth, db, storage };

/**
 * Returns initialized Firebase instances for the context provider.
 */
export function initializeFirebase() {
  return { app, auth, db, storage };
}

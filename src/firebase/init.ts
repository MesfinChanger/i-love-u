import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * @fileOverview Direct-instance Firebase Initialization.
 * Standardized to export auth, db, and storage directly.
 */

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

const apiKey = firebaseConfig.apiKey;
const isKeyValid = !!(
  apiKey &&
  apiKey.length > 10 &&
  !apiKey.includes("PLACEHOLDER")
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

export { auth, db, storage, app };

export function initializeFirebase() {
  return { app, auth, db, storage };
}

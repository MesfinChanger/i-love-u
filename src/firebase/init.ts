import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * @fileOverview Direct-instance Firebase Initialization.
 * Refactored to explicitly export auth, db, and storage as direct instances.
 */

const apiKey = firebaseConfig.apiKey;
const isKeyValid = !!(
  apiKey &&
  apiKey.length > 10 &&
  !apiKey.includes("PLACEHOLDER")
);

const app = (typeof window !== "undefined" && isKeyValid) 
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : (null as any);

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export { app };

export function initializeFirebase() {
  return { app, auth, db, storage };
}
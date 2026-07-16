import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * @fileOverview High-Fidelity Firebase Initialization.
 * Refactored to provide direct instance exports for auth, db, and storage.
 */

const apiKey = firebaseConfig.apiKey;
const isKeyValid = !!(
  apiKey &&
  apiKey.length > 10 &&
  !apiKey.includes("PLACEHOLDER")
);

const app = (typeof window !== "undefined" && isKeyValid) 
  ? initializeApp(firebaseConfig)
  : (null as any);

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export { app };

export function initializeFirebase() {
  return { app, auth, db, storage };
}
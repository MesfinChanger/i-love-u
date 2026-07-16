import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * @fileOverview High-Fidelity Firebase Initialization.
 * Directly exports auth, db, and storage instances for platform-wide synchronization.
 */

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export function initializeFirebase() {
  return { app, auth, db, storage };
}
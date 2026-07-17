/**
 * @fileOverview High-Fidelity Firebase Bridge.
 * Orchestrates session persistence and provides direct access to cloud services.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "@/firebase/config";

// Singleton initialization pattern to prevent redundant connections in Next.js
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Session Resilience Protocol: Keeps the user logged in after page refreshes
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Auth Persistence Ripple:", error);
  });
}

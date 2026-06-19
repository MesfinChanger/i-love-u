'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * @fileOverview Initializes Firebase services with extreme resilience.
 * Prevents root-level crashes (e.g. auth/invalid-api-key) during the 
 * environment variable provisioning phase.
 */
export function initializeFirebase(): { app: FirebaseApp | null; db: Firestore | null; auth: Auth | null } {
  // Defensive check: Validate API key before initialization
  // Most Firebase errors are triggered by placeholder strings or empty keys.
  const isConfigValid = 
    typeof firebaseConfig.apiKey === 'string' && 
    firebaseConfig.apiKey.length > 10 && 
    !firebaseConfig.apiKey.includes('YOUR_') &&
    !firebaseConfig.apiKey.includes('undefined');
  
  if (!isConfigValid) {
    console.warn("I Love U: Firebase configuration is incomplete. UI is in safe-mode.");
    return { 
      app: null, 
      db: null, 
      auth: null 
    };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    
    return { app, db, auth };
  } catch (error) {
    console.error("Firebase root initialization failed:", error);
    return { 
      app: null, 
      db: null, 
      auth: null 
    };
  }
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';

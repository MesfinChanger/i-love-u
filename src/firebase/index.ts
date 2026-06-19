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
export function initializeFirebase(): { app: FirebaseApp; db: Firestore; auth: Auth } {
  // Defensive check: Validate API key before initialization
  // Most Firebase errors are triggered by placeholder strings or empty keys.
  const isConfigValid = 
    typeof firebaseConfig.apiKey === 'string' && 
    firebaseConfig.apiKey.length > 10 && 
    !firebaseConfig.apiKey.includes('YOUR_');
  
  if (!isConfigValid) {
    console.warn("I Love U: Firebase configuration is incomplete. UI is in safe-mode.");
    return { 
      app: {} as FirebaseApp, 
      db: {} as Firestore, 
      auth: {} as Auth 
    };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Auth initialization is often where the 'invalid-api-key' error is thrown
    let auth: Auth;
    try {
      auth = getAuth(app);
    } catch (authError) {
      console.error("Firebase Auth failed to initialize:", authError);
      auth = {} as Auth;
    }
    
    return { app, db, auth };
  } catch (error) {
    console.error("Firebase root initialization failed:", error);
    return { 
      app: {} as FirebaseApp, 
      db: {} as Firestore, 
      auth: {} as Auth 
    };
  }
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';

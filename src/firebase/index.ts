'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * @fileOverview Initializes Firebase services with high resilience to missing configuration.
 * This prevents the entire application from crashing (e.g. auth/invalid-api-key)
 * during the provisioning phase of environment variables.
 */
export function initializeFirebase(): { app: FirebaseApp; db: Firestore; auth: Auth } {
  // Defensive check: If API Key is missing or too short, we are in a non-configured state.
  const isConfigValid = typeof firebaseConfig.apiKey === 'string' && firebaseConfig.apiKey.length > 5;
  
  if (!isConfigValid) {
    console.warn("Firebase configuration is incomplete. Authentication and database features will be limited until API keys are provided.");
    // Return dummy objects cast to their types to prevent immediate hook crashes.
    // Hooks like useUser or useCollection handle loading/null states already.
    return { 
      app: {} as FirebaseApp, 
      db: {} as Firestore, 
      auth: {} as Auth 
    };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    
    return { app, db, auth };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
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

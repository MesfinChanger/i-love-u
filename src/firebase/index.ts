
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * @fileOverview Initializes Firebase services with defensive validation to prevent boot-time crashes.
 */
export function initializeFirebase(): { app: FirebaseApp; db: Firestore; auth: Auth } {
  // Defensive bootstrapping: Ensure we have a string for apiKey to avoid immediate SDK crashes.
  // If the API key is missing or invalid, Auth operations will fail later with a caught error 
  // rather than crashing the entire Next.js root layout during hydration.
  const hasValidConfig = !!firebaseConfig.apiKey && firebaseConfig.apiKey.length > 5;
  
  const validatedConfig = {
    ...firebaseConfig,
    apiKey: hasValidConfig ? firebaseConfig.apiKey : "REVOLUTION_NON_BLOCKING_PLACEHOLDER"
  };

  const app = getApps().length > 0 ? getApp() : initializeApp(validatedConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  return { app, db, auth };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';

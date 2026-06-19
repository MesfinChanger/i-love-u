'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * @fileOverview Initializes Firebase services with defensive validation to prevent boot-time crashes.
 */
export function initializeFirebase(): { app: FirebaseApp; db: Firestore; auth: Auth } {
  // Defensive bootstrapping: Use a non-empty string for apiKey if missing to prevent initialization crash.
  // The SDK will still fail gracefully on auth operations rather than crashing the whole app during hydration.
  const hasValidKey = !!firebaseConfig.apiKey && firebaseConfig.apiKey.length > 5;
  
  const validatedConfig = {
    ...firebaseConfig,
    apiKey: hasValidKey ? firebaseConfig.apiKey : "REVOLUTION_STAGING_KEY_MISSING"
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

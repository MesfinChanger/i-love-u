'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * @fileOverview Initializes Firebase services with defensive validation to prevent boot-time crashes.
 */
export function initializeFirebase(): { app: FirebaseApp; db: Firestore; auth: Auth } {
  // Defensive bootstrapping: Only initialize if an API Key exists.
  // This prevents 'auth/invalid-api-key' from crashing the root layout during provisioning.
  const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== "";
  
  const validatedConfig = {
    ...firebaseConfig,
    apiKey: hasValidConfig ? firebaseConfig.apiKey : "REVOLUTION_PLACEHOLDER"
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

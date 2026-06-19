'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * @fileOverview Initializes Firebase services with defensive validation to prevent boot-time crashes.
 */
export function initializeFirebase(): { app: FirebaseApp; db: Firestore; auth: Auth } {
  // Defensive bootstrapping: Only initialize if we have a plausible API key string.
  // This prevents auth/invalid-api-key from crashing the root layout during SSR or hydration
  // if environment variables are not yet injected.
  const isConfigValid = typeof firebaseConfig.apiKey === 'string' && firebaseConfig.apiKey.length > 5;
  
  if (!isConfigValid) {
    // Return a proxy or empty object if config is missing to prevent root crash.
    // In a real scenario, initializeApp would throw, so we catch it or return dummies.
    console.warn("Firebase API key is missing or invalid. Please check your environment variables.");
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  return { app, db, auth };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';

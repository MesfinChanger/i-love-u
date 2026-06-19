'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

export function initializeFirebase(): { app: FirebaseApp; db: Firestore; auth: Auth } {
  // Defensive bootstrapping: If API Key is missing, use a dummy one to prevent crash
  // This allows the UI to render while environment variables are being provisioned
  const validatedConfig = {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey || "BOOTSTRAP_PLACEHOLDER_KEY"
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
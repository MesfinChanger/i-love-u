'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * @fileOverview Initializes Firebase services with resilience.
 * Returns null for services if initialization fails or config is missing,
 * allowing the UI to render in a limited state rather than crashing.
 */
export function initializeFirebase(): { app: FirebaseApp | null; db: Firestore | null; auth: Auth | null } {
  // SSR Safety: Do not initialize on the server
  if (typeof window === 'undefined') {
    return { app: null, db: null, auth: null };
  }

  // Validate basic config existence
  const hasApiKey = typeof firebaseConfig.apiKey === 'string' && firebaseConfig.apiKey.length > 0;
  
  if (!hasApiKey || firebaseConfig.apiKey === 'undefined' || firebaseConfig.apiKey.includes('YOUR_')) {
    console.warn("I Love U: Firebase API Key is missing or invalid. The platform will operate in safe-mode.");
    return { app: null, db: null, auth: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services individually
    let db: Firestore | null = null;
    let auth: Auth | null = null;

    try {
      db = getFirestore(app);
    } catch (e) {
      console.warn("Firestore service unavailable:", e);
    }

    try {
      auth = getAuth(app);
    } catch (e) {
      // Specifically catch auth/invalid-api-key here
      console.warn("Authentication service unavailable (Check API Key):", e);
    }
    
    return { app, db, auth };
  } catch (error) {
    console.error("Firebase root initialization failed:", error);
    return { app: null, db: null, auth: null };
  }
}

// Re-export specific modules to maintain the barrel while avoiding cycles
export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';

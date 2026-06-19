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
  // Validate basic config existence
  const hasApiKey = typeof firebaseConfig.apiKey === 'string' && firebaseConfig.apiKey.length > 0;
  
  if (!hasApiKey || firebaseConfig.apiKey === 'undefined' || firebaseConfig.apiKey.includes('YOUR_')) {
    console.warn("I Love U: Firebase API Key is missing or invalid. Check your environment variables.");
    return { app: null, db: null, auth: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize services individually to prevent one failure from killing all
    let db: Firestore | null = null;
    let auth: Auth | null = null;

    try {
      db = getFirestore(app);
    } catch (e) {
      console.error("Firestore initialization failed:", e);
    }

    try {
      auth = getAuth(app);
    } catch (e) {
      console.error("Auth initialization failed:", e);
    }
    
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

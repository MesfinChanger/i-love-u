'use client';

/**
 * @fileOverview Firebase Barrel File.
 * Explicitly re-exports components to ensure stable module resolution in Next.js.
 */

export * from './provider';
export { FirebaseClientProvider } from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './storage/use-storage';
export { initializeFirebase } from './init';
export { useMemoFirebase } from './use-memo-firebase';

'use client';

/**
 * @fileOverview Firebase Barrel File.
 * Explicitly re-exports components to ensure stable module resolution in Next.js 15.
 */

export * from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useFirebaseStorage } from './storage/use-storage';
export { initializeFirebase } from './init';
export { useMemoFirebase } from './use-memo-firebase';

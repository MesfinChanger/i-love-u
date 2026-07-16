'use client';

/**
 * @fileOverview Flattened Firebase Barrel File.
 * Re-exports components and direct instances explicitly.
 */

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './storage/use-storage';
export * from './use-memo-firebase';

// Direct Instance Re-exports
export { app, db, auth, storage, initializeFirebase } from './init';

'use client';

/**
 * @fileOverview Flattened Firebase Barrel File.
 * Re-exports components explicitly to prevent circular dependencies and ChunkLoadErrors.
 */

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './storage/use-storage';
export * from './use-memo-firebase';

// Helper for direct initialization access
import { initializeFirebase } from './init';
export { initializeFirebase };

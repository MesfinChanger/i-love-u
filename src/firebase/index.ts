'use client';

/**
 * @fileOverview Firebase Barrel File.
 * Re-exports everything needed for the app, including hooks and providers.
 */

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './storage/use-storage';
export { initializeFirebase } from './init';
export { useMemoFirebase } from './use-memo-firebase';

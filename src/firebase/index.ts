'use client';

/**
 * @fileOverview Firebase Barrel File.
 * Standardized entry point for all Firebase functionality.
 */

export { initializeFirebase } from './init';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './storage/use-storage';
export * from './provider';
export * from './client-provider';

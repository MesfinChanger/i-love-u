'use client';

/**
 * @fileOverview Firebase Barrel File.
 * Explicitly re-exports components to resolve "ChunkLoadError" and stable resolution.
 */

import { 
  FirebaseProvider, 
  useFirebase, 
  useFirebaseApp, 
  useFirestore, 
  useAuth, 
  useStorage 
} from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { useFirebaseStorage } from './storage/use-storage';
import { initializeFirebase } from './init';
import { useMemoFirebase } from './use-memo-firebase';

export {
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
  useStorage,
  useUser,
  useCollection,
  useDoc,
  useFirebaseStorage,
  initializeFirebase,
  useMemoFirebase,
};

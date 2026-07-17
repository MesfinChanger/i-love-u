'use client';
import {
  addDoc,
  collection,
  serverTimestamp,
  Firestore
} from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

/**
 * @fileOverview Greeting Protocol Service.
 * Orchestrates the dispatch of high-fidelity community greetings between hearts.
 */

export function sendSparkGreeting(db: Firestore, payload: {
  fromUserId: string;
  toUserId: string;
  message: string;
}) {
  const collectionRef = collection(db, "sparkGreetings");
  const data = {
    ...payload,
    status: "pending",
    createdAt: serverTimestamp()
  };

  // Prosperity Protocol: Initiate write without blocking UI heartbeat
  addDoc(collectionRef, data)
    .catch(async (serverError) => {
      // Contextual Error Recovery for Security Rules
      const permissionError = new FirestorePermissionError({
        path: collectionRef.path,
        operation: 'create',
        requestResourceData: data,
      } satisfies SecurityRuleContext);
      
      errorEmitter.emit('permission-error', permissionError);
    });
}

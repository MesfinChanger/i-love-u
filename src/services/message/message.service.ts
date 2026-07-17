'use client';
/**
 * @fileOverview Message Protocol Service.
 * Orchestrates high-fidelity message broadcasting within a conversation.
 */

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

/**
 * Send Message Protocol.
 * Dispatches a high-fidelity message record to the conversation subcollection.
 * Hardened with the non-blocking write protocol and contextual error recovery.
 */
export function sendMessage({
  conversationId,
  senderId,
  text
}: {
  conversationId: string;
  senderId: string;
  text: string;
}) {
  const collectionRef = collection(db, "conversations", conversationId, "messages");
  const data = {
    senderId,
    text,
    status: "sent",
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

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
 * Support for multi-modal payloads (text, images, E2EE) with field protection.
 */
export function sendMessage({
  conversationId,
  senderId,
  text,
  encryptedText,
  type = "text",
  storagePath = "",
  downloadAllowed = false
}: {
  conversationId: string;
  senderId: string;
  text?: string;
  encryptedText?: string;
  type?: "text" | "image" | "voice" | "file";
  storagePath?: string;
  downloadAllowed?: boolean;
}) {
  const collectionRef = collection(db, "conversations", conversationId, "messages");
  
  // Mission Integrity: Defined fields with safe defaults
  const data: any = {
    senderId,
    type,
    status: "sent",
    createdAt: serverTimestamp()
  };

  // Content Protection Logic
  if (text) data.text = text;
  if (encryptedText) data.encryptedText = encryptedText;
  
  // Media Protocol Fields
  if (type !== "text") {
    data.storagePath = storagePath;
    data.downloadAllowed = downloadAllowed;
  }

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

'use client';
/**
 * @fileOverview Message Protocol Service.
 * Orchestrates high-fidelity message broadcasting within a conversation.
 */

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc
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
  iv,
  type = "text",
  storagePath = "",
  downloadAllowed = false
}: {
  conversationId: string;
  senderId: string;
  text?: string;
  encryptedText?: string;
  iv?: string;
  type?: "text" | "image" | "voice" | "file";
  storagePath?: string;
  downloadAllowed?: boolean;
}) {
  if (!db || !conversationId) return;

  const collectionRef = collection(db, "conversations", conversationId, "messages");
  
  // Mission Integrity: Defined fields with safe defaults
  const data: any = {
    senderId,
    type,
    encryptedText: encryptedText || "",
    iv: iv || "",
    storagePath: storagePath || "",
    downloadAllowed: downloadAllowed ?? false,
    status: "sent",
    createdAt: serverTimestamp()
  };

  // Content Protection Logic
  if (text) data.text = text;

  // Prosperity Protocol: Initiate write without blocking UI heartbeat
  addDoc(collectionRef, data)
    .then(() => {
      // Background Sync: Update conversation summary
      setDoc(
        doc(db, "conversations", conversationId),
        {
          lastUpdatedAt: serverTimestamp(),
          lastMessage: text || (type === 'image' ? '[Image]' : '[Secured Message]')
        },
        { merge: true }
      ).catch(e => console.warn("Conversation sync ripple:", e));
    })
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

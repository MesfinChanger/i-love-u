import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview Chat Protocol Service.
 * Orchestrates high-fidelity conversation creation and secured message broadcasting.
 */

// Create Conversation
export async function createConversation(
  type: "spark" | "circle-private" | "circle-group" | "shopping" | "idea",
  participants: string[]
) {
  const ref = await addDoc(
    collection(db, "conversations"),
    {
      type,
      participants,
      encryptionVersion: "v1",
      createdAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp()
    }
  );
  return ref.id;
}

/**
 * Send Message Protocol with Field Protection.
 * Dispatches a message using the unified object parameter signature.
 */
export async function sendMessage({
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

  // Mission Integrity: Ensure mandatory fields and defaults
  const messageData = {
    senderId,
    type,
    encryptedText: encryptedText || "",
    iv: iv || "",
    storagePath: storagePath || "",
    downloadAllowed: downloadAllowed ?? false,
    status: "sent",
    deleted: false,
    createdAt: serverTimestamp()
  } as any;

  if (text) messageData.text = text;

  // 1. Broadcast to message subcollection
  await addDoc(
    collection(db, "conversations", conversationId, "messages"),
    messageData
  );

  // 2. Synchronize conversation heartbeat
  await setDoc(
    doc(db, "conversations", conversationId),
    {
      lastUpdatedAt: serverTimestamp(),
      lastMessage: text || (type === 'image' ? '[Image]' : '[Secured Message]')
    },
    { merge: true }
  );
}

// Load Messages
export async function getMessages(
  conversationId: string
) {
  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

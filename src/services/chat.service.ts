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
      createdAt: serverTimestamp()
    }
  );
  return ref.id;
}

// Send Message
export async function sendMessage(
  conversationId:string,
  message:any
 ){
 
  await addDoc(
   collection(
    db,
    "conversations",
    conversationId,
    "messages"
   ),
   {
 
    ...message,
 
    status:"sent",
 
    deleted:false,
 
    downloadPolicy:{
      allowDownload:false
    },
 
    createdAt:serverTimestamp()
 
   }
  );
 
 
  await setDoc(
   doc(
    db,
    "conversations",
    conversationId
   ),
   {
     lastMessageAt:serverTimestamp()
   },
   {
     merge:true
   }
  );
 
 }
  await addDoc(
    collection(db, "conversations", conversationId, "messages"),
    {
      ...message,
      createdAt: serverTimestamp(),
      status: "sent"
    }
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

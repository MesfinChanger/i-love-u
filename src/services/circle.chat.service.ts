/**
 * @fileOverview Hardened Circle Messaging Protocol.
 *
 * Security model:
 * - Validate all inputs.
 * - Prevent empty/oversized messages.
 * - Preserve audit timestamps.
 * - Support encrypted messages.
 * - Fail safely.
 *
 * Firestore structure:
 *
 * communities/{circleId}/messages/{messageId}
 *
 */


import {
    addDoc,
    collection,
    serverTimestamp,
    query,
    orderBy,
    getDocs,
    Timestamp
  } from "firebase/firestore";
  
  
  import { db } from "@/lib/firebase";
  
  
  
  /**
   * Message Types
   */
  export type CircleMessageType =
    | "text"
    | "image"
    | "voice"
    | "file";
  
  
  
  export interface CircleMessageInput {
  
    circleId:string;
  
    userId:string;
  
    text?:string;
  
    type?:CircleMessageType;
  
    encryptedText?:string;
  
    iv?:string;
  
    storagePath?:string;
  
  }
  
  
  
  /**
   * Maximum message size protection
   */
  const MAX_MESSAGE_LENGTH = 5000;
  
  
  
  /**
   * Send Circle Message
   */
  export async function sendCircleMessage(
   input:CircleMessageInput
  ){
  
  
   if(!db){
  
     throw new Error(
       "Firebase unavailable"
     );
  
   }
  
  
   const {
     circleId,
     userId,
     text="",
     type="text",
     encryptedText="",
     iv="",
     storagePath=""
   } = input;
  
  
  
   if(!circleId){
  
     throw new Error(
      "Circle ID required"
     );
  
   }
  
  
  
   if(!userId){
  
     throw new Error(
      "User ID required"
     );
  
   }
  
  
  
   const cleanText =
     text.trim();
  
  
  
   if(
     !cleanText &&
     !encryptedText &&
     !storagePath
   ){
  
     throw new Error(
      "Empty message blocked"
     );
  
   }
  
  
  
   if(
     cleanText.length >
     MAX_MESSAGE_LENGTH
   ){
  
     throw new Error(
      "Message exceeds limit"
     );
  
   }
  
  
  
  
   const messagePayload = {
  
  
     userId,
  
  
     type,
  
  
     /**
      * Plain text only when allowed.
      * Encrypted messages keep ciphertext.
      */
     text:
      cleanText || null,
  
  
     encryptedText:
      encryptedText || null,
  
  
     iv:
      iv || null,
  
  
     storagePath:
      storagePath || null,
  
  
     deleted:false,
  
  
     createdAt:
      serverTimestamp(),
  
  
     updatedAt:
      serverTimestamp()
  
  
   };
  
  
  
   try {
  
  
     const ref =
       await addDoc(
  
         collection(
          db,
          "communities",
          circleId,
          "messages"
         ),
  
         messagePayload
  
       );
  
  
     return {
  
       id:ref.id,
  
       success:true
  
     };
  
  
   }
   catch(error){
  
  
     console.error(
      "Circle message send failed:",
      error
     );
  
  
     throw new Error(
      "Unable to send message"
     );
  
  
   }
  
  }
  
  
  
  
  
  
  /**
   * Load Circle Messages
   */
  export async function loadCircleMessages(
   circleId:string
  ){
  
  
   if(!db){
  
     throw new Error(
      "Firebase unavailable"
     );
  
   }
  
  
  
   if(!circleId){
  
     throw new Error(
      "Circle ID required"
     );
  
   }
  
  
  
   try {
  
  
   const messagesQuery =
  
     query(
  
       collection(
  
         db,
  
         "communities",
  
         circleId,
  
         "messages"
  
       ),
  
       orderBy(
         "createdAt",
         "asc"
       )
  
     );
  
  
  
   const snapshot =
      await getDocs(
        messagesQuery
      );
  
  
  
   return snapshot.docs.map(
     item => ({
  
       id:item.id,
  
       ...item.data()
  
     })
   );
  
  
  
   }
   catch(error){
  
  
     console.error(
      "Circle message loading failed:",
      error
     );
  
  
     return [];
  
  
   }
  
  }
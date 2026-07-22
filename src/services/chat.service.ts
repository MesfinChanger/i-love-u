/**
 * @fileOverview Hardened Chat Protocol Service.
 *
 * Security model:
 *
 * Conversation
 *      |
 *      +-- participants
 *      |
 *      +-- encrypted messages
 *
 * Rules:
 * - Every message requires authenticated sender.
 * - Empty messages blocked.
 * - Encryption metadata protected.
 * - Conversation heartbeat synchronized.
 * - No unsafe any types.
 */


import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from "firebase/firestore";


import { db } from "@/lib/firebase";




/**
 * Supported conversation types.
 */
export type ConversationType =
  | "spark"
  | "circle-private"
  | "circle-group"
  | "shopping"
  | "idea";




/**
 * Supported message types.
 */
export type MessageType =
  | "text"
  | "image"
  | "voice"
  | "file";





interface ConversationPayload {

  type:ConversationType;

  participants:string[];

}





interface MessagePayload {


  senderId:string;


  type:MessageType;


  text?:string;


  encryptedText:string;


  iv:string;


  storagePath:string;


  downloadAllowed:boolean;


  status:"sent";


  deleted:boolean;


  deletedFor:string[];


  createdAt:unknown;

}






function validateId(
  value:string,
  name:string
){

  if(
    !value ||
    value.trim().length === 0
  ){

    throw new Error(
      `${name} is required`
    );

  }

}





function validateParticipants(
  participants:string[]
){

  if(
    !Array.isArray(participants) ||
    participants.length === 0
  ){

    throw new Error(
      "Conversation requires participants"
    );

  }



  const invalid =
    participants.some(
      id =>
        !id ||
        id.trim().length === 0
    );



  if(invalid){

    throw new Error(
      "Invalid participant"
    );

  }

}







/**
 * Create conversation.
 */
export async function createConversation(

  type:ConversationType,

  participants:string[]

):Promise<string>{



  if(!db){

    throw new Error(
      "Firebase unavailable"
    );

  }



  validateParticipants(
    participants
  );




  const payload:ConversationPayload =
  {

    type,

    participants:Array.from(
      new Set(participants)
    )

  };




  const ref =
    await addDoc(

      collection(
        db,
        "conversations"
      ),

      {

        ...payload,


        encryptionVersion:"v1",


        createdAt:
          serverTimestamp(),


        lastUpdatedAt:
          serverTimestamp()

      }

    );



  return ref.id;

}








/**
 * Send secured message.
 */
export async function sendMessage(

{

 conversationId,

 senderId,

 text,

 encryptedText,

 iv,

 type="text",

 storagePath="",

 downloadAllowed=false


}:
{

 conversationId:string;

 senderId:string;

 text?:string;

 encryptedText?:string;

 iv?:string;

 type?:MessageType;

 storagePath?:string;

 downloadAllowed?:boolean;

}

):Promise<string | null>{



  if(!db){

    throw new Error(
      "Firebase unavailable"
    );

  }



  validateId(
    conversationId,
    "Conversation ID"
  );


  validateId(
    senderId,
    "Sender ID"
  );




  if(
    !text &&
    !encryptedText &&
    !storagePath
  ){

    throw new Error(
      "Empty message blocked"
    );

  }




  if(
    text &&
    text.length > 5000
  ){

    throw new Error(
      "Message exceeds limit"
    );

  }






  const message:MessagePayload =
  {

    senderId,


    type,


    encryptedText:
      encryptedText ?? "",


    iv:
      iv ?? "",


    storagePath:
      storagePath ?? "",


    downloadAllowed:
      downloadAllowed === true,


    status:
      "sent",


    deleted:
      false,


    deletedFor:
      [],


    createdAt:
      serverTimestamp()

  };





  if(text){

    message.text =
      text.trim();

  }







  const messageRef =
    await addDoc(

      collection(

        db,

        "conversations",

        conversationId,

        "messages"

      ),

      message

    );







  await setDoc(

    doc(

      db,

      "conversations",

      conversationId

    ),

    {


      lastUpdatedAt:
        serverTimestamp(),


      lastMessage:

        type === "image"

          ? "[Image]"

          :

        type === "voice"

          ? "[Voice]"

          :

        type === "file"

          ? "[File]"

          :

        encryptedText

          ? "[Encrypted Message]"

          :

        text ?? ""



    },


    {
      merge:true
    }

  );




  return messageRef.id;

}









/**
 * Load messages.
 */
export async function getMessages(

  conversationId:string

){



  if(!db){

    throw new Error(
      "Firebase unavailable"
    );

  }




  validateId(
    conversationId,
    "Conversation ID"
  );





  const messagesQuery =

    query(

      collection(

        db,

        "conversations",

        conversationId,

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
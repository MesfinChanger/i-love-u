import {
    doc,
    updateDoc,
    arrayUnion
   } from "firebase/firestore";
   
   import {db} from "@/lib/firebase";
   
   
   export async function deleteMessageForMe(
    conversationId:string,
    messageId:string,
    userId:string
   ){
   
    const ref =
    doc(
     db,
     "conversations",
     conversationId,
     "messages",
     messageId
    );
   
   
    await updateDoc(ref,{
   
     deletedFor:
       arrayUnion(userId)
   
    });
   
   }
   
   
   
   export async function deleteMessageForEveryone(
    conversationId:string,
    messageId:string
   ){
   
    const ref =
    doc(
     db,
     "conversations",
     conversationId,
     "messages",
     messageId
    );
   
   
    await updateDoc(ref,{
   
     deletedForEveryone:true,
   
    });
   
   }
   
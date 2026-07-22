'use client';

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "@/firebase";


export async function discoverSparkProfiles() {

  if (!db) return [];

  const ref = collection(db,"sparkProfiles");

  const q = query(
    ref,
    where("visibility","==","public"),
    where("active","==",true)
  );


  const snapshot = await getDocs(q);


  return snapshot.docs.map(doc=>({
    id:doc.id,
    ...doc.data()
  }));

}




export async function sendSparkRequest(
 fromUserId:string,
 toUserId:string
){

 if(!db) return;


 await addDoc(
  collection(db,"sparkRequests"),
  {
   fromUserId,
   toUserId,
   status:"pending",
   createdAt:serverTimestamp()
  }
 );

}




export async function acceptSparkRequest(
 requestId:string
){

 if(!db) return;


 await updateDoc(
  doc(db,"sparkRequests",requestId),
  {
   status:"accepted"
  }
 );

}
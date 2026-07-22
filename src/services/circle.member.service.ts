'use client';

import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "@/lib/firebase";



export type CircleRole =
  | "owner"
  | "admin"
  | "moderator"
  | "member"
  | "guest";



export async function addCircleMember(
  circleId:string,
  userId:string,
  role:CircleRole = "member"
){

await setDoc(

doc(
db,
"communities",
circleId,
"members",
userId
),

{

userId,

role,

joinedAt:serverTimestamp()

}

);


}




export async function getCircleMembers(
circleId:string
){

const snapshot =
await getDocs(

collection(
db,
"communities",
circleId,
"members"
)

);


return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}




export async function getCircleMemberRole(
circleId:string,
userId:string
){

const snap =
await getDoc(

doc(
db,
"communities",
circleId,
"members",
userId
)

);


if(!snap.exists())
return null;


return snap.data().role;

}
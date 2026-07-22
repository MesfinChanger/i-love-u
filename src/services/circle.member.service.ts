"use client";

/**
 * @fileOverview Hardened Circle Member Service.
 *
 * Security model:
 * owner > admin > moderator > member > guest
 *
 * Responsibilities:
 * - Secure member creation
 * - Role normalization
 * - Member lookup
 * - Status protection
 * - Safe Firestore access
 */


import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";



/**
 * Allowed circle roles
 */
export const CircleRoles = [
  "owner",
  "admin",
  "moderator",
  "member",
  "guest"
] as const;


export type CircleRole =
  typeof CircleRoles[number];



/**
 * Member lifecycle
 */
export type MemberStatus =
  | "active"
  | "pending"
  | "blocked";



/**
 * Member document shape
 */
export interface CircleMember {

  id:string;

  userId:string;

  role:CircleRole;

  status:MemberStatus;

  joinedAt?:unknown;

  updatedAt?:unknown;

}



/**
 * Validate role input
 */
function normalizeRole(
  role:unknown
):CircleRole {


  if(
    typeof role !== "string"
  ){
    return "member";
  }


  const value =
    role
    .toLowerCase()
    .trim();


  if(
    CircleRoles.includes(
      value as CircleRole
    )
  ){
    return value as CircleRole;
  }


  return "member";

}



/**
 * Validate IDs
 */
function validateIds(
 circleId:string,
 userId?:string
){

 if(
   !circleId ||
   typeof circleId !== "string"
 ){
   throw new Error(
    "Invalid circle id"
   );
 }


 if(
   userId !== undefined &&
   !userId
 ){
   throw new Error(
    "Invalid user id"
   );
 }

}



/**
 * Add member securely
 */
export async function addCircleMember(

 circleId:string,

 userId:string,

 role:CircleRole="member"

):Promise<void>{


 if(!db)
   throw new Error(
    "Firebase unavailable"
   );


 validateIds(
   circleId,
   userId
 );


 const memberRole =
   normalizeRole(role);



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

    role:memberRole,

    status:"active",

    joinedAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp()

  },

  {
    merge:true
  }

 );

}



/**
 * Get all members
 */
export async function getCircleMembers(

 circleId:string

):Promise<CircleMember[]>{


 if(!db)
   throw new Error(
    "Firebase unavailable"
   );


 validateIds(circleId);



 const snapshot =
 await getDocs(

  collection(

    db,

    "communities",

    circleId,

    "members"

  )

 );



 return snapshot.docs.map(
 doc => {

   const data =
     doc.data();



   return {

    id:doc.id,

    userId:
      data.userId,

    role:
      normalizeRole(
        data.role
      ),

    status:
      data.status ??
      "active",

    joinedAt:
      data.joinedAt,

    updatedAt:
      data.updatedAt

   };

 }

 );

}



/**
 * Get one member role
 */
export async function getCircleMemberRole(

 circleId:string,

 userId:string

):Promise<CircleRole|null>{


 if(!db)
   throw new Error(
    "Firebase unavailable"
   );


 validateIds(
   circleId,
   userId
 );



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



 const data =
   snap.data();



 if(
   data.status === "blocked"
 )
 {
   return "guest";
 }



 return normalizeRole(
   data.role
 );

}



/**
 * Update member role
 */
export async function updateCircleMemberRole(

 circleId:string,

 userId:string,

 role:CircleRole

):Promise<void>{


 if(!db)
   throw new Error(
    "Firebase unavailable"
   );


 validateIds(
  circleId,
  userId
 );


 await updateDoc(

  doc(

    db,

    "communities",

    circleId,

    "members",

    userId

  ),

  {

   role:
    normalizeRole(role),

   updatedAt:
    serverTimestamp()

  }

 );

}



/**
 * Block member
 */
export async function blockCircleMember(

 circleId:string,

 userId:string

):Promise<void>{


 if(!db)
   throw new Error(
    "Firebase unavailable"
   );


 validateIds(
  circleId,
  userId
 );


 await updateDoc(

  doc(

    db,

    "communities",

    circleId,

    "members",

    userId

  ),

  {

   status:"blocked",

   updatedAt:
    serverTimestamp()

  }

 );

}
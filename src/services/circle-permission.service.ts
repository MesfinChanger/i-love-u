
'use client';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/**
 * @fileOverview Circle Permission Protocol Service.
 * Orchestrates granular role management and membership request cycles.
 */

export type CircleRole =
 | "owner"
 | "admin"
 | "moderator"
 | "member"
 | "pending"
 | "guest";

/**
 * Get Circle Role Protocol.
 * Retrieves the specific authority level of a heart within a community circle.
 */
export async function getCircleRole(
 circleId:string,
 userId:string
): Promise<CircleRole> {
 if (!db) return "guest";

 try {
   const ref = doc(
    db,
    "communities",
    circleId,
    "members",
    userId
   );

   const snap = await getDoc(ref);

   if (!snap.exists()) return "guest";

   return (
    snap.data().role ||
    "guest"
   ) as CircleRole;
 } catch (e) {
   console.warn("Circle Permission Ripple:", e);
   return "guest";
 }
}

/**
 * Request Join Protocol.
 * Registers a "pending" membership record for a heart wishing to synchronize with a circle.
 */
export async function requestJoinCircle(
 circleId:string,
 userId:string
) {
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
   role: "pending",
   status: "waiting",
   requestedAt: serverTimestamp(),
   permissions: {
     post: true,
     comment: true,
     invite: false,
     moderate: false
   }
  }
 );
}

/**
 * Update Circle Role Protocol.
 * Elevates or adjusts a heart's authority level within the circle frequency.
 */
export async function updateCircleRole(
 circleId:string,
 userId:string,
 role:CircleRole
) {
 await setDoc(
  doc(
   db,
   "communities",
   circleId,
   "members",
   userId
  ),
  {
   role,
   status: "active",
   updatedAt: serverTimestamp()
  },
  {
   merge: true
  }
 );
}

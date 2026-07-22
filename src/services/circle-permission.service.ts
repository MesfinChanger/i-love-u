/**
 * @fileOverview Unified Circle Permission Security Protocol.
 * Single source of truth for circle authority.
 */

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export type CircleRole =
  | "owner"
  | "moderator"
  | "member"
  | "guest"
  | null
  | undefined;

export interface CircleMemberPermission {
  userId: string;
  role: CircleRole;
  status?: "active" | "pending" | "blocked";
}

/**
 * Normalize roles from Firestore
 */
export function normalizeRole(role: unknown): CircleRole {
  if (typeof role !== "string") return null;

  const value = role
    .toLowerCase()
    .trim();

  switch(value){
    case "owner":
    case "moderator":
    case "member":
    case "guest":
      return value as CircleRole;
    default:
      return null;
  }
}

/**
 * Role checks
 */
export function isOwner(
 member?: CircleMemberPermission | null
): boolean {
 return normalizeRole(member?.role) === "owner";
}

export function isModerator(
 member?: CircleMemberPermission | null
): boolean {
 const role = normalizeRole(member?.role);
 return (
   role === "owner" ||
   role === "moderator"
 );
}

export function isMember(
 member?: CircleMemberPermission | null
): boolean {
 const role = normalizeRole(member?.role);
 return (
   role === "owner" ||
   role === "moderator" ||
   role === "member"
 );
}

/**
 * Content permissions
 */
export function canPost(
 member?: CircleMemberPermission | null
): boolean {
 return isMember(member);
}

export function canModerate(
 member?: CircleMemberPermission | null
): boolean {
 return isModerator(member);
}

/**
 * Circle management
 */
export function canManageCircle(
 role: CircleRole
): boolean {
 const normalized = normalizeRole(role);
 return (
   normalized === "owner" ||
   normalized === "moderator"
 );
}

/**
 * Change another member role
 */
export function canChangeRole(
 actor?: CircleMemberPermission | null,
 target?: CircleMemberPermission | null
): boolean {
 if(!actor || !target) return false;
 const actorRole = normalizeRole(actor.role);
 const targetRole = normalizeRole(target.role);

 // Only owner can promote/demote
 if(actorRole !== "owner"){
   return false;
 }

 // Cannot remove ownership accidentally
 if(targetRole === "owner"){
   return false;
 }

 return true;
}

/**
 * Remove member
 */
export function canRemoveMember(
 actor?: CircleMemberPermission | null,
 target?: CircleMemberPermission | null
): boolean {
 if(!actor || !target)
   return false;

 const actorRole = normalizeRole(actor.role);
 const targetRole = normalizeRole(target.role);

 // owner can remove anyone except himself
 if(
   actorRole === "owner" &&
   targetRole !== "owner"
 ){
   return true;
 }

 // moderators remove normal members only
 if(
   actorRole === "moderator" &&
   targetRole === "member"
 ){
   return true;
 }

 return false;
}

/**
 * Firestore role lookup
 */
export async function getCircleRole(
 circleId:string,
 userId:string
):Promise<CircleRole | null>{
 if(!circleId || !userId || !db)
   return null;

 try {
   const snap = await getDoc(
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

   return normalizeRole(
     snap.data().role ?? "member"
   );
 }
 catch(error){
   console.warn(
    "Circle authority lookup failed:",
    error
   );
   return null;
 }
}

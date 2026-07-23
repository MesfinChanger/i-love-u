/**
 * @fileOverview Hardened Circle Permission Security Protocol.
 *
 * Single source of truth for:
 * - Circle authorization logic
 * - Role validation
 * - Member capability checks
 *
 * Security boundary:
 * This service DOES NOT replace Firebase Rules.
 *
 * Real enforcement:
 * - Firestore Security Rules
 * - Server validation
 * - circle-admin.service.ts
 */


import {
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";



/**
 * Supported circle roles
 */
export type CircleRole =
  | "owner"
  | "moderator"
  | "member"
  | "guest"
  | null
  | undefined;



/**
 * Circle member authorization model
 */
export interface CircleMemberPermission {


  userId:string;


  role:CircleRole;


  status?:
    | "active"
    | "pending"
    | "blocked"
    | "suspended";


  joinedAt?:unknown;


  verified?:boolean;

}



/**
 * Normalize Firestore role values.
 */
export function normalizeRole(
  role:unknown
):CircleRole {


  if(
    typeof role !== "string"
  ){
    return null;
  }


  const value =
    role
      .toLowerCase()
      .trim();



  if(
    value === "owner" ||
    value === "moderator" ||
    value === "member" ||
    value === "guest"
  ){

    return value as CircleRole;

  }


  return null;

}





/**
 * Check active membership status.
 */
export function isActive(
  member?:CircleMemberPermission|null
):boolean {


  if(!member)
    return false;



  return (
    member.status !== "blocked" &&
    member.status !== "suspended"
  );

}





/**
 * Role identity
 */

export function isOwner(
  member?:CircleMemberPermission|null
):boolean {


  return (
    isActive(member) &&
    normalizeRole(member?.role)
      === "owner"
  );

}





export function isModerator(
  member?:CircleMemberPermission|null
):boolean {


  if(!isActive(member))
    return false;


  const role =
    normalizeRole(member?.role);



  return (
    role === "owner" ||
    role === "moderator"
  );

}





export function isMember(
  member?:CircleMemberPermission|null
):boolean {


  if(!isActive(member))
    return false;



  const role =
    normalizeRole(member?.role);



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
  member?:CircleMemberPermission|null
):boolean {


  return isMember(member);

}





export function canComment(
  member?:CircleMemberPermission|null
):boolean {


  return isMember(member);

}





/**
 * Circle visibility
 */

export function canViewCircle(
  member?:CircleMemberPermission|null,
  isPublic:boolean=false
):boolean {


  if(isPublic)
    return true;


  return isMember(member);

}





/**
 * Administration permissions
 */

export function canManageCircle(
  role:CircleRole
):boolean {


  const normalized =
    normalizeRole(role);



  return (
    normalized === "owner" ||
    normalized === "moderator"
  );

}





export function canManageMembers(
  member?:CircleMemberPermission|null
):boolean {


  if(!isActive(member))
    return false;



  return (
    isOwner(member) ||
    isModerator(member)
  );

}





export function canModerate(
  member?:CircleMemberPermission|null
):boolean {


  return isModerator(member);

}





/**
 * Role management
 *
 * Owner only.
 */

export function canChangeRole(
  actor?:CircleMemberPermission|null,
  target?:CircleMemberPermission|null
):boolean {


  if(
    !isOwner(actor) ||
    !target
  ){

    return false;

  }



  // Never modify another owner
  if(
    isOwner(target)
  ){

    return false;

  }



  return true;

}





/**
 * Member removal
 */

export function canRemoveMember(
  actor?:CircleMemberPermission|null,
  target?:CircleMemberPermission|null
):boolean {


  if(
    !actor ||
    !target
  ){

    return false;

  }



  // Cannot remove yourself
  if(
    actor.userId === target.userId
  ){

    return false;

  }



  const actorRole =
    normalizeRole(actor.role);


  const targetRole =
    normalizeRole(target.role);



  if(
    !isActive(actor)
  ){

    return false;

  }




  // Owner removes everyone except owners
  if(
    actorRole === "owner" &&
    targetRole !== "owner"
  ){

    return true;

  }





  // Moderator removes members only
  if(
    actorRole === "moderator" &&
    targetRole === "member"
  ){

    return true;

  }



  return false;

}





/**
 * Circle lifecycle
 */


export function canDeleteCircle(
  member?:CircleMemberPermission|null
):boolean {


  return isOwner(member);

}





export function canEditCircle(
  member?:CircleMemberPermission|null
):boolean {


  return canManageMembers(member);

}





/**
 * Firestore role lookup.
 *
 * Used by server/client permission checks.
 */

export async function getCircleRole(
  circleId:string,
  userId:string
):Promise<CircleRole|null>{



  if(
    !circleId ||
    !userId
  ){

    return null;

  }



  try {


    const ref =
      doc(
        db,
        "communities",
        circleId,
        "members",
        userId
      );



    const snap =
      await getDoc(ref);



    if(
      !snap.exists()
    ){

      return null;

    }




    const data =
      snap.data();



    if(
      data.status === "blocked" ||
      data.status === "suspended"
    ){

      return null;

    }




    return normalizeRole(
      data.role
    );



  }catch(error){


    console.error(
      "Circle permission lookup failed:",
      error
    );


    return null;

  }

}
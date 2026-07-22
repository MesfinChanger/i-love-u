/**
 * Circle Permission Engine
 *
 * Central security logic for Circle features.
 *
 * Roles:
 * owner
 * moderator
 * member
 * guest
 */

import {
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";


export type CircleRole =
  | "owner"
  | "moderator"
  | "member"
  | "guest";


export interface CircleMemberPermission {
  userId: string;
  role: CircleRole;
  status?: "active" | "pending" | "blocked";
}


/**
 * Check if user can view circle
 */
export function canViewCircle(
  member?: CircleMemberPermission | null,
  isPublic: boolean = false
) {

  if (isPublic) return true;

  return member?.status === "active";
}


/**
 * Check if user can create posts
 */
export function canPost(
  member?: CircleMemberPermission | null
) {

  if (!member) return false;

  if (member.status !== "active") {
    return false;
  }

  return [
    "owner",
    "moderator",
    "member"
  ].includes(member.role);
}


/**
 * Check if user can comment
 */
export function canComment(
  member?: CircleMemberPermission | null
) {

  return canPost(member);
}


/**
 * Check member management permissions
 */
export function canManageMembers(
  member?: CircleMemberPermission | null
) {

  if (!member) return false;

  return [
    "owner",
    "moderator"
  ].includes(member.role);
}


/**
 * Owner check
 */
export function isOwner(
  member?: CircleMemberPermission | null
) {

  return member?.role === "owner";
}


/**
 * Moderator check
 */
export function isModerator(
  member?: CircleMemberPermission | null
) {

  return (
    member?.role === "owner" ||
    member?.role === "moderator"
  );
}


/**
 * Load current user's circle role
 */
export async function getCircleRole(
  circleId: string,
  userId: string
): Promise<CircleRole | null> {

  if (!circleId || !userId) {
    return null;
  }

  const snap = await getDoc(
    doc(
      db,
      "communities",
      circleId,
      "members",
      userId
    )
  );

  if (!snap.exists()) {
    return null;
  }

  return (snap.data().role ?? "member") as CircleRole;
}

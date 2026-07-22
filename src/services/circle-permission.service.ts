/**
 * Circle Permission Security Protocol
 *
 * Security hierarchy:
 *
 * OWNER
 *    |
 * MODERATOR
 *    |
 * MEMBER
 *    |
 * GUEST
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
 * Normalize database role
 */
export function normalizeRole(role: unknown): CircleRole {
  if (typeof role !== "string") {
    return null;
  }

  const value = role.toLowerCase().trim();

  switch (value) {
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
 * Extract role safely
 */
export function getRole(member?: CircleMemberPermission | null): CircleRole {
  if (!member) {
    return null;
  }
  return normalizeRole(member.role);
}

/**
 * Ownership
 */
export function isOwner(member?: CircleMemberPermission | null): boolean {
  return getRole(member) === "owner";
}

/**
 * Moderator or owner
 */
export function isModerator(member?: CircleMemberPermission | null): boolean {
  const role = getRole(member);
  return role === "owner" || role === "moderator";
}

/**
 * Any real member
 */
export function isMember(member?: CircleMemberPermission | null): boolean {
  const role = getRole(member);
  return role === "owner" || role === "moderator" || role === "member";
}

/**
 * Guest access
 */
export function isGuest(member?: CircleMemberPermission | null): boolean {
  return getRole(member) === "guest";
}

/**
 * View circle
 */
export function canViewCircle(
  member?: CircleMemberPermission | null,
  isPublic = false
): boolean {
  if (isPublic) {
    return true;
  }
  return isMember(member);
}

/**
 * Create posts
 */
export function canPost(member?: CircleMemberPermission | null): boolean {
  return isMember(member);
}

/**
 * Comment
 */
export function canComment(member?: CircleMemberPermission | null): boolean {
  return isMember(member);
}

/**
 * Manage members
 * OWNER ONLY
 */
export function canManageMembers(member?: CircleMemberPermission | null): boolean {
  return isOwner(member);
}

/**
 * Moderate content
 * OWNER + MODERATOR
 */
export function canModerate(member?: CircleMemberPermission | null): boolean {
  return isModerator(member);
}

/**
 * Edit circle settings
 */
export function canEditCircle(member?: CircleMemberPermission | null): boolean {
  return isModerator(member);
}

/**
 * Delete circle
 */
export function canDeleteCircle(member?: CircleMemberPermission | null): boolean {
  return isOwner(member);
}

/**
 * Change member role
 */
export function canChangeRole(
  actor?: CircleMemberPermission | null,
  target?: CircleMemberPermission | null
): boolean {
  if (!actor || !target) {
    return false;
  }

  const actorRole = getRole(actor);
  const targetRole = getRole(target);

  if (actorRole !== "owner") {
    return false;
  }

  if (targetRole === "owner") {
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
  if (!actor || !target) {
    return false;
  }

  if (!isOwner(actor)) {
    return false;
  }

  if (isOwner(target)) {
    return false;
  }

  return true;
}

/**
 * Proxy for canManageMembers for backward compatibility
 */
export function canManageCircle(role: CircleRole): boolean {
  return role === "owner";
}

/**
 * Permission object
 */
export function getCirclePermissions(
  member?: CircleMemberPermission | null,
  isPublic = false
) {
  return {
    canViewCircle: canViewCircle(member, isPublic),
    canPost: canPost(member),
    canComment: canComment(member),
    canManageMembers: canManageMembers(member),
    canModerate: canModerate(member),
    canEditCircle: canEditCircle(member),
    canDeleteCircle: canDeleteCircle(member),
    canChangeRole: canChangeRole,
    canRemoveMember: canRemoveMember,
    isOwner: isOwner(member),
    isModerator: isModerator(member),
    isMember: isMember(member),
    isGuest: isGuest(member),
  };
}

/**
 * Firebase role lookup - Fixed duplicate issue
 */
export async function getCircleRole(
  circleId: string,
  userId: string
): Promise<CircleRole | null> {
  if (!circleId || !userId) {
    return null;
  }

  try {
    const snap = await getDoc(
      doc(db, "communities", circleId, "members", userId)
    );

    if (!snap.exists()) {
      return null;
    }

    return (snap.data().role ?? "member") as CircleRole;
  } catch (error) {
    console.error("Circle security lookup failed:", error);
    return null;
  }
}

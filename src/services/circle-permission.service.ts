'use client';

/**
 * @fileOverview Unified Circle Permission Security Protocol.
 * Single source of truth for circle authority and community honor.
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
 * Normalize roles from Firestore to recognized mission types.
 */
export function normalizeRole(role: unknown): CircleRole {
  if (typeof role !== "string") return null;

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
 * Authority Verification Protocols
 */

export function isOwner(member?: CircleMemberPermission | null): boolean {
  return normalizeRole(member?.role) === "owner";
}

export function isModerator(member?: CircleMemberPermission | null): boolean {
  const role = normalizeRole(member?.role);
  return role === "owner" || role === "moderator";
}

export function isMember(member?: CircleMemberPermission | null): boolean {
  const role = normalizeRole(member?.role);
  return role === "owner" || role === "moderator" || role === "member";
}

export function canPost(member?: CircleMemberPermission | null): boolean {
  return isMember(member);
}

export function canModerate(member?: CircleMemberPermission | null): boolean {
  return isModerator(member);
}

export function canManageCircle(role: CircleRole): boolean {
  const normalized = normalizeRole(role);
  return normalized === "owner" || normalized === "moderator";
}

export function canChangeRole(actor?: CircleMemberPermission | null, target?: CircleMemberPermission | null): boolean {
  if (!actor) return false;
  const actorRole = normalizeRole(actor.role);
  
  // Only owner can promote/demote
  if (actorRole !== "owner") return false;
  
  // Cannot remove ownership accidentally
  if (target?.role === "owner") return false;
  
  return true;
}

export function canRemoveMember(actor?: CircleMemberPermission | null, target?: CircleMemberPermission | null): boolean {
  if (!actor || !target) return false;
  const actorRole = normalizeRole(actor.role);
  const targetRole = normalizeRole(target.role);

  // owner can remove anyone except himself
  if (actorRole === "owner" && targetRole !== "owner") return true;

  // moderators remove normal members only
  if (actorRole === "moderator" && targetRole === "member") return true;

  return false;
}

export function canViewCircle(member?: CircleMemberPermission | null, isPublic: boolean = false): boolean {
  if (isPublic) return true;
  return isMember(member);
}

export function canDeleteCircle(member?: CircleMemberPermission | null): boolean {
  return isOwner(member);
}

export function canEditCircle(member?: CircleMemberPermission | null): boolean {
  return isOwner(member);
}

/**
 * Firestore role lookup protocol
 */
export async function getCircleRole(circleId: string, userId: string): Promise<CircleRole | null> {
  if (!circleId || !userId || !db) return null;

  try {
    const ref = doc(db, "communities", circleId, "members", userId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data();
    if (data.status === "blocked") return null;

    return normalizeRole(data.role || "member");
  } catch (error) {
    console.warn("Circle authority lookup ripple:", error);
    return null;
  }
}

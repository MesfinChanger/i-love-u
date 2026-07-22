/**
 * @fileOverview Unified Circle Permission Security Protocol.
 * The single high-fidelity source of truth for community authority.
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
 * Normalize database role strings.
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
 * Authority Checks
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

/**
 * UI Action Permissions
 */
export function canPost(member?: CircleMemberPermission | null): boolean {
  return isMember(member);
}

export function canModerate(member?: CircleMemberPermission | null): boolean {
  return isModerator(member);
}

export function canManageCircle(role: CircleRole): boolean {
  const norm = normalizeRole(role);
  return norm === "owner" || norm === "moderator";
}

/**
 * Sovereignty Handshake: Firestore Role Lookup
 */
export async function getCircleRole(
  circleId: string,
  userId: string
): Promise<CircleRole | null> {
  if (!circleId || !userId || !db) return null;

  try {
    const snap = await getDoc(doc(db, "communities", circleId, "members", userId));
    if (!snap.exists()) return null;
    return normalizeRole(snap.data().role ?? "member");
  } catch (e) {
    console.warn("Authority Registry sync ripple:", e);
    return null;
  }
}

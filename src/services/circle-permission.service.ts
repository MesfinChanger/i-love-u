/**
 * @fileOverview Hardened Circle Permission Security Protocol.
 *
 * Single source of truth for:
 * - Circle authorization logic
 * - Role validation
 * - Member capability checks
 */

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type CircleRole = "owner" | "moderator" | "member" | "guest" | null;

export interface CircleMemberPermission {
  userId: string;
  role: CircleRole;
  status?: "active" | "pending" | "blocked" | "suspended";
  joinedAt?: unknown;
  verified?: boolean;
}

export function normalizeRole(role: unknown): CircleRole {
  if (typeof role !== "string") return null;
  const value = role.toLowerCase().trim();
  if (["owner", "moderator", "member", "guest"].includes(value)) {
    return value as CircleRole;
  }
  return null;
}

export function isActive(member?: CircleMemberPermission | null): boolean {
  if (!member) return false;
  return member.status !== "blocked" && member.status !== "suspended";
}

export function isOwner(member?: CircleMemberPermission | null): boolean {
  return isActive(member) && normalizeRole(member?.role) === "owner";
}

export function isModerator(member?: CircleMemberPermission | null): boolean {
  if (!isActive(member)) return false;
  const role = normalizeRole(member?.role);
  return role === "owner" || role === "moderator";
}

export function isMember(member?: CircleMemberPermission | null): boolean {
  if (!isActive(member)) return false;
  const role = normalizeRole(member?.role);
  return role === "owner" || role === "moderator" || role === "member";
}

export function canPost(member?: CircleMemberPermission | null): boolean {
  return isMember(member);
}

export function canComment(member?: CircleMemberPermission | null): boolean {
  return isMember(member);
}

export function canViewCircle(member?: CircleMemberPermission | null, isPublic: boolean = false): boolean {
  if (isPublic) return true;
  return isMember(member);
}

export function canManageCircle(role: CircleRole): boolean {
  const normalized = normalizeRole(role);
  return normalized === "owner" || normalized === "moderator";
}

export function canManageMembers(member?: CircleMemberPermission | null): boolean {
  if (!isActive(member)) return false;
  return isOwner(member) || isModerator(member);
}

export function canModerate(member?: CircleMemberPermission | null): boolean {
  return isModerator(member);
}

export function canChangeRole(actor?: CircleMemberPermission | null, target?: CircleMemberPermission | null): boolean {
  if (!isOwner(actor) || !target) return false;
  if (isOwner(target)) return false;
  return true;
}

export function canRemoveMember(actor?: CircleMemberPermission | null, target?: CircleMemberPermission | null): boolean {
  if (!actor || !target) return false;
  if (actor.userId === target.userId) return false;
  const actorRole = normalizeRole(actor.role);
  const targetRole = normalizeRole(target.role);
  if (!isActive(actor)) return false;
  if (actorRole === "owner" && targetRole !== "owner") return true;
  if (actorRole === "moderator" && targetRole === "member") return true;
  return false;
}

export function canDeleteCircle(member?: CircleMemberPermission | null): boolean {
  return isOwner(member);
}

export function canEditCircle(member?: CircleMemberPermission | null): boolean {
  return canManageMembers(member);
}

export async function getCircleRole(circleId: string, userId: string): Promise<CircleRole | null> {
  if (!circleId || !userId || !db) return null;
  try {
    const ref = doc(db, "communities", circleId, "members", userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    if (data.status === "blocked" || data.status === "suspended") return null;
    return normalizeRole(data.role);
  } catch (error) {
    console.error("Circle permission lookup failed:", error);
    return null;
  }
}

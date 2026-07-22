'use client';
/**
 * @fileOverview Circle Permission Protocol Service.
 * Orchestrates granular authority checks for community circles.
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
  | "guest"
  | null;

/**
 * Get user's role inside a circle
 */
export async function getCircleRole(
  circleId: string,
  userId: string
): Promise<CircleRole> {

  if (!circleId || !userId || !db) {
    return null;
  }

  try {
    const memberRef = doc(
      db,
      "communities",
      circleId,
      "members",
      userId
    );

    const snapshot = await getDoc(memberRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return (data.role || "member") as CircleRole;
  } catch (e) {
    console.warn("Permission Protocol Ripple:", e);
    return null;
  }
}

/**
 * Permission checks
 */

export function isCircleOwner(
  role: CircleRole
) {
  return role === "owner";
}

export function isCircleModerator(
  role: CircleRole
) {
  return (
    role === "owner" ||
    role === "moderator"
  );
}

export function canManageCircle(
  role: CircleRole
) {
  return role === "owner";
}

export function canModerateCircle(
  role: CircleRole
) {
  return (
    role === "owner" ||
    role === "moderator"
  );
}

export function canPostInCircle(
  role: CircleRole
) {
  return (
    role === "owner" ||
    role === "moderator" ||
    role === "member"
  );
}

export function canChatInCircle(
  role: CircleRole
) {
  return (
    role === "owner" ||
    role === "moderator" ||
    role === "member"
  );
}

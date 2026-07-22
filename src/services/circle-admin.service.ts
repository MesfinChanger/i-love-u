'use client';

/**
 * @fileOverview Hardened Circle Administration Service.
 * SECURITY: Only authorized circle authorities can manage members.
 */

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  CircleMemberPermission,
  getCircleRole,
  canChangeRole,
  canRemoveMember
} from "@/services/circle-permission.service";

/**
 * Get all circle members for management.
 */
export async function getAllCircleMembers(circleId: string) {
  if (!db || !circleId) throw new Error("Invalid circle");

  const snapshot = await getDocs(
    collection(db, "communities", circleId, "members")
  );

  return snapshot.docs.map(item => ({
    id: item.id,
    ...item.data()
  }));
}

/**
 * Change member role.
 * OWNER ONLY protocol.
 */
export async function changeMemberRole(
  circleId: string,
  targetUserId: string,
  newRole: "member" | "moderator",
  requesterId: string
): Promise<void> {
  if (!db) throw new Error("Firebase unavailable");

  const requesterRole = await getCircleRole(circleId, requesterId);
  const targetRole = await getCircleRole(circleId, targetUserId);

  const requester: CircleMemberPermission = {
    userId: requesterId,
    role: requesterRole
  };

  const target: CircleMemberPermission = {
    userId: targetUserId,
    role: targetRole
  };

  if (!canChangeRole(requester, target)) {
    throw new Error("Unauthorized role change");
  }

  await updateDoc(
    doc(db, "communities", circleId, "members", targetUserId),
    {
      role: newRole,
      updatedAt: serverTimestamp()
    }
  );

  await createCircleAuditLog(circleId, requesterId, "ROLE_CHANGE", {
    targetUserId,
    oldRole: targetRole,
    newRole
  });
}

/**
 * Remove member from the community frequency.
 */
export async function removeMember(
  circleId: string,
  targetUserId: string,
  requesterId: string
): Promise<void> {
  if (!db) throw new Error("Firebase unavailable");

  const requesterRole = await getCircleRole(circleId, requesterId);
  const targetRole = await getCircleRole(circleId, targetUserId);

  const requester: CircleMemberPermission = {
    userId: requesterId,
    role: requesterRole
  };

  const target: CircleMemberPermission = {
    userId: targetUserId,
    role: targetRole
  };

  if (!canRemoveMember(requester, target)) {
    throw new Error("Unauthorized member removal");
  }

  await deleteDoc(
    doc(db, "communities", circleId, "members", targetUserId)
  );

  await createCircleAuditLog(circleId, requesterId, "MEMBER_REMOVE", {
    targetUserId,
    oldRole: targetRole
  });
}

/**
 * Circle security audit trail.
 */
async function createCircleAuditLog(
  circleId: string,
  actorId: string,
  action: string,
  metadata: any
): Promise<void> {
  if (!db) return;

  const auditRef = doc(collection(db, "communities", circleId, "auditLogs"));

  await setDoc(auditRef, {
    actorId,
    action,
    metadata,
    createdAt: serverTimestamp()
  });
}

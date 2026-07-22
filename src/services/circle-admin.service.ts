
'use client';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/**
 * Get All Circle Members Protocol.
 * Retrieves the complete membership registry for a specific circle frequency.
 */
export async function getAllCircleMembers(circleId: string) {
  if (!db) return [];
  try {
    const snap = await getDocs(
      collection(db, "communities", circleId, "members")
    );

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.warn("Registry Retrieval Ripple:", e);
    return [];
  }
}

/**
 * Change Member Role Protocol.
 * Adjusts a heart's authority level within the circle registry.
 */
export async function changeMemberRole(
  circleId: string,
  userId: string,
  role: string
) {
  if (!db) return;
  await updateDoc(
    doc(db, "communities", circleId, "members", userId),
    {
      role,
      updatedAt: serverTimestamp()
    }
  );
}

/**
 * Remove Member Protocol.
 * Respectfully disconnects a heart from the circle frequency.
 */
export async function removeMember(
  circleId: string,
  userId: string
) {
  if (!db) return;
  await deleteDoc(
    doc(db, "communities", circleId, "members", userId)
  );
}

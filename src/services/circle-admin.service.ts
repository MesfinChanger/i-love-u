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
  const snap = await getDocs(
    collection(db, "communities", circleId, "members")
  );

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
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
  await deleteDoc(
    doc(db, "communities", circleId, "members", userId)
  );
}

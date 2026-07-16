import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview Circle Protocol Service.
 * Handles the creation and discovery of high-fidelity community gatherings.
 */

// Create Circle
export async function createCircle(circle: any) {
  const ref = await addDoc(
    collection(db, "communities"),
    {
      ...circle,
      memberCount: 1,
      createdAt: serverTimestamp()
    }
  );
  return ref.id;
}

// Discover Circles
export async function discoverCircles() {
  const snapshot = await getDocs(
    collection(db, "communities")
  );

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Join Circle Protocol.
 * Establishes a member record within a specific community vibration.
 */
export async function joinCircle(
  circleId: string,
  userId: string
) {
  await setDoc(
    doc(
      db,
      "communities",
      circleId,
      "members",
      userId
    ),
    {
      userId,
      role: "member",
      joinedAt: serverTimestamp()
    }
  );
}

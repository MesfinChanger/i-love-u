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

/**
 * Create Circle Protocol.
 * Registers a new circle and automatically initializes the owner's membership record.
 */
export async function createCircle(circle: {
  name: string;
  description: string;
  category: string;
  ownerId: string;
  privacy: "open" | "private";
  imageURL: string;
}) {
  // 1. Establish the community master record
  const ref = await addDoc(
    collection(db, "communities"),
    {
      ...circle,
      memberCount: 1,
      createdAt: serverTimestamp()
    }
  );

  // 2. Automatic Owner Membership Protocol
  await setDoc(
    doc(db, "communities", ref.id, "members", circle.ownerId),
    {
      userId: circle.ownerId,
      role: "owner",
      status: "active",
      joinedAt: serverTimestamp()
    }
  );

  return ref.id;
}

/**
 * Discover Circles Protocol.
 * Retrieves all registered community gatherings.
 */
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
 * Returns true if joined successfully, false if already a member.
 */
export async function joinCircle(
  circleId: string,
  userId: string
) {
  const memberRef = doc(
    db,
    "communities",
    circleId,
    "members",
    userId
  );

  const existing = await getDoc(memberRef);

  if (existing.exists()) {
    return false;
  }

  await setDoc(
    memberRef,
    {
      userId,
      role: "member",
      joinedAt: serverTimestamp()
    }
  );

  return true;
}

/**
 * Get Circle Members Protocol.
 * Retrieves all members of a specific circle including their profile signatures.
 */
export async function getCircleMembers(
  circleId: string
) {
  const snapshot = await getDocs(
    collection(db, "communities", circleId, "members")
  );

  const members = [];

  for (const memberDoc of snapshot.docs) {
    const member = memberDoc.data();
    const userSnap = await getDoc(doc(db, "users", member.userId));

    members.push({
      id: memberDoc.id,
      ...member,
      profile: userSnap.exists() ? userSnap.data() : null
    });
  }

  return members;
}


import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview Spark Protocol Service.
 * Orchestrates high-fidelity discovery, matching, and connections.
 */

// Create Spark profile
export async function createSparkProfile(profile: any) {
  await setDoc(
    doc(db, "sparkProfiles", profile.userId),
    {
      ...profile,
      createdAt: serverTimestamp()
    }
  );
}

// Discover people
export async function discoverSparkUsers() {
  const q = query(
    collection(db, "sparkProfiles"),
    where("visibility", "==", "public")
  );

  const result = await getDocs(q);

  return result.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Spark Like Protocol
export async function sendSparkLike(fromUserId: string, toUserId: string) {
  const id = `${fromUserId}_${toUserId}`;

  await setDoc(
    doc(db, "sparkLikes", id),
    {
      fromUserId,
      toUserId,
      status: "pending",
      createdAt: serverTimestamp()
    }
  );
}

// Match Protocol
export async function createMatch(
  userA: string,
  userB: string
) {
  const matchId = [userA, userB].sort().join("_");

  await setDoc(
    doc(db, "matches", matchId),
    {
      users: [userA, userB],
      status: "active",
      createdAt: serverTimestamp()
    }
  );
}

/**
 * Friendship Protocol.
 * Establishes a cultural bridge between two hearts.
 */
export async function addFriend(
  userA: string,
  userB: string
) {
  const id = [userA, userB].sort().join("_");

  await setDoc(
    doc(db, "friendships", id),
    {
      userA,
      userB,
      status: "friends",
      createdAt: serverTimestamp()
    }
  );
}

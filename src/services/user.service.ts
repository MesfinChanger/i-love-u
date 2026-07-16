
/**
 * @fileOverview High-Fidelity User Management Service.
 */

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/firebase";
import { UserProfile } from "@/types";

export async function createUserProfile(profile: UserProfile) {
  if (!db) return;
  await setDoc(
    doc(db, "users", profile.uid),
    {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  );
}

export async function getUserProfile(uid: string) {
  if (!db) return null;
  const snapshot = await getDoc(
    doc(db, "users", uid)
  );

  if (snapshot.exists()) {
    return snapshot.data() as UserProfile;
  }
  return null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  if (!db) return;
  await updateDoc(
    doc(db, "users", uid),
    {
      ...data,
      updatedAt: serverTimestamp()
    }
  );
}

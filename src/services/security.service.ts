import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview Security Protocol Service.
 * Orchestrates device registration and session tracking for identity protection.
 */

/**
 * Register Device Protocol.
 * Adds a new device to the trusted registry with high-fidelity timestamps.
 */
export async function registerDevice(data: any) {
  await addDoc(collection(db, "devices"), {
    ...data,
    trusted: true,
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp()
  });
}

/**
 * Get User Devices Protocol.
 * Retrieves all registered heartbeats for a specific identity.
 */
export async function getUserDevices(userId: string) {
  const q = query(
    collection(db, "devices"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}


import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  serverTimestamp,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview Security Protocol Service.
 * Orchestrates device registration, session tracking, and trust levels for identity protection.
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

/**
 * Get Trust Score Protocol.
 * Retrieves the reputation metrics for a specific heart.
 */
export async function getTrustScore(userId: string) {
  const ref = doc(db, "trustScores", userId);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  return null;
}

/**
 * Initialize Trust Score Protocol.
 * Establishes a baseline reputation for a new heart in the community.
 */
export async function initializeTrustScore(userId: string) {
  await setDoc(doc(db, "trustScores", userId), {
    userId,
    score: 50, // Starting baseline
    verifiedEmail: false,
    verifiedPhone: false,
    verifiedIdentity: false,
    positiveReviews: 0,
    reports: 0
  }, { merge: true });
}

/**
 * Trust Calculation Protocol.
 * Dynamically computes a heart's trust score based on verification and reviews.
 */
export function calculateTrustScore(data: any) {
  let score = 50;

  if (data.verifiedEmail)
    score += 15;

  if (data.verifiedPhone)
    score += 15;

  if (data.positiveReviews > 10)
    score += 10;

  if (data.reports > 0)
    score -= 20;

  return Math.max(
    0,
    Math.min(score, 100)
  );
}

/**
 * Block User Protocol.
 * Establishes a safety record for hearts maintaining their sacred space.
 */
export async function blockUser(
  userId: string,
  blockedUserId: string,
  reason?: string
) {
  await addDoc(collection(db, "blocks"), {
    blockerId: userId,
    blockedUserId,
    reason: reason || "Respect Protocol Enforcement",
    createdAt: serverTimestamp()
  });
}

import { adminDb } from "@/lib/firebase-admin";

/**
 * @fileOverview High-Fidelity User Role Retrieval (Server-Side).
 * Hardened to handle uninitialized admin instances gracefully.
 */
export async function getUserRole(uid: string) {
  if (!adminDb || !uid) {
    return "guest";
  }

  try {
    const userDoc = await adminDb
      .collection("users")
      .doc(uid)
      .get();

    if (!userDoc.exists) {
      return "guest";
    }

    return userDoc.data()?.role || "guest";
  } catch (error) {
    console.warn("Role Retrieval Ripple:", error);
    return "guest";
  }
}

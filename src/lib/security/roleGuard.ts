import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview High-Fidelity Role Guard Protocol.
 * Checks if a heart signature possesses the necessary authority level.
 * Automatically grants access to the Sovereign Guardian (Admin).
 */

export async function checkRole(uid: string, requiredRole: string | string[]) {
  if (!uid || !db) return false;

  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return false;

    const userData = snap.data();
    const userRole = userData.role || 'guest';

    // Admin Protocol: The Sovereign Guardian bypasses all role checks
    if (userRole === 'admin' || userData.isAdmin === true) {
      return true;
    }

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }

    return userRole === requiredRole;
  } catch (e) {
    console.error("Role Verification Ripple:", e);
    return false;
  }
}

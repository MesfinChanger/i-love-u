import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

/**
 * @fileOverview High-Fidelity Admin Verification Protocol.
 * Checks if a heart holds the Guardian role or matches the Sovereign Signature.
 * Hardened with SSR safety checks and null-ref protection.
 */
export async function checkAdmin(uid: string) {
  if (!uid || !db) return false;

  // Sovereign Signature Check (Case-Insensitive)
  const SOVEREIGN_EMAIL = "thearmyoj@gmail.com";
  
  try {
    // Safety: auth might not be fully initialized during early hydration or server-side pre-render
    const currentUser = auth?.currentUser;
    const userEmail = currentUser?.email;
    
    if (userEmail && userEmail.toLowerCase() === SOVEREIGN_EMAIL.toLowerCase()) {
      return true;
    }

    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return false;
    }

    const data = snap.data();
    return (
      data.role === "admin" || 
      data.accountType === "Admin" || 
      data.isAdmin === true
    );
  } catch (e) {
    console.warn("Authority Verification Ripple:", e);
    return false;
  }
}

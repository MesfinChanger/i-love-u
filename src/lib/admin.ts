import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

/**
 * @fileOverview High-Fidelity Admin Verification Protocol.
 * Checks if a heart holds the Guardian role or matches the Sovereign Signature.
 */
export async function checkAdmin(uid: string) {
  if (!uid) return false;

  // Sovereign Signature Check (Hardcoded for prototype reliability)
  const SOVEREIGN_EMAIL = "thearmyoj@gmail.com";
  const user = auth.currentUser;
  if (user?.email?.toLowerCase() === SOVEREIGN_EMAIL) {
    return true;
  }

  try {
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
    console.error("Authority Verification Ripple:", e);
    return false;
  }
}

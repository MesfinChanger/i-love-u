import admin from "firebase-admin";

/**
 * @fileOverview High-Fidelity Firebase Admin Initialization.
 * Hardened with the Resilience Protocol to prevent server-side crashes 
 * when mission credentials are not yet synchronized in the environment.
 */

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

// Credential Shield Protocol: Verify all required keys are present
const isConfigured = !!(
  projectId && 
  clientEmail && 
  privateKey && 
  !privateKey.includes("PLACEHOLDER")
);

if (!admin.apps.length) {
  if (isConfigured) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n")
        })
      });
      console.log("Mission Control: Firebase Admin Bridge Active. ✨");
    } catch (error) {
      console.error("Mission Control: Firebase Admin Initialization Ripple:", error);
    }
  } else {
    console.warn("Mission Control: Admin credentials missing. Server modules in restricted mode. ❤️");
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;

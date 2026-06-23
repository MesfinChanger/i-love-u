/**
 * @fileOverview Hardened Firebase configuration for I LOVE U.
 * Proactively sanitizes environment variables to ensure invalid placeholders or literal variable names are rejected.
 */

const sanitizeEnv = (val: string | undefined, keyName: string): string => {
  if (!val) return "";
  const trimmed = val.trim();
  
  // Reject literal placeholder strings or un-substituted variable names
  if (
    trimmed === "" || 
    trimmed === "undefined" || 
    trimmed === "null" || 
    trimmed === keyName || 
    trimmed === `process.env.${keyName}` ||
    trimmed.includes("PLACEHOLDER") ||
    trimmed.includes("REPLACE_WITH") ||
    trimmed.includes("YOUR_") ||
    trimmed.startsWith("<")
  ) {
    return "";
  }
  return trimmed;
};

export const firebaseConfig = {
  apiKey: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: "studio-9260674464-8df20.firebaseapp.com",
  projectId: "studio-9260674464-8df20",
  storageBucket: "studio-9260674464-8df20.firebasestorage.app",
  messagingSenderId: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: "1:543611851947:web:32d955d7f3a11135f093ee"
};

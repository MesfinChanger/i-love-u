/**
 * @fileOverview Hardened Firebase configuration.
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
  authDomain: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN") || "studio-9260674464-8df20.firebaseapp.com",
  projectId: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "NEXT_PUBLIC_FIREBASE_PROJECT_ID") || "studio-9260674464-8df20",
  storageBucket: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET") || "studio-9260674464-8df20.firebasestorage.app",
  messagingSenderId: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, "NEXT_PUBLIC_FIREBASE_APP_ID") || "1:543611851947:web:32d955d7f3a11135f093ee"
};

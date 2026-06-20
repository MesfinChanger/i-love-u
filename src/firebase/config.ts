/**
 * @fileOverview Hardened Firebase configuration.
 * Sanitizes environment variables to ensure invalid placeholders are rejected.
 */

const sanitizeEnv = (val: string | undefined, keyName: string): string => {
  if (!val) return "";
  const trimmed = val.trim();
  
  // Reject literal placeholder strings injected by uninitialized environments
  if (
    trimmed === "" || 
    trimmed === "undefined" || 
    trimmed === "null" || 
    trimmed === keyName || 
    trimmed.includes("PLACEHOLDER") ||
    trimmed.startsWith("<") ||
    trimmed.startsWith("{") ||
    trimmed.includes("YOUR_")
  ) {
    return "";
  }
  return trimmed;
};

export const firebaseConfig = {
  apiKey: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, "NEXT_PUBLIC_FIREBASE_APP_ID")
};
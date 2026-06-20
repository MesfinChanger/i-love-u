/**
 * @fileOverview Standardized Firebase configuration for the Prosperity Revolution.
 * Correctly maps environment variables while filtering out invalid placeholder strings.
 */

const sanitizeEnv = (val: string | undefined, keyName?: string): string => {
  if (!val) return "";
  const trimmed = val.trim();
  
  // Explicitly filter out known placeholder patterns or un-substituted variables
  if (
    trimmed === "" || 
    trimmed === "undefined" || 
    trimmed === "null" || 
    (keyName && trimmed === keyName) || // Reject literal variable name as value
    trimmed.startsWith("NEXT_PUBLIC_") ||
    trimmed.startsWith("YOUR_") ||
    trimmed.startsWith("<") ||
    trimmed.startsWith("{")
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

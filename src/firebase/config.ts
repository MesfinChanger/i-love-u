/**
 * @fileOverview Standardized Firebase configuration.
 * Maps environment variables directly with a sanitizer to prevent invalid keys from crashing the SDK.
 */

const sanitizeEnv = (val: string | undefined): string => {
  if (!val) return "";
  const trimmed = val.trim();
  // Filter out literal placeholder strings or un-substituted env names
  if (
    trimmed === "" || 
    trimmed === "undefined" || 
    trimmed === "null" || 
    trimmed.startsWith("NEXT_PUBLIC_") ||
    trimmed.startsWith("YOUR_")
  ) {
    return "";
  }
  return trimmed;
};

export const firebaseConfig = {
  apiKey: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: sanitizeEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
};

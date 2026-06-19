/**
 * @fileOverview Firebase configuration object.
 * Maps environment variables to the Firebase Client SDK configuration.
 * Includes aggressive cleaning to prevent "invalid-api-key" runtime errors.
 */

const getSafeEnv = (key: string) => {
  const val = process.env[key] || "";
  // Filter out common placeholders or invalid strings
  if (!val || val === "undefined" || val.includes("YOUR_")) return "";
  return val.trim();
};

export const firebaseConfig = {
  apiKey: getSafeEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getSafeEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getSafeEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getSafeEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getSafeEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getSafeEnv("NEXT_PUBLIC_FIREBASE_APP_ID")
};

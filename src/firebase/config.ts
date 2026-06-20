/**
 * @fileOverview Standardized Firebase configuration.
 * Maps environment variables directly to ensure compatibility with platform injection.
 */

const getEnv = (key: string) => {
  const val = process.env[key];
  // Filter out placeholders, variable names, and string literals of "undefined"/"null"
  if (!val || val === "" || val.startsWith("YOUR_") || val.startsWith("NEXT_PUBLIC_") || val === "undefined" || val === "null") {
    return "";
  }
  return val.trim();
};

export const firebaseConfig = {
  apiKey: getEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("NEXT_PUBLIC_FIREBASE_APP_ID")
};

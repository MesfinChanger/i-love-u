/**
 * @fileOverview Firebase configuration object.
 * Resolves 'auth/api-key-not-valid' by strictly prioritizing environment variables.
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

if (!firebaseConfig.apiKey && typeof window !== 'undefined') {
  console.error("CRITICAL: Firebase API Key is missing. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in your Firebase Console / App Hosting environment.");
}

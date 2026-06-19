/**
 * @fileOverview Firebase configuration object.
 * Uses environment variables for security.
 * Note: To resolve "auth/api-key-not-valid", ensure NEXT_PUBLIC_FIREBASE_API_KEY 
 * is set in your environment (Firebase Console > App Hosting > Environment Variables).
 */

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export const firebaseConfig = {
  apiKey: apiKey || "MISSING_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "spark-dating.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "spark-dating",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "spark-dating.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

if (!apiKey && typeof window !== 'undefined') {
  console.warn("Firebase API Key is missing. Authentication will fail until it is provided in environment variables.");
}

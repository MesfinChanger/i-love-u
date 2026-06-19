/**
 * @fileOverview Firebase configuration object.
 * Strictly prioritizes environment variables for production and automatic publishing.
 */

const isProd = process.env.NODE_ENV === 'production';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (isProd ? "" : "AIzaSy_DEV_PLACEHOLDER"),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

if (!firebaseConfig.apiKey && typeof window !== 'undefined') {
  console.warn("Firebase API Key is missing. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in your environment.");
}
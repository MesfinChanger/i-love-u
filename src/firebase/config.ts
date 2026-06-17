/**
 * Firebase configuration object.
 * These values should be replaced with your actual Firebase project configuration
 * from the Firebase Console (Project Settings > General > Your Apps).
 * 
 * For Firebase App Hosting, these can also be managed via environment variables.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSy...",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "spark-dating.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "spark-dating",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "spark-dating.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

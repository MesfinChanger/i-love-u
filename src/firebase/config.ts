/**
 * @fileOverview Firebase configuration object.
 * Strictly prioritizes environment variables for production and automatic publishing.
 */

// Hardened check for environment variables to help debug "api-key-not-valid"
const getEnv = (key: string) => {
  if (typeof process === 'undefined' || !process.env) return "";
  const value = process.env[key];
  if (!value && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    console.warn(`Firebase Config: ${key} is missing. Please set it in your environment variables.`);
  }
  return value || "";
};

export const firebaseConfig = {
  apiKey: getEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('NEXT_PUBLIC_FIREBASE_APP_ID')
};

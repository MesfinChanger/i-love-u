/**
 * @fileOverview Hardened Firebase configuration object.
 * Standard Next.js environment variable mapping.
 */

const getEnv = (key: string): string => {
  if (typeof window === 'undefined') return "";
  const value = process.env[key];
  // Filter out literal "undefined" or "null" strings often seen in early provisioning
  if (!value || value === 'undefined' || value === 'null') {
    return "";
  }
  return value.trim();
};

export const firebaseConfig = {
  apiKey: getEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('NEXT_PUBLIC_FIREBASE_APP_ID')
};

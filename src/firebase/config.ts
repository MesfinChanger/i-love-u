/**
 * @fileOverview Hardened Firebase configuration object.
 * Maps NEXT_PUBLIC environment variables with strict validation to prevent initialization crashes.
 */

const getEnv = (key: string): string => {
  const value = process.env[key];
  // Filter out placeholders, literal "undefined" strings, and empty values
  if (!value || value === 'undefined' || value === 'null' || value.includes('YOUR_')) {
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

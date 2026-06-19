/**
 * @fileOverview Firebase configuration object.
 * Strictly prioritizes environment variables and validates them to prevent boot crashes.
 */

const getEnv = (key: string) => {
  if (typeof process === 'undefined' || !process.env) return "";
  const val = process.env[key];
  
  // Defensive check for common placeholder strings or literal "undefined"
  // Next.js sometimes injects "undefined" as a string if the variable is missing
  if (!val || 
      val === "YOUR_API_KEY" || 
      val === "undefined" || 
      val === "" || 
      val.startsWith('AIza') === false // Firebase API keys always start with AIza
  ) {
    return "";
  }
  return val;
};

export const firebaseConfig = {
  apiKey: getEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('NEXT_PUBLIC_FIREBASE_APP_ID')
};

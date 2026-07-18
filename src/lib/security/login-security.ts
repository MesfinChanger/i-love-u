import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 10 * 60 * 1000; // 10 minutes

export async function checkLoginLock(email: string) {
  // Note: Since we don't have the UID yet, we use a hash of the email or a dedicated lock registry
  // For this prototype, we check the user document if it exists
  const q = doc(db, "users_security", email.replace(/\./g, '_'));
  const snap = await getDoc(q);

  if (!snap.exists()) {
    return { locked: false };
  }

  const data = snap.data();
  const now = Date.now();

  if (data.lockedUntil && data.lockedUntil > now) {
    return {
      locked: true,
      remaining: Math.ceil((data.lockedUntil - now) / 1000),
    };
  }

  return { locked: false };
}

export async function recordFailedLogin(email: string) {
  const securityRef = doc(db, "users_security", email.replace(/\./g, '_'));
  const snap = await getDoc(securityRef);
  
  let attempts = 1;
  if (snap.exists()) {
    attempts = (snap.data().loginAttempts || 0) + 1;
  }

  const update: any = {
    loginAttempts: attempts,
    lastAttempt: serverTimestamp(),
    email: email
  };

  if (attempts >= MAX_ATTEMPTS) {
    update.lockedUntil = Date.now() + LOCK_TIME;
  }

  await setDoc(securityRef, update, { merge: true });

  await addDoc(collection(db, "securityLogs"), {
    email,
    action: "LOGIN_FAILED",
    success: false,
    timestamp: serverTimestamp(),
  });
}

export async function recordSuccessfulLogin(uid: string, email: string) {
  const securityRef = doc(db, "users_security", email.replace(/\./g, '_'));
  
  await setDoc(securityRef, {
    loginAttempts: 0,
    lockedUntil: null,
    lastLogin: serverTimestamp(),
    uid: uid
  }, { merge: true });

  await addDoc(collection(db, "securityLogs"), {
    uid,
    email,
    action: "LOGIN_SUCCESS",
    success: true,
    timestamp: serverTimestamp(),
  });

  await setDoc(
    doc(db, "users", uid),
    {
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );
}

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

/**
 * @fileOverview Login Security Protocol.
 * Tracks failed attempts and enforces temporary account locking.
 */

export async function checkLoginLock(email: string) {
  if (!email) return { locked: false };
  
  const securityId = email.toLowerCase().replace(/\./g, '_');
  const securityRef = doc(db, "users_security", securityId);
  const snap = await getDoc(securityRef);

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
  if (!email) return;
  
  const securityId = email.toLowerCase().replace(/\./g, '_');
  const securityRef = doc(db, "users_security", securityId);
  const snap = await getDoc(securityRef);
  
  let attempts = 1;
  if (snap.exists()) {
    attempts = (snap.data().loginAttempts || 0) + 1;
  }

  const update: any = {
    loginAttempts: attempts,
    lastAttempt: serverTimestamp(),
    email: email.toLowerCase()
  };

  if (attempts >= MAX_ATTEMPTS) {
    update.lockedUntil = Date.now() + LOCK_TIME;
  }

  await setDoc(securityRef, update, { merge: true });

  await addDoc(collection(db, "securityLogs"), {
    email: email.toLowerCase(),
    action: "LOGIN_FAILED",
    success: false,
    timestamp: serverTimestamp(),
  });
}

export async function recordSuccessfulLogin(uid: string, email: string) {
  if (!email) return;
  
  const securityId = email.toLowerCase().replace(/\./g, '_');
  const securityRef = doc(db, "users_security", securityId);
  
  await setDoc(securityRef, {
    loginAttempts: 0,
    lockedUntil: null,
    lastLogin: serverTimestamp(),
    uid: uid
  }, { merge: true });

  await addDoc(collection(db, "securityLogs"), {
    uid,
    email: email.toLowerCase(),
    action: "LOGIN_SUCCESS",
    success: true,
    timestamp: serverTimestamp(),
  });

  await setDoc(doc(db, "users", uid), { lastLogin: serverTimestamp() }, { merge: true });
}

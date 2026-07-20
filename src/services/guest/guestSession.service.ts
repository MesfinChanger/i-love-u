import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    Timestamp
  } from "firebase/firestore";
  
  import { db } from "@/lib/firebase";
  
  
  const GUEST_SESSION_DURATION = 30 * 60 * 1000;
  
  
  export async function createGuestSession(uid: string) {
  
    const now = new Date();
  
    const expiresAt = new Date(
      now.getTime() + GUEST_SESSION_DURATION
    );
  
  
    const sessionRef = doc(
      db,
      "guestSessions",
      uid
    );
  
  
    await setDoc(sessionRef, {
      uid,
      startedAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
      sparkGreetingsSent: 0,
      status: "active"
    });
  
  
    return {
      expiresAt
    };
  }
  
  
  
  export async function getGuestSession(uid: string) {
  
    const sessionRef = doc(
      db,
      "guestSessions",
      uid
    );
  
  
    const snapshot = await getDoc(sessionRef);
  
  
    if (!snapshot.exists()) {
      return null;
    }
  
  
    return snapshot.data();
  
  }
  
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    Timestamp
  } from "firebase/firestore";
  
  import { db } from "@/lib/firebase";
  
  /**
   * @fileOverview Guest Session Protocol Service.
   * Manages the high-fidelity lifecycle of anonymous explorer sessions.
   */
  
  const GUEST_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
  
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
  
    // Prosperity Protocol: Register session with high-fidelity permissions
    await setDoc(sessionRef, {
      uid,
      role: "guest",
      startedAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
      sparkGreetingsSent: 0,
      status: "active",
      permissions: {
        spark: true,
        circle: true,
        ideas: true,
        messages: false,
        shopping: false,
        wallet: false,
        ads: false,
        admin: false,
      }
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

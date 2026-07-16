import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview Analytics Protocol Service.
 * Orchestrates the registration of high-fidelity community heartbeats.
 */

/**
 * Track Event Protocol.
 * Dispatches a high-fidelity event record to the global analytics registry.
 * Aligned with the restricted security rule: match /analyticsEvents/{eventId}
 */
export async function trackEvent(
  event: any
) {
  try {
    await addDoc(
      collection(
        db,
        "analyticsEvents"
      ),
      {
        ...event,
        createdAt: serverTimestamp()
      }
    );
  } catch (e) {
    // Analytics failures are non-blocking to ensure smooth heart interactions
    console.warn("Analytics Ripple:", e);
  }
}

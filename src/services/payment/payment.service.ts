import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview Payment Protocol Service.
 * Orchestrates the registration of financial heartbeat records across the global bridge.
 */

export async function createPaymentRecord(
  payment: any
) {
  const ref = await addDoc(
    collection(
      db,
      "payments"
    ),
    {
      ...payment,
      createdAt: serverTimestamp()
    }
  );

  return ref.id;
}

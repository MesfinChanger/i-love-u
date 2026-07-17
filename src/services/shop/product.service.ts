import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview Product Protocol Service.
 * Orchestrates high-fidelity marketplace operations and listing creation.
 */

export async function createProduct(data: any) {
  if (!db) throw new Error("Firestore bridge not initialized.");
  
  return await addDoc(
    collection(db, "products"),
    {
      ...data,
      status: data.status || "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  );
}

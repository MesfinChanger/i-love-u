
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
  return await addDoc(
    collection(db, "products"),
    {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  );
}

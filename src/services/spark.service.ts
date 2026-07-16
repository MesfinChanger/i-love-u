
/**
 * @fileOverview High-Fidelity Discovery and Spark Service.
 */

import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/firebase";

/**
 * Creates or updates a high-fidelity Spark Profile.
 */
export async function createSparkProfile(profile: any) {
  if (!db) return;
  await setDoc(
    doc(db, "sparkProfiles", profile.userId),
    {
      ...profile,
      createdAt: serverTimestamp()
    }
  );
}

/**
 * Discovers public hearts swimming in the Spark stream.
 */
export async function discoverSparkUsers() {
  if (!db) return [];
  const q = query(
    collection(db, "sparkProfiles"),
    where("visibility", "==", "public")
  );

  const result = await getDocs(q);

  return result.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

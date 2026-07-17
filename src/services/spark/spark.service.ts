'use client';

import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "@/firebase";

/**
 * @fileOverview Spark Discovery Service.
 * Orchestrates the retrieval of public, active heart profiles within the Prosperity Revolution.
 */
export async function discoverSparkProfiles() {
  if (!db) {
    console.warn("Spark Service: Firestore bridge not initialized.");
    return [];
  }

  const profilesRef = collection(db, "sparkProfiles");

  const q = query(
    profilesRef,
    where("visibility", "==", "public"),
    where("active", "==", true)
  );

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Spark Discovery Ripple:", error);
    return [];
  }
}

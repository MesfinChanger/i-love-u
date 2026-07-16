
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Organization } from "@/types";

/**
 * @fileOverview Organization Protocol Service.
 * Orchestrates registration and management of community entities.
 */

/**
 * Create Organization Protocol.
 * Registers a new organization in the global community registry.
 */
export async function createOrganization(org: Partial<Organization>) {
  const ref = await addDoc(collection(db, "organizations"), {
    ...org,
    verified: false,
    createdAt: serverTimestamp()
  });
  return ref.id;
}

/**
 * Get Organization Protocol.
 * Retrieves a specific organization by its ID.
 */
export async function getOrganization(id: string) {
  const snap = await getDoc(doc(db, "organizations", id));
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as Organization;
  }
  return null;
}

/**
 * List Organizations Protocol.
 * Retrieves all registered organizations.
 */
export async function listOrganizations() {
  const snap = await getDocs(collection(db, "organizations"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Organization[];
}

/**
 * Get User Organizations Protocol.
 * Retrieves organizations owned by a specific heart.
 */
export async function getUserOrganizations(userId: string) {
  const q = query(collection(db, "organizations"), where("ownerId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Organization[];
}

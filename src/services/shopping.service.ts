import {
  collection,
  doc,
  addDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview Shopping Protocol Service.
 * Orchestrates high-fidelity marketplace operations, store management, and order tracking.
 */

/**
 * Create Store Protocol.
 * Establishes a verified artisan presence in the community.
 */
export async function createStore(store: any) {
  const id = `shop-${store.ownerId}`;
  await setDoc(
    doc(db, "shops", id),
    {
      ...store,
      createdAt: serverTimestamp()
    }
  );
  return id;
}

/**
 * Create Product Protocol.
 * Registers a new listing in the global marketplace.
 */
export async function createProduct(
  product: any
) {
  const ref = await addDoc(
    collection(db, "products"),
    {
      ...product,
      createdAt: serverTimestamp()
    }
  );

  return ref.id;
}

/**
 * Create Order Protocol.
 * Records a successful purchase transaction in the cloud.
 */
export async function createOrder(
  order: any
) {
  const ref = await addDoc(
    collection(db, "orders"),
    {
      ...order,
      createdAt: serverTimestamp()
    }
  );

  return ref.id;
}

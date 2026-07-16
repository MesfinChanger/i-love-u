import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
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
 * Records a successful purchase transaction in the cloud with mandatory status initialization.
 */
export async function createOrder(
  order: any
) {
  const ref = await addDoc(
    collection(db, "orders"),
    {
      ...order,
      paymentStatus: "pending",
      shippingStatus: "processing",
      createdAt: serverTimestamp()
    }
  );

  return ref.id;
}

/**
 * Get Stores Protocol.
 * Retrieves all registered artisan shops from the community registry.
 */
export async function getStores() {
  const snapshot = await getDocs(
    collection(db, "shops")
  );

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

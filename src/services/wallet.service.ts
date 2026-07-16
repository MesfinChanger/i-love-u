import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview Wallet Protocol Service.
 * Orchestrates prosperity balance management and transaction logging.
 * Aligned with the high-fidelity subcollection hierarchy.
 */

/**
 * Create Wallet Protocol.
 * Establishes a baseline prosperity registry for a new heart.
 */
export async function createWallet(
  userId: string,
  currency: string = "USD"
) {
  await setDoc(
    doc(
      db,
      "wallets",
      userId
    ),
    {
      userId,
      currency,
      availableBalance: 0,
      pendingBalance: 0,
      status: "active",
      createdAt: serverTimestamp()
    }
  );
}

/**
 * Get Wallet Protocol.
 * Retrieves the prosperity registry for a specific heart.
 */
export async function getWallet(
  userId: string
) {
  const snapshot = await getDoc(
    doc(
      db,
      "wallets",
      userId
    )
  );

  if (snapshot.exists()) {
    return snapshot.data();
  }

  return null;
}

/**
 * Add Transaction Protocol.
 * Dispatches a financial heartbeat to the high-fidelity transaction registry.
 * Note: Uses the subcollection pattern: /wallets/{userId}/transactions
 */
export async function createTransaction(
  transaction: any
) {
  const userId = transaction.userId;
  if (!userId) throw new Error("Transaction Protocol Ripple: userId is mandatory for registry.");

  await addDoc(
    collection(
      db,
      "wallets",
      userId,
      "transactions"
    ),
    {
      ...transaction,
      createdAt: serverTimestamp()
    }
  );
}

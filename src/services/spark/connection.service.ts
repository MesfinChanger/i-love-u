'use client';

import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview Connection Protocol Service.
 * Orchestrates the creation of high-fidelity community bonds and conversation rooms.
 */

/**
 * Create Spark Connection Protocol.
 * Registers a new connection and initializes a secured conversation room.
 */
export async function createSparkConnection(
  userA: string,
  userB: string
) {
  // 1. Establish the community bond record
  const connectionRef = await addDoc(
    collection(db, "sparkConnections"),
    {
      userIds: [userA, userB],
      status: "active",
      createdAt: serverTimestamp()
    }
  );

  // 2. Initialize the high-fidelity conversation room
  const conversationRef = await addDoc(
    collection(db, "conversations"),
    {
      participants: [userA, userB],
      type: "spark",
      connectionId: connectionRef.id,
      createdAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp()
    }
  );

  return {
    connectionId: connectionRef.id,
    conversationId: conversationRef.id
  };
}
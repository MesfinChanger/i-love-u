'use client';

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createSparkConnection } from "./connection.service";

/**
 * @fileOverview Greeting Acceptance Protocol.
 * Orchestrates the transition from a pending greeting to an active spark connection.
 */

/**
 * Accept Greeting Protocol.
 * 1. Updates the greeting status to 'accepted'.
 * 2. Establishes a formal Spark Connection and Conversation room.
 */
export async function acceptGreeting(
  greetingId: string,
  senderId: string,
  receiverId: string
) {
  // 1. Update the outreach registry
  await updateDoc(
    doc(db, "sparkGreetings", greetingId),
    {
      status: "accepted"
    }
  );

  // 2. Launch the connection protocol
  await createSparkConnection(senderId, receiverId);
}

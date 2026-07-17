/**
 * @fileOverview High-Fidelity Firebase Initialization Proxy.
 * Synchronized with the lib/firebase persistence protocol.
 */

import { app, auth, db, storage } from "@/lib/firebase";

export { app, auth, db, storage };

/**
 * Universal Initialization Protocol.
 * Returns the active instances for platform-wide synchronization.
 */
export function initializeFirebase() {
  return { app, auth, db, storage };
}

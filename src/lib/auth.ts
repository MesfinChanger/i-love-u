import {
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Identity Listener Protocol.
 * Subscribes to the heart's authentication heartbeat.
 */
export function listenAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

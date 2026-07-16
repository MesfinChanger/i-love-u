
import {
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "@/firebase";

/**
 * @fileOverview High-Fidelity Authentication Helpers.
 */

export function listenAuth(
  callback: (user: User | null) => void
) {
  if (!auth) return () => {};
  return onAuthStateChanged(
    auth,
    callback
  );
}

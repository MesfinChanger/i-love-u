
import {
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "@/firebase";

export function listenAuth(
  callback: (user: User | null) => void
) {
  if (!auth) return () => {};
  return onAuthStateChanged(
    auth,
    callback
  );
}

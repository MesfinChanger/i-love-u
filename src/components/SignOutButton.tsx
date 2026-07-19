"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  async function logout() {
    await signOut(auth);
    router.push("/login");
  }

  return (
    <button
      onClick={logout}
      className="rounded-xl border px-4 + py-2 hover:bg-slate-50 transition-colors font-bold text-sm"
    >
      🚪 Sign Out
    </button>
  );
}
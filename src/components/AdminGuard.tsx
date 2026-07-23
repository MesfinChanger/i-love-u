"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { checkAdmin } from "@/lib/admin";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Secure Admin Route Guard.
 * Ensures only Guardians can access administrative mission modules.
 */
export default function AdminGuard({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const allowed = await checkAdmin(user.uid);
      if (!allowed) {
        router.push("/");
        return;
      }
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4 opacity-40">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest">Verifying Authority...</p>
      </div>
    );
  }

  return <>{children}</>;
}

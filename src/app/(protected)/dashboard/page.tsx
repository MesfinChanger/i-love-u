'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Neutralized duplicate route to resolve Parallel Route Conflicts.
 * All logic has been consolidated to the root /dashboard path.
 */
export default function NeutralizedDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
}

'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Redundant Route Group component.
 * Redirects to the root /dashboard to resolve Parallel Route Conflicts.
 */
export default function DeprecatedDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
}

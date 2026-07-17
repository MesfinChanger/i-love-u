'use client';
/**
 * @fileOverview Deprecated Protected Route.
 * Consolidated at src/app/dashboard/page.tsx to resolve parallel route conflicts.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeprecatedDashboardPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
}

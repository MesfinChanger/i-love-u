'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Deprecated Route Group component.
 * Redirects to the root /dashboard in accordance with project guidelines.
 */
export default function DeprecatedDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
}

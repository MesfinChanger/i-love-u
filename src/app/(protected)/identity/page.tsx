'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Redundant Route Group component.
 * Redirects to the root /identity to resolve Parallel Route Conflicts.
 */
export default function DeprecatedIdentity() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/identity");
  }, [router]);
  return null;
}

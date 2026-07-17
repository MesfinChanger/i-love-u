'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Redundant Route Neutralization.
 * Redirects hearts from (protected) route group to consolidated root path.
 */
export default function RedirectToIdentity() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/identity");
  }, [router]);
  return null;
}

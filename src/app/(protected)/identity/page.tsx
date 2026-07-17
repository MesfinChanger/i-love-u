'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Deprecated Route Group component.
 * Redirects to the root /identity in accordance with project guidelines.
 */
export default function DeprecatedIdentity() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/identity");
  }, [router]);
  return null;
}

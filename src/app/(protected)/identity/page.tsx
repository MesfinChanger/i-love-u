'use client';
/**
 * @fileOverview Deprecated Protected Route.
 * Consolidated at src/app/identity/page.tsx to resolve parallel route conflicts.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeprecatedIdentityPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/identity");
  }, [router]);
  return null;
}

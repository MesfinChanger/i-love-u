'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Neutralized duplicate route to resolve Parallel Route Conflicts.
 * All logic has been consolidated to the root /identity path.
 */
export default function NeutralizedIdentity() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/identity");
  }, [router]);
  return null;
}

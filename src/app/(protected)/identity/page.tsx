'use client';
/**
 * @fileOverview Neutralized Route.
 * Logic moved to src/app/identity/page.tsx to resolve parallel route conflicts.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NeutralizedIdentity() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/identity");
  }, [router]);
  return null;
}

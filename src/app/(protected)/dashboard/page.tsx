'use client';
/**
 * @fileOverview Neutralized Route.
 * Logic consolidated at src/app/dashboard/page.tsx to resolve parallel route conflicts.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NeutralizedDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
}

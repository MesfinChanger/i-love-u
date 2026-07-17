
'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedundantIdentity() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/identity");
  }, [router]);
  return null;
}

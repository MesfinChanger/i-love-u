"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * @fileOverview Legacy Profile Redirect.
 * Ensures hearts navigating to the old route are respectfully guided to the new Identity Hub.
 */
export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/identity");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30">
      <div className="text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
          Redirecting to Identity Hub...
        </p>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/firebase";

interface GuestAccessGuardProps {
  feature: 
    | "spark"
    | "circle"
    | "messages"
    | "shopping"
    | "wallet"
    | "profile";

  children: React.ReactNode;
}

/**
 * @fileOverview Hardened Guest Access Guard Protocol.
 * Manages session expiration and feature-based permissions for anonymous hearts.
 * Ensures anonymous users cannot bypass permissions without a valid guest session record.
 */
export default function GuestAccessGuard({
  feature,
  children,
}: GuestAccessGuardProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();

  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (authLoading) return;

      if (!user) {
        router.push("/login");
        return;
      }

      if (!db) return;

      try {
        const guestRef = doc(db, "guestSessions", user.uid);
        const snap = await getDoc(guestRef);

        if (!snap.exists()) {
          // Anonymous users must have a guest session record
          if (user.isAnonymous) {
            router.push("/signup?reason=guest-required");
            return;
          }

          // Registered users get full access
          setAllowed(true);
          setChecking(false);
          return;
        }

        const guest = snap.data();
        const expiresAt = guest.expiresAt?.toDate();
        const now = new Date();
        const expired = !expiresAt || expiresAt < now;

        /**
         * Guest Permissions Registry.
         * Only Discovery Hubs are authorized for 30-minute explorers.
         */
        const guestAllowedFeatures = [
          "spark",
          "circle",
        ];

        if (!expired && guestAllowedFeatures.includes(feature)) {
          setAllowed(true);
        } else {
          // Redirect if mission expired or feature restricted
          router.push(expired ? "/signup?reason=guest-expired" : "/signup?reason=unauthorized");
        }
      } catch (e) {
        console.error("Access Protocol Ripple:", e);
      } finally {
        setChecking(false);
      }
    }

    checkAccess();
  }, [user, feature, router, authLoading]);

  if (checking || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verifying Protocol...</p>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}

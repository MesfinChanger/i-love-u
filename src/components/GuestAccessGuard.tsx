'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/firebase";

interface GuestAccessGuardProps {
  feature: 
    | "spark"
    | "circle"
    | "messages"
    | "shop"
    | "wallet"
    | "profile";

  children: React.ReactNode;
}

/**
 * @fileOverview Guest Access Guard Protocol.
 * Manages session expiration and feature-based permissions for anonymous hearts.
 */
export default function GuestAccessGuard({
  feature,
  children,
}: GuestAccessGuardProps) {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.currentUser;

  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (!user) {
        // If auth context is ready but no user, redirect to login
        if (auth) router.push("/login");
        return;
      }

      if (!db) return;

      try {
        const guestRef = doc(db, "guestSessions", user.uid);
        const snap = await getDoc(guestRef);

        // Normal registered users (no guest session record) have full access
        if (!snap.exists()) {
          setAllowed(true);
          setChecking(false);
          return;
        }

        const guest = snap.data();
        const expiresAt = guest.expiresAt?.toDate();
        const now = new Date();
        const expired = !expiresAt || expiresAt < now;

        // Guest permissions: Only allowed to see Spark and Circle
        const guestAllowedFeatures = ["spark", "circle"];

        if (!expired && guestAllowedFeatures.includes(feature)) {
          setAllowed(true);
        } else {
          // If expired or unauthorized feature, guide to signup for permanent status
          router.push("/signup?reason=" + (expired ? "guest-expired" : "unauthorized"));
        }
      } catch (e) {
        console.error("Access Protocol Ripple:", e);
      } finally {
        setChecking(false);
      }
    }

    checkAccess();
  }, [user, feature, router, auth]);

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Checking Access...</p>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}

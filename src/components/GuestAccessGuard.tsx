"use client";

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

export default function GuestAccessGuard({
  feature,
  children,
}: GuestAccessGuardProps) {
  const router = useRouter();
  const { user } = useAuth() || {};

  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (!user) {
        // Only redirect if we are certain the user is not logged in
        // In a real app, you might wait for auth loading state
        return;
      }

      if (!db) return;

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
        router.push("/signup?reason=guest-expired");
      }

      setChecking(false);
    }

    checkAccess();
  }, [user, feature, router]);

  if (checking) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Checking access...</p>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}

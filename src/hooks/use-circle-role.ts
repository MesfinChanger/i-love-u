"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/firebase";
import { getCircleRole, type CircleRole } from "@/services/circle-permission.service";

/**
 * @fileOverview High-Fidelity Circle Role Hook.
 * Orchestrates the retrieval of a heart's specific authority level within a circle frequency.
 * Stabilized with internal error recovery to prevent hydration ripples.
 */
export function useCircleRole(circleId: string | undefined) {
  const { user } = useUser();
  const [role, setRole] = useState<CircleRole>("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!user || !circleId) {
        if (mounted) {
          setRole("guest");
          setLoading(false);
        }
        return;
      }

      try {
        const result = await getCircleRole(circleId, user.uid);
        if (mounted) {
          setRole(result);
        }
      } catch (e) {
        console.warn("Role Sync Ripple:", e);
        if (mounted) setRole("guest");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [circleId, user]);

  return {
    role,
    loading,
    isOwner: role === "owner",
    isAdmin: role === "admin" || role === "owner",
    isModerator: role === "moderator" || role === "admin" || role === "owner",
    isMember: [
      "member", 
      "moderator", 
      "admin", 
      "owner"
    ].includes(role)
  };
}

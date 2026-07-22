"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/firebase";
import { getCircleRole, type CircleRole } from "@/services/circle-permission.service";

/**
 * @fileOverview High-Fidelity Circle Role Hook.
 * Orchestrates the retrieval of a heart's specific authority level within a circle frequency.
 * Provides boolean flags for structural UI branching (Member, Moderator, Admin, Owner).
 */
export function useCircleRole(circleId: string) {
  const { user } = useUser();
  const [role, setRole] = useState<CircleRole>("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setRole("guest");
        setLoading(false);
        return;
      }

      try {
        const result = await getCircleRole(circleId, user.uid);
        setRole(result);
      } catch (e) {
        console.warn("Role Sync Ripple:", e);
        setRole("guest");
      } finally {
        setLoading(false);
      }
    }

    load();
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

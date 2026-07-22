"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/firebase";
import {
  CircleRole,
  normalizeRole,
  getCircleRole
} from "@/services/circle-permission.service";

interface CircleRoleState {
  role: CircleRole;
  isOwner: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isMember: boolean;
  isGuest: boolean;
  loading: boolean;
}

/**
 * @fileOverview High-Fidelity Circle Role Hook.
 * Automatically synchronizes a heart's authority with the community registry.
 */
export function useCircleRole(circleId?: string): CircleRoleState {
  const { user } = useUser();
  const [role, setRole] = useState<CircleRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function sync() {
      if (!circleId || !user?.uid) {
        if (mounted) {
          setRole(null);
          setLoading(false);
        }
        return;
      }
      
      setLoading(true);
      try {
        const currentRole = await getCircleRole(circleId, user.uid);
        if (mounted) setRole(currentRole);
      } catch (error) {
        console.warn("Hook authority handshake ripple:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    sync();
    return () => { mounted = false; };
  }, [circleId, user?.uid]);

  const normalizedRole = normalizeRole(role);

  return {
    role: normalizedRole,
    isOwner: normalizedRole === "owner",
    isAdmin: normalizedRole === "owner" || normalizedRole === "moderator",
    isModerator: normalizedRole === "owner" || normalizedRole === "moderator",
    isMember: normalizedRole === "owner" || normalizedRole === "moderator" || normalizedRole === "member",
    isGuest: normalizedRole === "guest",
    loading
  };
}

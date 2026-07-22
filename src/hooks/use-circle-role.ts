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
  loading: boolean;
  isOwner: boolean;
  isModerator: boolean;
  isMember: boolean;
  isGuest: boolean;
}

/**
 * @fileOverview High-Fidelity Circle Role Hook.
 * Automatically synchronizes a heart's authority with the circle's member registry.
 */
export function useCircleRole(
 circleId?: string
): CircleRoleState {
 const { user } = useUser();
 const [role, setRole] = useState<CircleRole>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   async function sync() {
     if (!circleId || !user?.uid) {
       setLoading(false);
       return;
     }
     const currentRole = await getCircleRole(circleId, user.uid);
     setRole(currentRole);
     setLoading(false);
   }
   sync();
 }, [circleId, user?.uid]);

 const normalizedRole = normalizeRole(role);

 return {
   role: normalizedRole,
   loading,
   isOwner: normalizedRole === "owner",
   isModerator: normalizedRole === "owner" || normalizedRole === "moderator",
   isMember: normalizedRole === "owner" || normalizedRole === "moderator" || normalizedRole === "member",
   isGuest: normalizedRole === "guest" || !normalizedRole
 };
}

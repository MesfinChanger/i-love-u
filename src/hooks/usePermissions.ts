"use client";

import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/use-memo-firebase";
import { hasPermission } from "@/security/permissionEngine";
import { Permission } from "@/security/permissions";

/**
 * @fileOverview Global Permission Hook.
 * Correctly derives a heart's authority from their Firestore registry signature.
 */
export function usePermissions() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile, loading: profileLoading } = useDoc(userRef);

  const role = (profile as any)?.role || (profile as any)?.accountType || "guest";
  const loading = authLoading || profileLoading;

  return {
    loading,
    role,
    canCreateSpark: hasPermission(role, Permission.CREATE_SPARK),
    canSendMessage: hasPermission(role, Permission.SEND_MESSAGE),
    canJoinCircle: hasPermission(role, Permission.JOIN_CIRCLE),
    canDonate: hasPermission(role, Permission.DONATE),
    canManageUsers: hasPermission(role, Permission.MANAGE_USERS),
    canModerate: hasPermission(role, Permission.MODERATE_CONTENT),
    canViewSecurity: hasPermission(role, Permission.VIEW_SECURITY),
  };
}

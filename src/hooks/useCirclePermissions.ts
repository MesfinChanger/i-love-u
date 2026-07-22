"use client";

/**
 * @fileOverview Hardened Circle Permission Hook.
 *
 * Purpose:
 * - UI authorization state provider.
 * - Single interface for Circle UI components.
 *
 * Security boundary:
 * This hook DOES NOT protect data.
 */

import { useMemo } from "react";
import {
  CircleMemberPermission,
  canPost,
  canComment,
  canViewCircle,
  canManageMembers,
  canModerate,
  canChangeRole,
  canRemoveMember,
  canDeleteCircle,
  canEditCircle,
  isOwner,
  isModerator,
  isMember
} from "@/services/circle-permission.service";

export interface CirclePermissionState {
  canViewCircle: boolean;
  canPost: boolean;
  canComment: boolean;
  canManageMembers: boolean;
  canModerate: boolean;
  isOwner: boolean;
  isModerator: boolean;
  isMember: boolean;
  canChangeRole: (target?: CircleMemberPermission | null) => boolean;
  canRemoveMember: (target?: CircleMemberPermission | null) => boolean;
  canDeleteCircle: boolean;
  canEditCircle: boolean;
  authenticated: boolean;
  hasPermission: boolean;
}

export function useCirclePermissions(
  member?: CircleMemberPermission | null,
  isPublic: boolean = false
): CirclePermissionState {

  return useMemo(() => {
    const owner = isOwner(member);
    const moderator = isModerator(member);
    const memberAccess = isMember(member);

    return {
      /* Visibility */
      canViewCircle: canViewCircle(member, isPublic),

      /* Content */
      canPost: canPost(member),
      canComment: canComment(member),

      /* Administration */
      canManageMembers: canManageMembers(member),
      canModerate: canModerate(member),

      /* Identity */
      isOwner: owner,
      isModerator: moderator,
      isMember: memberAccess,

      /* Member actions */
      canChangeRole: (target?: CircleMemberPermission | null) => {
        return canChangeRole(member, target);
      },

      canRemoveMember: (target?: CircleMemberPermission | null) => {
        return canRemoveMember(member, target);
      },

      /* Circle lifecycle */
      canDeleteCircle: canDeleteCircle(member),
      canEditCircle: canEditCircle(member),

      /* Security helpers */
      authenticated: Boolean(member?.userId),
      hasPermission: Boolean(member && memberAccess)
    };
  }, [member, isPublic]);
}

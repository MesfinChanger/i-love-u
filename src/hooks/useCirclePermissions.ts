"use client";

import {
  CircleMemberPermission,
  canViewCircle,
  canPost,
  canComment,
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



/**
 * Circle Permission Hook
 *
 * Single source of truth for UI authorization.
 *
 * IMPORTANT:
 * This controls UI only.
 * Real protection is enforced by:
 *
 * circle-admin.service.ts
 * Firebase Security Rules
 *
 */


export function useCirclePermissions(

  member?: CircleMemberPermission | null,

  isPublic:boolean = false

){


  return {


    /**
     * Visibility
     */
    canViewCircle:
      canViewCircle(
        member,
        isPublic
      ),



    /**
     * Content permissions
     */
    canPost:
      canPost(member),


    canComment:
      canComment(member),



    /**
     * Administration
     */
    canManageMembers:
      canManageMembers(member),


    canModerate:
      canModerate(member),



    /**
     * Role identity
     */
    isOwner:
      isOwner(member),


    isModerator:
      isModerator(member),


    isMember:
      isMember(member),



    /**
     * Advanced actions
     *
     * Used when comparing
     * current user against target user
     */
    canChangeRole:
      (
        target?: CircleMemberPermission | null
      ) =>
        canChangeRole(
          member,
          target
        ),



    canRemoveMember:
      (
        target?: CircleMemberPermission | null
      ) =>
        canRemoveMember(
          member,
          target
        ),



    canDeleteCircle:
      canDeleteCircle(member),



    canEditCircle:
      canEditCircle(member)



  };

}
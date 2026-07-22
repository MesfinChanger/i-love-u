"use client";

import {
  canViewCircle,
  canPost,
  canComment,
  canManageMembers,
  canModerate,
  isOwner,
  isModerator,
  CircleMemberPermission
} from "@/services/circle-permission.service";


export function useCirclePermissions(
  member?: CircleMemberPermission | null,
  isPublic:boolean = false
){

  return {

    canViewCircle:
      canViewCircle(
        member,
        isPublic
      ),

    canPost:
      canPost(member),

    canComment:
      canComment(member),

    canManageMembers:
      canManageMembers(member),

    canModerate:
      canModerate(member),

    isOwner:
      isOwner(member),

    isModerator:
      isModerator(member)

  };

}
"use client";

import { ReactNode } from "react";

import { useCirclePermissions } from "@/hooks/useCirclePermissions";

import {
  CircleMemberPermission
} from "@/services/circle-permission.service";


interface CirclePermissionGuardProps {

  member?: CircleMemberPermission | null;

  permission:
    | "canPost"
    | "canComment"
    | "canManageMembers"
    | "canModerate"
    | "isOwner"
    | "isModerator";

  children: ReactNode;

}


export default function CirclePermissionGuard({

  member,

  permission,

  children

}: CirclePermissionGuardProps) {


  const permissions =
    useCirclePermissions(member);


  if (!permissions[permission]) {

    return null;

  }


  return (
    <>
      {children}
    </>
  );

}
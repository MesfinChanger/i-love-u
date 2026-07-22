"use client";

/**
 * @fileOverview Hardened Circle Permission Hook.
 *
 * Purpose:
 * - UI authorization state provider.
 * - Single interface for Circle components.
 *
 * Security boundary:
 * This hook DOES NOT secure data.
 *
 * Real enforcement:
 * - Firebase Security Rules
 * - Server validation
 * - circle-admin.service.ts
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


  readonly canViewCircle:boolean;


  readonly canPost:boolean;


  readonly canComment:boolean;



  readonly canManageMembers:boolean;


  readonly canModerate:boolean;



  readonly isOwner:boolean;


  readonly isModerator:boolean;


  readonly isMember:boolean;




  readonly canChangeRole:
  (
    target?:CircleMemberPermission|null
  )=>boolean;



  readonly canRemoveMember:
  (
    target?:CircleMemberPermission|null
  )=>boolean;




  readonly canDeleteCircle:boolean;


  readonly canEditCircle:boolean;




  readonly authenticated:boolean;


  readonly hasPermission:boolean;

}







export function useCirclePermissions(

  member?:CircleMemberPermission|null,

  isPublic:boolean=false

):CirclePermissionState {



  return useMemo(()=>{


    const owner =
      isOwner(member);



    const moderator =
      isModerator(member);



    const memberAccess =
      isMember(member);




    return Object.freeze({


      /**
       * Visibility
       */
      canViewCircle:

        canViewCircle(
          member,
          isPublic
        ),




      /**
       * Content
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
       * Identity
       */
      isOwner:

        owner,



      isModerator:

        moderator,



      isMember:

        memberAccess,






      /**
       * Member management
       */
      canChangeRole:

        (
          target?:CircleMemberPermission|null
        ):boolean =>

          canChangeRole(
            member,
            target
          ),





      canRemoveMember:

        (
          target?:CircleMemberPermission|null
        ):boolean =>

          canRemoveMember(
            member,
            target
          ),






      /**
       * Circle lifecycle
       */
      canDeleteCircle:

        canDeleteCircle(member),



      canEditCircle:

        canEditCircle(member),





      /**
       * Security state
       */
      authenticated:

        Boolean(
          member?.userId
        ),




      hasPermission:

        Boolean(
          member &&
          memberAccess
        )


    });


  },[
    member,
    isPublic
  ]);

}
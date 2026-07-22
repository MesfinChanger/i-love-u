"use client";


import {
  CircleRole,
  normalizeRole
} from "@/services/circle-permission.service";



interface CircleRoleState {

  role:CircleRole;

  isOwner:boolean;

  isModerator:boolean;

  isMember:boolean;

  isGuest:boolean;

}





export function useCircleRole(

 role?:unknown

):CircleRoleState {


 const normalizedRole =
   normalizeRole(role);



 return {


   role:
     normalizedRole,


   isOwner:

     normalizedRole==="owner",



   isModerator:

     normalizedRole==="owner"
     ||
     normalizedRole==="moderator",



   isMember:

     normalizedRole==="owner"
     ||
     normalizedRole==="moderator"
     ||
     normalizedRole==="member",



   isGuest:

     normalizedRole==="guest"


 };


}
import {
    CircleRole
  } from "@/services/circle-permission.service";
  
  
  
  export type Permission =
  
    | "view"
    | "post"
    | "comment"
    | "moderate"
    | "manageMembers"
    | "deleteCircle";
  
  
  
  
  
  const rolePermissions:
  
  Record<
   Exclude<CircleRole,null|undefined>,
   Permission[]
  >
  =
  {
  
  
   owner:[
  
     "view",
     "post",
     "comment",
     "moderate",
     "manageMembers",
     "deleteCircle"
  
   ],
  
  
  
   moderator:[
  
     "view",
     "post",
     "comment",
     "moderate"
  
   ],
  
  
  
   member:[
  
     "view",
     "post",
     "comment"
  
   ],
  
  
  
   guest:[
  
     "view"
  
   ]
  
  
  };
  
  
  
  
  
  export function hasPermission(
  
   role:CircleRole,
  
   permission:Permission
  
  ):boolean {
  
  
  
   if(
     !role
   ){
  
     return false;
  
   }
  
  
  
   return (
  
     rolePermissions[role]
       ?.includes(permission)
  
   )
   ||
   false;
  
  
  }
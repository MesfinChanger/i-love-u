"use client";


import {
 ReactNode
} from "react";


import {
 useRouter
} from "next/navigation";


import {
 useAuth
} from "@/hooks/useAuth";



type GuestPermission =

 | "browse"
 | "viewIdeas"
 | "viewPublicCircles"
 | "viewShop";





interface Props {

 children:ReactNode;

 permission:GuestPermission;

}





const guestPermissions:

Record<
GuestPermission,
boolean
>
={


 browse:true,


 viewIdeas:true,


 viewPublicCircles:true,


 viewShop:true


};





export default function GuestGuard({

 children,

 permission

}:Props){



 const {
   user
 } =
 useAuth();



 const router =
 useRouter();



 /*
  Logged users bypass guest limits
 */
 if(user){

   return <>{children}</>;

 }





 if(
   !guestPermissions[permission]
 ){

   router.push("/login");

   return null;

 }





 return <>{children}</>;

}
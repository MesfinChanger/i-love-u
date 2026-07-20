"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase";
import { checkGuestAccess } from "@/lib/security/guestGuard";


export default function GuestAccessGuard({
  children,
  feature
}:{
  children: React.ReactNode;
  feature:
    | "messages"
    | "shopping"
    | "wallet"
    | "ads";
}){

  const router = useRouter();
  const auth = useAuth();


  useEffect(()=>{

    async function verify(){

      const user = auth?.currentUser;

      if(!user) return;


      const result =
        await checkGuestAccess(user.uid);


      if(
        result.allowed &&
        result.permissions?.[feature] === false
      ){

        router.replace(
          "/spark?guestLimit=true"
        );

      }

    }


    verify();


  },[auth,feature,router]);


  return <>{children}</>;

}
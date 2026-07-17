"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";


export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {


  const router = useRouter();

  const [checking, setChecking] =
    useState(true);



  useEffect(() => {


    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {


          if (!user) {

            router.replace("/login");

            return;

          }


          setChecking(false);


        }
      );



    return () => unsubscribe();


  }, [router]);




  if (checking) {

    return (

      <main className="min-h-screen flex items-center justify-center">

        <div className="text-xl">

          🔐 Verifying Heart Identity...

        </div>

      </main>

    );

  }



  return <>{children}</>;

}
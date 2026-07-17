"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";


export default function WelcomePage() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);


  async function handleGuestLogin() {

    try {

      setLoading(true);


      const result =
        await signInAnonymously(auth);


      console.log(
        "Guest Identity:",
        result.user.uid
      );


      router.push("/dashboard");


    } catch(error) {

      console.error(
        "Guest login error:",
        error
      );

    } finally {

      setLoading(false);

    }

  }



  return (

    <main className="
      min-h-screen
      flex
      flex-col
      items-center
      justify-center
      p-8
      text-center
    ">


      <h1 className="
        text-5xl
        font-bold
      ">

        ❤️ I LOVE U

      </h1>



      <p className="
        text-xl
        mt-4
      ">

        Prosperity Revolution

      </p>



      <h2 className="
        text-3xl
        mt-10
        font-semibold
      ">

        Identify Your Heart

      </h2>



      <p className="
        mt-4
        max-w-xl
        text-gray-600
      ">

        Every spark needs a signature.
        Join the community, connect with people,
        learn, create, and grow together.

      </p>




      <div className="
        mt-8
        flex
        flex-col
        sm:flex-row
        gap-4
      ">



        <Link
          href="/login"
          className="
            rounded-xl
            border
            px-6
            py-3
          "
        >

          🔐 Sign In

        </Link>




        <Link
          href="/signup"
          className="
            rounded-xl
            border
            px-6
            py-3
          "
        >

          ✨ Join

        </Link>





        <button

          onClick={handleGuestLogin}

          disabled={loading}

          className="
            rounded-xl
            border
            px-6
            py-3
          "

        >

          {loading
            ?
            "Launching..."
            :
            "❤️ Explore as Guest"
          }


        </button>



      </div>



    </main>

  );

}
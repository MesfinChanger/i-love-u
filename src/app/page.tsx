"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";

import {
  Heart,
  Sparkles,
  LogIn,
  UserPlus,
  Loader2,
  Globe,
  Lightbulb,
  Users
} from "lucide-react";

import { Button } from "@/components/ui/button";


export default function WelcomePage() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);



  const handleGuestLogin = async () => {

    try {

      setLoading(true);

      await signInAnonymously(auth);

      router.push("/dashboard");


    } catch(error){

      console.error(error);

    } finally {

      setLoading(false);

    }

  };



  return (

    <main
      className="
      min-h-screen
      relative
      overflow-hidden
      flex
      items-center
      justify-center
      px-6
      py-16
      bg-gradient-to-br
      from-white
      via-pink-50
      to-blue-50
      "
    >


      {/* Soft glowing circles */}

      <div
        className="
        absolute
        -top-40
        -left-40
        w-96
        h-96
        rounded-full
        bg-pink-200/40
        blur-3xl
        "
      />

      <div
        className="
        absolute
        -bottom-40
        -right-40
        w-96
        h-96
        rounded-full
        bg-blue-200/40
        blur-3xl
        "
      />



      {/* Main Content */}

      <div
        className="
        relative
        z-10
        max-w-4xl
        w-full
        text-center
        space-y-12
        "
      >



        {/* Logo */}

        <div
          className="
          flex
          flex-col
          items-center
          gap-5
          "
        >

          <div
            className="
            w-28
            h-28
            rounded-[2rem]
            bg-white
            shadow-xl
            flex
            items-center
            justify-center
            ring-8
            ring-pink-100
            "
          >

            <Heart
              className="
              w-14
              h-14
              text-pink-500
              fill-pink-500
              "
            />

          </div>



          <h1
            className="
            text-5xl
            md:text-7xl
            font-black
            tracking-tight
            "
          >
            ❤️ I LOVE U
          </h1>


          <p
            className="
            text-sm
            md:text-base
            font-bold
            tracking-[0.45em]
            text-pink-600
            "
          >
            PROSPERITY REVOLUTION
          </p>


        </div>





        {/* Message */}

        <div className="space-y-5">


          <h2
            className="
            text-3xl
            md:text-4xl
            font-black
            "
          >
            Identify Your Heart
          </h2>


          <p
            className="
            max-w-xl
            mx-auto
            text-muted-foreground
            text-lg
            "
          >
            Every spark needs a signature.
            Connect, share ideas, build circles,
            and grow together worldwide.
          </p>


        </div>





        {/* Buttons */}

        <div
          className="
          max-w-xl
          mx-auto
          space-y-4
          "
        >


          <div
            className="
            grid
            md:grid-cols-2
            gap-4
            "
          >


            <Button
              asChild
              className="
              h-16
              rounded-2xl
              font-black
              shadow-lg
              "
            >

              <Link href="/login">

                <LogIn className="mr-2"/>

                Sign In

              </Link>


            </Button>





            <Button
              asChild
              className="
              h-16
              rounded-2xl
              font-black
              bg-pink-500
              hover:bg-pink-600
              "
            >

              <Link href="/signup">

                <UserPlus className="mr-2"/>

                Join

              </Link>


            </Button>


          </div>





          <Button

            onClick={handleGuestLogin}

            disabled={loading}

            variant="outline"

            className="
            w-full
            h-16
            rounded-2xl
            font-black
            bg-white/70
            "

          >

          {
            loading
            ?
            <Loader2 className="animate-spin mr-2"/>
            :
            <Sparkles className="mr-2"/>
          }

          Explore as Guest


          </Button>


        </div>





        {/* Mission Cards */}

        <div
          className="
          grid
          md:grid-cols-4
          gap-4
          "
        >


          {[
            {
              icon:<Users/>,
              title:"Connect",
              text:"Build circles"
            },
            {
              icon:<Sparkles/>,
              title:"Spark",
              text:"Create ideas"
            },
            {
              icon:<Lightbulb/>,
              title:"Idea Pool",
              text:"Share wisdom"
            },
            {
              icon:<Globe/>,
              title:"Global",
              text:"Grow together"
            }

          ].map((item,index)=>(

            <div
              key={index}
              className="
              bg-white/70
              backdrop-blur
              rounded-3xl
              p-5
              shadow-sm
              "
            >

              <div className="text-pink-500 flex justify-center mb-3">
                {item.icon}
              </div>

              <h3 className="font-black">
                {item.title}
              </h3>

              <p className="text-xs text-muted-foreground">
                {item.text}
              </p>


            </div>


          ))}


        </div>



        <p
          className="
          text-sm
          text-muted-foreground
          "
        >
          Respect & Love is Mandatory ❤️
        </p>



      </div>


    </main>

  );

}
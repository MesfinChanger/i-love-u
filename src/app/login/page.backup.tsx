"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
  Heart,
  Loader2,
  AtSign,
  Lock,
  Sparkles,
  UserPlus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



export default function LoginPage() {


  const router = useRouter();


  const [email,setEmail] = useState("");

  const [password,setPassword] = useState("");

  const [loading,setLoading] = useState(false);

  const [checking,setChecking] = useState(true);

  const [error,setError] = useState("");




  /*
   * If already logged in,
   * go directly to dashboard.
   */

  useEffect(()=>{


    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user)=>{


          if(user){

            router.replace("/dashboard");

          }


          setChecking(false);


        }
      );


    return ()=>unsubscribe();


  },[router]);






  async function handleLogin(
    e: React.FormEvent
  ){

    e.preventDefault();


    setError("");



    if(!email || !password){

      setError(
        "Please enter email and password."
      );

      return;

    }




    try {


      setLoading(true);



      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );



      router.replace("/dashboard");



    }


    catch(error:any){


      console.error(error);



      if(
        error.code ===
        "auth/user-not-found"
      ){

        setError(
          "Account not found."
        );


      }
      else if(
        error.code ===
        "auth/wrong-password"
      ){

        setError(
          "Incorrect password."
        );


      }
      else if(
        error.code ===
        "auth/invalid-credential"
      ){

        setError(
          "Invalid email or password."
        );


      }
      else {


        setError(
          error.message
        );


      }


    }


    finally{

      setLoading(false);

    }


  }






  if(checking){


    return (

      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        "
      >

        <Loader2
          className="
          w-10
          h-10
          animate-spin
          text-primary
          "
        />

      </div>

    );

  }






  return (


    <main
      className="
      min-h-screen
      flex
      items-center
      justify-center
      p-6
      bg-gradient-to-br
      from-white
      via-pink-50
      to-blue-50
      "
    >


      <div
        className="
        w-full
        max-w-md
        "
      >



        <div
          className="
          text-center
          mb-8
          "
        >


          <div
            className="
            mx-auto
            w-20
            h-20
            rounded-3xl
            bg-white
            shadow-xl
            flex
            items-center
            justify-center
            "
          >

            <Heart
              className="
              w-10
              h-10
              text-primary
              fill-primary
              "
            />

          </div>



          <h1
            className="
            mt-5
            text-4xl
            font-black
            "
          >

            Identify Your Heart

          </h1>



          <p
            className="
            text-muted-foreground
            italic
            mt-2
            "
          >

            Secure access to I LOVE U

          </p>



        </div>





        <div
          className="
          bg-white
          rounded-[2.5rem]
          shadow-2xl
          p-8
          "
        >



          <form
            onSubmit={handleLogin}
            className="
            space-y-6
            "
          >



            <div
              className="
              relative
              "
            >

              <AtSign
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
                "
              />


              <Input

                type="email"

                placeholder="Email address"

                value={email}

                onChange={
                  e=>setEmail(e.target.value)
                }

                className="
                h-14
                pl-12
                rounded-2xl
                "

                required

              />


            </div>






            <div
              className="
              relative
              "
            >


              <Lock
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
                "
              />



              <Input


                type="password"


                placeholder="Password"


                value={password}


                onChange={
                  e=>setPassword(e.target.value)
                }


                className="
                h-14
                pl-12
                rounded-2xl
                "


                required


              />



            </div>







            {error && (

              <p
                className="
                text-sm
                text-red-500
                text-center
                font-bold
                "
              >

                {error}

              </p>

            )}






            <Button

              type="submit"

              disabled={loading}

              className="
              w-full
              h-14
              rounded-2xl
              font-black
              uppercase
              tracking-widest
              "

            >


              {
                loading
                ?
                <Loader2 className="animate-spin"/>
                :
                <>
                <Sparkles className="mr-2"/>
                Sign In
                </>
              }


            </Button>




          </form>





          <div
            className="
            mt-6
            text-center
            space-y-4
            "
          >


            <Link
              href="/forgot-password"
              className="
              text-sm
              text-primary
              font-bold
              "
            >

              Forgot Password?

            </Link>



            <br />



            <Link
              href="/signup"
              className="
              text-sm
              font-bold
              "
            >

              <UserPlus className="inline mr-2 w-4 h-4"/>

              Join The Mission

            </Link>



          </div>



        </div>



      </div>



    </main>


  );


}
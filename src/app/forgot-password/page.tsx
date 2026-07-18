"use client";

import { useState } from "react";
<Link href="/forgot-password">
  Forgot Password?
</Link>

import {
  sendPasswordResetEmail
} from "firebase/auth";

import {
  auth
} from "@/lib/firebase";


export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleReset(e: React.FormEvent) {

    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);


    try {

      await sendPasswordResetEmail(
        auth,
        email
      );


      setMessage(
        "Password reset link sent. Please check your email inbox and spam folder."
      );


    } catch (err:any) {

      console.error(err);


      if(err.code === "auth/user-not-found"){

        setError(
          "No account exists with this email."
        );

      }
      else if(err.code === "auth/invalid-email"){

        setError(
          "Please enter a valid email address."
        );

      }
      else {

        setError(
          err.message
        );

      }


    } finally {

      setLoading(false);

    }

  }


  return (

    <main className="
    min-h-screen
    flex
    items-center
    justify-center
    p-6
    ">


      <div className="
      max-w-md
      w-full
      border
      rounded-3xl
      p-8
      shadow
      ">


        <h1 className="
        text-3xl
        font-bold
        text-center
        ">

        🔐 Recover Identity

        </h1>


        <p className="
        mt-4
        text-center
        ">

        Enter your email to receive a password reset link.

        </p>



        <form
        onSubmit={handleReset}
        className="
        mt-8
        space-y-4
        ">


          <input

          type="email"

          placeholder="Email Address"

          value={email}

          onChange={
            e=>setEmail(e.target.value)
          }

          className="
          w-full
          border
          rounded-xl
          px-4
          py-3
          "

          required

          />



          <button

          disabled={loading}

          className="
          w-full
          rounded-xl
          bg-black
          text-white
          py-3
          "

          >

          {loading
          ? "Sending..."
          : "Send Reset Link"
          }

          </button>


        </form>



        {
          message && (

          <p className="
          mt-5
          text-green-600
          ">

          {message}

          </p>

          )
        }



        {
          error && (

          <p className="
          mt-5
          text-red-600
          ">

          {error}

          </p>

          )
        }



        <Link

        href="/login"

        className="
        block
        text-center
        mt-6
        underline
        "

        >

        Back to Sign In

        </Link>


      </div>


    </main>

  );

}
catch (error:any) {

  console.log("RESET ERROR CODE:", error.code);
  console.log("RESET ERROR MESSAGE:", error.message);

  setError(
    error.code + " : " + error.message
  );

}
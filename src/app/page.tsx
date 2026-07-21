"use client";

import AnimatedBackground from "@/components/home/AnimatedBackground";
import {
  Heart,
  Sparkles,
  Users,
  Lightbulb,
  Globe,
  LogIn,
  UserPlus
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
<main className="relative min-h-screen overflow-hidden">   

      <AnimatedBackground />

      <section className="
        relative z-10
        min-h-screen
        flex
        flex-col
        items-center
        justify-center
        px-6
        text-center
      ">

        {/* Logo */}
        <div className="
          w-24 h-24
          rounded-3xl
          bg-white/80
          backdrop-blur
          shadow-xl
          flex
          items-center
          justify-center
          mb-6
          animate-heartbeat
        ">
          <Heart className="
            w-14 h-14
            text-pink-500
            fill-pink-500
          "/>
        </div>


        {/* Title */}
        <h1 className="
          text-5xl
          md:text-7xl
          font-black
          bg-gradient-to-r
          from-pink-600
          via-rose-500
          to-blue-600
          bg-clip-text
          text-transparent
        ">
          ❤️ I LOVE U
        </h1>


        <p className="
          mt-3
          text-sm
          md:text-lg
          font-black
          tracking-[0.35em]
          uppercase
          text-pink-600
        ">
          The Prosperity Revolution
        </p>


        {/* Message */}
        <div className="
          mt-8
          max-w-2xl
          bg-white/70
          backdrop-blur-xl
          rounded-3xl
          shadow-xl
          p-8
          border
          border-white
        ">

          <h2 className="
            text-3xl
            font-black
            text-slate-900
          ">
            Identify Your Heart
          </h2>


          <p className="
            mt-4
            text-slate-600
            text-lg
            italic
          ">
            "Every spark needs a signature."
            <br/>
            Connect, share ideas, and build circles worldwide.
          </p>

        </div>


        {/* Buttons */}
        <div className="
          mt-8
          flex
          flex-col
          md:flex-row
          gap-4
        ">

          <Link
            href="/login"
            className="
              px-8
              py-4
              rounded-2xl
              bg-white
              text-slate-900
              font-black
              shadow-lg
              hover:scale-105
              transition
              flex
              items-center
              gap-2
            "
          >
            <LogIn/>
            Sign In
          </Link>


          <Link
            href="/signup"
            className="
              px-8
              py-4
              rounded-2xl
              bg-pink-500
              text-white
              font-black
              shadow-lg
              hover:scale-105
              transition
              flex
              items-center
              gap-2
            "
          >
            <UserPlus/>
            Join The Mission
          </Link>

        </div>


        {/* Mission cards */}
        <div className="
          mt-12
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
          max-w-4xl
        ">

          <Card icon={<Users/>} title="Connect"/>
          <Card icon={<Sparkles/>} title="Spark"/>
          <Card icon={<Lightbulb/>} title="Ideas"/>
          <Card icon={<Globe/>} title="Global"/>

        </div>


        <p className="
          mt-10
          text-slate-500
          font-bold
        ">
          Respect & Love is Mandatory ❤️
        </p>


      </section>

    </main>
  );
}


function Card({
  icon,
  title
}:{
  icon: React.ReactNode;
  title:string;
}){

  return (
    <div className="
      bg-white/70
      backdrop-blur-xl
      rounded-3xl
      p-5
      shadow-lg
      border
      border-white
    ">
      <div className="text-pink-500 flex justify-center mb-2">
        {icon}
      </div>

      <div className="
        font-black
        text-sm
        text-slate-800
      ">
        {title}
      </div>

    </div>
  );
}

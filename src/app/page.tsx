"use client";

import Link from "next/link";
import {
  Heart,
  Sparkles,
  LogIn,
  UserPlus,
  Globe,
  Lightbulb,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview High-Fidelity Welcome Gateway.
 * Orchestrates the initial heart identification protocol.
 * Synchronized with reduced spacing and optimized logo dimensions.
 */
export default function WelcomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden bg-gradient-to-br from-white via-pink-50 to-blue-50">
      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-[1.5rem] bg-white shadow-xl flex items-center justify-center ring-8 ring-pink-100">
            <Heart className="w-10 h-10 text-pink-500 fill-pink-500 animate-heartbeat" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black">❤️ I LOVE U</h1>
          <p className="text-[10px] font-bold tracking-[0.45em] text-pink-600 uppercase">PROSPERITY REVOLUTION</p>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Identify Your Heart</h2>
          <p className="max-w-xl mx-auto text-muted-foreground text-lg italic font-medium">
            "Every spark needs a signature." Connect, share ideas, and build circles worldwide.
          </p>
        </div>

        {/* Authentication Buttons */}
        <div className="max-w-xl mx-auto space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button asChild className="h-16 rounded-2xl font-black bg-white text-slate-900 border hover:bg-pink-50 shadow-lg">
              <Link href="/login">
                <LogIn className="mr-2 text-pink-500" />
                Sign In
              </Link>
            </Button>

            <Button asChild className="h-16 rounded-2xl font-black bg-pink-500 hover:bg-pink-600 text-white shadow-lg">
              <Link href="/signup">
                <UserPlus className="mr-2" />
                Join The Mission
              </Link>
            </Button>
          </div>

          <Button asChild variant="outline" className="w-full h-16 rounded-2xl font-black bg-white/80">
            <Link href="/login/guest">
              <Sparkles className="mr-2 text-primary" />
              Explore As Guest
            </Link>
          </Button>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MissionCard icon={<Users className="w-5 h-5"/>} title="Connect" text="Build circles" />
          <MissionCard icon={<Sparkles className="w-5 h-5"/>} title="Spark" text="Create ideas" />
          <MissionCard icon={<Lightbulb className="w-5 h-5"/>} title="Idea Pool" text="Share wisdom" />
          <MissionCard icon={<Globe className="w-5 h-5"/>} title="Global" text="Grow together" />
        </div>

        <p className="text-sm text-muted-foreground font-bold italic opacity-40">Respect & Love is Mandatory ❤️</p>
      </div>
    </main>
  );
}

function MissionCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl p-5 shadow-sm border border-white/20">
      <div className="flex justify-center text-pink-500 mb-3">{icon}</div>
      <h3 className="font-black uppercase text-xs tracking-widest">{title}</h3>
      <p className="text-[10px] text-muted-foreground font-medium italic">{text}</p>
    </div>
  );
}

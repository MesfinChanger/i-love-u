"use client";
export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <h1 className="text-6xl text-white font-black">
        HOME TEST WORKING
      </h1>
    </div>
  );
}
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
 * Refined with tighter spacing and optimized logo dimensions.
 */

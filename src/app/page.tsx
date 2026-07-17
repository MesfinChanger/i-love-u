"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/firebase";
import { useState } from "react";
import { Heart } from "lucide-react";

/**
 * @fileOverview Welcome Gateway.
 * The primary entry point for hearts entering the Prosperity Revolution.
 */
export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      const result = await signInAnonymously(auth!);
      console.log("Guest:", result.user.uid);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#fcfcfc]">
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Heart className="w-20 h-20 text-primary fill-primary animate-heartbeat" />
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">❤️ I LOVE U</h1>
          <p className="text-xl font-bold text-muted-foreground uppercase tracking-widest">Prosperity Revolution</p>
        </div>

        <div className="pt-10 space-y-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-800">Identify Your Heart</h2>
          <p className="max-w-md mx-auto text-muted-foreground font-medium italic">
            "Every spark needs a signature. Join the community, connect, and grow together."
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonLink href="/login" icon="🔐" label="Sign In" />
          <ButtonLink href="/signup" icon="✨" label="Join" />
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="h-16 px-8 rounded-2xl border-2 border-primary/20 bg-white hover:bg-primary/5 transition-all font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-sm"
          >
            {loading ? "Launching..." : "❤️ Explore as Guest"}
          </button>
        </div>
      </div>
    </main>
  );
}

function ButtonLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="h-16 px-10 rounded-2xl border-2 border-slate-100 bg-white hover:bg-slate-50 transition-all font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 active:scale-95 shadow-sm"
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}

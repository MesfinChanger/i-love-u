"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/auth";

/**
 * @fileOverview Identity Registration Hub.
 * Phase 2 — Real Signup Protocol.
 * Create a permanent heart signature to join the Prosperity Revolution.
 */
export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(email, password, name);
      // Redirect to a neutral verification message page or dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-3xl p-8 shadow">
        <h1 className="text-4xl font-bold text-center">❤️ I LOVE U</h1>
        <p className="text-center mt-3 text-muted-foreground font-medium italic">
          Identify Your Heart
        </p>

        <form onSubmit={handleSignup} className="space-y-4 mt-8">
          <input
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className="w-full rounded-xl bg-black text-white p-3 font-bold hover:bg-slate-800 transition-colors active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "✨ Join I LOVE U"}
          </button>
        </form>

        {error && <p className="text-red-600 mt-4 text-sm font-bold text-center">{error}</p>}

        <div className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?
          <br />
          <Link href="/login" className="underline font-bold text-slate-900">
            🔐 Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}

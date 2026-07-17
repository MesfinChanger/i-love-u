"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * @fileOverview Secure Recovery Protocol.
 * Dispatches reset links with high-fidelity debugging for identity restoration.
 */
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
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Password reset link sent. Please check your email inbox and spam folder. ❤️");
    } catch (error: any) {
      // RESET DEBUGGING PROTOCOL: Surface ripples to the console for analysis
      console.log("RESET ERROR CODE:", error.code);
      console.log("RESET ERROR MESSAGE:", error.message);

      setError(
        error.code + " : " + error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="max-w-md w-full border rounded-[2.5rem] p-8 shadow-2xl bg-white animate-in fade-in zoom-in-95 duration-500">
        <h1 className="text-3xl font-black tracking-tighter uppercase text-center">
          🔐 Recover Identity
        </h1>

        <p className="mt-4 text-center text-muted-foreground font-medium italic leading-relaxed">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handleReset} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-3 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Sending Protocol..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="mt-5 text-green-600 font-bold text-center text-sm italic">
            {message}
          </p>
        )}

        {error && (
          <div className="mt-5 p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-[10px] text-red-500 font-mono break-all leading-tight">
              {error}
            </p>
          </div>
        )}

        <Link
          href="/login"
          className="block text-center mt-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Back to Sign In
        </Link>
      </div>
    </main>
  );
}

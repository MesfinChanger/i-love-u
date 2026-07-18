"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * @fileOverview Secure Recovery Protocol (Forgot Password).
 * Dispatches a password reset link to a verified heart signature.
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
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent. Please check your email inbox and spam folder.");
    } catch (err: any) {
      console.error("Reset Error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No account exists with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="max-w-md w-full border rounded-[2.5rem] p-8 shadow-2xl bg-white space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase">🔐 Recover Identity</h1>
          <p className="text-sm text-muted-foreground italic">"Restore your connection to the Prosperity Revolution."</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1">
             <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Signature</label>
             <input
                type="email"
                placeholder="heart@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 font-bold"
                required
              />
          </div>

          <button
            disabled={loading}
            className="w-full h-14 rounded-xl gradient-bg text-white font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
          >
            {loading ? "Sending Protocol..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="text-xs text-green-600 font-bold text-center italic">{message}</p>}
        {error && <p className="text-xs text-red-600 font-bold text-center italic">{error}</p>}

        <div className="text-center pt-4 border-t border-dashed">
          <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}

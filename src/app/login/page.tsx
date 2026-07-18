"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { recordSuccessfulLogin, recordFailedLogin } from "@/lib/security/login-security";
import { Heart, Loader2, AtSign, Lock, Sparkles, UserPlus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * @fileOverview Identity Identification Protocol.
 * High-fidelity gateway for members to enter the Prosperity Revolution.
 */
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !user.isAnonymous) {
        router.replace("/dashboard");
      }
      setChecking(false);
    });
    return () => unsubscribe();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, cleanEmail, password);

      // Sovereign Signature Protocol: Elevate admin if email matches
      if (cleanEmail === "thearmyoj@gmail.com") {
        try {
          await updateDoc(doc(db, "users", result.user.uid), {
            role: "admin",
            accountType: "Admin",
            isAdmin: true,
            status: "active",
            updatedAt: serverTimestamp()
          });
        } catch (e) {
          console.warn("Sovereign Sync Ripple (Non-fatal):", e);
        }
      }

      await recordSuccessfulLogin(result.user.uid, cleanEmail);
      router.replace("/dashboard");
    } catch (err: any) {
      console.error("Identification Ripple:", err);
      await recordFailedLogin(cleanEmail);

      if (err.code === "auth/user-not-found") {
        setError("Account signature not found.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect phrase.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid identity credentials.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white via-pink-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center">
            <Heart className="w-10 h-10 text-primary fill-primary animate-heartbeat" />
          </div>
          <h1 className="text-4xl font-black mt-6 tracking-tighter uppercase">Identify Your Heart</h1>
          <p className="text-muted-foreground mt-2 italic font-medium">Secure access to I LOVE U</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border border-white">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="password"
                placeholder="Secure Phrase"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex gap-2 text-xs font-bold items-center border border-red-100">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              disabled={loading}
              className="w-full h-16 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all gradient-bg"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <Sparkles className="mr-2 w-4 h-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-dashed pt-6 flex flex-col gap-4">
            <Link href="/signup" className="text-primary font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              Join The Mission
            </Link>
            <Link href="/recovery" className="text-slate-300 font-bold uppercase text-[9px] tracking-widest hover:text-primary transition-colors">
              Forgot Phrase or Username?
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

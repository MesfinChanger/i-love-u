"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  Heart, 
  KeyRound, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent. Please check your email inbox and spam folder. ❤️");
    } catch (err: any) {
      // RESET DEBUGGING PROTOCOL: Surface ripples to the console for analysis
      console.log("RESET ERROR CODE:", err.code);
      console.log("RESET ERROR MESSAGE:", err.message);

      if (err.code === "auth/user-not-found") {
        setError("No account exists with this email signature. ✨");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address. ❤️");
      } else {
        setError(err.code + " : " + err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-primary/5">
            <KeyRound className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Recover Identity</h1>
          <p className="text-muted-foreground font-medium italic">"Restore your secure access path."</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-6 border-b flex items-center justify-center gap-2">
             <ShieldCheck className="w-4 h-4 text-primary" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Secure Access Protocol</p>
          </div>

          <CardContent className="p-10 space-y-8">
            {message ? (
              <div className="text-center space-y-6">
                <p className="text-sm text-green-600 font-bold italic leading-relaxed">{message}</p>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3 text-left">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-800 font-black uppercase tracking-tight">
                    Note: Remember to check your Spam folder.
                  </p>
                </div>
                <Button asChild className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20">
                  <Link href="/login">Return to Sign In</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">REGISTERED EMAIL</p>
                  <Input 
                    type="email" 
                    placeholder="heart@example.com"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="h-14 rounded-2xl bg-muted/30 border-none font-bold" 
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={loading} 
                  className="w-full h-18 rounded-[1.8rem] gradient-bg font-black uppercase text-xs shadow-xl active:scale-95 transition-all gap-3"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Dispatch Reset Link
                    </>
                  )}
                </Button>

                {error && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-[9px] text-red-500 font-mono break-all">{error}</p>
                  </div>
                )}
              </form>
            )}

            <div className="text-center">
              <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-3 h-3" /> Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

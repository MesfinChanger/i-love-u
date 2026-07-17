"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Loader2, Mail, Sparkles, ArrowLeft, ShieldCheck, AlertTriangle } from "lucide-react";

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

      if (error.code === "auth/user-not-found") {
        setError("No account exists with this email signature.");
      } else {
        setError(error.code + " : " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-primary/5">
            <ShieldCheck className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Recover Identity</h1>
          <p className="text-muted-foreground font-medium italic leading-relaxed">
            "Every heart has its way home eventually."
          </p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-6 border-b flex items-center justify-center gap-2">
             <Sparkles className="w-4 h-4 text-primary" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Security Protocol</p>
          </div>

          <CardContent className="p-10 space-y-8">
            {message ? (
               <div className="space-y-6 text-center animate-in fade-in duration-500">
                  <div className="p-6 bg-green-50 rounded-3xl border-2 border-dashed border-green-200 text-green-700 font-bold italic text-sm">
                     {message}
                  </div>
                  <Button asChild className="w-full h-14 rounded-2xl gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl">
                     <Link href="/login">Return to Identification</Link>
                  </Button>
               </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">REGISTERED EMAIL</p>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type="email" 
                      placeholder="heart@example.com"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold" 
                      required
                    />
                  </div>
                </div>

                <Button 
                  disabled={loading} 
                  className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl active:scale-95 transition-all gap-3"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Send Reset Link
                    </>
                  )}
                </Button>

                {error && (
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-500 font-mono break-all leading-tight">
                      {error}
                    </p>
                  </div>
                )}
              </form>
            )}
          </CardContent>
        </Card>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>
      </div>
    </main>
  );
}

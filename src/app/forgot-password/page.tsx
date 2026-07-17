"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Loader2, 
  KeyRound, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft,
  AlertTriangle,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * @fileOverview Identity Recovery Protocol (Password Reset).
 * Securely dispatches access restoration links to confirmed heart email signatures.
 * Includes high-fidelity debugging to identify reset ripples.
 */
export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast({ 
        variant: "destructive", 
        title: "Signature Required", 
        description: "Please enter your registered heart email. ❤️" 
      });
      return;
    }

    setMessage("");
    setError("");
    setLoading(true);

    try {
      // Identity Protocol: Dispatch reset request to Firebase Cloud
      await sendPasswordResetEmail(auth, cleanEmail);
      
      setMessage("Password reset link sent. Please check your email inbox and spam folder. ❤️");
      toast({ 
        title: "Email Dispatched ✨", 
        description: "Your recovery path is waiting in your inbox." 
      });
    } catch (error: any) {
      // RESET DEBUGGING PROTOCOL: Log ripples to the console for analysis
      console.log("RESET ERROR CODE:", error.code);
      console.log("RESET ERROR MESSAGE:", error.message);

      setError(error.code + " : " + error.message);
      
      let friendlyTitle = "Access Ripple";
      let friendlyDesc = "We encountered a ripple in the recovery protocol. ❤️";

      if (error.code === 'auth/user-not-found') {
        friendlyDesc = "No heart signature found with this email. ✨";
      } else if (error.code === 'auth/too-many-requests') {
        friendlyDesc = "Too many attempts. Please wait a heartbeat and try again. ⏳";
      }

      toast({ 
        variant: "destructive", 
        title: friendlyTitle, 
        description: friendlyDesc 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#fcfcfc] relative overflow-hidden">
      {/* Decorative Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-primary/5">
            <KeyRound className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Recover Identity</h1>
          <p className="text-muted-foreground font-medium italic">"Restore your secure access path."</p>
        </div>

        <Card className="border-none shadow-[0_30px_100px_-10px_rgba(0,0,0,0.08)] rounded-[3.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center justify-center gap-2">
             <ShieldCheck className="w-4 h-4 text-primary" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Secure Access Protocol</p>
          </div>

          <CardContent className="p-10 space-y-8">
            {message ? (
              <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto border-2 border-dashed border-green-200">
                   <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-green-600 font-bold italic leading-relaxed">
                    {message}
                  </p>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3 text-left">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-800 font-black uppercase tracking-tight">
                      Note: Remember to check your <span className="underline">Spam</span> folder and wait up to 60 seconds.
                    </p>
                  </div>
                </div>
                <Button asChild className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
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
                    onChange={(e) => setEmail(e.target.value)} 
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

                <div className="text-center pt-4">
                  <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
                    <ArrowLeft className="w-3 h-3" /> Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 opacity-20">
           <Clock className="w-3.5 h-3.5" />
           <p className="text-[8px] font-black uppercase tracking-[0.3em]">Identity Hub • © {currentYear}</p>
        </div>
      </div>
    </main>
  );
}

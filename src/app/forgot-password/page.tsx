"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Loader2, ArrowLeft, Mail, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

/**
 * @fileOverview Secure Recovery Protocol Page.
 * Implements high-fidelity password reset logic with mission-aligned diagnostics.
 */
export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function resetPassword() {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your registered email. ❤️",
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setIsSent(true);
      toast({
        title: "Email Dispatched",
        description: "Check your inbox for a secure recovery link. ❤️",
      });
    } catch (error: any) {
      console.error("Reset Error Ripple:", error);
      toast({
        variant: "destructive",
        title: "Access Ripple",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <Link href="/recovery" className="absolute top-12 left-10 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Recovery
      </Link>

      <div className="w-full max-w-md space-y-10 z-10">
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 fill-primary text-primary mx-auto animate-heartbeat" />
          <h1 className="text-4xl font-black tracking-tighter uppercase">Recovery</h1>
          <p className="text-muted-foreground font-medium italic">"Identify your heart to restore connection."</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[3.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-8 border-b flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Forgot Password</p>
          </div>

          <CardContent className="p-10 space-y-8">
            {isSent ? (
              <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-dashed border-green-200">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Check Your Heart</h2>
                  <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">
                    A secure reset link has been dispatched to <strong>{email}</strong>. ❤️
                  </p>
                </div>
                <Button asChild className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">REGISTERED EMAIL</p>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type="email" 
                      placeholder="Email address"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold" 
                    />
                  </div>
                </div>

                <Button 
                  onClick={resetPassword}
                  disabled={isLoading || !email} 
                  className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl active:scale-95 transition-all"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link ❤️"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

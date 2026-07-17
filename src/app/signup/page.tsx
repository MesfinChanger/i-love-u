"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, Sparkles, AtSign, Lock, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

/**
 * @fileOverview Identity Registration Hub.
 * Phase 2 — Real Signup Protocol.
 * Create a permanent heart signature to join the Prosperity Revolution.
 */
export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !auth || !db) return;

    setIsLoading(true);
    setError("");
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);

      // Create high-fidelity profile record
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: email.trim(),
        name: "New Heart",
        displayName: "New Heart",
        accountType: "free",
        role: "member",
        status: "active",
        policyAccepted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Identity Secured ✨",
        description: "Welcome to the Revolution. Your heart signature is now global.",
      });

      router.push("/policy/agree");
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      toast({
        variant: "destructive",
        title: "Access Ripple",
        description: e.message || "Could not launch identity protocol. ❤️",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-primary/5">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Join Mission</h1>
          <p className="text-muted-foreground font-medium italic">"Create your permanent heart signature."</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-6 border-b flex items-center justify-center gap-2">
             <UserPlus className="w-4 h-4 text-primary" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Registration Protocol</p>
          </div>

          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">Heart Signature</p>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">Secure Phrase</p>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create secure phrase"
                    className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-18 rounded-[1.8rem] gradient-bg font-black uppercase text-[11px] tracking-[0.2em] shadow-xl active:scale-95 transition-all gap-3"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    Launch Identity
                  </>
                )}
              </Button>

              {error && <p className="text-xs text-red-500 text-center font-bold">{error}</p>}
            </form>

            <div className="flex flex-col gap-4 text-center">
              <Link
                href="/login"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Already registered? <span className="text-primary underline">Identify Here</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="bg-slate-900 p-6 rounded-3xl space-y-3 shadow-xl relative overflow-hidden group">
           <div className="flex items-center gap-3 text-primary">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Privacy Guarantee</span>
           </div>
           <p className="text-[9px] text-white/70 font-bold leading-relaxed uppercase tracking-widest">
              Your identity is protected by industry-standard encryption. We never sell heart data. Respect is Mandatory. ❤️
           </p>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/auth";
import { Heart, Loader2, AtSign, User, Lock, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * @fileOverview Identity Registration Hub.
 * Orchestrates the creation of a permanent heart signature to join the mission.
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
      router.push("/verify-email");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
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
            <Heart className="w-10 h-10 text-primary fill-primary animate-heartbeat" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Join the Mission</h1>
          <p className="text-muted-foreground font-medium italic">"Every spark starts with a signature."</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-6 border-b flex items-center justify-center gap-2">
             <Sparkles className="w-4 h-4 text-primary" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Identity Protocol</p>
          </div>

          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">Heart Name</p>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Your Name" 
                    className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold" 
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">Email Signature</p>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
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
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Password" 
                    className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold" 
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-18 rounded-[1.8rem] gradient-bg font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    ✨ Join I LOVE U
                  </>
                )}
              </Button>

              {error && <p className="text-xs text-red-500 text-center font-bold italic">{error}</p>}
            </form>

            <div className="text-center pt-4 border-t border-dashed">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Already have a heart signature?
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 mt-3 text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:underline">
                🔐 Sign In <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

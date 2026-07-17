
"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, Sparkles, AtSign, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

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

      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: email.trim(),
        name: "New Heart",
        accountType: "Member",
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Identity Secured ✨",
        description: "Welcome to the Revolution. Your heart signature is now global.",
      });

      router.push("/identity");
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      toast({
        variant: "destructive",
        title: "Access Ripple",
        description: e.message || "Could not launch identity protocol.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-primary mx-auto animate-pulse" />
          <h1 className="text-4xl font-black tracking-tighter uppercase">✨ Join</h1>
          <p className="text-muted-foreground font-medium italic">Create your permanent identity.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleSignup} className="space-y-4">
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
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Password"
                  className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl active:scale-95 transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Identity ❤️"}
              </Button>
            </form>

            {error && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
                 <ShieldCheck className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                 <p className="text-[10px] text-red-600 font-bold uppercase leading-relaxed">{error}</p>
              </div>
            )}

            <Link
              href="/login"
              className="block text-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              Already have an account? Sign In
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

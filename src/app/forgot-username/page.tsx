"use client";

import { useState } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, User, ShieldCheck, ArrowLeft, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

/**
 * @fileOverview Forgot Username Page.
 * High-fidelity identity retrieval protocol using Firestore queries.
 */
export default function ForgotUsernamePage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foundUsernames, setFoundUsernames] = useState<string[] | null>(null);
  const { toast } = useToast();

  async function retrieveUsername() {
    if (!email.trim()) {
      toast({ variant: "destructive", title: "Email Required", description: "Please enter your registered heart signature. ❤️" });
      return;
    }

    setIsLoading(true);
    setFoundUsernames(null);

    try {
      const q = query(collection(db, "users"), where("email", "==", email.trim().toLowerCase()), limit(5));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({ title: "Retrieval Complete", description: "If an identity matches this email, a reminder has been dispatched. ✨" });
      } else {
        const usernames = querySnapshot.docs.map(doc => doc.data().username || doc.data().displayName || "Mystery Heart");
        setFoundUsernames(usernames);
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Access Ripple", description: "The registry is temporarily unavailable. ❤️" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24 items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 fill-primary text-primary mx-auto animate-heartbeat" />
          <h1 className="text-4xl font-black tracking-tighter uppercase">ID Retrieval</h1>
          <p className="text-muted-foreground font-medium italic">"Identify your heart signature to restore connection."</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-6 border-b flex items-center justify-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Identity Protocol</p>
          </div>

          <CardContent className="p-10 space-y-8">
            {foundUsernames ? (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto border-2 border-dashed border-green-200">
                   <ShieldCheck className="w-8 h-8 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tight">Identity Found</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {foundUsernames.map((u, i) => (
                      <div key={i} className="px-4 py-2 bg-muted rounded-xl font-bold text-primary">
                        {u}
                      </div>
                    ))}
                  </div>
                </div>
                <Button asChild className="w-full h-14 rounded-xl gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl">
                  <Link href="/login">Identify with Phrase</Link>
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
                      placeholder="heart@example.com"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold" 
                    />
                  </div>
                </div>

                <Button 
                  onClick={retrieveUsername}
                  disabled={isLoading} 
                  className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl active:scale-95 transition-all gap-3"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Retrieve Signature
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Link href="/recovery" className="flex items-center justify-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Recovery Hub
        </Link>
      </div>
    </div>
  );
}

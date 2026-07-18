"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowRight, Heart, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview Email Verification Protocol.
 * Awaiting high-fidelity synchronization of the user's heart signature.
 */
export default function VerifyEmailPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center">
       <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24 items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-primary/5">
            <Mail className="w-10 h-10 text-primary animate-bounce" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Verify Heart</h1>
          <p className="text-muted-foreground font-medium italic">"A confirmation signature has been dispatched."</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-6 border-b flex items-center justify-center gap-2">
             <Sparkles className="w-4 h-4 text-primary" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Synchronization Pending</p>
          </div>

          <CardContent className="p-10 text-center space-y-8">
            <div className="space-y-4">
               <p className="text-lg text-slate-600 leading-relaxed font-medium italic">
                 We've sent a verification link to your email. Please check your inbox (and spam folder) to finalize your signature.
               </p>
            </div>

            <Button 
              onClick={() => router.push("/login")}
              className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl active:scale-95 transition-all gap-3"
            >
              Continue to Login
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="text-center opacity-40">
          <Heart className="w-6 h-6 text-primary mx-auto animate-heartbeat" />
          <p className="mt-2 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
            Respect & Love is Mandatory ❤️ Prosperity Revolution
          </p>
        </div>
      </div>
    </div>
  );
}

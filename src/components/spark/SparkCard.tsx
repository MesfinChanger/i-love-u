'use client';

import Card from "@/components/ui/Card";
import { sendSparkGreeting } from "@/services/spark/greeting.service";
import { useAuth, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Sparkles, Heart } from "lucide-react";

/**
 * @fileOverview Spark Card Component.
 * High-fidelity visual container for heart profiles in the discovery pool.
 * Enhanced with Greeting Protocol and mission-aligned feedback.
 */
export default function SparkCard({
  id,
  name,
  country
}: {
  id: string;
  name: string;
  country: string;
}) {
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const handleSendGreeting = async () => {
    if (!auth?.currentUser || !db || isSending) return;

    setIsSending(true);
    try {
      sendSparkGreeting(db, {
        fromUserId: auth.currentUser.uid,
        toUserId: id,
        message: "Hello ❤️ I would like to connect."
      });
      
      toast({
        title: "Greeting Sent",
        description: "Your respectful spark has been dispatched! ✨"
      });
    } catch (e) {
      // Errors handled centrally by service emitter
    } finally {
      // Snappy UI feedback: reset sending state after initiation
      setTimeout(() => setIsSending(false), 1000);
    }
  };

  return (
    <Card className="hover:scale-[1.02] transition-transform group border-primary/5 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
         <Heart className="w-16 h-16 text-primary fill-primary" />
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-none">
            ❤️ {name}
          </h2>
          <p className="mt-2 text-sm font-medium text-muted-foreground italic">
            🌍 {country}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 border border-primary/10 bg-primary/5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
            <Sparkles className="w-3 h-3" />
            Shared Values
          </span>
        </div>

        <Button
          onClick={handleSendGreeting}
          disabled={isSending}
          className="mt-2 w-full bg-white hover:bg-primary hover:text-white border-2 border-primary/10 hover:border-primary rounded-xl h-14 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-sm hover:shadow-primary/20 gap-2 flex items-center justify-center"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <>👋 Send Greeting</>
          )}
        </Button>
      </div>
    </Card>
  );
}

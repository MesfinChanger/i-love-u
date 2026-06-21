
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShieldCheck, Scale, AlertTriangle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function PolicyAgreePage() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isAgreeing, setIsAgreeing] = useState(false);

  const handleAgree = async () => {
    if (!user || !db || isAgreeing) return;

    setIsAgreeing(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        policyAccepted: true,
        policyAcceptedAt: serverTimestamp()
      });
      toast({
        title: "Agreement Recorded",
        description: "Welcome to the full Revolution experience! ❤️"
      });
      router.push('/discover');
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not record agreement." });
    } finally {
      setIsAgreeing(false);
    }
  };

  const handleViewOnly = () => {
    toast({
      title: "View Only Mode",
      description: "You can explore, but interaction is disabled until you agree. ✨"
    });
    router.push('/discover');
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-primary/5">
            <Heart className="w-10 h-10 text-primary fill-primary animate-heartbeat" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.9]">
            The Sacred <br/><span className="gradient-text">Agreement.</span>
          </h1>
          <p className="text-muted-foreground font-medium italic">
            "Happiness and prosperity require a foundation of mutual honor."
          </p>
        </div>

        <Card className="rounded-[3rem] border-none shadow-[0_40px_100px_-10px_rgba(0,0,0,0.1)] overflow-hidden bg-white">
          <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-black text-xl uppercase tracking-tighter leading-none">Mandatory Policy</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mt-1">Version 1.2.0 • Global</p>
              </div>
            </div>
            <Scale className="w-6 h-6 text-white/20" />
          </div>

          <CardContent className="p-10 space-y-8">
            <section className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                   <span className="font-black text-primary">01</span>
                </div>
                <div>
                   <h4 className="font-black text-sm uppercase tracking-tight mb-1">Respect is Mandatory</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     Any sign of meanness, bullying, or aggression is forbidden. We are here to bridge cultures with love.
                   </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-secondary/5 flex items-center justify-center shrink-0 border border-secondary/10">
                   <span className="font-black text-secondary">02</span>
                </div>
                <div>
                   <h4 className="font-black text-sm uppercase tracking-tight mb-1">100% Free Community</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     Financial solicitation, sugar dating, or commercial services in private chats are strictly prohibited.
                   </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                   <span className="font-black text-blue-600">03</span>
                </div>
                <div>
                   <h4 className="font-black text-sm uppercase tracking-tight mb-1">Legal Liability</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     You acknowledge that the developers and platform owners are NOT liable for damages or financial losses arising from interactions.
                   </p>
                </div>
              </div>
            </section>

            <div className="p-6 bg-amber-50 border border-amber-200 rounded-[2rem] flex items-start gap-4">
               <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 shrink-0" />
               <p className="text-xs text-amber-800 font-bold leading-relaxed uppercase">
                 "View Only Mode" will be active if you do not agree. You will be unable to Spark, Message, or Post until agreement is recorded.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                onClick={handleViewOnly}
                className="h-16 rounded-2xl flex-1 border-2 font-black uppercase text-[10px] tracking-widest text-slate-400"
              >
                View Only Mode
              </Button>
              <Button 
                onClick={handleAgree}
                disabled={isAgreeing}
                className="h-16 rounded-2xl flex-1 gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 gap-3"
              >
                {isAgreeing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                I Agree & Commit
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-[9px] text-center text-slate-400 uppercase font-black tracking-[0.4em]">
          Eliminating World Poverty Together ❤️
        </p>
      </div>
    </div>
  );
}

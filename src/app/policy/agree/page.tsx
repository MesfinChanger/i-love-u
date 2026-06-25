
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShieldCheck, Scale, AlertTriangle, ArrowRight, Loader2, Sparkles, ScrollText, Gavel, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { cn } from '@/lib/utils';

export default function PolicyAgreePage() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isAgreeing, setIsAgreeing] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  
  const { data: profile } = useDoc(userRef);

  // Protocol Synchronization: If cloud profile already has acceptance, 
  // immediately update local state and proceed to discovery.
  useEffect(() => {
    if (profile?.policyAccepted) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('iloveu_policy_accepted', 'true');
      }
      router.push('/discover');
    }
  }, [profile?.policyAccepted, router]);

  const handleAgree = async () => {
    if (!user || !db || isAgreeing) return;

    setIsAgreeing(true);
    try {
      // Immediate Local Persistence (Snappy UI Feedback)
      if (typeof window !== 'undefined') {
        localStorage.setItem('iloveu_policy_accepted', 'true');
      }

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
                <h3 className="font-black text-xl uppercase tracking-tighter leading-none">Universal Protocol</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mt-1">Version 2.0.0 • Mandatory Fulfillment</p>
              </div>
            </div>
            <Gavel className="w-6 h-6 text-white/20" />
          </div>

          <CardContent className="p-0">
            <div className="p-8 sm:p-10 space-y-8 max-h-[50vh] overflow-y-auto no-scrollbar">
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Heart className="w-5 h-5 fill-current" />
                    <h4 className="font-black text-sm uppercase tracking-widest">01. Mandatory Respect & Love</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    In this community, treating every heart with pure honor is not a suggestion—it is <span className="font-bold text-slate-900 uppercase underline">Mandatory</span>. We have Zero Tolerance for meanness, bullying, aggression, harassment, or toxic energy.
                  </p>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 space-y-4 relative group">
                  <div className="flex items-center gap-3 text-slate-900">
                    <Scale className="w-6 h-6" />
                    <h4 className="font-black text-base uppercase tracking-tighter">Legal Disclaimer & Liability Waiver</h4>
                  </div>
                  <div className="space-y-4 text-[13px] text-slate-500 font-bold uppercase leading-relaxed italic">
                    <p>
                      By clicking "I Agree," you solemnly acknowledge that the owners, developers, and partners of this platform are <span className="text-primary">NOT LIABLE</span> for any damages.
                    </p>
                    <p>
                      You assume <span className="text-slate-900 underline">100% Total Responsibility</span> for your own safety.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 border-t bg-slate-50/50 space-y-6">
              <div className="flex items-start gap-4 p-4 mt-8 bg-amber-50 rounded-2xl border border-amber-100">
                 <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                 <p className="text-[10px] text-amber-800 font-black uppercase leading-tight tracking-tight">
                   "View Only Mode" will disable all Sparking and Messaging until your agreement is recorded.
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
                  className="h-16 rounded-2xl flex-1 gradient-bg font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-primary/20 gap-3 group"
                >
                  {isAgreeing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
                  I COMMIT
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-[9px] text-center text-slate-400 uppercase font-black tracking-[0.4em]">
          Eliminating World Poverty Together ❤️ Reaching Every Village
        </p>
      </div>
    </div>
  );
}

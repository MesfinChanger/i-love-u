
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, Heart, Globe, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24 items-center justify-center p-6">
      <div className="w-full max-w-lg animate-in zoom-in-95 duration-700">
        <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white text-center p-12 space-y-8">
           <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
              <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl ring-8 ring-white">
                <CheckCircle2 className="w-12 h-12" />
              </div>
           </div>

           <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Mission Funded</h1>
              <p className="text-muted-foreground font-medium italic">
                "One spark lights up an entire village." Your contribution has been secured in the cloud.
              </p>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2.5rem] space-y-4 shadow-xl border border-primary/20">
              <div className="flex items-center gap-3 text-primary justify-center">
                 <Sparkles className="w-6 h-6" />
                 <h4 className="font-black text-xs uppercase tracking-widest text-white">Impact Protocol</h4>
              </div>
              <p className="text-[10px] text-white/70 font-bold leading-relaxed uppercase tracking-widest">
                Verification: {sessionId?.slice(0, 20)}... <br />
                Status: Recorded in Prosperity Fund
              </p>
           </div>

           <div className="flex flex-col gap-4">
              <Button asChild className="h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 group">
                <Link href="/discover">
                  Back to Discovery
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="ghost" asChild className="h-12 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
                <Link href="/profile">View Transaction History</Link>
              </Button>
           </div>
        </Card>
        
        <div className="mt-12 flex flex-col items-center gap-4 text-center opacity-30">
           <div className="flex items-center gap-4">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <Globe className="w-5 h-5 text-blue-500" />
              <Heart className="w-5 h-5 text-primary fill-primary" />
           </div>
           <p className="text-[9px] font-black uppercase tracking-[0.5em]">Eliminating World Poverty Together</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Header />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}>
        <SuccessContent />
      </Suspense>
      <BottomNav />
    </div>
  );
}

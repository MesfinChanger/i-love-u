
'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Heart, Globe, ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

/**
 * @fileOverview Payment Cancellation Landing Page.
 * Respectfully guides the user back to the mission if a payment ripple occurs.
 */

export default function PaymentCancelledPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white text-center p-12 space-y-8">
             <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-sm border border-red-100">
                <ShieldAlert className="w-12 h-12 text-red-500" />
             </div>

             <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-slate-900">Payment Ripple</h1>
                <p className="text-muted-foreground font-medium italic">
                  "The bridge encountered a momentary pause." No contribution was recorded at this time.
                </p>
             </div>

             <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <p className="text-[10px] text-slate-400 font-black uppercase leading-relaxed tracking-widest">
                  If you intended to fund the mission, please try again or contact mission support for assistance. ❤️
                </p>
             </div>

             <div className="flex flex-col gap-4">
                <Button asChild className="h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs shadow-xl group">
                  <Link href="/donate">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Retry Support
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-16 rounded-2xl border-2 font-black uppercase tracking-widest text-xs">
                  <Link href="/discover">Return to Hearts</Link>
                </Button>
             </div>
          </Card>
          
          <div className="mt-12 text-center opacity-20">
             <p className="text-[8px] font-black uppercase tracking-[0.6em]">Happiness is Mandatory ❤️ Prosperity Revolution</p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}


'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft, ShieldAlert, AlertTriangle, Heart, Scale } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><Link href="/profile"><ArrowLeft className="w-5 h-5" /></Link></Button>
          <h1 className="text-xl font-bold">Terms of Service</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-10 prose prose-sm max-w-2xl">
        <h2 className="text-2xl font-black mb-6 uppercase">Legal Agreement</h2>
        
        <section className="space-y-8">
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-[1.5rem]">
            <h3 className="font-bold text-primary text-lg">MANDATORY: RESPECT & LOVE</h3>
            <p className="text-sm text-primary/80 font-bold uppercase">
              IN THIS COMMUNITY, RESPECTING AND LOVING EACH OTHER IS MANDATORY. ANY FORM OF DISRESPECT OR UNLOVING BEHAVIOR IS A DIRECT VIOLATION OF THESE TERMS.
            </p>
          </div>

          <div className="p-6 bg-amber-50 border border-amber-200 rounded-[1.5rem]">
            <h3 className="font-bold text-amber-800 text-lg uppercase">Critical Limitation of Liability</h3>
            <p className="text-[11px] text-amber-700 font-black uppercase">
              THE DEVELOPERS, OWNERS, AND PLATFORM ARE NOT LIABLE FOR ANY DAMAGES, HARMFUL INTERACTIONS, OR FINANCIAL LOSSES ARISING FROM THE USE OF THIS APP. USERS ASSUME ALL RISK.
            </p>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-[1.5rem]">
            <h3 className="font-bold text-lg text-primary uppercase">Advertiser Liability</h3>
            <p className="text-[11px] font-bold uppercase">
              ADVERTISERS ARE SOLELY RESPONSIBLE FOR THE CONTENT, LEGALITY, AND CONSEQUENCES OF THEIR ADS. THE PLATFORM IS NOT LIABLE FOR ANY CLAIMS ARISING FROM ADVERTISEMENTS.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">1. Eligibility</h3>
            <p>You must be 18+ to use Spark. Zero tolerance for financial solicitation or transactional dating.</p>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

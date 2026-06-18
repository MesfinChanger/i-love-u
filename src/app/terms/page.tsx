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
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold">Terms of Service</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-10 prose prose-sm max-w-2xl">
        <h2 className="text-2xl font-black mb-6 tracking-tighter uppercase">Legal Agreement</h2>
        <p className="text-muted-foreground mb-4 italic">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-8">
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-[1.5rem] space-y-4">
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 text-primary shrink-0 mt-1 fill-primary" />
              <div>
                <h3 className="font-bold text-primary text-lg">MANDATORY: RESPECT & LOVE</h3>
                <p className="text-sm text-primary/80 leading-relaxed font-bold">
                  IN THIS COMMUNITY, RESPECTING EACH OTHER AND LOVING EACH OTHER IS MANDATORY. THIS IS NOT AN OPTION; IT IS THE FOUNDATION OF SPARK. ANY FORM OF DISRESPECT, HATE, OR UNLOVING BEHAVIOR IS A DIRECT VIOLATION OF THESE TERMS.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-amber-50 border border-amber-200 rounded-[1.5rem] space-y-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-amber-800 text-lg uppercase tracking-tighter">Critical Limitation of Liability</h3>
                <p className="text-[11px] text-amber-700 leading-relaxed font-black uppercase">
                  THE DEVELOPERS, OWNERS, AND OPERATORS OF SPARK (COLLECTIVELY "THE PLATFORM") ARE NOT LIABLE BY ANY MEANS FOR ANY DAMAGES, HARMFUL INTERACTIONS, FINANCIAL LOSSES, OR ANY "UNNECESSARY THINGS" ARISING FROM THE USE OF THIS APP. BY USING SPARK, YOU AGREE THAT YOU DO SO AT YOUR OWN RISK. THE PLATFORM IS NOT LIABLE FOR THE CONDUCT OF USERS, ADVERTISERS, OR SELLERS.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-[1.5rem] space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <Scale className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-primary uppercase tracking-tighter">7. Specific Advertiser Liability</h3>
                <p className="text-[11px] leading-relaxed font-bold uppercase opacity-90">
                  IF YOU USE THE ADVERTISING TOOLS, YOU AGREE THAT THE ADVERTISER IS SOLELY RESPONSIBLE FOR THE CONTENT, LEGALITY, AND CONSEQUENCES OF THE ADVERTISEMENT. THE OWNER, THE DEVELOPER, THE WEB PLATFORM, AND THE MOBILE APP ARE NOT LIABLE FOR ANY CLAIMS, DAMAGES, OR ILLEGALITIES ARISING FROM AN ADVERTISEMENT. THE ADVERTISER INDEMNIFIES THE PLATFORM AGAINST ALL LOSSES.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">1. Age Requirement & Eligibility</h3>
            <p>You must be at least 18 years old to use Spark. By creating an account, you represent and warrant that you are at least 18 years of age and that you have never been convicted of a felony or any crime involving violence or sexual misconduct.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">2. User Conduct & AI Moderation</h3>
            <p>Users must be respectful. Harassment, insults, and spam are not tolerated. AI moderation is active to enforce these standards. We reserve the right to terminate accounts that violate our community guidelines without notice.</p>
          </div>

          <div className="p-6 bg-red-50 border border-red-200 rounded-[1.5rem] space-y-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-800 text-lg">3. Zero-Tolerance Policy</h3>
                <p className="text-sm text-red-700 leading-relaxed">
                  Spark is a <strong>100% free community</strong>. Asking for money, gifts, or any form of financial compensation for sexual activities, "sugar dating," or commercial services is <strong>strictly prohibited</strong>. 
                  <br /><br />
                  Any user found soliciting financial transactions, engaging in transactional dating, or prostitution will be <strong>permanently banned immediately</strong>.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2 text-primary uppercase tracking-widest text-xs font-black">4. General Disclaimer</h3>
            <p className="font-medium bg-muted/30 p-4 rounded-xl border border-dashed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SPARK, ITS OWNERS, AND ITS DEVELOPERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">6. Free Service & Donations</h3>
            <p>Spark is 100% free. We do not charge for matching or messaging. Donations and shop purchases are voluntary and do not grant special privileges beyond the designated badges.</p>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft, Heart, Scale, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-black font-headline uppercase tracking-tighter">Legal Control</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-10 max-w-3xl">
        <div className="mb-12 space-y-4">
           <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-sm">
              <Scale className="w-8 h-8" />
           </div>
           <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">
             I LOVE U – <br/><span className="gradient-text">TERMS OF SERVICE</span>
           </h2>
           <p className="text-muted-foreground font-medium italic">
             Last Updated: {lastUpdated}
           </p>
        </div>
        
        <section className="space-y-10 text-slate-700">
          <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] space-y-4 shadow-xl border border-primary/20">
             <div className="flex items-center gap-3 text-primary">
                <ShieldCheck className="w-6 h-6" />
                <h3 className="font-black text-xs uppercase tracking-[0.3em]">Mandatory Protocol</h3>
             </div>
             <p className="text-xs font-bold text-white/80 uppercase leading-relaxed tracking-widest italic">
               By accessing the I Love U platform, you agree to be legally bound by these Terms. If you do not agree, you must discontinue use immediately.
             </p>
          </div>

          <div className="grid gap-12">
            <LegalPoint number="1" title="Acceptance of Terms">
              By using the Platform, you agree to these Terms, Privacy Policy, Community Standards, and all applicable laws.
            </LegalPoint>

            <LegalPoint number="2" title="Eligibility">
              You warrant that you are at least 18 years old and possess legal capacity.
            </LegalPoint>

            <LegalPoint number="3" title="User Conduct">
              Users must not harass, stalk, or abuse others. Respect and Love is Mandatory.
            </LegalPoint>

            <LegalPoint number="4" title="User Generated Content">
              Users retain ownership but grant the Platform a license to host and operate content.
            </LegalPoint>

            <LegalPoint number="5" title="Community Guidelines">
              Meanness or toxic energy is purged. Content promoting violence or abuse is forbidden.
            </LegalPoint>

            <LegalPoint number="6" title="Communications">
              While E2EE is implemented, use at your own discretion. No system is 100% secure.
            </LegalPoint>

            <LegalPoint number="7" title="Relationships">
              The Platform does not guarantee identity, safety, or relationship outcomes.
            </LegalPoint>

            <LegalPoint number="8" title="Payments">
              Transactions are processed through third parties. We are not responsible for banking failures.
            </LegalPoint>

            <LegalPoint number="9" title="Intellectual Property">
              All branding and software are protected properties of the Prosperity Revolution.
            </LegalPoint>

            <LegalPoint number="10" title="Limitation of Liability">
              To the maximum extent permitted by law, the Platform shall not be liable for indirect, incidental, or consequential damages.
            </LegalPoint>

            <LegalPoint number="11" title="Indemnification">
              You agree to defend and hold harmless the Platform from claims arising from your conduct.
            </LegalPoint>

            <LegalPoint number="12" title="Suspension">
              Accounts may be terminated for violations or security concerns without notice.
            </LegalPoint>

            <LegalPoint number="13" title="Privacy">
              Processing of information is governed by our Privacy Policy.
            </LegalPoint>

            <LegalPoint number="14" title="Governing Law">
              These terms are governed by the laws of our primary jurisdiction.
            </LegalPoint>

            <LegalPoint number="15" title="Changes">
              The Platform may modify these terms at any time. Continued use constitutes acceptance.
            </LegalPoint>

            <LegalPoint number="16" title="Contact">
              Inquiries regarding these terms should be sent through official support channels.
            </LegalPoint>
          </div>
        </section>

        <div className="mt-20 pt-10 border-t border-dashed flex flex-col items-center gap-4 text-center opacity-40">
           <Heart className="w-8 h-8 text-primary" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em]">
             Eliminating World Poverty Together ❤️ Reaching Every Heart
           </p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

function LegalPoint({ number, title, children }: { number: string, title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
        <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs shrink-0">{number}</span>
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-600 font-medium pl-14">
        {children}
      </p>
    </div>
  );
}

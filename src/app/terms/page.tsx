'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft, ShieldAlert, Heart, Scale, ShieldCheck, Gavel, FileText, Lock, Users, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * @fileOverview The I Love U Platform Official Terms of Service & Legal Disclaimer.
 * Comprehensive 16-point framework for community safety and liability management.
 */
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
             I LOVE U – <br/><span className="gradient-text">TERMS OF SERVICE & LEGAL DISCLAIMER</span>
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
               By accessing, downloading, registering for, or using the I Love U platform ("Platform"), you agree to be legally bound by these Terms. If you do not agree, you must discontinue use immediately.
             </p>
          </div>

          <div className="grid gap-12">
            <LegalPoint number="1" title="Acceptance of Terms">
              By using the Platform, you agree to these Terms, Privacy Policy, Community Standards, and all applicable laws.
            </LegalPoint>

            <LegalPoint number="2" title="Eligibility">
              You warrant that you are at least 18 years old, possess legal capacity, and will provide accurate information. The Platform may terminate accounts that violate eligibility.
            </LegalPoint>

            <LegalPoint number="3" title="User Conduct">
              Users must not harass, stalk, or abuse others; publish harmful/fraudulent content; infringe on intellectual property; or circumvent security protections.
            </LegalPoint>

            <LegalPoint number="4" title="User Generated Content">
              Users retain ownership but grant the Platform a worldwide license to host and operate such content for service improvement.
            </LegalPoint>

            <LegalPoint number="5" title="Community Guidelines">
              Respect is mandatory. Content promoting violence, hate speech, or abuse may be removed without notice.
            </LegalPoint>

            <LegalPoint number="6" title="Messaging and Communications">
              While security measures like E2EE may be implemented, no system can guarantee absolute security. Use at your own discretion.
            </LegalPoint>

            <LegalPoint number="7" title="Relationships and Personal Interactions">
              The Platform does not conduct background investigations or guarantee safety, identity, or relationship outcomes. Meeting others is at your own risk.
            </LegalPoint>

            <LegalPoint number="8" title="Marketplace, Donations, and Payments">
              Transactions are processed through third parties. The Platform is not responsible for banking failures, tax obligations, or third-party merchant conduct.
            </LegalPoint>

            <LegalPoint number="9" title="Intellectual Property">
              All branding, logos, and software are protected. No rights are granted except those expressly provided.
            </LegalPoint>

            <div className="bg-red-50 p-8 rounded-[2.5rem] border-2 border-dashed border-red-200 space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xl font-black uppercase tracking-tight">10. Limitation of Liability</h3>
              </div>
              <div className="text-[11px] text-red-900/70 font-black uppercase leading-relaxed tracking-widest italic space-y-4">
                <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE PLATFORM IS PROVIDED "AS IS".</p>
                <p>THE PLATFORM SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, LOSS OF PROFITS, LOSS OF DATA, OR PERSONAL INJURY.</p>
              </div>
            </div>

            <LegalPoint number="11" title="Indemnification">
              You agree to defend and hold harmless the Platform and its owners from claims arising from your use, content, or conduct.
            </LegalPoint>

            <LegalPoint number="12" title="Account Suspension and Termination">
              The Platform may terminate any account at any time for violations, fraud, or security concerns without prior notice.
            </LegalPoint>

            <LegalPoint number="13" title="Privacy">
              Collection and processing of information are governed by the Privacy Policy. Use constitutes consent.
            </LegalPoint>

            <LegalPoint number="14" title="Governing Law">
              These Terms shall be governed by the laws of the jurisdiction in which the Platform operator is established.
            </LegalPoint>

            <LegalPoint number="15" title="Changes to Terms">
              The Platform may modify these Terms at any time. Continued use constitutes acceptance.
            </LegalPoint>

            <LegalPoint number="16" title="Contact">
              Questions regarding these Terms may be submitted through official support channels.
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

'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft, ShieldAlert, Heart, Scale, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * @fileOverview The platform's Legal Agreement.
 * Features a comprehensive 8-point protocol for eligibility, respect, and liability.
 */
export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-headline uppercase tracking-tighter">Terms of Service</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-10 max-w-3xl">
        <div className="mb-12 space-y-4">
           <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-sm">
              <Scale className="w-8 h-8" />
           </div>
           <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">
             Community <br/><span className="gradient-text">Agreement.</span>
           </h2>
           <p className="text-muted-foreground font-medium italic">
             "Prosperity requires a foundation of mutual honor and legal clarity."
           </p>
        </div>
        
        <section className="space-y-12 text-slate-700">
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-2">
             <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-black text-xs uppercase tracking-widest">Protocol Priority</h3>
             </div>
             <p className="text-sm font-bold text-primary/80 uppercase leading-relaxed">
               By using I Love U, you agree to these mandatory protocols designed to protect our global community.
             </p>
          </div>

          <div className="grid gap-10">
            <div className="space-y-3">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs">1</span>
                Eligibility
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 font-medium pl-11">
                You must be at least 18 years old to use this platform. By creating an account, you confirm that the information you provide is accurate and truthful.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs">2</span>
                Respect Is Mandatory
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 font-medium pl-11">
                Harassment, hate speech, discrimination, threats, scams, impersonation, fraud, and abusive conduct are strictly prohibited. Kindness is a fundamental requirement of participation.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs">3</span>
                User Content
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 font-medium pl-11">
                You retain ownership of content you upload. You grant the platform permission to display, store, and process content for operation, moderation, security, and legal compliance.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs">4</span>
                Messaging & Privacy
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 font-medium pl-11">
                The platform may offer secure messaging tools including End-to-End Encryption (E2EE). No internet service can guarantee absolute security. Users should avoid sharing sensitive personal information or financial data.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs">5</span>
                Community Safety
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 font-medium pl-11">
                Content involving illegal activity, violence, exploitation, harassment, fraud, or abuse may be removed and reported where required by law. AI moderation is active to ensure a safe environment.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs">6</span>
                No Guarantee
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 font-medium pl-11">
                The platform provides tools for communication, friendship, relationships, networking, and community engagement. We do not guarantee matches, friendships, employment, business opportunities, or financial outcomes.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs">7</span>
                Account Suspension
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 font-medium pl-11">
                Accounts may be suspended or terminated immediately for violations of these policies or behavior that threatens community safety or the "Respect is Mandatory" protocol.
              </p>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2.5rem] space-y-4 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                  <ShieldAlert className="w-24 h-24 text-primary" />
               </div>
               <div className="relative z-10 flex items-center gap-3 text-primary">
                  <ShieldAlert className="w-6 h-6" />
                  <h3 className="text-xl font-black uppercase tracking-tight">8. Disclaimer</h3>
               </div>
               <p className="relative z-10 text-xs font-black text-white/80 uppercase leading-relaxed tracking-widest pl-9 italic">
                 THIS PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE." TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE PLATFORM DISCLAIMS ALL WARRANTIES AND SHALL NOT BE LIABLE FOR INDIRECT OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR INTERACTIONS OR USE.
               </p>
            </div>
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

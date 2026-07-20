'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/Card';
import { ideaCategories } from '@/constants/categories';
import { Brain, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import GuestAccessGuard from "@/components/GuestAccessGuard";

/**
 * @fileOverview Ideas Discovery module.
 * Wrapped in the Guest Access Guard Protocol to enforce mission-aligned permissions.
 */
export default function IdeasPage() {
  return (
    <GuestAccessGuard feature="ideas">
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <section className="bg-white border-b py-16 px-6 text-center overflow-hidden relative">
           <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 translate-x-20">
              <Brain className="w-96 h-96 text-primary" />
           </div>
           <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-8 ring-white">
                 <Brain className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.9]">
                 Idea <br/><span className="gradient-text">Discovery</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium italic">
                 "Browse mission-aligned topics and dive into the Prosperity Pool."
              </p>
           </div>
        </section>

        <main className="container mx-auto px-6 py-10 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideaCategories.map((topic) => (
              <Link key={topic.value} href={`/pool?category=${topic.value}`}>
                <Card className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-white">
                  <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                    <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-primary/5 transition-all">
                      {topic.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black uppercase tracking-tighter">{topic.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-4">
                        {topic.description}
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button variant="ghost" size="sm" className="rounded-full h-8 text-[9px] font-black uppercase tracking-widest gap-2 group-hover:text-primary">
                        Explore Pool <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12 p-10 bg-slate-900 rounded-[3rem] border border-primary/20 shadow-2xl relative overflow-hidden group">
             <Sparkles className="absolute top-0 right-0 p-8 w-40 h-40 text-primary opacity-5 group-hover:rotate-12 transition-transform" />
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                   <Brain className="w-6 h-6" />
                   <h4 className="text-xl font-black uppercase tracking-tight">Collective Prosperity Intelligence</h4>
                </div>
                <p className="text-lg text-white/70 font-medium italic leading-relaxed uppercase tracking-widest">
                  "Respect & Love is Mandatory." Every thought in the pool fuels our global mission to reach every village. Access is earned through verified heart status and community contribution.
                </p>
             </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}

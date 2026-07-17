'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import ChatBox from "@/components/messages/ChatBox";
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Sparkles } from 'lucide-react';

/**
 * @fileOverview 💬 Messages Page.
 * The high-fidelity interaction hub for secured heart-to-heart conversations.
 */
export default function MessagesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-6 py-12 max-w-4xl space-y-10">
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none flex items-center justify-center sm:justify-start gap-3">
            <MessageSquare className="w-10 h-10 text-primary" />
            Messages
          </h1>
          <p className="text-muted-foreground font-medium italic">
            "Secured high-fidelity spaces for every heart connection."
          </p>
        </div>

        <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden flex flex-col h-[500px]">
          <div className="bg-primary/5 p-6 border-b flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                   <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest">Active Spark</h3>
             </div>
             <div className="text-[10px] font-black uppercase text-primary/40 tracking-[0.2em]">Protocol: test_room</div>
          </div>
          
          <CardContent className="flex-grow p-8 flex flex-col justify-end bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
             <div className="space-y-6">
                <div className="flex flex-col items-center justify-center h-full opacity-10 py-20">
                   <MessageSquare className="w-20 h-20 text-slate-400 mb-4" />
                   <p className="text-sm font-black uppercase tracking-[0.3em] text-center">Start a respectful conversation</p>
                </div>
                
                <div className="pt-4">
                   <ChatBox conversationId="test" />
                </div>
             </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
          Respect & Love is Mandatory ❤️ Prosperity Revolution
        </p>
      </main>

      <BottomNav />
    </div>
  );
}

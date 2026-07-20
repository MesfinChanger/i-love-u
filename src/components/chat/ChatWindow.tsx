'use client';

import { useState } from "react";
import { sendMessage } from "@/services/chat.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

/**
 * @fileOverview Chat Window Module.
 * A high-fidelity interface for secured message broadcasting.
 */
export default function ChatWindow({
  conversationId,
  userId
}: {
  conversationId: string;
  userId: string;
}) {
  const [text, setText] = useState("");

  /**
   * Broadcast Protocol.
   * Dispatches a message to the high-fidelity subcollection path using the unified object signature.
   */
  async function send() {
    if (!text.trim()) return;

    await sendMessage({
      conversationId,
      senderId: userId,
      text: text.trim(),
      type: "text"
    });

    setText("");
  }

  return (
    <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden flex flex-col h-[600px] transition-all">
      <CardHeader className="bg-primary/5 border-b p-6 flex flex-row items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
             <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-black uppercase tracking-tighter leading-none">Spark Chat</CardTitle>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 mt-1">Secured Frequency</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <ShieldCheck className="w-4 h-4 text-green-500" />
           <span className="text-[8px] font-black uppercase text-green-600 tracking-widest">Protocol Active</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-8 overflow-y-auto no-scrollbar relative">
        <div className="flex flex-col items-center justify-center h-full opacity-10 space-y-4">
           <div className="relative">
              <MessageSquare className="w-20 h-20 text-slate-400" />
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-primary animate-pulse" />
           </div>
           <p className="text-sm font-black uppercase tracking-[0.3em] text-center max-w-[200px]">
             "Every message is a bridge of respect."
           </p>
        </div>
      </CardContent>

      <div className="p-6 border-t bg-slate-50/50 space-y-4">
        <div className="flex gap-3">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Write a respectful message..."
            className="rounded-2xl bg-white border-none shadow-sm h-14 px-6 font-bold text-base focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <Button
            onClick={send}
            size="icon"
            className="h-14 w-14 rounded-2xl gradient-bg shadow-xl shadow-primary/20 shrink-0 active:scale-95 transition-all group"
            disabled={!text.trim()}
          >
            <Send className="w-6 h-6 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Button>
        </div>
        
        <p className="text-[8px] text-center text-muted-foreground font-black uppercase tracking-[0.4em] opacity-40">
           Happiness is Mandatory ❤️ Prosperity Revolution
        </p>
      </div>
    </Card>
  );
}

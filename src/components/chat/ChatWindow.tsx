'use client';

import { useState } from "react";
import { sendMessage } from "@/services/chat.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

/**
 * @fileOverview Chat Window Module.
 */
export default function ChatWindow({
  conversationId,
  userId
}: {
  conversationId: string;
  userId: string;
}) {
  const [text, setText] = useState("");

  async function send() {
    if (!text.trim()) return;
    await sendMessage({ conversationId, senderId: userId, text: text.trim(), type: "text" });
    setText("");
  }

  return (
    <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden flex flex-col h-[600px]">
      <CardHeader className="bg-primary/5 border-b p-6 flex flex-row items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl font-black uppercase">Spark Chat</CardTitle>
        </div>
        <ShieldCheck className="w-4 h-4 text-green-500" />
      </CardHeader>
      
      <CardContent className="flex-grow p-8 overflow-y-auto relative flex flex-col items-center justify-center">
        <div className="opacity-10 text-center"><Sparkles className="w-10 h-10 text-primary mx-auto mb-4" /><p className="font-black uppercase tracking-widest">Bridging Hearts</p></div>
      </CardContent>

      <div className="p-6 border-t bg-slate-50/50 flex gap-3">
        <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Write a respectful message..." className="rounded-2xl bg-white h-14" />
        <Button onClick={send} size="icon" className="h-14 w-14 rounded-2xl gradient-bg shadow-xl" disabled={!text.trim()}><Send className="w-6 h-6" /></Button>
      </div>
    </Card>
  );
}

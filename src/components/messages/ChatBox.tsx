"use client";

import { useState } from "react";
import { auth } from "@/firebase";
import { sendMessage } from "@/services/message/message.service";

/**
 * @fileOverview Chat Box Component.
 * Provides a high-fidelity interaction layer for broadcasting heart-to-heart messages.
 * Synchronized with the Message Protocol Service.
 */
export default function ChatBox({
  conversationId
}: {
  conversationId: string;
}) {
  const [text, setText] = useState("");

  /**
   * Broadcast Protocol.
   * Dispatches the message to the high-fidelity conversation subcollection.
   */
  async function send() {
    const user = auth?.currentUser;
    if (!user || !text.trim()) return;

    // Prosperity Protocol: Dispatches message via the dedicated service
    await sendMessage({
      conversationId,
      senderId: user.uid,
      text: text.trim()
    });

    setText("");
  }

  return (
    <div className="flex gap-3 items-center">
      <input
        className="flex-grow border rounded-xl p-4 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/50"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && send()}
        placeholder="Write a respectful message..."
      />

      <button
        onClick={send}
        disabled={!text.trim()}
        className="bg-slate-900 text-white border-none rounded-xl px-6 h-14 font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none group"
      >
        Send 💬
      </button>
    </div>
  );
}

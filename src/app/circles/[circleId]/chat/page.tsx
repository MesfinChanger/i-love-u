'use client';

import { useState, use, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Users, Loader2, ShieldCheck, Clock, ArrowLeft } from "lucide-react";
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, orderBy, serverTimestamp, doc, addDoc, limit } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/use-memo-firebase";
import { useToast } from "@/hooks/use-toast";
import { moderateText } from "@/ai/flows/moderate-text-flow";
import { useCircleRole } from "@/hooks/use-circle-role";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * @fileOverview Protected Circle Chat Module.
 * Synchronized with the Circle Access Protocol to ensure only members participate.
 */
export default function CircleChatPage({ params }: { params: Promise<{ circleId: string }> }) {
  const { circleId } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Authority Verification Protocol
  const { isMember, loading: roleLoading } = useCircleRole(circleId);

  const circleRef = useMemoFirebase(() => db && circleId ? doc(db, 'communities', circleId) : null, [db, circleId]);
  const { data: circle } = useDoc(circleRef);

  const messagesQuery = useMemoFirebase(() => {
    if (!db || !circleId || !isMember) return null;
    return query(
      collection(db, 'communities', circleId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );
  }, [db, circleId, isMember]);

  const { data: messages, loading: messagesLoading } = useCollection(messagesQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || !user || !db || !circleId || isSending || !isMember) return;

    setIsSending(true);
    try {
      const moderation = await moderateText({ text: message });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Respect Protocol", description: moderation.reason });
        setIsSending(false);
        return;
      }

      await addDoc(collection(db, 'communities', circleId, 'messages'), {
        senderId: user.uid,
        senderName: user.displayName || "Mystery Heart",
        text: message.trim(),
        createdAt: serverTimestamp(),
        edited: false,
        deleted: false
      });

      setMessage("");
    } catch (error) {
      console.error("Broadcast ripple:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Access Restriction UI
  if (!roleLoading && !isMember) {
    return (
      <div className="min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto max-w-5xl p-6">
          <Card className="m-10 p-12 text-center rounded-[3.5rem] border-none shadow-2xl bg-white space-y-8">
             <div className="w-20 h-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto">
                <Users className="w-10 h-10 text-primary opacity-20" />
             </div>
             <div className="space-y-2">
                <h1 className="text-3xl font-black uppercase tracking-tighter">Members Only</h1>
                <p className="text-muted-foreground italic font-medium">Join this Circle to participate in the conversation. ❤️</p>
             </div>
             <Button asChild className="h-14 px-8 rounded-2xl gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
                <Link href={`/circles/${circleId}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Circle
                </Link>
             </Button>
          </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <GuestAccessGuard feature="circle">
      <div className="min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto max-w-5xl p-6">
          <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
            <div className="bg-primary/5 p-8 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
                    {circle?.name || "Circle Chat"}
                  </h1>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mt-1">Community Hub • Heart Registry</p>
                </div>
              </div>
              <div className="inline-flex items-center rounded-full px-3 py-1 bg-green-500/10 text-green-600 text-[8px] font-black uppercase h-6 gap-1.5">
                <ShieldCheck className="w-3 h-3" /> Secure Frequency
              </div>
            </div>

            <CardContent className="p-0 flex flex-col h-[600px]">
              <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar">
                {messagesLoading || roleLoading ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  </div>
                ) : messages && messages.length > 0 ? (
                  messages.map((msg: any) => {
                    const isMe = msg.senderId === user?.uid;
                    return (
                      <div key={msg.id} className={cn("flex flex-col gap-1.5", isMe ? "items-end" : "items-start")}>
                        <div className={cn(
                          "px-6 py-4 rounded-[2rem] text-sm font-medium shadow-sm max-w-[80%]",
                          isMe ? "bg-primary text-white rounded-tr-none" : "bg-muted/50 rounded-tl-none border"
                        )}>
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-2 px-2">
                          <span className="text-[8px] font-black uppercase text-muted-foreground">{msg.senderName}</span>
                          <Clock className="w-2 h-2 text-muted-foreground/40" />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                      <Users className="w-10 h-10" />
                    </div>
                    <p className="text-sm font-medium italic">"Silence is where the first spark begins."</p>
                  </div>
                )}
              </div>

              <div className="p-8 border-t bg-slate-50/50">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a respectful community message..."
                    className="h-16 rounded-2xl bg-white border-none shadow-md px-8 text-lg font-medium italic"
                    disabled={isSending || roleLoading}
                  />
                  <Button type="submit" size="icon" className="w-16 h-16 rounded-2xl gradient-bg shrink-0 shadow-xl active:scale-95 transition-all" disabled={!message.trim() || isSending || roleLoading}>
                    {isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </main>
        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}

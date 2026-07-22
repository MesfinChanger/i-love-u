
'use client';

import { useState, useMemo, useEffect, useRef, use } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Send, 
  ChevronLeft, 
  Loader2, 
  Users, 
  ShieldCheck,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  serverTimestamp, 
  doc, 
  addDoc,
  limit
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { cn } from '@/lib/utils';
import GuestAccessGuard from "@/components/GuestAccessGuard";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * @fileOverview High-Fidelity Circle Community Chat.
 * Orchestrates real-time group communication for community members.
 */
export default function CircleChatPage({ params }: { params: Promise<{ circleId: string }> }) {
  const { circleId } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // 1. Fetch Circle Details
  const circleRef = useMemoFirebase(() => 
    db && circleId ? doc(db, 'communities', circleId) : null, 
    [db, circleId]
  );
  const { data: circleData, loading: circleLoading } = useDoc(circleRef);

  // 2. Fetch User Profile (for senderName)
  const userRef = useMemoFirebase(() => 
    db && user?.uid ? doc(db, 'users', user.uid) : null, 
    [db, user?.uid]
  );
  const { data: myProfile } = useDoc(userRef);

  // 3. Subscribe to Circle Messages
  const messagesQuery = useMemoFirebase(() => {
    if (!db || !circleId) return null;
    return query(
      collection(db, 'communities', circleId, 'messages'), 
      orderBy('createdAt', 'asc'),
      limit(100)
    );
  }, [db, circleId]);
  
  const { data: messages, loading: messagesLoading } = useCollection(messagesQuery);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !user || !db || !circleId || isSending) return;
    
    setIsSending(true);
    try {
      // Mission Protocol: Respect Moderation
      const moderation = await moderateText({ text: newMessage });
      if (moderation.isFlagged) {
        toast({ 
          variant: "destructive", 
          title: "Respect Protocol", 
          description: moderation.reason || "Your message was flagged for meanness. Respect is Mandatory. ❤️" 
        });
        setIsSending(false);
        return;
      }

      const collectionRef = collection(db, 'communities', circleId, 'messages');
      const messageData = {
        senderId: user.uid,
        senderName: myProfile?.displayName || user.displayName || "Mystery Heart",
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
        edited: false,
        deleted: false
      };

      // Prosperity Protocol: Non-blocking write
      addDoc(collectionRef, messageData)
        .then(() => {
          setNewMessage('');
          setIsSending(false);
        })
        .catch(async (err) => {
          setIsSending(false);
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: messageData
          }));
        });

    } catch (e) {
      console.error("Message dispatch ripple:", e);
      setIsSending(false);
    }
  };

  if (circleLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="animate-spin text-primary opacity-20 w-10 h-10" />
      </div>
    );
  }

  return (
    <GuestAccessGuard feature="circle">
      <div className="flex flex-col h-[100dvh] overflow-hidden bg-muted/30">
        <Header />
        
        <header className="flex items-center gap-4 px-6 h-20 border-b shrink-0 bg-white/80 backdrop-blur-md z-20">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-primary/5 text-primary">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-grow text-left">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-lg tracking-tight truncate leading-none">
                    {circleData?.name || "Community Circle"}
                  </h2>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1">
                    Global Circle Chat • {circleData?.memberCount || 1} Hearts
                  </p>
                </div>
             </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-2xl border border-green-100">
             <ShieldCheck className="w-4 h-4 text-green-600" />
             <span className="text-[9px] font-black uppercase text-green-700 tracking-widest">Safe Community</span>
          </div>
        </header>

        <main ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar pb-10">
          {messagesLoading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20 gap-4">
              <Loader2 className="animate-spin text-primary w-8 h-8" />
              <p className="text-[10px] font-black uppercase tracking-widest">Synchronizing History...</p>
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((msg: any) => {
              const isMe = msg.senderId === user?.uid;
              return (
                <div key={msg.id} className={cn("flex flex-col gap-2", isMe ? 'items-end' : 'items-start')}>
                  {!isMe && (
                    <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-4">
                      {msg.senderName}
                    </span>
                  )}
                  <div className={cn(
                    "px-6 py-4 rounded-[2.5rem] text-sm shadow-sm max-w-[85%] sm:max-w-[70%]",
                    isMe 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                  )}>
                    <span className="font-semibold leading-relaxed">
                      {msg.deleted ? <span className="italic opacity-50">This heartbeat was removed.</span> : msg.text}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-center space-y-6 opacity-20">
               <div className="w-20 h-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-primary" />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">"A quiet frequency..."</h3>
                  <p className="text-sm font-medium mt-2">Be the first to share a respectful moment.</p>
               </div>
            </div>
          )}
        </main>

        <footer className="p-6 bg-white border-t border-slate-100 shrink-0 pb-10 sm:pb-8">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
            <div className="relative flex-grow">
               <Input 
                value={newMessage} 
                onChange={e => setNewMessage(e.target.value)} 
                placeholder="Share a respectful thought..."
                className="rounded-[1.8rem] bg-muted/40 border-none h-16 px-8 text-base italic focus-visible:ring-2 focus-visible:ring-primary/20 transition-all pr-14"
                disabled={isSending}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                 <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="w-16 h-16 rounded-[1.5rem] gradient-bg shadow-xl active:scale-95 transition-all shrink-0" 
              disabled={!newMessage.trim() || isSending}
            >
              {isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-center gap-2 opacity-30 sm:hidden">
             <p className="text-[8px] font-black uppercase tracking-[0.4em]">Respect is Mandatory ❤️</p>
          </div>
        </footer>

        <div className="hidden sm:block">
           <BottomNav />
        </div>
      </div>
    </GuestAccessGuard>
  );
}

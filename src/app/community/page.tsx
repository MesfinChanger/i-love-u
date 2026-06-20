
'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Globe2, 
  Send, 
  Loader2, 
  ShieldCheck, 
  Sparkles, 
  Heart,
  Ghost,
  MessageSquare
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, limit, doc } from 'firebase/firestore';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function CommunityPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: myProfile } = useDoc(userRef);

  const communityQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'communityMessages'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );
  }, [db]);

  const { data: messages, loading } = useCollection(communityQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !user || !db || isSending) return;

    setIsSending(true);
    try {
      const moderation = await moderateText({ text: newMessage, context: 'chat' });
      
      if (moderation.isFlagged) {
        toast({
          variant: "destructive",
          title: "Respect Rule Violation",
          description: moderation.reason || "Offensive content is forbidden in the Friendship Circle. ✨"
        });
        setIsSending(false);
        return;
      }

      await addDoc(collection(db, 'communityMessages'), {
        senderId: user.uid,
        senderNickname: myProfile?.publicNickname || "Mystery Heart",
        text: newMessage,
        timestamp: serverTimestamp(),
      });

      setNewMessage('');
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not post to wall." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-muted/30 overflow-hidden">
      <Header />
      
      <div className="bg-primary/5 border-b p-2 flex items-center justify-center gap-2 shrink-0">
         <ShieldCheck className="w-3.5 h-3.5 text-primary animate-pulse" />
         <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">Global Moderation Active • Respect is Mandatory</p>
      </div>

      <main ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
        <div className="text-center py-8 space-y-3 opacity-60">
           <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-sm border">
              <Globe2 className="w-8 h-8 text-primary" />
           </div>
           <div>
              <h2 className="text-xl font-black tracking-tighter">Global Circle Wall</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest">Bridging Hearts Across Every City</p>
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary/20" /></div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg: any, i) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id || i} className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}>
                <div className="flex items-center gap-2 px-2">
                   <span className="text-[9px] font-black uppercase text-muted-foreground">{msg.senderNickname}</span>
                   <span className="text-[7px] text-muted-foreground/40">{msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}</span>
                </div>
                <div className={cn(
                  "max-w-[85%] px-4 py-3 rounded-[1.8rem] text-sm font-medium shadow-sm transition-all",
                  isMe ? "bg-primary text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border"
                )}>
                  {msg.text}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-20">
             <MessageSquare className="w-12 h-12" />
             <p className="text-sm font-bold uppercase tracking-widest">The Wall is Silent.<br/>Spark the First Message.</p>
          </div>
        )}
      </main>

      <footer className="p-4 bg-white/80 backdrop-blur-xl border-t pb-24 shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)} 
            placeholder="Share a respectful thought..." 
            className="rounded-2xl bg-muted/40 border-none h-12 px-6 font-bold text-sm"
            disabled={isSending}
          />
          <Button type="submit" size="icon" className="rounded-xl h-12 w-12 gradient-bg shrink-0 shadow-lg" disabled={!newMessage.trim() || isSending}>
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </footer>
      
      <BottomNav />
    </div>
  );
}

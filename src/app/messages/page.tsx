'use client';

import { useMemo, useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useCollection, useUser, useFirestore } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Loader2, 
  Sparkles, 
  ShieldCheck,
  ChevronRight,
  Clock,
  Heart
} from 'lucide-react';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';
import GuestAccessGuard from "@/components/GuestAccessGuard";

/**
 * @fileOverview Messages Hub synchronized with the Conversation Protocol.
 * Lists all active secured spark rooms and community interactions.
 */
export default function MessagesPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { t } = useTranslation();

  // Conversation Registry Query
  const convQuery = useMemoFirebase(() => {
    if (!user?.uid || !db) return null;
    return query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastUpdatedAt', 'desc'),
      limit(50)
    );
  }, [user?.uid, db]);

  const { data: conversations, loading } = useCollection(convQuery);

  return (
    <GuestAccessGuard feature="messages">
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Messages</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">Secured Communications</p>
            </div>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
               <ShieldCheck className="w-4 h-4" />
               E2EE Active
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 opacity-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-[10px] font-black uppercase tracking-widest mt-4">Tuning Frequencies...</p>
            </div>
          ) : conversations && conversations.length > 0 ? (
            <div className="space-y-4">
              {conversations.map((conv: any) => (
                <ConversationListItem key={conv.id} conv={conv} currentUserId={user?.uid!} />
              ))}
            </div>
          ) : (
            <Card className="rounded-[3rem] border-2 border-dashed border-primary/10 bg-white/50 p-20 text-center flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center relative">
                <MessageSquare className="w-10 h-10 text-primary opacity-20" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse opacity-40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-400">Quiet vibration</h3>
                <p className="text-muted-foreground font-medium italic max-w-xs mx-auto">
                  "Every conversation starts with a single spark." Reach out to a match to begin.
                </p>
              </div>
              <Link href="/discover" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
                Start Discovering
              </Link>
            </Card>
          )}

          <div className="p-8 bg-white/60 rounded-[2.5rem] border-2 border-dashed border-primary/5 text-center space-y-3">
             <div className="flex items-center justify-center gap-2 opacity-20">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <p className="text-[9px] font-black uppercase tracking-widest">End-to-End Encryption Protocol</p>
             </div>
             <p className="text-[11px] text-muted-foreground font-medium italic leading-relaxed">
               "Respect & Love is Mandatory." All private messages are secured between hearts. Our mission is to protect your journey. ❤️
             </p>
          </div>
        </main>

        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}

function ConversationListItem({ conv, currentUserId }: { conv: any, currentUserId: string }) {
  const db = useFirestore();
  const partnerId = conv.participants.find((id: string) => id !== currentUserId);
  const { data: partner } = useCollection(partnerId ? query(collection(db, 'users'), where('uid', '==', partnerId)) : null);
  const partnerProfile = partner?.[0];

  const lastUpdate = useMemo(() => {
    if (!conv.lastUpdatedAt) return 'Now';
    try {
      const d = conv.lastUpdatedAt.toDate ? conv.lastUpdatedAt.toDate() : new Date(conv.lastUpdatedAt);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return 'Recent'; }
  }, [conv.lastUpdatedAt]);

  return (
    <Link href={`/messages/${conv.id}`}>
      <Card className="rounded-[2.5rem] border-none shadow-md hover:shadow-xl transition-all bg-white group overflow-hidden">
        <CardContent className="p-6 flex items-center gap-5">
          <div className="relative shrink-0">
            <Avatar className="w-16 h-16 border-2 border-primary/10 shadow-sm transition-transform group-hover:scale-105">
              <AvatarImage src={partnerProfile?.photoURL} className="object-cover" />
              <AvatarFallback className="bg-primary/5 text-primary font-black text-xl">
                {partnerProfile?.displayName?.[0] || <Heart className="w-6 h-6 fill-primary" />}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-sm" />
          </div>

          <div className="flex-grow min-w-0 space-y-1">
            <div className="flex justify-between items-baseline gap-2">
              <h4 className="font-black text-xl tracking-tight text-slate-900 truncate">
                {partnerProfile?.displayName || "Mystery Heart"}
              </h4>
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 shrink-0">
                <Clock className="w-2.5 h-2.5" /> {lastUpdate}
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-medium italic line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
              {conv.lastMessage || "Start a secured conversation..."}
            </p>
          </div>

          <div className="shrink-0 text-slate-200 group-hover:text-primary transition-colors">
            <ChevronRight className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

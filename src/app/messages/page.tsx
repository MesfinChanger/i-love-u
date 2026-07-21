'use client';

import { useMemo } from 'react';
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
import GuestAccessGuard from "@/components/GuestAccessGuard";

/**
 * @fileOverview Messages Hub Module.
 */
export default function MessagesPage() {
  const { user } = useUser();
  const db = useFirestore();

  const convQuery = useMemoFirebase(() => {
    if (!user?.uid || !db) return null;
    return query(collection(db, 'conversations'), where('participants', 'array-contains', user.uid), orderBy('lastUpdatedAt', 'desc'), limit(50));
  }, [user?.uid, db]);

  const { data: conversations, loading } = useCollection(convQuery);

  return (
    <GuestAccessGuard feature="messages">
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
          <div className="flex justify-between items-end">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Messages</h1>
            <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-widest px-4 h-8 flex items-center gap-2">
               <ShieldCheck className="w-4 h-4" /> E2EE Active
            </Badge>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 opacity-20"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
          ) : conversations && conversations.length > 0 ? (
            <div className="space-y-4">
              {conversations.map((conv: any) => (
                <ConversationListItem key={conv.id} conv={conv} currentUserId={user?.uid!} />
              ))}
            </div>
          ) : (
            <Card className="rounded-[3rem] border-2 border-dashed border-primary/10 bg-white/50 p-20 text-center flex flex-col items-center gap-6">
              <MessageSquare className="w-10 h-10 text-primary opacity-20" />
              <p className="text-muted-foreground italic font-medium">"Every conversation starts with a single spark."</p>
              <Link href="/discover" className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Start Discovering</Link>
            </Card>
          )}
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

  return (
    <Link href={`/messages/${conv.id}`}>
      <Card className="rounded-[2.5rem] border-none shadow-md hover:shadow-xl transition-all bg-white group overflow-hidden">
        <CardContent className="p-6 flex items-center gap-5">
          <Avatar className="w-16 h-16 border-2 border-primary/10 shadow-sm">
            <AvatarImage src={partnerProfile?.photoURL} />
            <AvatarFallback className="bg-primary/5 text-primary font-black"><Heart className="w-6 h-6" /></AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <h4 className="font-black text-xl tracking-tight truncate">{partnerProfile?.displayName || "Mystery Heart"}</h4>
            <p className="text-sm text-muted-foreground italic line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
              {conv.lastMessage || "Start a secured conversation..."}
            </p>
          </div>
          <ChevronRight className="shrink-0 text-slate-200 group-hover:text-primary transition-colors" />
        </CardContent>
      </Card>
    </Link>
  );
}

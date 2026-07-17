'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Globe, 
  Loader2, 
  Rocket, 
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, limit, doc } from 'firebase/firestore';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

/**
 * @fileOverview Global Wall module synchronized with the Community Message Protocol.
 * Harmonized typography scale.
 */
export default function CommunityPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const userRef = useMemoFirebase(() => db && user?.uid ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: myProfile } = useDoc(userRef);

  const isCommercial = myProfile?.accountType === 'business';
  const hasAcceptedPolicy = myProfile?.policyAccepted === true;
  const isInteractionRestricted = isCommercial && !hasAcceptedPolicy;

  const communityQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'communityMessages'), orderBy('createdAt', 'asc'), limit(100));
  }, [db]);
  
  const { data: messages, loading } = useCollection(communityQuery);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-gate'));
      return;
    }

    if (!newMessage.trim() || !db || isSending) return;
    
    if (isInteractionRestricted) {
      toast({ variant: "destructive", title: "Posting Restricted", description: "Protocol agreement required. ❤️" });
      return;
    }

    setIsSending(true);
    try {
      const moderation = await moderateText({ text: newMessage });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Respect Policy Ripple", description: moderation.reason });
        setIsSending(false);
        return;
      }

      const collectionRef = collection(db, 'communityMessages');
      const data = {
        authorId: user.uid,
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
      };

      addDoc(collectionRef, data)
        .then(() => {
          setNewMessage('');
          setIsSending(false);
        })
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: data,
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
          setIsSending(false);
        });
    } catch (e) {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <section className="bg-white border-b py-16 px-6 text-center overflow-hidden relative">
         <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 translate-x-20">
            <Globe className="w-96 h-96 text-primary" />
         </div>
         <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-8 ring-white">
               <Globe className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase leading-[1.2]">
               Global <br/><span className="gradient-text">Wall</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium italic">
               "Share respectful moments with hearts across every city."
            </p>
         </div>
      </section>

      <main className="max-w-4xl mx-auto w-full flex-grow px-6 py-10 space-y-8">
        {isInteractionRestricted && (
          <div className="bg-amber-100 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
             <div className="flex items-center gap-3 text-amber-800">
                <ShieldAlert className="w-5 h-5" />
                <p className="text-xs font-bold uppercase tracking-tight">View Only Mode: Protocol Agreement Required</p>
             </div>
             <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase text-amber-900" asChild>
                <a href="/policy/agree">Agree Now</a>
             </Button>
          </div>
        )}

        <Card className="rounded-[3rem] border-none shadow-xl bg-white overflow-hidden">
           <CardContent className="p-8">
              <form onSubmit={handleSendMessage} className="flex gap-4">
                 <Input 
                   value={newMessage}
                   onChange={e => setNewMessage(e.target.value)}
                   placeholder={isInteractionRestricted ? "Protocol required to post..." : "What's on your heart?"} 
                   className="flex-grow rounded-2xl bg-muted/40 border-none h-16 px-8 text-lg font-medium italic"
                   disabled={isInteractionRestricted}
                 />
                 <Button type="submit" size="icon" className="w-16 h-16 rounded-[1.8rem] gradient-bg shrink-0 shadow-xl shadow-primary/20 active:scale-95 transition-all" disabled={isSending || isInteractionRestricted || !newMessage.trim()}>
                    {isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6" />}
                 </Button>
              </form>
           </CardContent>
        </Card>

        <div className="space-y-6">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest mt-4">Tuning Frequencies...</p>
             </div>
           ) : messages?.map((msg: any) => (
             <CommunityMessageCard key={msg.id} msg={msg} />
           ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function CommunityMessageCard({ msg }: { msg: any }) {
  const db = useFirestore();
  const authorRef = useMemoFirebase(() => db ? doc(db, 'users', msg.authorId) : null, [msg.authorId]);
  const { data: author } = useDoc(authorRef);

  return (
    <Card className="rounded-[2.5rem] border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition-all group">
      <CardContent className="p-8 space-y-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-lg">
                  {author?.username?.[0] || author?.displayName?.[0] || 'H'}
               </div>
               <div className="text-left leading-none">
                  <h4 className="font-black text-lg tracking-tight text-slate-900">
                    {author?.username || author?.displayName || "Mystery Heart"}
                  </h4>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    Community Member
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
               <Clock className="w-3.5 h-3.5" />
               <span className="text-[9px] font-black uppercase tracking-widest">Broadcast Active</span>
            </div>
         </div>
         <p className="text-lg font-medium text-slate-700 italic border-l-8 border-primary/5 pl-8 py-2 leading-relaxed">
            "{msg.text}"
         </p>
      </CardContent>
    </Card>
  );
}

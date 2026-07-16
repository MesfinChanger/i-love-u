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
  Camera, 
  Paperclip, 
  FileIcon, 
  Rocket, 
  Shield, 
  ShieldAlert 
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useDoc, useFirebaseStorage } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, limit, doc } from 'firebase/firestore';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

export default function CommunityPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { uploadFile } = useFirebaseStorage();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const userRef = useMemoFirebase(() => db && user?.uid ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: myProfile } = useDoc(userRef);

  const isCommercial = myProfile?.isSeller || myProfile?.isAdvertiser;
  const hasAcceptedPolicy = myProfile?.policyAccepted === true;
  const isInteractionRestricted = isCommercial && !hasAcceptedPolicy;

  const communityQuery = useMemoFirebase(() => db ? query(collection(db, 'communityMessages'), orderBy('timestamp', 'asc'), limit(100)) : null, [db]);
  const { data: messages, loading } = useCollection(communityQuery);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-gate'));
      return;
    }

    if (!newMessage.trim() || !db || isSending) return;
    
    if (isInteractionRestricted) {
      toast({ variant: "destructive", title: "Posting Restricted", description: "Commercial users must commit to the Respect Protocol first. ❤️" });
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

      await addDoc(collection(db, 'communityMessages'), {
        senderId: user.uid,
        senderNickname: myProfile?.publicNickname || "Mystery Heart",
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <section className="bg-white border-b py-12 px-6 text-center">
         <div className="max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <Globe className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Global Wall</h1>
            <p className="text-muted-foreground font-medium italic">"Share respectful moments with the world community."</p>
         </div>
      </section>

      <main className="max-w-4xl mx-auto w-full flex-grow px-6 py-10 space-y-6">
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
           <CardContent className="p-8">
              <div className="flex items-center gap-4">
                 <form onSubmit={handleSendMessage} className="flex-grow flex gap-2">
                    <Input 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder={isInteractionRestricted ? "View Only Mode: Policy Agreement Required" : "Share a respectful moment..."} 
                      className="rounded-2xl bg-muted/40 border-none h-14 px-6"
                      disabled={isInteractionRestricted}
                    />
                    <Button type="submit" size="icon" className="w-14 h-14 rounded-2xl gradient-bg shrink-0" disabled={isSending || isInteractionRestricted}>
                       {isSending ? <Loader2 className="animate-spin" /> : <Rocket className="w-6 h-6" />}
                    </Button>
                 </form>
              </div>
           </CardContent>
        </Card>

        <div className="space-y-6">
           {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary opacity-20" /></div>
           ) : messages?.map((msg: any) => (
             <Card key={msg.id} className="rounded-[2.5rem] border-none shadow-md overflow-hidden bg-white">
                <CardContent className="p-6 space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black">
                         {msg.senderNickname?.[0] || 'U'}
                      </div>
                      <div className="text-left leading-none">
                         <h4 className="font-black text-sm">{msg.senderNickname}</h4>
                         <p className="text-[8px] font-bold text-muted-foreground uppercase mt-1">Community Member</p>
                      </div>
                   </div>
                   <p className="text-lg font-medium text-slate-700 italic border-l-4 border-primary/10 pl-6">
                      "{msg.text}"
                   </p>
                </CardContent>
             </Card>
           ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
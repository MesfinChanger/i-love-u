'use client';

import { useState, useMemo, useEffect, useRef, use } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  ChevronLeft, 
  Loader2, 
  Camera, 
  Lock, 
  ShieldAlert,
  X,
  Trash2,
  Paperclip
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { encryptText, decryptText } from '@/lib/crypto';
import { cn } from '@/lib/utils';

export default function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [decryptedMessages, setDecryptedMessages] = useState<Record<string, string>>({});

  const currentUserId = user?.uid;

  const userRef = useMemoFirebase(() => db && currentUserId ? doc(db, 'users', currentUserId) : null, [db, currentUserId]);
  const { data: myProfile } = useDoc(userRef);
  
  const isCommercial = myProfile?.isSeller || myProfile?.isAdvertiser;
  const hasAcceptedPolicy = myProfile?.policyAccepted === true;
  const isInteractionRestricted = isCommercial && !hasAcceptedPolicy;

  const matchRef = useMemoFirebase(() => db && matchId ? doc(db, 'matches', matchId) : null, [db, matchId]);
  const { data: matchData, loading: matchLoading } = useDoc(matchRef);

  const partnerId = useMemo(() => matchData?.userIds?.find((id: string) => id !== currentUserId), [matchData?.userIds, currentUserId]);
  const partnerRef = useMemoFirebase(() => db && partnerId ? doc(db, 'users', partnerId) : null, [db, partnerId]);
  const { data: partnerProfile } = useDoc(partnerRef);

  const messagesQuery = useMemoFirebase(() => db && matchId ? query(collection(db, 'matches', matchId, 'messages'), orderBy('timestamp', 'asc')) : null, [db, matchId]);
  const { data: messages, loading: messagesLoading } = useCollection(messagesQuery);

  useEffect(() => {
    const decryptAll = async () => {
      if (!messages || !currentUserId) return;
      const privKey = localStorage.getItem(`spark_priv_${currentUserId}`);
      if (!privKey) return;
      const newDecrypted = { ...decryptedMessages };
      for (const msg of messages as any[]) {
        if (msg.encryptedText && !newDecrypted[msg.id]) {
          try {
            newDecrypted[msg.id] = await decryptText(msg.encryptedText, privKey);
          } catch (e) {
            newDecrypted[msg.id] = "[Encryption Ripple]";
          }
        }
      }
      setDecryptedMessages(newDecrypted);
    };
    decryptAll();
  }, [messages, currentUserId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !user || !db || !matchId || isSending) return;
    
    if (isInteractionRestricted) {
      toast({ variant: "destructive", title: "Action Restricted", description: "Sellers and Purchasers must accept the policy first. ❤️" });
      return;
    }

    setIsSending(true);
    try {
      const moderation = await moderateText({ text: newMessage });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Policy Blocked", description: moderation.reason });
        setIsSending(false);
        return;
      }
      const partnerPubKey = partnerProfile?.publicKey;
      let encryptedText = partnerPubKey ? await encryptText(newMessage, partnerPubKey) : null;
      await addDoc(collection(db, 'matches', matchId, 'messages'), {
        senderId: user.uid,
        text: partnerPubKey ? "[Encrypted Content]" : newMessage,
        encryptedText,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  if (matchLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-primary opacity-20" /></div>;

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-white">
      <header className="flex items-center gap-4 px-4 h-16 border-b shrink-0 bg-white/80 backdrop-blur-md z-20">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full"><ChevronLeft className="w-5 h-5" /></Button>
        <div className="flex-grow text-left">
           <h2 className="font-black text-sm tracking-tight truncate">{partnerProfile?.displayName || "Partner"}</h2>
           <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest leading-none">Spark Room</p>
        </div>
      </header>

      <main ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messagesLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
        ) : (
          messages?.map((msg: any) => {
            const isMe = msg.senderId === currentUserId;
            const textToShow = msg.encryptedText ? (decryptedMessages[msg.id] || "...") : msg.text;
            return (
              <div key={msg.id} className={cn("flex", isMe ? 'justify-end' : 'justify-start')}>
                <div className={cn("px-5 py-4 rounded-[2.2rem] text-sm shadow-sm", isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-foreground rounded-tl-none border')}>
                  <span className="font-semibold">{textToShow}</span>
                </div>
              </div>
            );
          })
        )}
      </main>

      <footer className="p-4 border-t pb-8 bg-white/80 backdrop-blur-xl">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)} 
            placeholder={isInteractionRestricted ? "View Only: Policy Agreement Required" : "Respectful message..."} 
            className="rounded-2xl bg-muted/40 border-none h-12 px-6"
            disabled={isInteractionRestricted}
          />
          <Button type="submit" size="icon" className="rounded-xl h-12 w-12 gradient-bg" disabled={!newMessage.trim() || isSending || isInteractionRestricted}>
             <Send className="w-5 h-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  ChevronLeft, 
  Loader2, 
  ShieldCheck
} from 'lucide-react';
import { db, useCollection, useDoc } from '@/firebase';
import { collection, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { 
  importPublicKey, 
  importPrivateKey, 
  createSharedKey, 
  encryptText, 
  decryptText 
} from '@/lib/crypto';
import { cn } from '@/lib/utils';
import { sendMessage } from '@/services/chat.service';

/**
 * @fileOverview High-Fidelity E2EE Chat Window.
 * Orchestrates secured message broadcasting with ECDH-P256 and AES-GCM.
 */
export default function ChatWindow({
  conversationId,
  userId
}: {
  conversationId: string;
  userId: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [decryptedMessages, setDecryptedMessages] = useState<Record<string, string>>({});
  const [sharedKey, setSharedKey] = useState<CryptoKey | null>(null);

  const currentUserId = userId;
  
  const convRef = useMemoFirebase(() => db && conversationId ? doc(db, 'conversations', conversationId) : null, [db, conversationId]);
  const { data: convData, loading: matchLoading } = useDoc(convRef);

  const partnerId = useMemo(() => convData?.participants?.find((id: string) => id !== currentUserId), [convData?.participants, currentUserId]);
  const partnerRef = useMemoFirebase(() => db && partnerId ? doc(db, 'users', partnerId) : null, [db, partnerId]);
  const { data: partnerProfile } = useDoc(partnerRef);

  const messagesQuery = useMemoFirebase(() => {
    if (!db || !conversationId) return null;
    return query(
      collection(db, 'conversations', conversationId, 'messages'), 
      orderBy('createdAt', 'asc')
    );
  }, [db, conversationId]);
  
  const { data: messages, loading: messagesLoading } = useCollection(messagesQuery);

  // E2EE Shared Key Agreement Protocol (ECDH-P256)
  useEffect(() => {
    const establishSharedKey = async () => {
      if (!db || !currentUserId || !partnerId) return;
      const privKeyStr = localStorage.getItem(`spark_priv_${currentUserId}`);
      if (!privKeyStr) return;
      try {
        const keySnap = await getDoc(doc(db, 'publicKeys', partnerId));
        const keyData = keySnap.data();
        if (keyData?.publicKey) {
          const myPrivKey = await importPrivateKey(privKeyStr);
          const partnerPubKey = await importPublicKey(keyData.publicKey);
          if (myPrivKey && partnerPubKey) {
            const derivedKey = await createSharedKey(myPrivKey, partnerPubKey);
            setSharedKey(derivedKey);
          }
        }
      } catch (e) {
        console.warn("Shared key agreement ripple:", e);
      }
    };
    establishSharedKey();
  }, [db, currentUserId, partnerId]);

  // Decryption Flow (AES-GCM Protocol)
  useEffect(() => {
    const decryptAll = async () => {
      if (!messages || !sharedKey) return;
      const newDecrypted = { ...decryptedMessages };
      let changed = false;
      for (const msg of messages as any[]) {
        if (msg.encryptedText && msg.iv && !newDecrypted[msg.id]) {
          try {
            const text = await decryptText(msg.encryptedText, msg.iv, sharedKey);
            newDecrypted[msg.id] = text;
            changed = true;
          } catch (e) {
            newDecrypted[msg.id] = "[Encryption Ripple]";
            changed = true;
          }
        }
      }
      if (changed) setDecryptedMessages(newDecrypted);
    };
    decryptAll();
  }, [messages, sharedKey]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !userId || !db || !conversationId || isSending) return;
    
    setIsSending(true);
    try {
      const moderation = await moderateText({ 
        text: newMessage,
        context: 'chat'
      });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Policy Blocked", description: moderation.reason });
        setIsSending(false);
        return;
      }

      const payload: any = {
        conversationId,
        senderId: userId,
        type: "text" as const,
      };

      if (sharedKey) {
        const encrypted = await encryptText(newMessage, sharedKey);
        if (encrypted) {
          payload.encryptedText = encrypted.cipherText;
          payload.iv = encrypted.iv;
        } else {
          payload.text = newMessage;
        }
      } else {
        payload.text = newMessage;
      }

      await sendMessage(payload);
      setNewMessage('');
    } catch (e) {
      console.error("Chat error:", e);
    } finally {
      setIsSending(false);
    }
  };

  if (matchLoading) return <div className="flex items-center justify-center h-full min-h-[400px]"><Loader2 className="animate-spin text-primary opacity-20" /></div>;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <header className="flex items-center gap-4 px-4 h-16 border-b shrink-0 bg-white/80 backdrop-blur-md z-20">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full"><ChevronLeft className="w-5 h-5" /></Button>
        <div className="flex-grow text-left">
           <div className="flex items-center gap-2">
              <h2 className="font-black text-sm tracking-tight truncate">{partnerProfile?.displayName || "Partner"}</h2>
              {sharedKey && <ShieldCheck className="w-3 h-3 text-green-500" />}
           </div>
           <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest leading-none">Secured Spark Room</p>
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
          <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Respectful message..." className="rounded-2xl bg-muted/40 border-none h-12 px-6 font-bold" />
          <Button type="submit" size="icon" className="rounded-xl h-12 w-12 gradient-bg" disabled={!newMessage.trim() || isSending}><Send className="w-5 h-5" /></Button>
        </form>
      </footer>
    </div>
  );
}

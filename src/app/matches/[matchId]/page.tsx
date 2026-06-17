'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, doc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateIcebreaker } from '@/ai/flows/generate-icebreaker-flow';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

export default function ChatPage() {
  const { matchId } = useParams();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Get current user profile for language preference
  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  // Mock match details
  const matchInfo = useMemo(() => {
    const idNum = parseInt(String(matchId).split('-')[1]) || 0;
    const img = PlaceHolderImages.filter(img => img.id.startsWith('user-'))[idNum % 4];
    return {
      name: ['Alex', 'Jordan', 'Taylor', 'Casey'][idNum % 4],
      photoUrl: img?.imageUrl,
      interests: ['Hiking', 'Coffee', 'Music', 'Travel']
    };
  }, [matchId]);

  // Real-time messages from Firestore
  const messagesQuery = useMemoFirebase(() => {
    if (!db || !matchId) return null;
    return query(
      collection(db, 'matches', String(matchId), 'messages'),
      orderBy('timestamp', 'asc')
    );
  }, [db, matchId]);

  const { data: messages, loading } = useCollection(messagesQuery);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !user || !db || !matchId) return;

    addDoc(collection(db, 'matches', String(matchId), 'messages'), {
      senderId: user.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  const handleIcebreaker = async () => {
    setIsGenerating(true);
    try {
      const result = await generateIcebreaker({
        recipientName: matchInfo.name,
        recipientInterests: matchInfo.interests,
        language: profile?.preferredLanguage || 'English'
      });
      setNewMessage(result.icebreaker);
      toast({
        title: "Icebreaker generated!",
        description: `Message generated in ${profile?.preferredLanguage || 'English'}.`
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Custom Chat Header */}
      <header className="flex items-center gap-4 px-4 h-16 border-b shrink-0">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={matchInfo.photoUrl} className="object-cover" />
          <AvatarFallback>{matchInfo.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <h2 className="font-bold">{matchInfo.name}</h2>
          <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Online Now</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleIcebreaker}
          disabled={isGenerating}
          className="text-primary gap-1"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span className="hidden sm:inline">Icebreaker</span>
        </Button>
      </header>

      {/* Messages Area */}
      <main ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/10">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          messages?.map((msg: any, i) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-[1.5rem] text-sm ${
                  isMe 
                    ? 'bg-primary text-white rounded-tr-none shadow-md' 
                    : 'bg-white text-foreground rounded-tl-none border shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        {messages?.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm">Say something charming to start the spark!</p>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-4 border-t pb-8">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="rounded-full bg-muted/30 border-none focus-visible:ring-primary h-12 px-6"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full h-12 w-12 gradient-bg shrink-0 shadow-lg"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
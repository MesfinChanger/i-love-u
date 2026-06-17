
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ChevronLeft, Sparkles, Loader2, Camera, ShieldAlert, EyeOff, Info } from 'lucide-react';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, doc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateIcebreaker } from '@/ai/flows/generate-icebreaker-flow';
import { moderateImage } from '@/ai/flows/moderate-image-flow';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import Image from 'next/image';

export default function ChatPage() {
  const { matchId } = useParams();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Get current user profile
  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: myProfile } = useDoc(userRef);

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

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !user || !db || !matchId || isSending) return;

    setIsSending(true);
    try {
      // Moderate text before sending
      const moderation = await moderateText({ text: newMessage });
      
      if (moderation.isFlagged) {
        toast({
          variant: "destructive",
          title: "Safety Alert",
          description: "Your message was flagged for disrespectful or insulting content. Let's keep things friendly! ✨"
        });
        setIsSending(false);
        return;
      }

      addDoc(collection(db, 'matches', String(matchId), 'messages'), {
        senderId: user.uid,
        text: newMessage,
        timestamp: serverTimestamp(),
      });

      setNewMessage('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send message."
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !db || !matchId) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        
        // Moderate image before sending
        const moderation = await moderateImage({ photoDataUri: dataUri });
        
        addDoc(collection(db, 'matches', String(matchId), 'messages'), {
          senderId: user.uid,
          imageUrl: dataUri,
          isSensitive: moderation.isSensitive,
          timestamp: serverTimestamp(),
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not process image."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleIcebreaker = async () => {
    setIsGenerating(true);
    try {
      const result = await generateIcebreaker({
        recipientName: matchInfo.name,
        recipientInterests: matchInfo.interests,
        language: myProfile?.preferredLanguage || 'English'
      });
      setNewMessage(result.icebreaker);
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

      <main ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/10">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          messages?.map((msg: any, i) => {
            const isMe = msg.senderId === user?.uid;
            const isSensitive = msg.isSensitive;
            const blockedBySettings = isSensitive && !myProfile?.settings?.allowSensitiveContent;

            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-[1.5rem] text-sm ${
                  isMe 
                    ? 'bg-primary text-white rounded-tr-none shadow-md' 
                    : 'bg-white text-foreground rounded-tl-none border shadow-sm'
                }`}>
                  {msg.imageUrl ? (
                    <div className="relative w-48 h-64 overflow-hidden rounded-xl">
                      {blockedBySettings ? (
                        <div className="w-full h-full bg-slate-900/90 flex flex-col items-center justify-center text-center p-4 gap-2">
                          <EyeOff className="w-8 h-8 text-white/50" />
                          <p className="text-[10px] font-bold text-white/70 uppercase">Sensitive Content</p>
                          <p className="text-[8px] text-white/40">Hidden by your safety settings</p>
                        </div>
                      ) : (
                        <Image 
                          src={msg.imageUrl} 
                          alt="Attachment" 
                          fill 
                          className={`object-cover ${isSensitive ? 'blur-xl' : ''}`}
                        />
                      )}
                      {isSensitive && !blockedBySettings && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full shadow-lg">
                          <ShieldAlert className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      <footer className="p-4 border-t pb-8">
        <div className="flex items-center gap-2 mb-2">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload}
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full shrink-0 border-muted"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 text-muted-foreground" />}
          </Button>
          <form onSubmit={handleSendMessage} className="flex-grow flex gap-2">
            <Input 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="rounded-full bg-muted/30 border-none focus-visible:ring-primary h-12 px-6"
              disabled={isSending}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full h-12 w-12 gradient-bg shrink-0 shadow-lg"
              disabled={!newMessage.trim() || isSending}
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Send className="w-5 h-5 text-white" />}
            </Button>
          </form>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <ShieldAlert className="w-3 h-3 text-muted-foreground" />
          <p className="text-[8px] text-center text-muted-foreground uppercase font-bold tracking-widest">
            AI Moderation Active: Respectful content only
          </p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  ChevronLeft, 
  Sparkles, 
  Loader2, 
  Camera, 
  ShieldAlert, 
  EyeOff, 
  Lock, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  Cake, 
  TreePine, 
  BookOpen,
  Flag
} from 'lucide-react';
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
import { encryptText, decryptText } from '@/lib/crypto';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [isReporting, setIsReporting] = useState(false);
  const [decryptedMessages, setDecryptedMessages] = useState<Record<string, string>>({});

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: myProfile } = useDoc(userRef);

  const matchRef = useMemoFirebase(() => {
    if (!db || !matchId) return null;
    return doc(db, 'matches', String(matchId));
  }, [db, matchId]);
  const { data: matchData } = useDoc(matchRef);

  const partnerId = useMemo(() => {
    return matchData?.userIds?.find((id: string) => id !== user?.uid);
  }, [matchData, user]);

  const partnerRef = useMemoFirebase(() => {
    if (!db || !partnerId) return null;
    return doc(db, 'users', partnerId);
  }, [db, partnerId]);
  const { data: partnerProfile } = useDoc(partnerRef);

  const matchInfo = useMemo(() => {
    const idNum = parseInt(String(matchId).split('-')[1]) || 0;
    const img = PlaceHolderImages.filter(img => img.id.startsWith('user-'))[idNum % 4];
    return {
      name: partnerProfile?.displayName || ['Alex', 'Jordan', 'Taylor', 'Casey'][idNum % 4],
      photoUrl: partnerProfile?.photoUrl || img?.imageUrl,
      interests: partnerProfile?.interests || ['Hiking', 'Coffee', 'Music', 'Travel']
    };
  }, [matchId, partnerProfile]);

  const messagesQuery = useMemoFirebase(() => {
    if (!db || !matchId) return null;
    return query(
      collection(db, 'matches', String(matchId), 'messages'),
      orderBy('timestamp', 'asc')
    );
  }, [db, matchId]);

  const { data: messages, loading } = useCollection(messagesQuery);

  useEffect(() => {
    const decryptAll = async () => {
      if (!messages || !user) return;
      const privKey = localStorage.getItem(`spark_priv_${user.uid}`);
      if (!privKey) return;

      const newDecrypted: Record<string, string> = { ...decryptedMessages };
      let changed = false;

      for (const msg of messages as any[]) {
        if (msg.encryptedText && !newDecrypted[msg.id]) {
          const decrypted = await decryptText(msg.encryptedText, privKey);
          newDecrypted[msg.id] = decrypted;
          changed = true;
        }
      }

      if (changed) setDecryptedMessages(newDecrypted);
    };

    decryptAll();
  }, [messages, user]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !user || !db || !matchId || isSending) return;

    setIsSending(true);
    try {
      const moderation = await moderateText({ text: newMessage });
      
      if (moderation.isFlagged) {
        toast({
          variant: "destructive",
          title: "Community Guidelines",
          description: "Your message violates our mandatory respect & love policy. ✨"
        });
        setIsSending(false);
        return;
      }

      const partnerPubKey = partnerProfile?.publicKey;

      let encryptedText = null;
      if (partnerPubKey) {
        encryptedText = await encryptText(newMessage, partnerPubKey);
      }

      addDoc(collection(db, 'matches', String(matchId), 'messages'), {
        senderId: user.uid,
        text: partnerPubKey ? "[Encrypted Content]" : newMessage,
        encryptedText: encryptedText,
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
        const moderation = await moderateImage({ photoDataUri: dataUri });
        
        addDoc(collection(db, 'matches', String(matchId), 'messages'), {
          senderId: user.uid,
          imageUrl: dataUri,
          isSensitive: moderation.isSensitive,
          timestamp: serverTimestamp(),
        });
        
        toast({
          title: "Image Sent",
          description: moderation.isSensitive ? "Protected sensitive content sent." : "Moment shared successfully."
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

  const handleReport = async () => {
    if (!user || !db || !partnerId) return;
    setIsReporting(true);
    try {
      await addDoc(collection(db, 'reports'), {
        reporterId: user.uid,
        reportedId: partnerId,
        matchId: matchId,
        timestamp: serverTimestamp(),
        reason: "Violation of Respect & Love Mandatory Rule"
      });
      toast({
        title: "Report Received",
        description: "Admins will review the immutable chat logs for violations. ✨"
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not file report." });
    } finally {
      setIsReporting(false);
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

  const isDatingMatch = matchData?.type === 'date';
  const partnerExactLoc = partnerProfile?.exactLocation;

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center gap-4 px-4 h-16 border-b shrink-0" role="banner">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back to matches list">
          <ChevronLeft className="w-6 h-6" aria-hidden="true" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={matchInfo.photoUrl} className="object-cover" alt="" />
          <AvatarFallback>{matchInfo.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <h2 className="font-bold flex items-center gap-1">
            {matchInfo.name}
            <Lock className="w-3 h-3 text-green-500" aria-label="Encrypted conversation" />
          </h2>
          <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Verified Private Channel</p>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleIcebreaker}
            disabled={isGenerating}
            className="text-primary gap-1"
            aria-label="Generate AI icebreaker message"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" aria-hidden="true" />}
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" aria-label="Report disrespectful behavior">
                <Flag className="w-4 h-4" aria-hidden="true" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2rem]">
              <AlertDialogHeader>
                <AlertDialogTitle>Report Disrespectful Behavior?</AlertDialogTitle>
                <AlertDialogDescription>
                  In this community, Respect & Love is mandatory. Flagging this user will send the immutable chat logs to administrators for review.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReport} className="bg-destructive text-white rounded-xl">
                  {isReporting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Report Violation"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <div className="bg-slate-50 border-b px-4 py-2 flex items-center justify-center gap-4 overflow-x-auto no-scrollbar" role="note" aria-label="Chat security information">
         <div className="flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-3 h-3 text-slate-400" aria-hidden="true" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap">Permanent Records Enabled</span>
         </div>
         <div className="flex items-center gap-1.5 shrink-0 bg-white/50 px-2 py-0.5 rounded-full border">
            <Cake className="w-3 h-3 text-pink-500" aria-hidden="true" />
            <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">Birthday Moments</span>
         </div>
         <div className="flex items-center gap-1.5 shrink-0 bg-white/50 px-2 py-0.5 rounded-full border">
            <TreePine className="w-3 h-3 text-green-600" aria-hidden="true" />
            <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">Holiday Traditions</span>
         </div>
         <div className="flex items-center gap-1.5 shrink-0 bg-white/50 px-2 py-0.5 rounded-full border">
            <BookOpen className="w-3 h-3 text-blue-500" aria-hidden="true" />
            <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">Teachable Pics</span>
         </div>
      </div>

      {isDatingMatch && (
        <div className="bg-red-50 border-b border-red-100 p-3 flex items-center justify-between" role="complementary" aria-label="Partner exact location data">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500 animate-pulse" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-black text-red-700 uppercase tracking-widest leading-none">Verified Exact Place</p>
              <p className="text-[8px] text-red-500 uppercase tracking-tighter mt-0.5">Anti-Cheating Protection Active</p>
            </div>
          </div>
          {partnerExactLoc ? (
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-mono font-bold text-red-800">
                {partnerExactLoc.latitude.toFixed(4)}, {partnerExactLoc.longitude.toFixed(4)}
              </p>
              <Button size="icon" variant="ghost" className="h-6 w-6 text-red-600" onClick={() => window.open(`https://www.google.com/maps?q=${partnerExactLoc.latitude},${partnerExactLoc.longitude}`)} aria-label="View exact location on Google Maps">
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <p className="text-[8px] text-red-400 font-bold uppercase">GPS Validating...</p>
          )}
        </div>
      )}

      <main ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/10" role="main" aria-label="Chat messages history">
        <div className="flex justify-center mb-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1.5 py-1 px-3 rounded-full text-[10px] uppercase font-bold tracking-wider">
            <Lock className="w-3 h-3" aria-hidden="true" />
            Immutable Vault Active
          </Badge>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" aria-label="Loading messages" />
          </div>
        ) : (
          messages?.map((msg: any, i) => {
            const isMe = msg.senderId === user?.uid;
            const isSensitive = msg.isSensitive;
            const blurContent = isSensitive && !myProfile?.settings?.allowSensitiveContent;
            const textToShow = msg.encryptedText ? (decryptedMessages[msg.id] || "Decrypting...") : msg.text;

            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-[1.5rem] text-sm ${
                    isMe 
                      ? 'bg-primary text-white rounded-tr-none shadow-md' 
                      : 'bg-white text-foreground rounded-tl-none border shadow-sm'
                  }`}
                  aria-label={`${isMe ? 'My message' : 'Message from ' + matchInfo.name} sent at ${msg.timestamp?.toDate().toLocaleTimeString()}`}
                >
                  {msg.imageUrl ? (
                    <div className="relative w-48 h-64 overflow-hidden rounded-xl bg-muted group">
                      {blurContent ? (
                        <div className="w-full h-full bg-slate-900/90 flex flex-col items-center justify-center text-center p-4 gap-2">
                          <EyeOff className="w-8 h-8 text-white/50" aria-hidden="true" />
                          <p className="text-[10px] font-bold text-white/70 uppercase">Protected Content</p>
                          <p className="text-[8px] text-white/40">Enable "Safety Guard" in profile to view</p>
                        </div>
                      ) : (
                        <Image 
                          src={msg.imageUrl} 
                          alt="Shared moment in chat" 
                          fill 
                          className={cn("object-cover transition-all", isSensitive && "blur-xl hover:blur-none")}
                        />
                      )}
                      {isSensitive && !blurContent && (
                        <div className="absolute top-2 right-2">
                           <Badge className="bg-amber-500/80 backdrop-blur-sm text-[8px] border-none">Sensitive</Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span>{textToShow}</span>
                      {msg.encryptedText && (
                        <span className="text-[8px] opacity-40 uppercase font-black tracking-widest text-right">E2EE SECURE</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      <footer className="p-4 border-t pb-8 bg-white" role="contentinfo">
        <div className="flex items-center gap-2 mb-2">
          <input 
            type="file" 
            id="chat-photo-input"
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload}
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full shrink-0 border-muted h-12 w-12"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            aria-label="Upload and share a moment"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-5 h-5 text-muted-foreground" aria-hidden="true" />}
          </Button>
          <form onSubmit={handleSendMessage} className="flex-grow flex gap-2">
            <Input 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Immutable encrypted message..."
              className="rounded-full bg-muted/30 border-none focus-visible:ring-primary h-12 px-6"
              disabled={isSending}
              aria-label="Message text"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full h-12 w-12 gradient-bg shrink-0 shadow-lg"
              disabled={!newMessage.trim() || isSending}
              aria-label="Send message"
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Send className="w-5 h-5 text-white" aria-hidden="true" />}
            </Button>
          </form>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <ShieldCheck className="w-3 h-3 text-green-500" aria-hidden="true" />
          <p className="text-[8px] text-center text-muted-foreground uppercase font-bold tracking-widest">
            Respect Mandatory: Messages are immutable and logged for community safety
          </p>
        </div>
      </footer>
    </div>
  );
}

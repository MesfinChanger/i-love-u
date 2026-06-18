
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
  Flag,
  Info
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CHAT_SHORTCUTS = [
  { id: 'teachable', label: 'Teachable Pic', icon: BookOpen, description: 'Share a skill or a piece of your culture.' },
  { id: 'holiday', label: 'Holiday Tradition', icon: TreePine, description: 'Show how your family celebrates holidays.' },
  { id: 'birthday', label: 'Birthday Moment', icon: Cake, description: 'Share a happy birthday memory.' }
];

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
          title: "Respect Mandatory Rule",
          description: "This message was blocked by AI for violating our Mandatory Respect & Love policy. ✨"
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, contextLabel?: string) => {
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
          contextLabel: contextLabel || null,
          timestamp: serverTimestamp(),
        });
        
        toast({
          title: contextLabel ? `Shared: ${contextLabel}` : "Image Sent",
          description: moderation.isSensitive ? "Sensitive content protected." : "Moment shared successfully."
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
        reason: "Violation of Mandatory Respect & Love"
      });
      toast({
        title: "Report Received",
        description: "Admin reviews are based on immutable logs. Thank you for keeping the community safe. ✨"
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
      <header className="flex items-center gap-4 px-4 h-16 border-b shrink-0 bg-white/80 backdrop-blur-md z-10" role="banner">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back to matches list">
          <ChevronLeft className="w-6 h-6" aria-hidden="true" />
        </Button>
        <Avatar className="w-10 h-10 border border-primary/10">
          <AvatarImage src={matchInfo.photoUrl} className="object-cover" alt="" />
          <AvatarFallback>{matchInfo.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-grow min-w-0">
          <h2 className="font-black text-sm tracking-tight flex items-center gap-1.5 truncate">
            {matchInfo.name}
            <Lock className="w-3 h-3 text-green-500" aria-label="E2EE Active" />
          </h2>
          <p className="text-[9px] text-green-500 font-black uppercase tracking-widest leading-none">Private Channel</p>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleIcebreaker}
            disabled={isGenerating}
            className="text-primary gap-1 font-bold text-xs"
            aria-label="Generate AI icebreaker message"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" aria-hidden="true" />}
            AI
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" aria-label="Report violation">
                <Flag className="w-4 h-4" aria-hidden="true" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black tracking-tighter">Report Unloving Behavior?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground leading-relaxed">
                  In our community, Respect & Love is mandatory. Flagging this user will send the immutable, encrypted chat history to administrators for a human review.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReport} className="bg-destructive text-white rounded-xl shadow-lg shadow-destructive/20">
                  {isReporting ? <Loader2 className="w-4 h-4 animate-spin" /> : "File Safety Report"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {isDatingMatch && (
        <div className="bg-red-50 border-b border-red-100 p-3 flex items-center justify-between animate-in slide-in-from-top duration-500" role="complementary" aria-label="Accountability GPS Active">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-red-100">
               <MapPin className="w-4 h-4 text-red-500 animate-pulse" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-black text-red-700 uppercase tracking-widest leading-none">GPS Accountability</p>
              <p className="text-[8px] text-red-500 uppercase tracking-tighter mt-0.5">Visible to you only during match</p>
            </div>
          </div>
          {partnerExactLoc ? (
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-mono font-bold text-red-800 bg-white/50 px-2 py-0.5 rounded border border-red-100">
                {partnerExactLoc.latitude.toFixed(4)}, {partnerExactLoc.longitude.toFixed(4)}
              </p>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-100" onClick={() => window.open(`https://www.google.com/maps?q=${partnerExactLoc.latitude},${partnerExactLoc.longitude}`)} aria-label="Open Map">
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
               <Loader2 className="w-3 h-3 animate-spin text-red-300" />
               <span className="text-[8px] text-red-400 font-bold uppercase">Pinpointing...</span>
            </div>
          )}
        </div>
      )}

      <main ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/10 relative" role="main" aria-label="Conversation history">
        <div className="flex flex-col items-center gap-4 py-6">
           <Badge variant="outline" className="bg-white/50 backdrop-blur-sm text-green-700 border-green-100 gap-1.5 py-1.5 px-4 rounded-full text-[10px] uppercase font-black tracking-widest shadow-sm">
             <ShieldCheck className="w-3 h-3" aria-hidden="true" />
             Immutable Security Active
           </Badge>
           <p className="text-[9px] text-center text-muted-foreground/60 max-w-[200px] uppercase font-bold tracking-tighter">
             Messages are encrypted and permanently stored for community safety and legal compliance.
           </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" aria-label="Loading messages" />
          </div>
        ) : (
          messages?.map((msg: any, i) => {
            const isMe = msg.senderId === user?.uid;
            const isSensitive = msg.isSensitive;
            const filterActive = !myProfile?.settings?.allowSensitiveContent;
            const blurContent = isSensitive && filterActive;
            const textToShow = msg.encryptedText ? (decryptedMessages[msg.id] || "...") : msg.text;

            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
                <div 
                  className={`max-w-[85%] px-4 py-3 rounded-[1.75rem] text-sm leading-relaxed ${
                    isMe 
                      ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' 
                      : 'bg-white text-foreground rounded-tl-none border shadow-sm'
                  }`}
                  aria-label={`${isMe ? 'My message' : matchInfo.name + "'s message"} at ${msg.timestamp?.toDate().toLocaleTimeString()}`}
                >
                  {msg.imageUrl ? (
                    <div className="flex flex-col gap-2">
                       {msg.contextLabel && (
                         <div className={`text-[8px] uppercase font-black tracking-widest mb-1 ${isMe ? 'text-white/60' : 'text-primary'}`}>
                           {msg.contextLabel}
                         </div>
                       )}
                       <div className="relative w-56 h-72 overflow-hidden rounded-2xl bg-muted group shadow-inner">
                        {blurContent ? (
                          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-center p-6 gap-3">
                            <EyeOff className="w-10 h-10 text-white/20" aria-hidden="true" />
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Safety Guard Active</p>
                               <p className="text-[8px] text-white/30 leading-tight">This image was flagged by AI. Change "Safety Guard" in Profile to view.</p>
                            </div>
                          </div>
                        ) : (
                          <Image 
                            src={msg.imageUrl} 
                            alt="Shared cultural moment" 
                            fill 
                            className={cn("object-cover transition-all duration-700", isSensitive && "blur-2xl hover:blur-none")}
                          />
                        )}
                        {isSensitive && !blurContent && (
                          <div className="absolute top-3 right-3">
                             <Badge className="bg-amber-500/90 backdrop-blur-md text-[8px] font-black border-none text-white uppercase tracking-widest">Sensitive</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <span className="font-medium">{textToShow}</span>
                      {msg.encryptedText && (
                        <div className="flex items-center justify-end gap-1 opacity-40">
                           <Lock className="w-2.5 h-2.5" />
                           <span className="text-[7px] uppercase font-black tracking-widest">E2EE VAULT</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      <footer className="p-4 border-t pb-8 bg-white z-10" role="contentinfo">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-1" aria-label="Cultural exchange shortcuts">
           <TooltipProvider>
             {CHAT_SHORTCUTS.map((shortcut) => (
               <Tooltip key={shortcut.id}>
                 <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full shrink-0 h-9 gap-1.5 border-primary/10 text-primary hover:bg-primary/5 hover:border-primary/30 transition-all font-bold text-xs"
                    >
                      <shortcut.icon className="w-3.5 h-3.5" />
                      {shortcut.label}
                    </Button>
                 </TooltipTrigger>
                 <TooltipContent className="rounded-xl border-none bg-primary text-white shadow-xl">
                   <p className="text-xs font-bold">{shortcut.description}</p>
                 </TooltipContent>
               </Tooltip>
             ))}
           </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="file" 
            id="chat-photo-input"
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={(e) => handleImageUpload(e)}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full shrink-0 bg-muted/30 h-12 w-12 text-muted-foreground hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            aria-label="Upload photo"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-6 h-6" aria-hidden="true" />}
          </Button>
          <form onSubmit={handleSendMessage} className="flex-grow flex gap-2">
            <Input 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Respectful message..."
              className="rounded-full bg-muted/40 border-none focus-visible:ring-2 focus-visible:ring-primary h-12 px-6 font-medium placeholder:text-muted-foreground/50"
              disabled={isSending}
              aria-label="Write message"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full h-12 w-12 gradient-bg shrink-0 shadow-xl shadow-primary/20 active:scale-90 transition-transform"
              disabled={!newMessage.trim() || isSending}
              aria-label="Send"
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Send className="w-5 h-5 text-white" aria-hidden="true" />}
            </Button>
          </form>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3 opacity-60">
           <ShieldCheck className="w-2.5 h-2.5 text-green-600" aria-hidden="true" />
           <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
             Respect Mandatory • End-to-End Encrypted
           </p>
        </div>
      </footer>
    </div>
  );
}


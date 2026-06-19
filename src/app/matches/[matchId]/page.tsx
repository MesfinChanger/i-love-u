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
  EyeOff, 
  Lock, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  Cake, 
  TreePine, 
  BookOpen,
  Users,
  HeartOff,
  Heart,
  Star
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, doc, updateDoc, writeBatch } from 'firebase/firestore';
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
  const [isUnconnecting, setIsUnconnecting] = useState(false);
  const [isInvitingWitness, setIsInvitingWitness] = useState(false);
  const [witnessUid, setWitnessUid] = useState('');
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
    const idParts = String(matchId).split('_');
    const idNum = idParts.length > 1 ? parseInt(idParts[1].substring(0, 5), 36) || 0 : 0;
    const userImages = PlaceHolderImages.filter(img => img.id.startsWith('user-'));
    const img = userImages[idNum % userImages.length] || userImages[0];
    
    return {
      name: partnerProfile?.displayName || "Mystery Heart",
      photoUrl: partnerProfile?.photoUrl || img?.imageUrl,
      interests: partnerProfile?.interests || ['Happiness', 'Respect', 'Love']
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

  const handleUnconnect = async () => {
    if (!user || !db || !matchId) return;
    setIsUnconnecting(true);
    try {
      const batch = writeBatch(db);
      
      batch.update(doc(db, 'matches', String(matchId)), {
        status: 'unmatched',
        unmatchedAt: serverTimestamp(),
        unmatchedBy: user.uid
      });

      if (matchData?.type === 'date') {
        matchData.userIds.forEach((uid: string) => {
          batch.update(doc(db, 'users', uid), {
            relationshipStatus: 'single',
            partnerId: null
          });
        });
      }

      await batch.commit();
      
      toast({
        title: "Unconnected",
        description: "Your connection has been ended respectfully."
      });
      router.push('/matches');
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not unconnect." });
    } finally {
      setIsUnconnecting(false);
    }
  };

  const handleInviteWitness = async () => {
    if (!user || !db || !matchId || !witnessUid) return;
    setIsInvitingWitness(true);
    try {
      await updateDoc(doc(db, 'matches', String(matchId)), {
        witnessId: witnessUid,
        witnessStatus: 'pending'
      });
      toast({
        title: "Witness Invited",
        description: "A trusted third party has been invited to vouch for your relationship! ✨"
      });
      setWitnessUid('');
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not invite witness." });
    } finally {
      setIsInvitingWitness(false);
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
  const isWitnessed = matchData?.witnessStatus === 'confirmed';

  return (
    <div className={cn("flex flex-col h-screen", isDatingMatch ? "bg-accent/30" : "bg-white")}>
      <header className="flex items-center gap-4 px-4 h-20 border-b shrink-0 bg-white/80 backdrop-blur-md z-20 shadow-sm" role="banner">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back to matches list" className="rounded-full">
          <ChevronLeft className="w-6 h-6" aria-hidden="true" />
        </Button>
        
        <div className="relative">
          <Avatar className="w-12 h-12 border-2 border-primary/20 shadow-lg">
            <AvatarImage src={matchInfo.photoUrl} className="object-cover" alt="" />
            <AvatarFallback>{matchInfo.name[0]}</AvatarFallback>
          </Avatar>
          {isDatingMatch && (
            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-white animate-pulse">
               <Heart className="w-3 h-3 fill-white" />
            </div>
          )}
        </div>

        <div className="flex-grow min-w-0">
          <h2 className="font-black text-base tracking-tight flex items-center gap-1.5 truncate">
            {matchInfo.name}
            {isWitnessed && <ShieldCheck className="w-3.5 h-3.5 text-primary" aria-label="Witnessed" />}
            <Lock className="w-3 h-3 text-green-500/50" aria-label="E2EE Active" />
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">
              {isDatingMatch ? "Spark Room Active" : "Friendship Circle"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isDatingMatch && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5 rounded-full" aria-label="Invite Witness">
                  <Users className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[3rem] border-none shadow-2xl p-8">
                <AlertDialogHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <AlertDialogTitle className="text-3xl font-black tracking-tighter">Invite Success Witness</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground text-base italic leading-relaxed">
                    "Happy relationships build global prosperity." Invite a trusted third party to vouch for your respectful and loving Spark.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-6 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="witness-id" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Witness User ID</label>
                    <Input 
                      id="witness-id"
                      placeholder="e.g. gHZ9n7s..." 
                      value={witnessUid} 
                      onChange={e => setWitnessUid(e.target.value)}
                      className="rounded-2xl h-14 bg-muted/30 border-none px-6 text-lg font-bold"
                    />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-dashed text-[10px] text-muted-foreground font-medium text-center uppercase tracking-wider">
                    Witnesses can view match status to confirm accountability and success.
                  </div>
                </div>
                <AlertDialogFooter className="flex-col gap-3">
                  <AlertDialogAction onClick={handleInviteWitness} disabled={!witnessUid || isInvitingWitness} className="w-full h-14 rounded-2xl gradient-bg font-black text-lg shadow-xl shadow-primary/20">
                    {isInvitingWitness ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Send Invitation"}
                  </AlertDialogAction>
                  <AlertDialogCancel className="w-full h-14 rounded-2xl border-none font-bold text-muted-foreground">Maybe Later</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleIcebreaker}
            disabled={isGenerating}
            className="text-primary gap-1.5 font-black text-[10px] uppercase tracking-widest h-10 px-4 bg-primary/5 rounded-full"
            aria-label="Generate AI icebreaker message"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" aria-hidden="true" />}
            AI Spark
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full" aria-label="Unconnect">
                <HeartOff className="w-5 h-5" aria-hidden="true" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[3rem] p-10 border-none shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-3xl font-black tracking-tighter">End this Journey?</AlertDialogTitle>
                <AlertDialogDescription className="text-lg leading-relaxed italic">
                  Stopping this connection is final. You can always start a new journey with someone else in a respectful manner.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-8 flex-col sm:flex-row gap-4">
                <AlertDialogCancel className="rounded-2xl h-14 font-bold flex-1 border-none bg-muted/50">Keep Connecting</AlertDialogCancel>
                <AlertDialogAction onClick={handleUnconnect} className="gradient-bg rounded-2xl h-14 font-black text-lg flex-1 shadow-xl shadow-primary/20">
                  {isUnconnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Unconnect Now"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {isDatingMatch && (
        <div className="bg-red-50/80 backdrop-blur-sm border-b border-red-100 p-4 flex items-center justify-between z-10" role="complementary" aria-label="Accountability GPS Active">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-red-100">
               <MapPin className="w-5 h-5 text-red-500 animate-pulse" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-black text-red-700 uppercase tracking-widest leading-none">GPS Accountability</p>
              <p className="text-[9px] text-red-500 uppercase tracking-tighter mt-1 font-bold">Safety Guard Active</p>
            </div>
          </div>
          {partnerExactLoc ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-mono font-black text-red-800 bg-white/50 px-3 py-1 rounded-full border border-red-100">
                  {partnerExactLoc.latitude.toFixed(4)}, {partnerExactLoc.longitude.toFixed(4)}
                </p>
              </div>
              <Button size="icon" variant="ghost" className="h-10 w-10 text-red-600 hover:bg-red-100 rounded-full bg-white shadow-sm" onClick={() => window.open(`https://www.google.com/maps?q=${partnerExactLoc.latitude},${partnerExactLoc.longitude}`)} aria-label="Open Map">
                <ExternalLink className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full">
               <Loader2 className="w-3 h-3 animate-spin text-red-300" />
               <span className="text-[9px] text-red-400 font-black uppercase tracking-widest">Pinpointing Partner...</span>
            </div>
          )}
        </div>
      )}

      <main ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 relative" role="main" aria-label="Conversation history">
        <div className="flex flex-col items-center gap-4 py-10 opacity-40">
           <div className="relative">
             <ShieldCheck className="w-16 h-16 text-primary fill-primary/5" aria-hidden="true" />
             <Lock className="absolute bottom-0 right-0 w-6 h-6 text-green-500 bg-white rounded-full p-1 border shadow-sm" />
           </div>
           <div className="text-center space-y-1">
             <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Sacred Space</p>
             <p className="text-[10px] font-bold text-muted-foreground max-w-[240px] uppercase leading-relaxed tracking-tighter">
               E2EE Encrypted & Immutable Logs <br/> for Community Safety.
             </p>
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" aria-label="Loading messages" />
          </div>
        ) : (
          messages?.map((msg: any, i) => {
            const isMe = msg.senderId === user?.uid;
            const isSensitive = msg.isSensitive;
            const filterActive = !myProfile?.settings?.allowSensitiveContent;
            const blurContent = isSensitive && filterActive;
            const textToShow = msg.encryptedText ? (decryptedMessages[msg.id] || "...") : msg.text;

            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                <div 
                  className={cn(
                    "max-w-[85%] px-5 py-4 rounded-[2.2rem] text-sm leading-relaxed shadow-sm transition-all",
                    isMe 
                      ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' 
                      : 'bg-white text-foreground rounded-tl-none border border-primary/5 shadow-sm'
                  )}
                >
                  {msg.imageUrl ? (
                    <div className="flex flex-col gap-3">
                       {msg.contextLabel && (
                         <div className={cn("text-[9px] uppercase font-black tracking-widest flex items-center gap-1.5", isMe ? "text-white/60" : "text-primary")}>
                           <Star className="w-3 h-3 fill-current" />
                           {msg.contextLabel}
                         </div>
                       )}
                       <div className="relative w-64 h-80 overflow-hidden rounded-[1.8rem] bg-muted group shadow-inner">
                        {blurContent ? (
                          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-center p-8 gap-4">
                            <EyeOff className="w-12 h-12 text-white/20" aria-hidden="true" />
                            <div className="space-y-2">
                               <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">Safety Guard Active</p>
                               <p className="text-[9px] text-white/30 leading-relaxed font-medium uppercase">Flagged by AI. Change in Profile to view.</p>
                            </div>
                          </div>
                        ) : (
                          <Image 
                            src={msg.imageUrl} 
                            alt="Shared cultural moment" 
                            fill 
                            className={cn("object-cover transition-all duration-1000", isSensitive && "blur-3xl hover:blur-none")}
                          />
                        )}
                        {isSensitive && !blurContent && (
                          <div className="absolute top-4 right-4">
                             <Badge className="bg-amber-500/90 backdrop-blur-md text-[9px] font-black border-none text-white uppercase tracking-widest px-3 h-6">Sensitive</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-base tracking-tight">{textToShow}</span>
                      <div className={cn("flex items-center gap-1.5 opacity-40 justify-end mt-1", isMe ? "text-white" : "text-primary")}>
                         <Lock className="w-3 h-3" />
                         <span className="text-[8px] uppercase font-black tracking-widest">E2EE Secured</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      <footer className="p-6 border-t pb-10 bg-white/80 backdrop-blur-xl z-20" role="contentinfo">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-2" aria-label="Cultural exchange shortcuts">
           <TooltipProvider>
             {CHAT_SHORTCUTS.map((shortcut) => (
               <Tooltip key={shortcut.id}>
                 <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full shrink-0 h-11 gap-2.5 border-primary/10 text-primary hover:bg-primary/5 hover:border-primary/30 transition-all font-black text-[10px] uppercase tracking-widest px-5 shadow-sm"
                    >
                      <shortcut.icon className="w-4 h-4" />
                      {shortcut.label}
                    </Button>
                 </TooltipTrigger>
                 <TooltipContent className="rounded-2xl border-none bg-primary text-white shadow-2xl p-4">
                   <p className="text-xs font-black uppercase tracking-widest">{shortcut.description}</p>
                 </TooltipContent>
               </Tooltip>
             ))}
           </TooltipProvider>
        </div>

        <div className="flex items-center gap-3">
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
            className="rounded-2xl shrink-0 bg-muted/40 h-14 w-14 text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all shadow-inner"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            aria-label="Upload photo"
          >
            {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-7 h-7" aria-hidden="true" />}
          </Button>
          <form onSubmit={handleSendMessage} className="flex-grow flex gap-3">
            <Input 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Respectful message..."
              className="rounded-[1.8rem] bg-muted/40 border-none focus-visible:ring-2 focus-visible:ring-primary h-14 px-8 font-bold text-lg placeholder:text-muted-foreground/40 shadow-inner"
              disabled={isSending}
              aria-label="Write message"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-2xl h-14 w-14 gradient-bg shrink-0 shadow-xl shadow-primary/30 active:scale-90 transition-transform"
              disabled={!newMessage.trim() || isSending}
              aria-label="Send"
            >
              {isSending ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Send className="w-6 h-6 text-white" aria-hidden="true" />}
            </Button>
          </form>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-5">
           <div className="flex items-center gap-1.5 opacity-50">
             <ShieldCheck className="w-3 h-3 text-green-600" aria-hidden="true" />
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
               Happiness is Mandatory ❤️ End-to-End Encrypted
             </p>
           </div>
        </div>
      </footer>
    </div>
  );
}

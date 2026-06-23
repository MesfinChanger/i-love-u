
'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Globe2, 
  Send, 
  Loader2, 
  ShieldCheck, 
  ImageIcon, 
  X 
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useDoc, useFirebaseStorage } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, limit, doc } from 'firebase/firestore';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Progress } from "@/components/ui/progress";
import { compressImage } from '@/lib/image-utils';
import { cn } from '@/lib/utils';
import Image from 'next/image';

/**
 * @fileOverview Accessible Community Wall.
 * Enforces "Respect is Mandatory" and provides high-impact feedback.
 * Hardened error handling for Storage and AI ripples.
 */
export default function CommunityPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { uploadFile, isUploading, progress } = useFirebaseStorage();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ file: File; url: string } | null>(null);

  const userRef = useMemoFirebase(() => db && user ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: myProfile } = useDoc(userRef);

  const communityQuery = useMemoFirebase(() => db ? query(collection(db, 'communityMessages'), orderBy('timestamp', 'asc'), limit(100)) : null, [db]);
  const { data: messages, loading } = useCollection(communityQuery);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !user || !db || isSending) return;
    setIsSending(true);
    try {
      const moderation = await moderateText({ text: newMessage });
      if (moderation.isFlagged) {
        toast({
          variant: "destructive",
          title: "Respect Policy Ripple",
          description: moderation.reason || "Your message violates the mandatory respect rule. ❤️"
        });
        setIsSending(false);
        return;
      }

      let imageUrl = null;
      if (selectedImage) {
        const compressed = await compressImage(selectedImage.file, 0.65);
        imageUrl = await uploadFile(`community/${Date.now()}_${compressed.name}`, compressed);
      }
      
      await addDoc(collection(db, 'communityMessages'), {
        senderId: user.uid,
        senderNickname: myProfile?.publicNickname || "Mystery Heart",
        text: newMessage,
        imageUrl,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
      setSelectedImage(null);
      toast({ title: "Shared!", description: "Your post is live on the wall. ❤️" });
    } catch (error: any) {
      if (error.code === 'storage/unknown' || error.message?.includes('storage')) {
        toast({ 
          variant: "destructive", 
          title: "Storage Configuration Ripple", 
          description: "Firebase Storage needs setup. Check Rules & CORS in console. 🛠️",
          action: <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase" onClick={() => window.open('https://console.firebase.google.com/')}>Open Console</Button>
        });
      } else if (error.message?.includes('API key') || error.message?.includes('400')) {
        toast({ 
          variant: "destructive", 
          title: "AI Bridge Offline", 
          description: "Mission Control is waiting for your GenAI credentials. ❤️" 
        });
      } else {
        toast({ 
          variant: "destructive", 
          title: "Sharing Ripple", 
          description: error.message || "Could not secure post right now." 
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage({ file, url });
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-muted/30 overflow-hidden">
      <Header />
      <div className="bg-primary/5 border-b p-2 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-primary animate-pulse" />
        <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">Respect is Mandatory • Global Moderation Active</p>
      </div>

      <main 
        ref={scrollRef} 
        className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar"
        role="log"
        aria-label="Community conversation wall"
      >
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary opacity-20" aria-label="Loading messages" /></div>
        ) : messages?.map((msg: any) => (
          <div key={msg.id} className={cn("flex flex-col gap-1", msg.senderId === user?.uid ? "items-end" : "items-start")}>
            <span className="text-[8px] font-black uppercase text-muted-foreground px-2">{msg.senderNickname}</span>
            <div className={cn("max-w-[85%] px-4 py-3 rounded-[1.5rem] shadow-sm", msg.senderId === user?.uid ? "bg-primary text-white" : "bg-white border text-slate-800")}>
              {msg.imageUrl && (
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
                  <Image src={msg.imageUrl} alt="Community share" fill className="object-cover" />
                </div>
              )}
              <p className="text-sm font-medium">{msg.text}</p>
            </div>
          </div>
        ))}
      </main>

      <footer className="p-4 bg-white/80 backdrop-blur-xl border-t pb-24 shrink-0 space-y-3">
        {isUploading && (
          <div className="space-y-1" role="status" aria-label={`Uploading media: ${Math.round(progress)}%`}>
            <Progress value={progress} className="h-1" />
            <p className="text-[8px] font-black uppercase text-primary">Securing Media {Math.round(progress)}%</p>
          </div>
        )}
        
        {selectedImage && (
          <div className="flex items-center gap-3 p-2 bg-muted/40 rounded-xl animate-in zoom-in-95">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
               <Image src={selectedImage.url} alt="Selected" fill className="object-cover" />
            </div>
            <p className="text-[10px] font-bold truncate flex-grow">{selectedImage.file.name}</p>
            <Button variant="ghost" size="icon" onClick={() => setSelectedImage(null)} className="rounded-full h-8 w-8 hover:bg-red-50 hover:text-red-500" aria-label="Remove selected image">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input 
            type="file" 
            ref={galleryRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
            id="community-image-upload"
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={() => galleryRef.current?.click()} 
            className="rounded-xl h-12 w-12 bg-muted/40 text-muted-foreground"
            aria-label="Attach Photo"
          >
            <ImageIcon className="w-6 h-6" />
          </Button>
          <Input 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)} 
            placeholder="Share a respectful thought..." 
            className="rounded-2xl border-none bg-muted/40 h-12 font-bold"
            aria-label="Message text"
          />
          <Button 
            type="submit" 
            disabled={isSending || (!newMessage.trim() && !selectedImage)} 
            className="rounded-xl h-12 gradient-bg shadow-lg px-6"
            aria-label="Post to wall"
          >
            {isSending ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </footer>
      <BottomNav />
    </div>
  );
}

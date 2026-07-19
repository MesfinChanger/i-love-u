'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Sparkles, 
  MapPin, 
  Loader2, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  Clock,
  ShieldX
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/Card';
import { BottomNav } from '@/components/BottomNav';
import { useUser, db } from '@/firebase';
import { doc, setDoc, collection, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useDoc, useCollection } from '@/firebase';
import Link from 'next/link';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

/**
 * @fileOverview Discovery Hub featuring the Presence Grid Protocol.
 * Balanced heading sizes for professional interaction.
 */
export default function DiscoverPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [mounted, setMounted] = useState(false);
  const [isLiveExpanded, setIsLiveExpanded] = useState(true);
  const [isOfflineExpanded, setIsOfflineExpanded] = useState(true);
  const [presenceOverrides, setPresenceShimmer] = useState<Record<string, { isOnline: boolean, lastActive: string }>>({});
  const [blockedUids, setBlockedUids] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [user?.uid]);
  const { data: myProfile } = useDoc(userRef);

  useEffect(() => {
    if (!db || !user?.uid) return;
    const q = query(collection(db, 'relationships'), where('status', '==', 'blocked'));
    const unsub = onSnapshot(q, (snap) => {
      const uids = new Set<string>();
      snap.docs.forEach(doc => {
        const data = doc.data();
        if (data.userA === user.uid) uids.add(data.userB);
        if (data.userB === user.uid) uids.add(data.userA);
      });
      setBlockedUids(uids);
    }, async (err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'relationships', operation: 'list' }));
    });
    return () => unsub();
  }, [user?.uid]);

  const isCommercial = myProfile?.accountType === 'business';
  const hasAcceptedPolicy = myProfile?.policyAccepted === true;
  const isInteractionRestricted = isCommercial && !hasAcceptedPolicy;

  const discoveryQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'publicProfiles'));
  }, []);
  const { data: discoveryItems, loading: usersLoading } = useCollection(discoveryQuery);

  const { liveHearts, restingHearts } = useMemo(() => {
    const hasItems = mounted && discoveryItems && discoveryItems.length > 0;
    const allHearts = hasItems 
      ? (discoveryItems || [])
        .filter((u: any) => {
          const id = u.uid || u.id;
          return id !== user?.uid && !blockedUids.has(id);
        })
        .map((u: any) => {
          const id = u.uid || u.id;
          return {
            id, uid: id,
            name: u.username || u.displayName || "Mystery Heart", 
            age: u.age,
            photoURL: u.photoURL || null,
            videoURL: u.videoURL || null,
            bio: u.bio || "Respect Mandatory. ❤️",
            country: u.country || "Global",
            isOnline: u.isOnline ?? false,
            lastActive: u.lastActive || "Recently"
          };
        })
      : [];

    return {
      liveHearts: allHearts.filter((h: any) => h.isOnline),
      restingHearts: allHearts.filter((h: any) => !h.isOnline)
    };
  }, [discoveryItems, user?.uid, mounted, blockedUids]);

  const handleSparkAction = (targetId: string, type: 'friend' | 'date') => {
    if (!user) { window.dispatchEvent(new CustomEvent('open-auth-gate')); return; }
    if (isInteractionRestricted) { toast({ variant: "destructive", title: "Access Restricted", description: "Agreement required. ❤️" }); return; }
    
    const participants = [user.uid, targetId].sort();
    const docRef = doc(db, 'connections', participants.join('_'));
    const data = { fromUserId: user.uid, toUserId: targetId, status: "pending", type: type === 'date' ? 'spark' : 'friend', createdAt: serverTimestamp() };
    
    setDoc(docRef, data, { merge: true })
      .then(() => toast({ title: "Invitation Sent!", description: "Waiting for acceptance. ❤️" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'write', requestResourceData: data })));
  };

  if (!mounted || (usersLoading && db)) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-6 py-10 max-w-7xl space-y-10">
        <div className="space-y-1">
           <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h1 className="text-2xl font-bold tracking-tighter uppercase">Discover Hearts</h1>
           </div>
           <p className="text-muted-foreground text-xs italic">"Separated by presence, unified by respect."</p>
        </div>

        <Collapsible open={isLiveExpanded} onOpenChange={setIsLiveExpanded} className="space-y-4">
           <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between border-b pb-2 cursor-pointer hover:opacity-80">
                 <div className="flex items-center gap-3">
                    <Wifi className="w-4 h-4 text-green-600 animate-pulse" />
                    <h2 className="text-lg font-bold tracking-tight uppercase">Live Now</h2>
                 </div>
                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {isLiveExpanded ? <ChevronUp /> : <ChevronDown />}
                 </Button>
              </div>
           </CollapsibleTrigger>
           <CollapsibleContent className="animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {liveHearts.map((heart: any) => <DiscoverCard key={heart.id} item={heart} onAction={handleSparkAction} />)}
              </div>
           </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isOfflineExpanded} onOpenChange={setIsOfflineExpanded} className="space-y-4">
           <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between border-b pb-2 cursor-pointer hover:opacity-80">
                 <div className="flex items-center gap-3 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <h2 className="text-lg font-bold tracking-tight uppercase">Resting Hearts</h2>
                 </div>
                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {isOfflineExpanded ? <ChevronUp /> : <ChevronDown />}
                 </Button>
              </div>
           </CollapsibleTrigger>
           <CollapsibleContent className="animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {restingHearts.map((heart: any) => <DiscoverCard key={heart.id} item={heart} onAction={handleSparkAction} />)}
              </div>
           </CollapsibleContent>
        </Collapsible>
      </main>
      <BottomNav />
    </div>
  );
}

function DiscoverCard({ item, onAction }: any) {
  return (
    <Card className="group relative aspect-[3/4] overflow-hidden border-none shadow-md rounded-2xl bg-white transition-all hover:scale-[1.02]">
      {item.photoURL ? <img src={item.photoURL} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-primary/5 flex items-center justify-center"><Heart className="w-6 h-6 text-primary/10" /></div>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 space-y-2">
         <div className="leading-none">
            <h3 className="text-base font-bold text-white tracking-tight truncate">{item.name}</h3>
            <span className="text-[8px] font-bold text-white/60 uppercase">{item.country}</span>
         </div>
         <div className="flex gap-1.5 pt-1">
            <Button onClick={() => onAction(item.id, 'friend')} variant="outline" className="flex-1 h-8 rounded-lg bg-white/10 border-white/20 text-white font-bold uppercase text-[7px] tracking-widest">Invite</Button>
            <Button onClick={() => onAction(item.id, 'date')} className="flex-1 h-8 rounded-lg gradient-bg font-bold uppercase text-[7px] tracking-widest">Spark</Button>
         </div>
      </div>
    </Card>
  );
}

'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search as SearchIcon, 
  Loader2, 
  Send, 
  MapPin, 
  Users, 
  Ghost,
  ShieldCheck,
  Star,
  ImageIcon,
  ShieldX
} from 'lucide-react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { query, collection, doc, setDoc, serverTimestamp, limit, where, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useTranslation } from '@/components/providers/LanguageProvider';
import Image from 'next/image';

/**
 * @fileOverview Find Hearts module.
 */
function SearchContent() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [blockedUids, setBlockedUids] = useState<Set<string>>(new Set());

  useEffect(() => setMounted(true), []);

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
    });
    return () => unsub();
  }, [user?.uid, db]);

  const profilesQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, 'publicProfiles'), limit(100));
  }, [db, user?.uid]);

  const { data: allProfiles, loading } = useCollection(profilesQuery);

  const filteredProfiles = useMemo(() => {
    if (!allProfiles) return [];
    const queryStr = searchTerm.toLowerCase();
    return allProfiles.filter((p: any) => {
      const id = p.uid || p.id;
      if (id === user?.uid || blockedUids.has(id)) return false;
      const searchBase = `${p.username} ${p.displayName} ${p.bio} ${p.interests?.join(' ')}`.toLowerCase();
      return queryStr === '' || searchBase.includes(queryStr);
    });
  }, [allProfiles, searchTerm, user?.uid, blockedUids]);

  const handleAction = async (targetUid: string, type: 'friend' | 'date') => {
    if (!user) { window.dispatchEvent(new CustomEvent('open-auth-gate')); return; }
    if (!db) return;
    setIsProcessing(targetUid);
    const participants = [user.uid, targetUid].sort();
    try {
      await setDoc(doc(db, 'connections', participants.join('_')), {
        fromUserId: user.uid,
        toUserId: targetUid,
        status: "pending",
        type: type === 'date' ? 'spark' : 'friend',
        createdAt: serverTimestamp(),
      }, { merge: true });
      toast({ title: "Invitation Sent!", description: "Request dispatched. ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Ripple occurred." });
    } finally {
      setIsProcessing(null);
    }
  };

  if (!mounted) return <Loader2 className="animate-spin m-auto opacity-20" />;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
        <div className="text-center space-y-4">
           <SearchIcon className="w-12 h-12 text-primary mx-auto" />
           <h1 className="text-4xl font-black uppercase tracking-tighter">{t('search.title')}</h1>
        </div>

        <Input value={searchTerm} onChange={e => setSearchQuery(e.target.value)} placeholder={t('search.placeholder')} className="h-16 rounded-[2rem] bg-white border-none shadow-xl px-8 font-bold" />

        <div className="grid gap-6">
          {loading ? <Loader2 className="animate-spin mx-auto opacity-20" /> : filteredProfiles.map((p: any) => (
            <Card key={p.uid} className="rounded-[2.5rem] p-6 bg-white shadow-lg flex flex-col sm:flex-row gap-6">
              <div className="relative w-32 h-32 shrink-0 bg-primary/5 rounded-2xl overflow-hidden">
                {p.photoURL && <Image src={p.photoURL} alt={p.displayName} fill className="object-cover" />}
              </div>
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-start">
                   <div><h3 className="font-black text-xl">{p.displayName || "Mystery Heart"}</h3><p className="text-[10px] font-bold uppercase opacity-40">{p.country}</p></div>
                   <Badge variant="outline" className="text-[8px] uppercase">{p.accountType}</Badge>
                </div>
                <p className="text-sm text-muted-foreground font-medium italic line-clamp-2">"{p.bio || "Respect Mandatory. ❤️"}"</p>
                <div className="flex gap-2">
                   <Button onClick={() => handleAction(p.uid, 'friend')} disabled={isProcessing === p.uid} variant="outline" className="flex-1 h-10 rounded-xl uppercase font-black text-[9px]">Invite</Button>
                   <Button onClick={() => handleAction(p.uid, 'date')} disabled={isProcessing === p.uid} className="flex-1 h-10 rounded-xl gradient-bg uppercase font-black text-[9px]">Spark</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<Loader2 className="animate-spin" />}><SearchContent /></Suspense>;
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { 
  collection, 
  query, 
  where, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  setDoc, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  Loader2, 
  Lock, 
  Zap, 
  Search, 
  Users, 
  Store, 
  Megaphone,
  Gavel
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Sovereign Command Center.
 * Exclusively accessible to the one true owner. Manages all global permissions.
 */
export default function AdminApprovalsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [sovereignId, setSovereignId] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'siteSettings', 'sovereignty'), (snap) => {
      if (snap.exists()) setSovereignId(snap.data().ownerId);
      else setSovereignId(null);
    });
    return () => unsub();
  }, [db]);

  const isUserSovereign = user?.uid === sovereignId;
  const isVacant = sovereignId === null;

  const pendingSellersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('sellerStatus', '==', 'pending'));
  }, [db]);

  const pendingAdvertisersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('advertiserStatus', '==', 'pending'));
  }, [db]);

  const allUsersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), limit(100));
  }, [db]);

  const { data: pendingSellers } = useCollection(pendingSellersQuery);
  const { data: pendingAdvertisers } = useCollection(pendingAdvertisersQuery);
  const { data: allUsers, loading: usersLoading } = useCollection(allUsersQuery);

  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];
    const q = searchQuery.toLowerCase();
    return allUsers.filter((u: any) => 
      u.displayName?.toLowerCase().includes(q) || 
      u.email?.toLowerCase().includes(q) ||
      u.uid === searchQuery
    );
  }, [allUsers, searchQuery]);

  const handleClaimSovereignty = async () => {
    if (!user || !db || isClaiming) return;
    setIsClaiming(true);
    try {
      await setDoc(doc(db, 'siteSettings', 'sovereignty'), {
        ownerId: user.uid,
        claimedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'users', user.uid), {
        role: 'admin',
        isAdmin: true
      });
      toast({ title: "Authority Claimed", description: "You are now the Sovereign Guardian. ✨" });
    } catch (e) {
      toast({ variant: "destructive", title: "Claim Denied", description: "Sovereign Seat occupied." });
    } finally {
      setIsClaiming(false);
    }
  };

  const handleRoleToggle = async (uid: string, roleKey: string, val: any) => {
    if (!db || !isUserSovereign || isProcessing) return;
    setIsProcessing(uid);
    try {
      const updates: any = { [roleKey]: val };
      if (roleKey === 'isAdmin') {
        updates.role = val ? 'admin' : 'member';
      }
      await updateDoc(doc(db, 'users', uid), updates);
      toast({ title: "Permissions Updated", description: "Decree synchronized. ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Access Denied", description: "Guardian authority required." });
    } finally {
      setIsProcessing(null);
    }
  };

  if (isVacant) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 items-center justify-center p-6 text-center text-white">
        <Gavel className="w-16 h-16 text-primary mb-8" />
        <h1 className="text-4xl font-black uppercase mb-4">Authority Vacant</h1>
        <Button onClick={handleClaimSovereignty} disabled={isClaiming} className="h-16 px-10 rounded-2xl gradient-bg font-black">
          {isClaiming ? <Loader2 className="animate-spin" /> : "Claim Sovereignty"}
        </Button>
      </div>
    );
  }

  if (!isUserSovereign) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 text-center">
        <Lock className="w-12 h-12 text-primary mb-6" />
        <h2 className="text-2xl font-black uppercase">Restricted Access</h2>
        <Button variant="outline" className="mt-8 rounded-xl" onClick={() => window.location.href = '/discover'}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-5xl space-y-12">
        <h1 className="text-4xl font-black uppercase">Sovereign Command</h1>
        
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase flex items-center gap-3">
                 <Users className="w-5 h-5 text-blue-500" /> Heart Registry
              </h2>
              <Input 
                placeholder="Search..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="max-w-xs rounded-xl"
              />
           </div>

           <div className="grid gap-4">
              {usersLoading ? (
                 <Loader2 className="animate-spin mx-auto opacity-20" />
              ) : filteredUsers.map((u: any) => (
                <Card key={u.uid} className="p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="text-left flex-grow">
                      <h3 className="font-black text-lg">{u.displayName || "Mystery Heart"}</h3>
                      <p className="text-[10px] font-mono text-muted-foreground">{u.uid}</p>
                   </div>
                   <div className="flex flex-wrap items-center gap-6">
                      <RoleSwitch label="Admin" checked={u.role === 'admin'} onToggle={(v: boolean) => handleRoleToggle(u.uid, 'isAdmin', v)} />
                      <RoleSwitch label="Seller" checked={u.isSeller} onToggle={(v: boolean) => handleRoleToggle(u.uid, 'isSeller', v)} />
                      <RoleSwitch label="Advertiser" checked={u.isAdvertiser} onToggle={(v: boolean) => handleRoleToggle(u.uid, 'isAdvertiser', v)} />
                   </div>
                </Card>
              ))}
           </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
           <section className="space-y-4">
              <h2 className="font-black uppercase flex items-center gap-2"><Store className="w-5 h-5" /> Pending Sellers</h2>
              {pendingSellers?.map((s: any) => (
                 <Card key={s.uid} className="p-4 rounded-2xl flex justify-between items-center">
                    <span className="font-bold">{s.displayName}</span>
                    <Button size="sm" onClick={() => handleRoleToggle(s.uid, 'isSeller', true)} className="h-8 rounded-lg gradient-bg">Approve</Button>
                 </Card>
              ))}
           </section>
           <section className="space-y-4">
              <h2 className="font-black uppercase flex items-center gap-2"><Megaphone className="w-5 h-5" /> Pending Ads</h2>
              {pendingAdvertisers?.map((a: any) => (
                 <Card key={a.uid} className="p-4 rounded-2xl flex justify-between items-center">
                    <span className="font-bold">{a.displayName}</span>
                    <Button size="sm" onClick={() => handleRoleToggle(a.uid, 'isAdvertiser', true)} className="h-8 rounded-lg gradient-bg">Approve</Button>
                 </Card>
              ))}
           </section>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

function RoleSwitch({ label, checked, onToggle }: any) {
  return (
    <div className="flex items-center gap-3">
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
       <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}

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
  Gavel,
  ShieldCheck,
  Star,
  UserCheck,
  Edit3
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
 * Uses role === 'admin' string check for authority.
 */
export default function AdminApprovalsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [sovereignId, setSovereignId] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Sovereign Authority Listener (Real-time)
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

  // Registry Queries
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
      u.uid === searchQuery ||
      u.role?.toLowerCase().includes(q)
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
      // Also mark this user as admin in their own doc using the role field
      await updateDoc(doc(db, 'users', user.uid), {
        role: 'admin'
      });
      toast({ title: "Authority Claimed", description: "You are now the Sovereign Guardian. ✨" });
    } catch (e) {
      toast({ variant: "destructive", title: "Claim Denied", description: "The Sovereign Seat is already filled." });
    } finally {
      setIsClaiming(false);
    }
  };

  const handleRoleToggle = async (uid: string, roleKey: string, val: boolean) => {
    if (!db || !isUserSovereign || isProcessing) return;
    setIsProcessing(uid);
    try {
      const updates: any = { [roleKey]: val };
      
      // Enforce role: admin string logic
      if (roleKey === 'isAdmin') {
        updates.role = val ? 'admin' : 'member';
      }

      await updateDoc(doc(db, 'users', uid), updates);
      toast({ title: "Permissions Updated", description: "The decree has been synchronized. ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Access Denied", description: "Only the Sovereign can assign roles." });
    } finally {
      setIsProcessing(null);
    }
  };

  if (isVacant) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 items-center justify-center p-6 text-center text-white">
        <div className="w-32 h-32 bg-primary/20 rounded-[3rem] flex items-center justify-center mb-8 animate-pulse border-4 border-dashed border-primary/40 shadow-[0_0_50px_rgba(255,51,102,0.3)]">
          <Gavel className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">Authority Vacant</h1>
        <p className="text-xl text-white/60 italic max-w-md mb-10 leading-relaxed">
          "A revolution requires a Guardian." Claim the Sovereign Seat to manage permissions and protect the community.
        </p>
        <Button 
          onClick={handleClaimSovereignty} 
          disabled={isClaiming}
          className="h-20 px-12 rounded-[2.5rem] gradient-bg text-2xl font-black shadow-2xl shadow-primary/40 hover:scale-105 transition-all"
        >
          {isClaiming ? <Loader2 className="animate-spin mr-3" /> : <Zap className="w-6 h-6 mr-3" />}
          Claim Sovereignty
        </Button>
      </div>
    );
  }

  if (!isUserSovereign) {
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-2xl">
           <Lock className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter uppercase">Restricted Access</h2>
        <p className="text-muted-foreground mt-2 max-w-xs font-medium">Only the Sovereign Guardian can assign permissions. ❤️</p>
        <Button variant="outline" className="mt-8 rounded-2xl h-14 px-8 border-2 font-bold" onClick={() => window.location.href = '/discover'}>Return to Discovery</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-5xl space-y-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-primary shadow-2xl ring-4 ring-white relative overflow-hidden group">
                 <Zap className="w-10 h-10 group-hover:rotate-12 transition-transform" />
                 <div className="absolute inset-0 bg-primary/10 animate-pulse" />
              </div>
              <div className="text-left">
                 <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Sovereign Command</h1>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2">Guardian Protocol Active</p>
              </div>
           </div>
           <Badge className="bg-slate-900 text-white border-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
             Exclusive Authority
           </Badge>
        </div>

        <section className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                 <Users className="w-6 h-6 text-blue-500" />
                 Heart Registry
              </h2>
              <div className="relative w-64">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                 <Input 
                   placeholder="Search ID, Name, Role..." 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="pl-12 rounded-full bg-white border-none shadow-sm h-12"
                 />
              </div>
           </div>

           <div className="grid gap-4">
              {usersLoading ? (
                 <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary opacity-20" /></div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u: any) => (
                  <UserAdminCard 
                    key={u.uid} 
                    u={u} 
                    onToggle={(role, val) => handleRoleToggle(u.uid, role, val)}
                    isProcessing={isProcessing === u.uid}
                  />
                ))
              ) : (
                <div className="p-12 text-center bg-white/40 rounded-[2.5rem] border-2 border-dashed border-muted text-muted-foreground font-bold italic">
                   "Scanning the network..." No matches found.
                </div>
              )}
           </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
           <section className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <Store className="w-6 h-6 text-primary" />
                 <h2 className="text-xl font-black uppercase tracking-tight">Pending Sellers</h2>
              </div>
              <div className="space-y-4">
                 {pendingSellers?.map((s: any) => (
                    <PendingRequestItem key={s.uid} u={s} type="seller" onToggle={handleRoleToggle} />
                 ))}
                 {pendingSellers?.length === 0 && <p className="text-xs text-center text-muted-foreground italic font-medium py-10 bg-white/40 rounded-3xl border border-dashed">No pending artisans.</p>}
              </div>
           </section>

           <section className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <Megaphone className="w-6 h-6 text-primary" />
                 <h2 className="text-xl font-black uppercase tracking-tight">Pending Ads</h2>
              </div>
              <div className="space-y-4">
                 {pendingAdvertisers?.map((a: any) => (
                    <PendingRequestItem key={a.uid} u={a} type="advertiser" onToggle={handleRoleToggle} />
                 ))}
                 {pendingAdvertisers?.length === 0 && <p className="text-xs text-center text-muted-foreground italic font-medium py-10 bg-white/40 rounded-3xl border border-dashed">No pending reaches.</p>}
              </div>
           </section>
        </div>

      </main>
      <BottomNav />
    </div>
  );
}

function UserAdminCard({ u, onToggle, isProcessing }: any) {
  return (
    <Card className="rounded-[2.5rem] border-none shadow-md bg-white overflow-hidden group hover:shadow-xl transition-all">
       <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left flex-grow min-w-0">
             <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center font-black text-lg text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {u.displayName?.[0] || 'U'}
             </div>
             <div className="min-w-0">
                <div className="flex items-center gap-2">
                   <h3 className="font-black text-lg truncate leading-none">{u.displayName || "Mystery Heart"}</h3>
                   {u.role === 'admin' && <Badge className="h-5 px-2 bg-red-500 text-white text-[7px] font-black uppercase tracking-widest border-none">Admin</Badge>}
                </div>
                <p className="text-[9px] font-mono text-muted-foreground/60 truncate mt-1">{u.uid}</p>
             </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
             <RoleSwitch label="Admin" checked={u.role === 'admin'} onToggle={v => onToggle('isAdmin', v)} color="text-red-500" disabled={isProcessing} />
             <RoleSwitch label="Seller" checked={u.isSeller} onToggle={v => onToggle('isSeller', v)} color="text-green-500" disabled={isProcessing} />
             <RoleSwitch label="Advertiser" checked={u.isAdvertiser} onToggle={v => onToggle('isAdvertiser', v)} color="text-blue-500" disabled={isProcessing} />
          </div>
       </div>
    </Card>
  );
}

function RoleSwitch({ label, checked, onToggle, color, disabled }: any) {
  return (
    <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-2xl border border-dashed hover:bg-white hover:shadow-sm transition-all">
       <span className={cn("text-[10px] font-black uppercase tracking-widest", checked ? color : "text-slate-300")}>{label}</span>
       <Switch checked={checked} onCheckedChange={onToggle} disabled={disabled} className="scale-75" />
    </div>
  );
}

function PendingRequestItem({ u, type, onToggle }: any) {
  return (
    <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden p-4">
       <div className="flex items-center justify-between">
          <div className="text-left">
             <p className="text-sm font-bold truncate max-w-[120px]">{u.displayName}</p>
             <p className="text-[8px] font-black uppercase text-muted-foreground/60">{u.country || 'GLOBAL'}</p>
          </div>
          <div className="flex gap-2">
             <Button 
               size="sm" 
               variant="outline" 
               className="h-8 rounded-full px-4 text-[9px] font-black uppercase border-2 text-red-500 hover:bg-red-50"
               onClick={() => onToggle(`${type}Status`, 'rejected')}
             >Reject</Button>
             <Button 
               size="sm" 
               className="h-8 rounded-full px-4 text-[9px] font-black uppercase gradient-bg shadow-lg"
               onClick={() => {
                 onToggle(`is${type.charAt(0).toUpperCase() + type.slice(1)}`, true);
                 onToggle(`${type}Status`, 'approved');
               }}
             >Approve</Button>
          </div>
       </div>
    </Card>
  );
}
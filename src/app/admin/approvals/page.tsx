
'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { 
  ShieldCheck, 
  Loader2, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Store, 
  Megaphone,
  ClipboardCheck,
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

export default function AdminApprovalsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const pendingSellersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('sellerStatus', '==', 'pending'));
  }, [db]);

  const pendingAdvertisersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('advertiserStatus', '==', 'pending'));
  }, [db]);

  const { data: pendingSellers, loading: sellersLoading } = useCollection(pendingSellersQuery);
  const { data: pendingAdvertisers, loading: advertisersLoading } = useCollection(pendingAdvertisersQuery);

  const [checklists, setChecklists] = useState<Record<string, Record<string, boolean>>>({});
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const updateChecklist = (uid: string, key: string, val: boolean) => {
    setChecklists(prev => ({
      ...prev,
      [uid]: { ...prev[uid], [key]: val }
    }));
  };

  const handleDecision = async (uid: string, type: 'seller' | 'advertiser', decision: 'approved' | 'rejected') => {
    if (!db || isProcessing) return;

    const checklist = checklists[uid] || {};
    const allChecked = checklist.idVerified && checklist.addressVerified && checklist.policySigned && checklist.humanVerified;

    if (decision === 'approved' && !allChecked) {
      toast({
        variant: "destructive",
        title: "Checklist Incomplete",
        description: "All mandatory items must be verified before approval. ✨"
      });
      return;
    }

    setIsProcessing(uid);
    try {
      const updates: any = {
        [`${type}Status`]: decision,
        adminChecklist: checklist,
        [`${type}DecisionAt`]: serverTimestamp()
      };

      if (decision === 'approved') {
        updates[`is${type.charAt(0).toUpperCase() + type.slice(1)}`] = true;
      }

      await updateDoc(doc(db, 'users', uid), updates);
      
      toast({
        title: "Decision Recorded",
        description: `Member has been ${decision} for ${type} status. ❤️`
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Operation failed." });
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-primary shadow-xl ring-4 ring-white">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Platform Approvals</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Administrator Verification Command</p>
          </div>
        </div>

        <div className="grid gap-12">
          {/* Seller Requests */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-xl font-black flex items-center gap-3">
                 <Store className="w-6 h-6 text-primary" />
                 Pending Sellers
                 <Badge variant="outline" className="ml-2 font-black">{pendingSellers?.length || 0}</Badge>
               </h2>
               <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Artisan & Gifting Review</p>
            </div>

            {sellersLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary opacity-20" /></div>
            ) : pendingSellers && pendingSellers.length > 0 ? (
              pendingSellers.map((seller: any) => (
                <RequestCard 
                  key={seller.uid} 
                  user={seller} 
                  type="seller" 
                  checklist={checklists[seller.uid] || {}} 
                  onCheck={(k, v) => updateChecklist(seller.uid, k, v)}
                  onAction={(d) => handleDecision(seller.uid, 'seller', d)}
                  isProcessing={isProcessing === seller.uid}
                />
              ))
            ) : (
              <EmptyAdminState icon={Store} label="No pending seller requests." />
            )}
          </section>

          {/* Advertiser Requests */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-xl font-black flex items-center gap-3">
                 <Megaphone className="w-6 h-6 text-primary" />
                 Pending Advertisers
                 <Badge variant="outline" className="ml-2 font-black">{pendingAdvertisers?.length || 0}</Badge>
               </h2>
               <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Marketing & Reach Review</p>
            </div>

            {advertisersLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary opacity-20" /></div>
            ) : pendingAdvertisers && pendingAdvertisers.length > 0 ? (
              pendingAdvertisers.map((adv: any) => (
                <RequestCard 
                  key={adv.uid} 
                  user={adv} 
                  type="advertiser" 
                  checklist={checklists[adv.uid] || {}} 
                  onCheck={(k, v) => updateChecklist(adv.uid, k, v)}
                  onAction={(d) => handleDecision(adv.uid, 'advertiser', d)}
                  isProcessing={isProcessing === adv.uid}
                />
              ))
            ) : (
              <EmptyAdminState icon={Megaphone} label="No pending advertiser requests." />
            )}
          </section>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

function RequestCard({ user, type, checklist, onCheck, onAction, isProcessing }: any) {
  const items = [
    { id: 'idVerified', label: 'ID / Tax ID Document Verified' },
    { id: 'addressVerified', label: 'Business Address Physical Check' },
    { id: 'policySigned', label: 'Respect Policy Alignment' },
    { id: 'humanVerified', label: 'Verified Human Status' }
  ];

  return (
    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden group hover:scale-[1.01] transition-all">
      <div className="flex flex-col md:flex-row">
        <div className="p-8 md:w-1/3 border-b md:border-b-0 md:border-r space-y-4">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white font-black text-lg">
                {user.displayName?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                 <h3 className="font-black text-lg truncate leading-none">{user.displayName || "Mystery Heart"}</h3>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{user.country || 'GLOBAL'}</p>
              </div>
           </div>
           <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-dashed">
              <p className="text-[9px] font-black uppercase text-muted-foreground/60">Commercial Data</p>
              <div className="flex justify-between items-baseline">
                <span className="text-[8px] font-bold uppercase text-slate-400">Tax ID:</span>
                <span className="text-[10px] font-black font-mono">{user.taxId || 'NOT PROVIDED'}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[8px] font-bold uppercase text-slate-400">Address:</span>
                <span className="text-[10px] font-black truncate max-w-[120px]">{user.address1 || 'NONE'}</span>
              </div>
           </div>
        </div>

        <div className="p-8 md:w-2/3 space-y-6">
           <div className="flex items-center gap-2 text-primary">
              <ClipboardCheck className="w-5 h-5" />
              <h4 className="text-sm font-black uppercase tracking-tighter">Verification Checklist</h4>
           </div>
           
           <div className="grid sm:grid-cols-2 gap-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors" onClick={() => onCheck(item.id, !checklist[item.id])}>
                  <Checkbox checked={checklist[item.id]} onCheckedChange={(v) => onCheck(item.id, !!v)} className="rounded-md h-5 w-5" />
                  <label className="text-[10px] font-black uppercase tracking-tight text-slate-600 cursor-pointer">{item.label}</label>
                </div>
              ))}
           </div>

           <div className="flex gap-4 pt-4 border-t border-dashed">
              <Button 
                variant="outline" 
                onClick={() => onAction('rejected')} 
                disabled={isProcessing}
                className="flex-1 h-14 rounded-2xl border-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 hover:border-red-200 transition-all gap-2"
              >
                <XCircle className="w-4 h-4" /> Reject
              </Button>
              <Button 
                onClick={() => onAction('approved')} 
                disabled={isProcessing}
                className="flex-1 h-14 rounded-2xl gradient-bg shadow-xl shadow-primary/20 text-[10px] font-black uppercase tracking-[0.2em] transition-all gap-2"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve Member
              </Button>
           </div>
        </div>
      </div>
    </Card>
  );
}

function EmptyAdminState({ icon: Icon, label }: any) {
  return (
    <div className="p-16 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-muted/60 space-y-4">
      <Icon className="w-12 h-12 text-muted-foreground/20 mx-auto" />
      <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/40">{label}</p>
    </div>
  );
}

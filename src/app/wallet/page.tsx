'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { collection, query, where, orderBy, limit, doc } from 'firebase/firestore';
import { 
  Wallet as WalletIcon, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Loader2, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Gift,
  Megaphone,
  Store,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { CURRENCIES } from '@/lib/world-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import GuestAccessGuard from "@/components/GuestAccessGuard";

/**
 * @fileOverview 💳 High-Fidelity Wallet Screen.
 * Orchestrates prosperity balance tracking and transaction synchronization.
 */
export default function WalletPage() {
  const { user } = useUser();
  const db = useFirestore();

  const walletRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'wallets', user.uid);
  }, [db, user?.uid]);

  const { data: wallet, loading: walletLoading } = useDoc(walletRef);

  const transactionsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }, [db, user?.uid]);

  const { data: transactions, loading: txLoading } = useCollection(transactionsQuery);

  const currencySymbol = useMemo(() => {
    return CURRENCIES.find(c => c.code === (wallet?.currency || 'USD'))?.symbol || '$';
  }, [wallet?.currency]);

  if (!user) {
     return (
       <div className="flex flex-col min-h-screen bg-muted/30 items-center justify-center p-6 text-center">
          <WalletIcon className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">Identify Your Heart</h2>
          <p className="text-muted-foreground mt-2 mb-8 font-medium">Login to access your prosperity registry. ❤️</p>
          <Button asChild className="h-14 px-8 rounded-2xl gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20">
            <Link href="/login">Launch Identity</Link>
          </Button>
       </div>
     );
  }

  return (
    <GuestAccessGuard feature="wallet">
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
              <WalletIcon className="w-10 h-10 text-primary" />
              My Wallet
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">Prosperity Registry • Bridge Active</p>
          </div>

          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-slate-900 text-white relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 translate-x-4 transition-transform group-hover:rotate-0 duration-700">
               <TrendingUp className="w-40 h-40 text-primary" />
            </div>
            <CardHeader className="p-8 pb-0 relative z-10">
               <div className="flex items-center justify-between">
                  <Badge className="bg-primary/20 text-primary border-none px-3 h-6 text-[8px] font-black uppercase tracking-widest">
                     {wallet?.status || 'Active'} Account
                  </Badge>
                  <div className="flex items-center gap-1.5 text-white/40">
                     <ShieldCheck className="w-3.5 h-3.5" />
                     <span className="text-[7px] font-bold uppercase tracking-widest leading-none">Secured by Cloud Bridge</span>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8 relative z-10">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Available Balance</p>
                  <div className="flex items-baseline gap-2">
                     <span className="text-5xl font-black tracking-tighter">
                       {walletLoading ? '---' : `${currencySymbol}${wallet?.availableBalance?.toFixed(2) || '0.00'}`}
                     </span>
                     <span className="text-sm font-bold text-white/30 uppercase">{wallet?.currency || 'USD'}</span>
                  </div>
               </div>

               <div className="flex gap-4">
                  <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-[1.5rem] p-4 border border-white/10">
                     <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Pending</p>
                     <p className="text-lg font-bold">
                       {walletLoading ? '--' : `${currencySymbol}${wallet?.pendingBalance?.toFixed(2) || '0.00'}`}
                     </p>
                  </div>
                  <Button asChild className="h-16 flex-1 rounded-[1.5rem] gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all gap-2">
                     <Link href="/donate">
                       <TrendingUp className="w-4 h-4" />
                       Fund Mission
                     </Link>
                  </Button>
               </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
             <Link href="/shop" className="group">
                <div className="bg-white rounded-3xl p-4 text-center shadow-sm group-hover:shadow-md transition-all border border-transparent group-hover:border-primary/10">
                   <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Gift className="w-5 h-5" />
                   </div>
                   <p className="text-[8px] font-black uppercase tracking-widest">Buy Gifts</p>
                </div>
             </Link>
             <Link href="/shop/manage" className="group">
                <div className="bg-white rounded-3xl p-4 text-center shadow-sm group-hover:shadow-md transition-all border border-transparent group-hover:border-secondary/10">
                   <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Store className="w-5 h-5" />
                   </div>
                   <p className="text-[8px] font-black uppercase tracking-widest">Storefront</p>
                </div>
             </Link>
             <Link href="/ads/manage" className="group">
                <div className="bg-white rounded-3xl p-4 text-center shadow-sm group-hover:shadow-md transition-all border border-transparent group-hover:border-blue-100">
                   <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Megaphone className="w-5 h-5" />
                   </div>
                   <p className="text-[8px] font-black uppercase tracking-widest">Ads Hub</p>
                </div>
             </Link>
          </div>

          <section className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black uppercase tracking-tight">Transaction History</h2>
                <div className="flex items-center gap-2 text-muted-foreground/40">
                   <Clock className="w-3 h-3" />
                   <span className="text-[8px] font-bold uppercase tracking-widest">Real-time sync</span>
                </div>
             </div>

             <div className="space-y-3">
                {txLoading ? (
                   <div className="flex justify-center py-10 opacity-20"><Loader2 className="animate-spin text-primary" /></div>
                ) : transactions && transactions.length > 0 ? (
                  transactions.map((tx: any) => (
                    <TransactionItem key={tx.id} tx={tx} currencySymbol={currencySymbol} />
                  ))
                ) : (
                  <div className="py-20 text-center bg-white/40 rounded-[2.5rem] border-2 border-dashed border-muted text-muted-foreground">
                     <p className="text-xs font-black uppercase tracking-widest italic">"No financial heartbeats recorded yet."</p>
                  </div>
                )}
             </div>
          </section>

          <div className="p-8 bg-white/60 rounded-[2.5rem] border-2 border-dashed border-primary/5 text-center space-y-4">
             <div className="flex items-center justify-center gap-4 opacity-20">
                <Sparkles className="w-5 h-5 text-primary" />
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <Sparkles className="w-5 h-5 text-primary" />
             </div>
             <p className="text-[11px] text-muted-foreground font-medium italic leading-relaxed">
               "Your prosperity fuels global opportunity." Every transaction within our network supports local job creation to eliminate poverty forever. ❤️
             </p>
          </div>
        </main>

        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}

function TransactionItem({ tx, currencySymbol }: { tx: any, currencySymbol: string }) {
  const isPositive = ['deposit', 'refund'].includes(tx.type);
  
  const typeIcons: Record<string, any> = {
    deposit: <ArrowDownLeft className="w-4 h-4 text-green-500" />,
    withdrawal: <ArrowUpRight className="w-4 h-4 text-slate-400" />,
    purchase: <Gift className="w-4 h-4 text-pink-500" />,
    refund: <Sparkles className="w-4 h-4 text-blue-500" />,
    transfer: <ArrowRight className="w-4 h-4 text-slate-400" />,
    donation: <Heart className="w-4 h-4 text-primary fill-primary/10" />,
    subscription: <ShieldCheck className="w-4 h-4 text-amber-500" />,
  };

  const dateString = useMemo(() => {
    if (!tx.createdAt) return 'Recent';
    try {
      const d = tx.createdAt.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return 'Just now'; }
  }, [tx.createdAt]);

  return (
    <Card className="rounded-3xl border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white group">
       <div className="p-4 flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
            isPositive ? "bg-green-50" : "bg-muted/30"
          )}>
             {typeIcons[tx.type] || <Clock className="w-4 h-4" />}
          </div>
          <div className="flex-grow min-w-0">
             <div className="flex justify-between items-start mb-0.5">
                <h4 className="font-black text-sm uppercase tracking-tight truncate leading-none">
                  {tx.description || tx.type}
                </h4>
                <p className={cn(
                  "font-black text-base tabular-nums",
                  isPositive ? "text-green-600" : "text-slate-900"
                )}>
                  {isPositive ? '+' : '-'}{currencySymbol}{tx.amount?.toFixed(2)}
                </p>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">{dateString}</span>
                <Badge variant="outline" className={cn(
                  "h-4 text-[6px] font-black uppercase px-1 border-none",
                  tx.status === 'completed' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                )}>
                   {tx.status}
                </Badge>
             </div>
          </div>
       </div>
    </Card>
  );
}

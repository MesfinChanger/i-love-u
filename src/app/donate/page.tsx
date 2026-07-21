"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Heart, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle, 
  Globe, 
  TrendingDown, 
  Zap,
  User,
  AtSign,
  Phone,
  MapPin,
  ArrowRight,
  Building2,
  Map,
  Hash
} from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { createDonationSession } from '@/lib/stripe-actions';
import { useSearchParams } from 'next/navigation';
import { CURRENCIES } from '@/lib/world-data';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

function DonateContent() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  const [amount, setAmount] = useState('5');
  const [isDonating, setIsDonating] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [guestCity, setGuestCity] = useState('');
  const [guestState, setGuestState] = useState('');
  const [guestZip, setGuestZip] = useState('');
  const [pendingAmount, setPendingAmount] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({ title: "Prosperity Sparked!", description: "Thank you for building local prosperity! ❤️" });
    }
  }, [searchParams, toast]);

  const handleDonate = async (targetAmount?: string) => {
    const finalAmount = targetAmount || amount;
    if (!finalAmount) return;
    
    if (!user) {
      setPendingAmount(finalAmount);
      setShowGuestForm(true);
      return;
    }

    setIsDonating(true);
    try {
      const result = await createDonationSession(parseFloat(finalAmount), profile?.currency || 'USD', user.uid, {
        email: profile?.email || user.email || '',
        phone: profile?.phoneNumber || '',
        address: profile?.address1 || '',
        city: profile?.city || '',
        state: profile?.state || '',
        zip: profile?.postalCode || ''
      });
      if (result?.url) window.location.href = result.url;
    } catch (e) {
      setIsDonating(false);
    }
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAmount) return;
    setIsDonating(true);
    setShowGuestForm(false);
    try {
      const result = await createDonationSession(parseFloat(pendingAmount), 'USD', 'guest', {
        email: guestEmail,
        phone: guestPhone,
        address: guestAddress,
        city: guestCity,
        state: guestState,
        zip: guestZip
      });
      if (result?.url) window.location.href = result.url;
    } catch (e) {
      setIsDonating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <div className="text-center space-y-4 mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-xl"><TrendingDown className="w-12 h-12 text-primary" /></div>
          <h1 className="text-5xl font-black tracking-tighter">Spark Change</h1>
          <p className="text-xl text-muted-foreground font-medium italic">"Building lives through job creation."</p>
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden relative">
          {isDonating && <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /><p className="mt-4 font-black uppercase text-[10px]">Opening Bridge...</p></div>}
          <CardHeader className="bg-primary/5 text-center py-10">
             <CardTitle className="text-primary text-3xl font-black flex items-center justify-center gap-3"><Globe className="w-8 h-8" /> U-Propel Fund</CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase">Investment Amount</Label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="h-16 text-3xl font-black rounded-2xl" />
              </div>
              <Button onClick={() => handleDonate()} disabled={isDonating} className="w-full h-20 rounded-[2rem] gradient-bg text-2xl font-black shadow-xl active:scale-95 transition-all">Propel Prosperity</Button>
          </CardContent>
        </Card>
      </main>

      <Dialog open={showGuestForm} onOpenChange={setShowGuestForm}>
        <DialogContent className="sm:max-w-md rounded-[3rem] p-0 overflow-hidden bg-white">
           <DialogHeader className="p-8 bg-slate-900 text-white text-center">
              <DialogTitle className="text-xl font-black uppercase">Guest Billing</DialogTitle>
           </DialogHeader>
           <form onSubmit={handleGuestSubmit} className="p-8 space-y-6">
              <Input value={guestAddress} onChange={e => setGuestAddress(e.target.value)} placeholder="Address" className="h-12 rounded-xl" required />
              <div className="grid grid-cols-2 gap-4">
                 <Input value={guestCity} onChange={e => setGuestCity(e.target.value)} placeholder="City" required />
                 <Input value={guestState} onChange={e => setGuestState(e.target.value)} placeholder="State" required />
              </div>
              <Input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="Email" className="h-12 rounded-xl" />
              <Button type="submit" className="w-full h-16 rounded-2xl gradient-bg font-black uppercase">Continue to Payment</Button>
           </form>
        </DialogContent>
      </Dialog>
      <BottomNav />
    </div>
  );
}

export default function DonatePage() {
  return <Suspense><DonateContent /></Suspense>;
}

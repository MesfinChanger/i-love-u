
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Loader2, Sparkles, Coins, ShieldCheck, CheckCircle, HandHeart, Globe, Briefcase } from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { createDonationSession } from '@/lib/stripe-actions';
import { useSearchParams } from 'next/navigation';

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'NGN', symbol: '₦' },
  { code: 'KES', symbol: 'KSh' },
  { code: 'INR', symbol: '₹' },
  { code: 'IDR', symbol: 'Rp' }
];

export default function DonatePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  const [amount, setAmount] = useState('10');
  const [isDonating, setIsDonating] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: "Investment Received!",
        description: "Thank you for funding global job creation and economic growth! ❤️",
      });
    }
  }, [searchParams, toast]);

  const userCurrency = profile?.currency || 'USD';
  const currencySymbol = useMemo(() => CURRENCIES.find(c => c.code === userCurrency)?.symbol || '$', [userCurrency]);

  const handleDonate = async () => {
    if (!user || !db || !amount) return;
    
    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount < 1) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: `Minimum mission contribution is 1 ${userCurrency}. ✨`
      });
      return;
    }

    setIsDonating(true);
    try {
      await createDonationSession(donationAmount, userCurrency, user.uid);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Could not initiate payment." });
      setIsDonating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <div className="text-center space-y-4 mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Briefcase className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Job Creation Mission</h1>
          <p className="text-muted-foreground font-medium">
            We do not distribute charity. We create **jobs**. Your contributions fund training, resources, and placement for workers in rural and urban areas worldwide.
          </p>
        </div>

        {searchParams.get('success') ? (
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden p-10 text-center space-y-4">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
             </div>
             <h2 className="text-2xl font-black">Mission Funded</h2>
             <p className="text-muted-foreground">Your contribution has been received. You are actively building livelihoods in rural and city areas globally!</p>
             <Button className="w-full rounded-xl gradient-bg" onClick={() => window.location.href = '/discover'}>Return to Discover</Button>
          </Card>
        ) : (
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 text-center py-10">
              <CardTitle className="text-primary text-3xl flex items-center justify-center gap-2">
                <Globe className="w-8 h-8" />
                Empowerment Fund
              </CardTitle>
              <CardDescription className="text-primary/60 font-bold uppercase tracking-widest text-xs mt-2">
                Direct Funding for Rural & Urban Jobs
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {['5', '10', '25', '50', '100'].map(val => (
                    <Button 
                      key={val}
                      variant={amount === val ? 'default' : 'outline'}
                      className="rounded-full px-6"
                      onClick={() => setAmount(val)}
                    >
                      {currencySymbol}{val}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Investment Amount ({userCurrency})</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">{currencySymbol}</span>
                    <Input 
                      id="custom-amount" 
                      type="number" 
                      min="1"
                      placeholder="1.00" 
                      className="pl-10 h-14 rounded-xl text-xl font-bold"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                    Secure Empowerment Fund
                  </p>
                </div>
                <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                  100% of mission funds are allocated to vocational training, equipment for new entrepreneurs, and local infrastructure projects that generate employment.
                </p>
              </div>

              <Button 
                className="w-full h-16 rounded-2xl gradient-bg text-lg font-bold shadow-xl shadow-primary/20"
                onClick={handleDonate}
                disabled={isDonating || !amount}
              >
                {isDonating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                Contribute {currencySymbol}{amount}
              </Button>
              
              <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest opacity-50">
                Building Livelihoods • Rural & City • Worldwide
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Loader2, Sparkles, ShieldCheck, CheckCircle, Globe, Briefcase, TrendingDown, Star } from 'lucide-react';
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
        title: "Prosperity Sparked!",
        description: "Thank you for investing in humanity and ending poverty! ❤️",
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
        description: `Minimum investment is 1 ${userCurrency}. ✨`
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
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-primary/5">
            <TrendingDown className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground">Spark Change</h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Your investment builds lives. We create jobs to end poverty forever.
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-200">
            <Star className="w-3 h-3 fill-amber-500" />
            100% Impact Driven
          </div>
        </div>

        {searchParams.get('success') ? (
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden p-12 text-center space-y-6">
             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
             </div>
             <h2 className="text-3xl font-black tracking-tighter">Mission Funded</h2>
             <p className="text-muted-foreground text-lg italic">"One spark can light up an entire community." Thank you for ending poverty with us!</p>
             <Button className="w-full h-14 rounded-2xl gradient-bg font-bold" onClick={() => window.location.href = '/discover'}>Back to Hearts</Button>
          </Card>
        ) : (
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 text-center py-12">
              <CardTitle className="text-primary text-4xl font-black flex items-center justify-center gap-3">
                <Globe className="w-10 h-10" />
                U-Propel Fund
              </CardTitle>
              <CardDescription className="text-primary/60 font-black uppercase tracking-[0.2em] text-[10px] mt-4">
                Creating Jobs • Ending Poverty
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  {['5', '20', '50', '100', '500'].map(val => (
                    <Button 
                      key={val}
                      variant={amount === val ? 'default' : 'outline'}
                      className="rounded-full px-8 h-12 font-black text-sm"
                      onClick={() => setAmount(val)}
                    >
                      {currencySymbol}{val}
                    </Button>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="custom-amount" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Investment Amount ({userCurrency})</Label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-2xl text-muted-foreground/40">{currencySymbol}</span>
                    <Input 
                      id="custom-amount" 
                      type="number" 
                      min="1"
                      placeholder="0.00" 
                      className="pl-12 h-20 rounded-[1.5rem] text-4xl font-black border-2 border-primary/5 focus-visible:border-primary/20"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2rem] space-y-4 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <p className="text-sm font-black uppercase tracking-widest">
                    Your Impact Guarantee
                  </p>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed italic font-medium">
                  We fund equipment, vocational training, and local infrastructure that turns dependency into prosperity. Join the mission to reach every city and village.
                </p>
              </div>

              <Button 
                className="w-full h-20 rounded-[2rem] gradient-bg text-2xl font-black shadow-2xl shadow-primary/30 active:scale-95 transition-all"
                onClick={handleDonate}
                disabled={isDonating || !amount}
              >
                {isDonating ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Sparkles className="w-6 h-6 mr-2" />}
                Propel Prosperity
              </Button>
              
              <p className="text-[9px] text-center text-muted-foreground uppercase font-black tracking-[0.3em] opacity-40">
                Poverty Elimination is Mandatory ❤️
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

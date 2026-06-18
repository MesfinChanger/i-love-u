
'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Loader2, Sparkles, Coins, ShieldCheck } from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

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

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  const [amount, setAmount] = useState('10');
  const [isDonating, setIsDonating] = useState(false);

  const userCurrency = profile?.currency || 'USD';
  const currencySymbol = useMemo(() => CURRENCIES.find(c => c.code === userCurrency)?.symbol || '$', [userCurrency]);

  const handleDonate = async () => {
    if (!user || !db || !amount) return;
    
    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount < 1) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: `Minimum donation is 1 ${userCurrency}. ✨`
      });
      return;
    }

    setIsDonating(true);
    try {
      await addDoc(collection(db, 'donations'), {
        userId: user.uid,
        amount: donationAmount,
        currency: userCurrency,
        timestamp: serverTimestamp()
      });
      
      toast({
        title: "Thank You!",
        description: `Your contribution of ${currencySymbol}${donationAmount} helps keep Spark free for everyone. ❤️`
      });
      setAmount('10');
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Payment failed." });
    } finally {
      setIsDonating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <div className="text-center space-y-4 mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-primary fill-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Support Spark</h1>
          <p className="text-muted-foreground">We are a 100% free community. Your voluntary donations keep the sparks flying! ❤️</p>
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 text-center py-10">
            <CardTitle className="text-primary text-3xl flex items-center justify-center gap-2">
              <Coins className="w-8 h-8" />
              Make a Gift
            </CardTitle>
            <CardDescription className="text-primary/60 font-bold uppercase tracking-widest text-xs mt-2">
              Starts from 1+ in your currency
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
                <Label htmlFor="custom-amount">Custom Amount ({userCurrency})</Label>
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

            <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                Secure transaction via your local banking provider
              </p>
            </div>

            <Button 
              className="w-full h-16 rounded-2xl gradient-bg text-lg font-bold shadow-xl shadow-primary/20"
              onClick={handleDonate}
              disabled={isDonating || !amount}
            >
              {isDonating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
              Donate {currencySymbol}{amount}
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest opacity-50">
              Respect & Love Community • No Obligations
            </p>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}

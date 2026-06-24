"use client";

import { useState, useMemo } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Loader2, Sparkles, Coins, ShieldCheck, Briefcase, TrendingDown } from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { createDonationSession } from '@/lib/stripe-actions';
import { cn } from '@/lib/utils';

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

interface DonationDialogProps {
  trigger?: React.ReactNode;
}

export function DonationDialog({ trigger }: DonationDialogProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  const [amount, setAmount] = useState('5');
  const [isDonating, setIsDonating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const userCurrency = profile?.currency || 'USD';
  const currencySymbol = useMemo(() => CURRENCIES.find(c => c.code === userCurrency)?.symbol || '$', [userCurrency]);

  const handleDonate = async () => {
    if (!user || !db || !amount) return;
    
    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount < 0.25) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: `Minimum contribution is 0.25 ${userCurrency}. ✨`
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

  const presetOptions = [
    { val: '0.25', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    { val: '5', color: 'bg-pink-100 text-pink-600 border-pink-200' },
    { val: '25', color: 'bg-amber-100 text-amber-600 border-amber-200' },
    { val: '100', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 transition-colors">
            <TrendingDown className="w-5 h-5 text-primary" aria-hidden="true" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-primary/5 py-8 text-center border-b">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-3">
              <TrendingDown className="w-8 h-8 text-primary" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tighter">Eliminate Poverty</DialogTitle>
           <DialogDescription className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">
             Ending economic hardship through job creation
           </DialogDescription>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {presetOptions.map(opt => (
              <button 
                key={opt.val}
                onClick={() => setAmount(opt.val)}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-black text-[9px] transition-all border-2 shadow-sm active:scale-95",
                  opt.color,
                  amount === opt.val ? "ring-2 ring-primary ring-offset-2 scale-110 border-primary" : "opacity-80 hover:opacity-100"
                )}
              >
                {currencySymbol}{opt.val}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dialog-amount" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mission Investment ({userCurrency})</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">{currencySymbol}</span>
              <Input 
                id="dialog-amount" 
                type="number" 
                min="0.25"
                step="0.01"
                placeholder="1.00" 
                className="pl-10 h-12 rounded-xl text-lg font-bold"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-dashed flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter leading-tight">
              100% focused on dismantling poverty via jobs.
            </p>
          </div>

          <Button 
            className="w-full h-14 rounded-2xl gradient-bg text-base font-bold shadow-lg"
            onClick={handleDonate}
            disabled={isDonating || !amount}
          >
            {isDonating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Fund the Mission {currencySymbol}{amount}
          </Button>
          
          <p className="text-[9px] text-center text-muted-foreground uppercase font-black tracking-widest opacity-50">
            Respect Mandatory • Eliminate Poverty
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
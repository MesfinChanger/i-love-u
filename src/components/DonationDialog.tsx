
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
import { 
  Heart, 
  Loader2, 
  Sparkles, 
  Coins, 
  ShieldCheck, 
  Briefcase, 
  TrendingDown, 
  Zap,
  User,
  MapPin,
  AtSign,
  Phone,
  ArrowRight
} from 'lucide-react';
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

  // Guest State
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [pendingAmount, setPendingAmount] = useState<string | null>(null);

  const userCurrency = profile?.currency || 'USD';
  const currencySymbol = useMemo(() => CURRENCIES.find(c => c.code === userCurrency)?.symbol || '$', [userCurrency]);

  const handleDonate = async (targetAmount?: string) => {
    const finalAmount = targetAmount || amount;
    if (!finalAmount) return;
    
    const donationAmount = parseFloat(finalAmount);
    if (isNaN(donationAmount) || donationAmount < 0.25) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: `Minimum contribution is 0.25 ${userCurrency}. ✨`
      });
      return;
    }

    if (!user) {
      setPendingAmount(finalAmount);
      setShowGuestForm(true);
      return;
    }

    setIsDonating(true);
    try {
      const result = await createDonationSession(donationAmount, userCurrency, user.uid);
      if (result?.url) {
        window.location.href = result.url;
      } else if (result?.error) {
        throw new Error(result.error);
      }
    } catch (e: any) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: e.message || "Could not initiate payment." });
      setIsDonating(false);
    }
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAmount) return;
    if (!guestAddress) {
      toast({ variant: "destructive", title: "Address Required", description: "Billing address is mandatory for guests. ❤️" });
      return;
    }
    if (!guestEmail && !guestPhone) {
      toast({ variant: "destructive", title: "Contact Required", description: "Please provide an email or phone number. ✨" });
      return;
    }

    setIsDonating(true);
    setShowGuestForm(false);
    try {
      const result = await createDonationSession(parseFloat(pendingAmount), userCurrency, 'guest', {
        email: guestEmail,
        phone: guestPhone,
        address: guestAddress
      });
      if (result?.url) {
        window.location.href = result.url;
      } else if (result?.error) {
        throw new Error(result.error);
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message || "Payment bridge failed." });
      setIsDonating(false);
    }
  };

  const presetOptions = [
    { val: '0.25', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    { val: '5', color: 'bg-pink-100 text-pink-600 border-pink-200' },
    { val: '25', color: 'bg-amber-100 text-amber-600 border-amber-200' },
    { val: '100', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { val: '250', color: 'bg-purple-100 text-purple-600 border-purple-200' },
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
      <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden relative">
        {isDonating && (
          <div className="absolute inset-0 z-[60] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase">Opening Payment Window</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2">Linking to Fund... ❤️</p>
          </div>
        )}

        {!showGuestForm ? (
          <>
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
                    onClick={() => {
                      setAmount(opt.val);
                      handleDonate(opt.val);
                    }}
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
                onClick={() => handleDonate()}
                disabled={isDonating || !amount}
              >
                {isDonating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Fund the Mission {currencySymbol}{amount}
              </Button>
            </div>
          </>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="bg-slate-900 p-8 text-white text-center">
               <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-primary" />
               </div>
               <DialogTitle className="text-xl font-black uppercase tracking-tighter">Guest Billing</DialogTitle>
               <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">Identity Protocol Active</p>
            </div>
            <form onSubmit={handleGuestSubmit} className="p-8 space-y-5">
               <div className="space-y-4">
                  <div className="space-y-1.5">
                     <Label className="text-[9px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                        <MapPin className="w-2.5 h-2.5" /> Billing Address
                     </Label>
                     <Input 
                        value={guestAddress} 
                        onChange={e => setGuestAddress(e.target.value)} 
                        placeholder="Street, City, Country" 
                        className="h-11 rounded-xl bg-muted/30 border-none font-bold text-xs"
                        required
                     />
                  </div>
                  <div className="space-y-1.5">
                     <Label className="text-[9px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                        <AtSign className="w-2.5 h-2.5" /> Email
                     </Label>
                     <Input 
                        type="email" 
                        value={guestEmail} 
                        onChange={e => setGuestEmail(e.target.value)} 
                        placeholder="heart@example.com" 
                        className="h-11 rounded-xl bg-muted/30 border-none font-bold text-xs"
                     />
                  </div>
                  <div className="space-y-1.5">
                     <Label className="text-[9px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Phone className="w-2.5 h-2.5" /> Phone
                     </Label>
                     <Input 
                        type="tel" 
                        value={guestPhone} 
                        onChange={e => setGuestPhone(e.target.value)} 
                        placeholder="+1..." 
                        className="h-11 rounded-xl bg-muted/30 border-none font-bold text-xs"
                     />
                  </div>
                  <p className="text-[8px] text-muted-foreground italic font-medium leading-tight text-center">
                    Mandatory billing info for guests. Provide email or phone. ❤️
                  </p>
               </div>
               <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setShowGuestForm(false)} className="h-12 rounded-xl text-[9px] font-black uppercase tracking-widest">Back</Button>
                  <Button type="submit" className="flex-grow h-12 rounded-xl gradient-bg font-black uppercase text-[9px] tracking-widest gap-2">
                    Pay {currencySymbol}{pendingAmount} <ArrowRight className="w-3 h-3" />
                  </Button>
               </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Star, 
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
  
  // Guest Info State
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
      toast({
        title: "Prosperity Sparked!",
        description: "Thank you for investing in humanity and ending poverty! ❤️",
      });
    }
  }, [searchParams, toast]);

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
        description: `Minimum investment is 0.25 ${userCurrency}. ✨`
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
      // Sync identity info from profile
      const details = {
        email: profile?.email || user.email || '',
        phone: profile?.phoneNumber || '',
        address: profile?.address1 || '',
        city: profile?.city || '',
        state: profile?.state || '',
        zip: profile?.postalCode || ''
      };

      const result = await createDonationSession(donationAmount, userCurrency, user.uid, details);
      if (result?.url) {
        window.location.href = result.url;
      } else if (result?.error) {
        throw new Error(result.error);
      }
    } catch (e: any) {
      console.error(e);
      toast({ 
        variant: "destructive", 
        title: "Bridge Disconnected", 
        description: e.message || "Could not reach the payment cloud. Please try again later. ❤️" 
      });
      setIsDonating(false);
    }
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAmount) return;
    if (!guestAddress || !guestCity || !guestState || !guestZip) {
      toast({ variant: "destructive", title: "Location Required", description: "Full billing address is mandatory for guests. ❤️" });
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
        address: guestAddress,
        city: guestCity,
        state: guestState,
        zip: guestZip
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
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden relative">
            {isDonating && (
              <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-6">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter uppercase">Securing Cloud Bridge</h3>
                <p className="text-muted-foreground text-sm font-medium italic mt-2">Connecting to the Prosperity Network. Please wait... ❤️</p>
              </div>
            )}

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
                <div className="flex flex-wrap gap-4 justify-center">
                  {presetOptions.map(opt => (
                    <button 
                      key={opt.val}
                      onClick={() => {
                        setAmount(opt.val);
                        handleDonate(opt.val);
                      }}
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center font-black text-[10px] transition-all border-2 shadow-sm active:scale-95",
                        opt.color,
                        amount === opt.val ? "ring-4 ring-primary ring-offset-2 scale-110 border-primary" : "opacity-80 hover:opacity-100"
                      )}
                    >
                      {currencySymbol}{opt.val}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="custom-amount" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Investment Amount ({userCurrency})</Label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-2xl text-muted-foreground/40">{currencySymbol}</span>
                    <Input 
                      id="custom-amount" 
                      type="number" 
                      min="0.25"
                      step="0.01"
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
                onClick={() => handleDonate()}
                disabled={isDonating || !amount}
              >
                {isDonating ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Sparkles className="w-6 h-6 mr-2" />}
                Propel Prosperity
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Guest Billing Form Dialog */}
      <Dialog open={showGuestForm} onOpenChange={setShowGuestForm}>
        <DialogContent className="sm:max-w-md rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden bg-white max-h-[90vh] overflow-y-auto">
           <DialogHeader className="p-8 bg-slate-900 text-white text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <User className="w-8 h-8 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">Guest Billing</DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Mission Integrity Protocol</DialogDescription>
           </DialogHeader>
           <form onSubmit={handleGuestSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-primary" /> Street Address
                    </Label>
                    <Input 
                      value={guestAddress} 
                      onChange={e => setGuestAddress(e.target.value)} 
                      placeholder="123 Heart Lane" 
                      className="h-12 rounded-xl bg-muted/30 border-none font-bold"
                      required
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                         <Building2 className="w-3 h-3 text-primary" /> City
                       </Label>
                       <Input value={guestCity} onChange={e => setGuestCity(e.target.value)} placeholder="City" className="h-12 rounded-xl bg-muted/30 border-none font-bold" required />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                         <Map className="w-3 h-3 text-primary" /> State
                       </Label>
                       <Input value={guestState} onChange={e => setGuestState(e.target.value)} placeholder="State" className="h-12 rounded-xl bg-muted/30 border-none font-bold" required />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Hash className="w-3 h-3 text-primary" /> Zip / Postal Code
                    </Label>
                    <Input value={guestZip} onChange={e => setGuestZip(e.target.value)} placeholder="00000" className="h-12 rounded-xl bg-muted/30 border-none font-bold" required />
                 </div>
                 <div className="grid grid-cols-2 gap-4 border-t pt-4 border-dashed">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                         <AtSign className="w-3 h-3" /> Email
                       </Label>
                       <Input 
                         type="email" 
                         value={guestEmail} 
                         onChange={e => setGuestEmail(e.target.value)} 
                         placeholder="heart@example.com" 
                         className="h-12 rounded-xl bg-muted/30 border-none font-bold"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                         <Phone className="w-3 h-3" /> Phone
                       </Label>
                       <Input 
                         type="tel" 
                         value={guestPhone} 
                         onChange={e => setGuestPhone(e.target.value)} 
                         placeholder="+1..." 
                         className="h-12 rounded-xl bg-muted/30 border-none font-bold"
                       />
                    </div>
                 </div>
                 <p className="text-[9px] text-muted-foreground italic font-medium text-center">
                    * Full billing address and at least one contact method (email/phone) are mandatory for guests.
                 </p>
              </div>
              <Button type="submit" className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-xs tracking-widest shadow-xl gap-2">
                Continue to Payment <ArrowRight className="w-4 h-4" />
              </Button>
           </form>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}>
      <DonateContent />
    </Suspense>
  );
}

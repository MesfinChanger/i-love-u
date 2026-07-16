
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Store, 
  Sparkles, 
  Loader2, 
  Package, 
  CreditCard, 
  HeartHandshake,
  Percent,
  Save,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { createSubscriptionSession } from '@/lib/stripe-actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { CURRENCIES } from '@/lib/world-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function SellerManageContent() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const adminConfigRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'config', 'pricing');
  }, [db]);
  const { data: adminPricing } = useDoc(adminConfigRef);

  const basicPrice = adminPricing?.basic_seller_fee || 29;
  const proPrice = adminPricing?.pro_seller_fee || 79;

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  const [shopName, setShopName] = useState('');
  const [shopDesc, setShopDesc] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isRequestingNegotiation, setIsRequestingNegotiation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hold Protocol: Load Draft
  useEffect(() => {
    setMounted(true);
    if (user?.uid) {
      const draft = localStorage.getItem(`shop_draft_${user.uid}`);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setShopName(prev => parsed.shopName || prev);
          setShopDesc(prev => parsed.shopDesc || prev);
        } catch (e) {}
      }
    }
  }, [user]);

  // Hold Protocol: Save Draft
  useEffect(() => {
    if (user?.uid && mounted) {
      const draft = { shopName, shopDesc };
      localStorage.setItem(`shop_draft_${user.uid}`, JSON.stringify(draft));
    }
  }, [shopName, shopDesc, user?.uid, mounted]);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: "Subscription Active",
        description: "Welcome to the I Love U Seller community! ✨",
      });
    }
  }, [searchParams, toast]);

  const isApprovedSeller = profile?.isSeller && profile?.sellerStatus === 'approved';
  const sellerStatus = profile?.sellerStatus || 'none';
  const negotiationRequested = profile?.negotiationRequested || false;
  const userCurrency = profile?.currency || 'USD';
  const currencySymbol = useMemo(() => CURRENCIES.find(c => c.code === userCurrency)?.symbol || '$', [userCurrency]);
  const hasFullCommercialInfo = profile?.address1 && profile?.taxId;

  const handleSubscribe = async (plan: 'basic_seller' | 'pro_seller') => {
    if (!user || !db) return;
    
    if (!hasFullCommercialInfo) {
      toast({
        variant: "destructive",
        title: "Verification Required",
        description: "Please complete your Business Address and SSN/TIN in Profile before subscribing."
      });
      router.push('/profile?tab=address');
      return;
    }

    setIsSubscribing(true);
    try {
      if (sellerStatus !== 'approved') {
        await updateDoc(doc(db, 'users', user.uid), {
          sellerStatus: 'pending',
          requestedPlan: plan
        });
      }

      const priceToCharge = plan === 'basic_seller' ? basicPrice : proPrice;
      const result = await createSubscriptionSession(plan, userCurrency, user.uid, priceToCharge);
      if (result?.url) {
        window.location.href = result.url;
      } else if (result?.error) {
        throw new Error(result.error);
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message || "Payment redirect failed." });
      setIsSubscribing(false);
    }
  };

  const handleRequestCommissionPlan = async () => {
    if (!user || !db) return;
    if (!hasFullCommercialInfo) {
      router.push('/profile?tab=address');
      return;
    }
    setIsRequestingNegotiation(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        negotiationRequested: true,
        sellerStatus: 'pending',
        requestedPlan: 'commission_free',
        negotiationTimestamp: new Date().toISOString()
      });
      toast({
        title: "Approval Request Filed",
        description: "Administrators will review your profile for Seller verification. ✨"
      });
    } finally {
      setIsRequestingNegotiation(false);
    }
  };

  const handleSaveShop = async () => {
    if (!user || !db || !profile) return;
    setIsSaving(true);
    try {
      const shopId = `shop-${user.uid}`;
      
      // Strictly adhering to requested Shop schema
      await setDoc(doc(db, 'shops', shopId), {
        ownerId: user.uid,
        name: shopName.trim(),
        description: shopDesc.trim(),
        logo: profile.photoURL || 'https://picsum.photos/seed/shop/200/200',
        country: profile.country || 'Global',
        rating: profile.shopRating || 5, // Default for new shops
        verified: profile.isSellerVerified || false
      }, { merge: true });
      
      localStorage.removeItem(`shop_draft_${user.uid}`);
      toast({ title: "Shop Updated", description: "Your virtual store is live. ✨" });
    } finally {
      setIsSaving(false);
    }
  };

  if (sellerStatus === 'pending') {
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-lg">
           <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white p-12 text-center space-y-8">
              <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto ring-4 ring-white shadow-xl">
                 <Clock className="w-12 h-12 text-amber-500 animate-pulse" />
              </div>
              <div className="space-y-3">
                 <h1 className="text-4xl font-black tracking-tighter uppercase">Verification Pending</h1>
                 <p className="text-muted-foreground font-medium leading-relaxed italic">
                   "Quality builds trust." Our administrators are thoroughly checking your ID, address, and profile for our Mandatory Respect Policy.
                 </p>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] space-y-4 shadow-xl border border-primary/20">
                 <div className="flex items-center gap-3 text-primary justify-center">
                    <FileCheck className="w-6 h-6" />
                    <h4 className="font-black text-xs uppercase tracking-widest">Admin Checklist</h4>
                 </div>
                 <ul className="text-[10px] text-white/70 font-bold uppercase tracking-widest space-y-2 text-left">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Tax ID & Identity Verification</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Physical Address Proof</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Respect & Love Policy Signing</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Human Verification Status</li>
                 </ul>
              </div>
              <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2" onClick={() => router.push('/discover')}>Return to Discovery</Button>
           </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl" role="main">
        {!isApprovedSeller ? (
          <div className="space-y-8 text-center py-12">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Store className="w-12 h-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter">Become a Seller</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Start your business on I Love U. Our **Admin Approval Protocol** ensures a safe, premium marketplace for every heart.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12 items-stretch text-left">
              <Card className="border-2 border-dashed border-green-300 bg-green-50/30 flex flex-col justify-between rounded-[2.5rem]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 uppercase tracking-tighter">
                    <Percent className="w-5 h-5" />
                    Growth
                  </CardTitle>
                  <CardDescription>Free for local artisans</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs text-muted-foreground leading-relaxed italic">Pay zero monthly fees. Use our commission model to scale your craft.</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleRequestCommissionPlan}
                    disabled={isRequestingNegotiation || negotiationRequested}
                    className="w-full rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold h-12 shadow-lg"
                  >
                    {negotiationRequested ? "Awaiting Review" : "Request Approval"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border border-neutral-200 bg-white flex flex-col justify-between rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="uppercase tracking-tighter">Basic Seller</CardTitle>
                  <CardDescription>Perfect for expanding</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{currencySymbol}{basicPrice}/mo flat monthly rate. Subject to admin approval.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-2xl h-12 gradient-bg font-bold" onClick={() => handleSubscribe('basic_seller')} disabled={isSubscribing}>
                    {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Start"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 border-primary bg-primary/5 relative overflow-hidden flex flex-col justify-between rounded-[2.5rem] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2 uppercase tracking-tighter">
                    <Sparkles className="w-4 h-4" />
                    Pro Seller
                  </CardTitle>
                  <CardDescription>Established brands</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{currencySymbol}{proPrice}/mo. Gain maximum visibility and trust badges.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-2xl h-12 gradient-bg font-bold shadow-xl shadow-primary/20" onClick={() => handleSubscribe('pro_seller')} disabled={isSubscribing}>
                    {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Scale"}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-6 max-w-2xl mx-auto mt-12 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                  <ShieldAlert className="w-32 h-32 text-primary" />
               </div>
               <div className="relative z-10 flex items-center gap-4 text-primary justify-center">
                  <HeartHandshake className="w-10 h-10" />
                  <h3 className="font-black text-3xl uppercase tracking-tighter">Identity Protocol</h3>
               </div>
               <p className="text-base text-white/70 italic leading-relaxed px-4">
                 "Prosperity is built on integrity." Every Seller undergoes a thorough administrative check-up of their identity, business address, and policy alignment.
               </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tighter">Manage Your Shop</h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Verified Seller Console</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-none px-4 h-8 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Admin Approved
              </Badge>
            </div>

            <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white">
              <CardHeader className="bg-primary/5 border-b p-8 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Store className="w-8 h-8 text-primary" />
                  Store Identity
                </CardTitle>
                <Save className="w-6 h-6 text-primary/20" />
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="shop-name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Shop Name</Label>
                  <Input id="shop-name" placeholder="e.g. Blossom Luxury Gifts" value={shopName} onChange={e => setShopName(e.target.value)} className="rounded-2xl h-14 bg-muted/20 border-none px-6 text-lg font-bold" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="shop-desc" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Store Description</Label>
                  <Textarea id="shop-desc" placeholder="Describe your mission and what you sell..." value={shopDesc} onChange={e => setShopDesc(e.target.value)} className="rounded-[1.5rem] min-h-[120px] bg-muted/20 border-none p-6" />
                </div>
                <Button className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 gap-2" onClick={handleSaveShop} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Update Storefront & Save
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-8 text-center space-y-3 rounded-[2.5rem] border-none shadow-sm bg-white">
                <Package className="w-10 h-10 text-primary mx-auto opacity-20" />
                <div className="text-4xl font-black tracking-tighter">12</div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Active Products</div>
              </Card>
              <Card className="p-8 text-center space-y-3 rounded-[2.5rem] border-none shadow-sm bg-white">
                <CreditCard className="w-10 h-10 text-green-500 mx-auto opacity-20" />
                <div className="text-4xl font-black tracking-tighter">{currencySymbol}4,250</div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Monthly Sales</div>
              </Card>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

export default function SellerManagePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>}>
      <SellerManageContent />
    </Suspense>
  );
}

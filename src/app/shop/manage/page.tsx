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
  CheckCircle2, 
  Store, 
  Plus, 
  Package, 
  CreditCard, 
  Sparkles, 
  Loader2, 
  TrendingUp, 
  HeartHandshake,
  Percent,
  Check,
  IdCard,
  Save
} from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { createSubscriptionSession } from '@/lib/stripe-actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { CURRENCIES } from '@/lib/world-data';

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

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: "Subscription Active",
        description: "Welcome to the I Love U Seller community! ✨",
      });
    }
  }, [searchParams, toast]);

  const isSeller = profile?.isSeller || false;
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
    const priceToCharge = plan === 'basic_seller' ? basicPrice : proPrice;
    
    try {
      await createSubscriptionSession(plan, userCurrency, user.uid, priceToCharge);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Payment redirect failed." });
      setIsSubscribing(false);
    }
  };

  const handleRequestCommissionPlan = () => {
    if (!user || !db) return;
    if (!hasFullCommercialInfo) {
      router.push('/profile?tab=address');
      return;
    }
    setIsRequestingNegotiation(true);
    updateDoc(doc(db, 'users', user.uid), {
      negotiationRequested: true,
      requestedPlan: 'commission_free',
      negotiationTimestamp: new Date().toISOString()
    });
    toast({
      title: "Agreement Request Filed",
      description: "Administrators will contact you based on your entrepreneur status. ✨"
    });
    setIsRequestingNegotiation(false);
  };

  const handleSaveShop = async () => {
    if (!user || !db) return;
    setIsSaving(true);
    try {
      const shopId = `shop-${user.uid}`;
      await setDoc(doc(db, 'shops', shopId), {
        ownerId: user.uid,
        name: shopName,
        description: shopDesc,
        logoUrl: 'https://picsum.photos/seed/shop/200/200'
      }, { merge: true });
      toast({ title: "Shop Updated", description: "Your virtual store is live. ✨" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl" role="main">
        {!isSeller ? (
          <div className="space-y-8 text-center py-12">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Store className="w-12 h-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter">Become a Seller</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Start your own gifting business on I Love U. Reach local hearts with custom pricing built for growth.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12 items-stretch text-left">
              <Card className="border-2 border-dashed border-green-300 bg-green-50/30 flex flex-col justify-between rounded-[2.5rem]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Percent className="w-5 h-5" />
                    Growth
                  </CardTitle>
                  <CardDescription>Free for local artisans</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs text-muted-foreground leading-relaxed">Pay zero monthly membership fees. Operate via a fair commission model.</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleRequestCommissionPlan}
                    disabled={isRequestingNegotiation || negotiationRequested}
                    className="w-full rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold h-12"
                  >
                    {negotiationRequested ? "Awaiting Review" : "Request Agreement"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border border-neutral-200 bg-white flex flex-col justify-between rounded-[2.5rem]">
                <CardHeader>
                  <CardTitle>Basic Seller</CardTitle>
                  <CardDescription>Perfect for expanding</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs text-muted-foreground leading-relaxed">{currencySymbol}{basicPrice}/mo flat monthly rate. Keep 100% of your earnings.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-2xl h-12 gradient-bg font-bold" onClick={() => handleSubscribe('basic_seller')} disabled={isSubscribing}>
                    {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Basic"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 border-primary bg-primary/5 relative overflow-hidden flex flex-col justify-between rounded-[2.5rem]">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Pro Seller
                  </CardTitle>
                  <CardDescription>Established brands</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs text-muted-foreground leading-relaxed">{currencySymbol}{proPrice}/mo. Gain premium visibility in the gift marketplace.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-2xl h-12 gradient-bg font-bold shadow-xl shadow-primary/20" onClick={() => handleSubscribe('pro_seller')} disabled={isSubscribing}>
                    {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Scale with Pro"}
                  </Button>
                </CardFooter>
              </div>

              <div className="p-8 bg-slate-900 rounded-[3rem] text-white space-y-4 max-w-2xl mx-auto mt-12 shadow-2xl">
               <div className="flex items-center gap-3 text-primary justify-center">
                  <HeartHandshake className="w-8 h-8" />
                  <h3 className="font-black text-2xl uppercase tracking-tighter">Entrepreneur Support</h3>
               </div>
               <p className="text-sm text-white/70 italic leading-relaxed">
                 Are you a local producer? We support your dreams. Join the Prosperity Revolution and fund local job creation through your unique gifts.
               </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h1 className="text-4xl font-black tracking-tighter">Manage Your Shop</h1>
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
                <Button className="w-full rounded-2xl h-16 gradient-bg font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 gap-2" onClick={handleSaveShop} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Update Storefront
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


'use client';

import { useState, useMemo, useEffect } from 'react';
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
  Handshake,
  Percent,
  Check,
  ShieldAlert,
  IdCard
} from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { createSubscriptionSession } from '@/lib/stripe-actions';
import { useSearchParams, useRouter } from 'next/navigation';

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

export default function SellerManagePage() {
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
  const hasFullCommercialInfo = profile?.address && profile?.taxId;

  const handleSubscribe = async (plan: 'basic_seller' | 'pro_seller') => {
    if (!user || !db) return;
    
    if (!hasFullCommercialInfo) {
      toast({
        variant: "destructive",
        title: "Verification Required",
        description: "Please complete your Business Address and SSN/TIN in Profile before subscribing as a Seller."
      });
      router.push('/profile?tab=commercial');
      return;
    }

    setIsSubscribing(true);
    const priceToCharge = plan === 'basic_seller' ? basicPrice : proPrice;
    
    try {
      await createSubscriptionSession(plan, userCurrency, user.uid, priceToCharge);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Payment redirect failed." });
      setIsSubscribing(false);
    }
  };

  const handleRequestCommissionPlan = () => {
    if (!user || !db) return;

    if (!hasFullCommercialInfo) {
      toast({
        variant: "destructive",
        title: "Verification Required",
        description: "Please complete your Business Address and SSN/TIN in Profile before requesting a plan."
      });
      router.push('/profile?tab=commercial');
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
      description: "Administrators will contact you to sign your custom commission agreement based on your entrepreneur status. ✨"
    });
    setIsRequestingNegotiation(false);
  };

  const handleSaveShop = () => {
    if (!user || !db) return;
    const shopId = `shop-${user.uid}`;
    setDoc(doc(db, 'shops', shopId), {
      ownerId: user.uid,
      name: shopName,
      description: shopDesc,
      logoUrl: 'https://picsum.photos/seed/shop/200/200'
    }, { merge: true });
    toast({ title: "Shop Updated", description: "Your virtual store is live." });
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
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start your own gifting business on I Love U. Reach local hearts with custom pricing structures built for real growth.
            </p>

            {!hasFullCommercialInfo && (
              <Card className="max-w-xl mx-auto rounded-[2.5rem] border-2 border-dashed border-amber-300 bg-amber-50 p-6 flex items-center gap-4 text-left">
                 <div className="p-3 bg-white rounded-full text-amber-600 shadow-sm">
                   <IdCard className="w-6 h-6" />
                 </div>
                 <div className="flex-grow">
                   <h3 className="font-black uppercase tracking-tighter text-amber-900">Verification Required</h3>
                   <p className="text-xs text-amber-700">Commercial sellers must provide a Business Address and SSN/TIN for tax compliance before opening a shop.</p>
                 </div>
                 <Button variant="outline" size="sm" onClick={() => router.push('/profile')} className="rounded-xl font-bold bg-white">Verify</Button>
              </Card>
            )}
            
            <div className="flex flex-col items-center gap-4 mt-6">
              <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-3 px-6 rounded-2xl border border-blue-100 w-full max-w-md">
                 <TrendingUp className="w-5 h-5" aria-hidden="true" />
                 <span className="text-sm font-bold uppercase tracking-wider">Demand-Based Pricing Enabled</span>
              </div>
              
              <div className="p-6 bg-green-50 text-green-800 rounded-3xl border border-green-200 w-full max-w-xl space-y-3 mx-auto text-left">
                <div className="flex items-center gap-2 justify-center text-center">
                  <Handshake className="w-6 h-6 text-green-600" aria-hidden="true" />
                  <h3 className="font-black text-lg uppercase tracking-tight">100% Negotiable and Supportive</h3>
                </div>
                <p className="text-xs font-medium leading-relaxed text-center">
                  Are you a <strong>Local Producer</strong> or a <strong>New Entrepreneur</strong>? We support your dreams. 
                  Choose standard sub plans or start absolutely free with a tailored commission model.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12 items-stretch text-left">
              <Card className="border-2 border-dashed border-green-300 bg-green-50/30 flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="flex items-center gap-1.5 text-green-700">
                    <Percent className="w-5 h-5 text-green-600" aria-hidden="true" />
                    Growth Plan
                  </CardTitle>
                  <CardDescription>Free setup for local artisans</CardDescription>
                  <div className="text-2xl font-black mt-4 text-green-800">
                    {currencySymbol}0/mo
                    <span className="block text-[10px] text-green-600 uppercase font-normal mt-1">Custom Commission Rate</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm flex-grow">
                  <p className="text-xs text-muted-foreground">Pay zero monthly membership fees. Instead, operate via a fair commission percentage determined by your signed agreement.</p>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700"><Check className="w-3.5 h-3.5 text-green-600" aria-hidden="true" /> Complete storefront setup</div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700"><Check className="w-3.5 h-3.5 text-green-600" aria-hidden="true" /> Mutually agreed sales cut</div>
                </CardContent>
                <CardFooter>
                  {negotiationRequested ? (
                    <Button disabled className="w-full rounded-xl bg-green-200 text-green-700">Awaiting Admin Signoff</Button>
                  ) : (
                    <Button 
                      onClick={handleRequestCommissionPlan}
                      disabled={isRequestingNegotiation}
                      className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                      Request Agreement
                    </Button>
                  )}
                </CardFooter>
              </Card>

              <Card className="border border-neutral-200 bg-white flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>Basic Seller</CardTitle>
                  <CardDescription>Perfect for expanding operations</CardDescription>
                  <div className="text-2xl font-black mt-4">
                    {currencySymbol}{basicPrice}/mo
                    <span className="block text-[10px] text-muted-foreground uppercase font-normal mt-1">Flat Monthly Rate</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm flex-grow">
                  <p className="text-xs text-muted-foreground">Keep 100% of your earnings minus standard credit card processor rates. Standard monthly entry plan.</p>
                  <div className="flex items-center gap-2 text-xs"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden="true" /> List up to 10 products</div>
                  <div className="flex items-center gap-2 text-xs"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden="true" /> Core metrics & sales tracking</div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-xl gradient-bg" onClick={() => handleSubscribe('basic_seller')} disabled={isSubscribing}>
                    {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Basic Plan"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 border-primary bg-primary/5 relative overflow-hidden flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    Pro Seller
                  </CardTitle>
                  <CardDescription>For prominent established brands</CardDescription>
                  <div className="text-2xl font-black mt-4 text-primary">
                    {currencySymbol}{proPrice}/mo
                    <span className="block text-[10px] text-primary/60 uppercase font-normal mt-1">Priority Store Placement</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm flex-grow">
                  <p className="text-xs text-muted-foreground">Gain premium visibility indicators in the gift marketplace to attract maximum matching gift purchases.</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary"><CheckCircle2 className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> Unlimited inventory space</div>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary"><CheckCircle2 className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> Featured store listing</div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-xl gradient-bg" onClick={() => handleSubscribe('pro_seller')} disabled={isSubscribing}>
                    {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Scale with Pro"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h1 className="text-4xl font-black tracking-tighter">Manage Your Shop</h1>
            
            <Card className="rounded-[2rem] border-none shadow-xl overflow-hidden bg-white">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-6 h-6" aria-hidden="true" />
                  Store Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="shop-name">Shop Name</Label>
                  <Input id="shop-name" placeholder="e.g. Blossom Luxury Gifts" value={shopName} onChange={e => setShopName(e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shop-desc">Store Description</Label>
                  <Textarea id="shop-desc" placeholder="Describe what you sell..." value={shopDesc} onChange={e => setShopDesc(e.target.value)} className="rounded-xl min-h-[100px]" />
                </div>
                <Button className="w-full rounded-xl gradient-bg h-12" onClick={handleSaveShop}>Update Storefront</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center space-y-2 rounded-[1.5rem] border-none shadow-sm bg-white">
                <Package className="w-8 h-8 text-primary mx-auto" aria-hidden="true" />
                <div className="text-2xl font-black">12</div>
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Products</div>
              </Card>
              <Card className="p-6 text-center space-y-2 rounded-[1.5rem] border-none shadow-sm bg-white">
                <CreditCard className="w-8 h-8 text-green-500 mx-auto" aria-hidden="true" />
                <div className="text-2xl font-black">{currencySymbol}4,250</div>
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Monthly Sales</div>
              </Card>
            </div>

            <Button variant="outline" className="w-full rounded-xl gap-2 h-14 border-2">
              <Plus className="w-5 h-5" aria-hidden="true" />
              Add New Product
            </Button>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

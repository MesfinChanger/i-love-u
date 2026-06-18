
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Store, Plus, Package, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { createSubscriptionSession } from '@/lib/stripe-actions';
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

export default function SellerManagePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  const [shopName, setShopName] = useState('');
  const [shopDesc, setShopDesc] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: "Subscription Active",
        description: "Welcome to the Spark Seller community! ✨",
      });
    }
  }, [searchParams, toast]);

  const isSeller = profile?.isSeller || false;
  const userCurrency = profile?.currency || 'USD';
  const currencySymbol = useMemo(() => CURRENCIES.find(c => c.code === userCurrency)?.symbol || '$', [userCurrency]);

  const handleSubscribe = async (plan: 'basic_seller' | 'pro_seller') => {
    if (!user || !db) return;
    setIsSubscribing(true);
    try {
      await createSubscriptionSession(plan, userCurrency, user.uid);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Payment redirect failed." });
      setIsSubscribing(false);
    }
  };

  const handleSaveShop = async () => {
    if (!user || !db) return;
    const shopId = `shop-${user.uid}`;
    await setDoc(doc(db, 'shops', shopId), {
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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {!isSeller ? (
          <div className="space-y-8 text-center py-12">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Store className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter">Become a Seller</h1>
            <p className="text-xl text-muted-foreground">Start your own gifting business on Spark. Reach local sparks with localized pricing.</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card className="border-2 border-primary/20 bg-white">
                <CardHeader>
                  <CardTitle>Basic Seller</CardTitle>
                  <CardDescription>Perfect for local artisans</CardDescription>
                  <div className="text-3xl font-black mt-4">{currencySymbol}29/mo</div>
                </CardHeader>
                <CardContent className="space-y-4 text-left">
                  <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> List up to 10 products</div>
                  <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Basic sales analytics</div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-xl gradient-bg" onClick={() => handleSubscribe('basic_seller')} disabled={isSubscribing}>
                    {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Basic Plan"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-4 border-primary bg-primary/5 relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Pro Seller
                  </CardTitle>
                  <CardDescription>For growing businesses</CardDescription>
                  <div className="text-3xl font-black mt-4">{currencySymbol}79/mo</div>
                </CardHeader>
                <CardContent className="space-y-4 text-left">
                  <div className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited products</div>
                  <div className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="w-4 h-4 text-primary" /> Priority Placement</div>
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
                  <Store className="w-6 h-6" />
                  Store Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label>Shop Name</Label>
                  <Input placeholder="e.g. Blossom Luxury Gifts" value={shopName} onChange={e => setShopName(e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Store Description</Label>
                  <Textarea placeholder="Describe what you sell..." value={shopDesc} onChange={e => setShopDesc(e.target.value)} className="rounded-xl min-h-[100px]" />
                </div>
                <Button className="w-full rounded-xl gradient-bg h-12" onClick={handleSaveShop}>Update Storefront</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center space-y-2 rounded-[1.5rem] border-none shadow-sm bg-white">
                <Package className="w-8 h-8 text-primary mx-auto" />
                <div className="text-2xl font-black">12</div>
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Products</div>
              </Card>
              <Card className="p-6 text-center space-y-2 rounded-[1.5rem] border-none shadow-sm bg-white">
                <CreditCard className="w-8 h-8 text-green-500 mx-auto" />
                <div className="text-2xl font-black">{currencySymbol}4,250</div>
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Monthly Sales</div>
              </Card>
            </div>

            <Button variant="outline" className="w-full rounded-xl gap-2 h-14 border-2">
              <Plus className="w-5 h-5" />
              Add New Product
            </Button>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

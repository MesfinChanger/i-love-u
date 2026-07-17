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
  Percent,
  Save,
  Clock,
  CheckCircle2,
  FileCheck,
  Plus,
  Trash2,
  Tags
} from 'lucide-react';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, updateDoc, collection, serverTimestamp, query, where, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { createSubscriptionSession } from '@/lib/stripe-actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { CURRENCIES } from '@/lib/world-data';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { createProduct } from '@/services/shop/product.service';
import Link from 'next/link';

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

  const productsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'products'), where('sellerId', '==', user.uid));
  }, [db, user]);
  const { data: myProducts, loading: productsLoading } = useCollection(productsQuery);

  useEffect(() => {
    setMounted(true);
    if (user?.uid) {
      const draft = localStorage.getItem(`shop_draft_${user.uid}`);
      if (draft && draft.trim()) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed && typeof parsed === 'object') {
            setShopName(prev => parsed.shopName || prev);
            setShopDesc(prev => parsed.shopDesc || prev);
          }
        } catch (e) {
          console.warn("Draft Synchronization Ripple:", e);
        }
      }
    }
  }, [user]);

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
        description: "Please complete your Business Address and SSN/TIN in Profile."
      });
      router.push('/profile?tab=address');
      return;
    }
    setIsSubscribing(true);
    try {
      const priceToCharge = plan === 'basic_seller' ? basicPrice : proPrice;
      const result = await createSubscriptionSession(plan, userCurrency, user.uid, priceToCharge);
      if (result?.url) window.location.href = result.url;
    } catch (e) {
      setIsSubscribing(false);
    }
  };

  const handleRequestCommissionPlan = async () => {
    if (!user || !db) return;
    setIsRequestingNegotiation(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        negotiationRequested: true,
        sellerStatus: 'pending',
        requestedPlan: 'commission_free',
      });
      toast({ title: "Approval Request Sent", description: "Review in progress. ✨" });
    } finally {
      setIsRequestingNegotiation(false);
    }
  };

  const handleSaveShop = async () => {
    if (!user || !db) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'shops', `shop-${user.uid}`), {
        ownerId: user.uid,
        name: shopName.trim(),
        description: shopDesc.trim(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      toast({ title: "Shop Updated", description: "Identity synchronized. ✨" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast({ title: "Product Removed", description: "Listing deleted." });
    } catch (e) {}
  };

  if (sellerStatus === 'pending') {
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-lg text-center">
           <Card className="rounded-[3rem] border-none shadow-2xl p-12 space-y-8 bg-white">
              <Clock className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full p-4 mx-auto animate-pulse" />
              <h1 className="text-4xl font-black uppercase">Verification Pending</h1>
              <p className="text-muted-foreground font-medium italic">Our guardians are reviewing your profile. ❤️</p>
              <Button variant="outline" className="w-full h-14 rounded-2xl" onClick={() => router.push('/dashboard')}>Return Home</Button>
           </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {!isApprovedSeller ? (
          <div className="space-y-8 text-center py-12">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Store className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter">Become a Seller</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium italic">"Launch your prosperity journey on I Love U."</p>

            <div className="grid md:grid-cols-3 gap-6 mt-12 items-stretch text-left">
              <Card className="border-2 border-dashed border-green-300 bg-green-50/30 flex flex-col justify-between rounded-[2.5rem]">
                <CardHeader>
                  <CardTitle className="text-green-700 uppercase tracking-tighter flex items-center gap-2">
                    <Percent className="w-5 h-5" /> Growth
                  </CardTitle>
                  <CardDescription>Free for local artisans</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={handleRequestCommissionPlan} disabled={negotiationRequested} className="w-full rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold h-12">
                    {negotiationRequested ? "Awaiting Review" : "Request Approval"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border border-neutral-200 bg-white flex flex-col justify-between rounded-[2.5rem] shadow-sm">
                <CardHeader>
                  <CardTitle className="uppercase tracking-tighter">Basic Seller</CardTitle>
                  <CardDescription>{currencySymbol}{basicPrice}/mo</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full rounded-2xl h-12 gradient-bg font-bold" onClick={() => handleSubscribe('basic_seller')} disabled={isSubscribing}>
                    {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Mission"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 border-primary bg-primary/5 flex flex-col justify-between rounded-[2.5rem] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2 uppercase tracking-tighter">
                    <Sparkles className="w-4 h-4" /> Pro Seller
                  </CardTitle>
                  <CardDescription>{currencySymbol}{proPrice}/mo</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full rounded-2xl h-12 gradient-bg font-bold shadow-xl shadow-primary/20" onClick={() => handleSubscribe('pro_seller')} disabled={isSubscribing}>
                    {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Scale"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tighter">Seller Console</h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Verified Marketplace</p>
              </div>
              <Button asChild variant="outline" className="rounded-xl h-10 px-4 font-black uppercase text-[9px] border-2">
                 <Link href="/shop/manage/create">Add Product</Link>
              </Button>
            </div>

            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="grid grid-cols-2 h-14 bg-white/50 backdrop-blur-md rounded-2xl p-1 mb-8 border">
                <TabsTrigger value="inventory" className="rounded-xl text-[10px] font-black uppercase gap-2"><Package className="w-4 h-4" /> Inventory</TabsTrigger>
                <TabsTrigger value="storefront" className="rounded-xl text-[10px] font-black uppercase gap-2"><Store className="w-4 h-4" /> Storefront</TabsTrigger>
              </TabsList>

              <TabsContent value="storefront" className="animate-in fade-in">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Shop Name</Label>
                    <Input value={shopName} onChange={e => setShopName(e.target.value)} className="rounded-2xl h-14 bg-muted/20 border-none font-bold px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Mission Description</Label>
                    <Textarea value={shopDesc} onChange={e => setShopDesc(e.target.value)} className="rounded-[1.5rem] min-h-[120px] bg-muted/20 border-none p-6" />
                  </div>
                  <Button className="w-full h-16 rounded-2xl gradient-bg font-black uppercase shadow-xl gap-2" onClick={handleSaveShop} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Sync Storefront
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6 animate-in fade-in">
                 <div className="grid gap-4">
                    {productsLoading ? (
                       <div className="flex justify-center py-20 opacity-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
                    ) : myProducts && myProducts.length > 0 ? (
                       myProducts.map((p: any) => (
                          <Card key={p.id} className="rounded-[2rem] border-none shadow-md bg-white overflow-hidden p-4 flex items-center gap-4">
                             <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-muted shrink-0">
                                <Image src={p.images?.[0] || 'https://picsum.photos/seed/product/200/200'} alt={p.name} fill className="object-cover" />
                             </div>
                             <div className="flex-grow min-w-0">
                                <h3 className="font-black text-lg truncate">{p.name}</h3>
                                <p className="text-[10px] font-bold text-primary">{currencySymbol}{p.price} • {p.inventory} Stock</p>
                                <Badge variant="outline" className="text-[7px] font-black uppercase mt-2">{p.category}</Badge>
                             </div>
                             <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p.id)} className="rounded-xl text-muted-foreground/20 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                             </Button>
                          </Card>
                       ))
                    ) : (
                       <div className="text-center py-24 bg-white/40 rounded-[3rem] border-2 border-dashed border-muted">
                          <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                          <p className="text-sm font-black uppercase text-muted-foreground tracking-widest">No products listed.</p>
                       </div>
                    )}
                 </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

export default function SellerManagePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}>
      <SellerManageContent />
    </Suspense>
  );
}

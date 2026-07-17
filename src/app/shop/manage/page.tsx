
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
  FileCheck,
  Plus,
  Trash2,
  ImageIcon,
  Tags
} from 'lucide-react';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, updateDoc, collection, addDoc, serverTimestamp, query, where, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { createSubscriptionSession } from '@/lib/stripe-actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { CURRENCIES } from '@/lib/world-data';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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

  // Shop Identity State
  const [shopName, setShopName] = useState('');
  const [shopDesc, setShopDesc] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isRequestingNegotiation, setIsRequestingNegotiation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Product Management State
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('General');
  const [newProductInventory, setNewProductInventory] = useState('10');
  const [newProductImageUrl, setNewProductImageUrl] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const productsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'products'), where('storeId', '==', user.uid));
  }, [db, user]);
  const { data: myProducts, loading: productsLoading } = useCollection(productsQuery);

  // Hold Protocol: Load Draft with JSON resilience
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
      await setDoc(doc(db, 'shops', shopId), {
        ownerId: user.uid,
        name: shopName.trim(),
        description: shopDesc.trim(),
        logo: profile.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`,
        country: profile.country || 'Global',
        rating: profile.shopRating || 5,
        verified: profile.isSellerVerified || false
      }, { merge: true });
      
      localStorage.removeItem(`shop_draft_${user.uid}`);
      toast({ title: "Shop Updated", description: "Your virtual store is live. ✨" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = async () => {
    if (!user || !db || !newProductName || !newProductPrice) return;
    setIsAddingProduct(true);
    try {
      await addDoc(collection(db, 'products'), {
        storeId: user.uid,
        name: newProductName.trim(),
        description: newProductDesc.trim(),
        price: parseFloat(newProductPrice),
        currency: userCurrency,
        category: newProductCategory,
        inventory: parseInt(newProductInventory),
        images: [newProductImageUrl || `https://picsum.photos/seed/${newProductName.length}/600/600`],
        createdAt: serverTimestamp()
      });

      setNewProductName('');
      setNewProductDesc('');
      setNewProductPrice('');
      setNewProductImageUrl('');
      toast({ title: "Product Listed", description: "Your item is now live in the marketplace! ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to list product." });
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast({ title: "Product Removed", description: "Listing has been deleted." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not remove listing." });
    }
  };

  if (sellerStatus === 'pending') {
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto px-4 py-12 max-lg text-center">
           <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white p-12 text-center space-y-8">
              <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto ring-4 ring-white shadow-xl">
                 <Clock className="w-12 h-12 text-amber-500 animate-pulse" />
              </div>
              <div className="space-y-3">
                 <h1 className="text-4xl font-black tracking-tighter uppercase">Verification Pending</h1>
                 <p className="text-muted-foreground font-medium italic">
                   "Quality builds trust." Our administrators are thoroughly checking your ID, address, and profile alignment.
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
      <main className="container mx-auto px-4 py-8 max-w-5xl" role="main">
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
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{currencySymbol}{basicPrice}/mo flat monthly rate.</p>
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
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{currencySymbol}{proPrice}/mo. Gain maximum visibility.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-2xl h-12 gradient-bg font-bold shadow-xl shadow-primary/20" onClick={() => handleSubscribe('pro_seller')} disabled={isSubscribing}>
                    {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Scale"}
                  </Button>
                </CardFooter>
              </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tighter">Seller Console</h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Verified Store Management</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-none px-4 h-8 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Admin Approved
              </Badge>
            </div>

            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="grid grid-cols-2 h-14 bg-white/50 backdrop-blur-md rounded-2xl p-1 mb-8 border">
                <TabsTrigger value="inventory" className="rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                   <Package className="w-4 h-4" />
                   Inventory
                </TabsTrigger>
                <TabsTrigger value="storefront" className="rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                   <Store className="w-4 h-4" />
                   Storefront
                </TabsTrigger>
              </TabsList>

              <TabsContent value="storefront" className="animate-in fade-in slide-in-from-bottom-2">
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
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Shop Name</Label>
                      <Input placeholder="e.g. Blossom Luxury Gifts" value={shopName} onChange={e => setShopName(e.target.value)} className="rounded-2xl h-14 bg-muted/20 border-none px-6 text-lg font-bold" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Store Description</Label>
                      <Textarea placeholder="Describe your mission and what you sell..." value={shopDesc} onChange={e => setShopDesc(e.target.value)} className="rounded-[1.5rem] min-h-[120px] bg-muted/20 border-none p-6" />
                    </div>
                    <Button className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-xs shadow-xl gap-2" onClick={handleSaveShop} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Update Storefront
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                 <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5">
                       <Card className="rounded-[2.5rem] border-none shadow-xl bg-white sticky top-24 overflow-hidden">
                          <CardHeader className="bg-slate-900 text-white p-8">
                             <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                                <Plus className="w-6 h-6 text-primary" />
                                Add Product
                             </CardTitle>
                          </CardHeader>
                          <CardContent className="p-8 space-y-5">
                             <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest ml-1">Product Name</Label>
                                <Input value={newProductName} onChange={e => setNewProductName(e.target.value)} placeholder="e.g. Handmade Leather Bag" className="h-12 rounded-xl bg-muted/30 border-none font-bold" />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                   <Label className="text-[9px] font-black uppercase tracking-widest ml-1">Price ({currencySymbol})</Label>
                                   <Input type="number" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} placeholder="0.00" className="h-12 rounded-xl bg-muted/30 border-none font-bold" />
                                </div>
                                <div className="space-y-1.5">
                                   <Label className="text-[9px] font-black uppercase tracking-widest ml-1">Stock</Label>
                                   <Input type="number" value={newProductInventory} onChange={e => setNewProductInventory(e.target.value)} placeholder="10" className="h-12 rounded-xl bg-muted/30 border-none font-bold" />
                                </div>
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest ml-1">Category</Label>
                                <Input value={newProductCategory} onChange={e => setNewProductCategory(e.target.value)} placeholder="General" className="h-12 rounded-xl bg-muted/30 border-none font-bold" />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest ml-1">Image URL</Label>
                                <Input value={newProductImageUrl} onChange={e => setNewProductImageUrl(e.target.value)} placeholder="https://..." className="h-12 rounded-xl bg-muted/30 border-none font-bold text-xs" />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest ml-1">Description</Label>
                                <Textarea value={newProductDesc} onChange={e => setNewProductDesc(e.target.value)} placeholder="What makes this product special?" className="min-h-[100px] rounded-xl bg-muted/30 border-none font-medium italic text-xs" />
                             </div>
                             <Button onClick={handleAddProduct} disabled={isAddingProduct || !newProductName || !newProductPrice} className="w-full h-14 rounded-2xl gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl">
                                {isAddingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sync Listing"}
                             </Button>
                          </CardContent>
                       </Card>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                       <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 ml-2">
                          <Tags className="w-5 h-5 text-primary" />
                          Live Inventory
                       </h2>

                       <div className="grid gap-4">
                          {productsLoading ? (
                             <div className="flex justify-center py-20 opacity-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
                          ) : myProducts && myProducts.length > 0 ? (
                             myProducts.map((p: any) => (
                                <Card key={p.id} className="rounded-[2rem] border-none shadow-md bg-white overflow-hidden group hover:shadow-xl transition-all">
                                   <div className="flex items-center p-4 gap-4">
                                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-muted shrink-0">
                                         <Image src={p.images?.[0] || 'https://picsum.photos/seed/product/200/200'} alt={p.name} fill className="object-cover" />
                                      </div>
                                      <div className="flex-grow min-w-0">
                                         <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-black text-lg truncate tracking-tight">{p.name}</h3>
                                            <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black">{currencySymbol}{p.price}</Badge>
                                         </div>
                                         <p className="text-[10px] text-muted-foreground font-medium italic line-clamp-1 mb-2">"{p.description}"</p>
                                         <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="text-[7px] font-black uppercase border-muted-foreground/20 text-muted-foreground/60">{p.category}</Badge>
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">{p.inventory} in stock</span>
                                         </div>
                                      </div>
                                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p.id)} className="rounded-xl text-muted-foreground/20 hover:text-red-500 hover:bg-red-50 transition-colors">
                                         <Trash2 className="w-4 h-4" />
                                      </Button>
                                   </div>
                                </Card>
                             ))
                          ) : (
                             <div className="text-center py-24 bg-white/40 rounded-[3rem] border-2 border-dashed border-muted">
                                <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                <p className="text-sm font-black uppercase text-muted-foreground tracking-widest">No products listed yet.</p>
                             </div>
                          )}
                       </div>
                    </div>
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>}>
      <SellerManageContent />
    </Suspense>
  );
}

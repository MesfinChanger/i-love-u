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
  Save, 
  Clock, 
  CheckCircle2, 
  FileCheck, 
  Plus, 
  Trash2, 
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

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  const [shopName, setShopName] = useState('');
  const [shopDesc, setShopDesc] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    if (user?.uid && mounted) {
      const draft = { shopName, shopDesc };
      localStorage.setItem(`shop_draft_${user.uid}`, JSON.stringify(draft));
    }
  }, [shopName, shopDesc, user?.uid, mounted]);

  const isApprovedSeller = profile?.isSeller && profile?.sellerStatus === 'approved';
  const sellerStatus = profile?.sellerStatus || 'none';
  const userCurrency = profile?.currency || 'USD';
  const currencySymbol = CURRENCIES.find(c => c.code === userCurrency)?.symbol || '$';

  const handleApply = async () => {
    if (!user || !db) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { sellerStatus: 'pending' });
      toast({ title: "Application Sent", description: "Review in progress. ✨" });
    } catch (e) {}
  };

  const handleSaveShop = async () => {
    if (!user || !db || !profile) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'shops', `shop-${user.uid}`), {
        ownerId: user.uid,
        name: shopName.trim(),
        description: shopDesc.trim(),
        logo: profile.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`,
        country: profile.country || 'Global',
        rating: profile.shopRating || 5,
        verified: profile.isSellerVerified || false
      }, { merge: true });
      localStorage.removeItem(`shop_draft_${user.uid}`);
      toast({ title: "Shop Synchronized", description: "Identity updated. ✨" });
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
      setNewProductPrice('');
      toast({ title: "Product Sync Successful", description: "Item listed! ❤️" });
    } finally {
      setIsAddingProduct(false);
    }
  };

  if (sellerStatus === 'pending') {
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-lg text-center">
           <Card className="rounded-[3rem] border-none shadow-2xl p-12 space-y-8">
              <Clock className="w-20 h-20 text-amber-500 mx-auto animate-pulse" />
              <h1 className="text-4xl font-black uppercase">Verification Pending</h1>
              <p className="text-muted-foreground font-medium italic">Our community guardians are reviewing your identity. Respect is mandatory. ❤️</p>
              <Button variant="outline" className="w-full h-14 rounded-2xl" onClick={() => router.push('/spark')}>Return to Spark</Button>
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
          <div className="text-center py-20 space-y-8">
            <Store className="w-24 h-24 text-primary mx-auto mb-4" />
            <h1 className="text-5xl font-black uppercase">Start Your Prosperity</h1>
            <p className="text-xl text-muted-foreground font-medium italic">Launch a verified artisan shop to reach local hearts.</p>
            <Button onClick={handleApply} className="h-16 px-12 rounded-[2rem] gradient-bg font-black uppercase text-xs shadow-xl">Apply for Seller Status</Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
               <h1 className="text-4xl font-black uppercase">Artisan Console</h1>
               <Badge className="bg-green-100 text-green-700 px-4 h-8 uppercase font-black">✓ Verified</Badge>
            </div>
            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="grid grid-cols-2 h-14 bg-white/50 backdrop-blur-md rounded-2xl p-1 mb-8 border">
                <TabsTrigger value="inventory" className="rounded-xl text-[10px] font-black uppercase">Inventory</TabsTrigger>
                <TabsTrigger value="storefront" className="rounded-xl text-[10px] font-black uppercase">Storefront</TabsTrigger>
              </TabsList>
              <TabsContent value="storefront" className="space-y-6">
                <Card className="rounded-[2.5rem] p-8 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Shop Name</Label>
                    <Input value={shopName} onChange={e => setShopName(e.target.value)} className="h-14 rounded-2xl bg-muted/20 border-none font-bold" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mission Description</Label>
                    <Textarea value={shopDesc} onChange={e => setShopDesc(e.target.value)} className="min-h-[120px] rounded-[1.5rem] bg-muted/20 border-none p-6" />
                  </div>
                  <Button onClick={handleSaveShop} disabled={isSaving} className="w-full h-16 rounded-2xl gradient-bg font-black uppercase shadow-xl">
                    {isSaving ? <Loader2 className="animate-spin" /> : "Update Storefront"}
                  </Button>
                </Card>
              </TabsContent>
              <TabsContent value="inventory" className="grid lg:grid-cols-12 gap-8">
                 <div className="lg:col-span-5">
                    <Card className="rounded-[2.5rem] p-8 space-y-5 sticky top-24">
                       <h3 className="font-black uppercase flex items-center gap-3"><Plus className="text-primary" /> Add Product</h3>
                       <Input value={newProductName} onChange={e => setNewProductName(e.target.value)} placeholder="Product Name" className="h-12 rounded-xl bg-muted/30 border-none" />
                       <div className="grid grid-cols-2 gap-4">
                          <Input value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} placeholder={currencySymbol + "0.00"} className="h-12 rounded-xl bg-muted/30 border-none" />
                          <Input value={newProductInventory} onChange={e => setNewProductInventory(e.target.value)} placeholder="Stock" className="h-12 rounded-xl bg-muted/30 border-none" />
                       </div>
                       <Button onClick={handleAddProduct} disabled={isAddingProduct} className="w-full h-14 rounded-2xl gradient-bg uppercase font-black">Sync Listing</Button>
                    </Card>
                 </div>
                 <div className="lg:col-span-7 space-y-4">
                    {myProducts?.map((p: any) => (
                       <Card key={p.id} className="p-4 rounded-3xl flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-xl bg-muted overflow-hidden">
                             <Image src={p.images?.[0]} alt={p.name} fill className="object-cover" />
                          </div>
                          <div className="flex-grow">
                             <h4 className="font-black truncate">{p.name}</h4>
                             <p className="text-[10px] font-bold text-primary">{currencySymbol}{p.price} • {p.inventory} Stock</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc(db, 'products', p.id))} className="text-muted-foreground/20 hover:text-red-500"><Trash2 /></Button>
                       </Card>
                    ))}
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
  return <Suspense><SellerManageContent /></Suspense>;
}

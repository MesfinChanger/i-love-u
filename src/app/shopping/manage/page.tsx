'use client';

import { useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Store, 
  Loader2, 
  Save, 
  Clock, 
  Plus, 
  Trash2
} from 'lucide-react';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, updateDoc, collection, addDoc, serverTimestamp, query, where, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useRouter } from 'next/navigation';
import { CURRENCIES } from '@/lib/world-data';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

function SellerManageContent() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  const [shopName, setShopName] = useState('');
  const [shopDesc, setShopDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const productsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'products'), where('storeId', '==', user.uid));
  }, [db, user]);
  const { data: myProducts, loading: productsLoading } = useCollection(productsQuery);

  const isApprovedSeller = profile?.isSeller && profile?.sellerStatus === 'approved';
  const sellerStatus = profile?.sellerStatus || 'none';

  const handleApply = async () => {
    if (!user || !db) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { sellerStatus: 'pending' });
      toast({ title: "Application Sent", description: "Guardian review active. ✨" });
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
        country: profile.country || 'Global'
      }, { merge: true });
      toast({ title: "Shop Updated", description: "Identity synchronized. ✨" });
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
        price: parseFloat(newProductPrice),
        createdAt: serverTimestamp()
      });
      setNewProductName(''); setNewProductPrice('');
      toast({ title: "Product Synced", description: "Item listed! ❤️" });
    } finally {
      setIsAddingProduct(false);
    }
  };

  if (sellerStatus === 'pending') {
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-lg text-center">
           <Card className="rounded-[3rem] p-12 space-y-8">
              <Clock className="w-16 h-16 text-amber-500 mx-auto animate-pulse" />
              <h1 className="text-3xl font-black uppercase">Pending Approval</h1>
              <p className="text-muted-foreground italic">Guardians are reviewing your artisan status. ❤️</p>
              <Button variant="outline" className="w-full h-14 rounded-2xl" onClick={() => router.push('/shopping')}>Return Home</Button>
           </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        {!isApprovedSeller ? (
          <div className="text-center py-20 space-y-8">
            <Store className="w-24 h-24 text-primary mx-auto" />
            <h1 className="text-5xl font-black uppercase">Launch Artisan Store</h1>
            <Button onClick={handleApply} className="h-16 px-12 rounded-[2rem] gradient-bg font-black uppercase">Apply for Seller Status</Button>
          </div>
        ) : (
          <div className="space-y-8">
            <h1 className="text-4xl font-black uppercase">Artisan Console</h1>
            <Tabs defaultValue="inventory" className="w-full space-y-8">
              <TabsList className="grid grid-cols-2 h-14 bg-white/50 rounded-2xl p-1 border">
                <TabsTrigger value="inventory" className="rounded-xl font-black uppercase text-[10px]">Inventory</TabsTrigger>
                <TabsTrigger value="storefront" className="rounded-xl font-black uppercase text-[10px]">Storefront</TabsTrigger>
              </TabsList>
              <TabsContent value="storefront">
                <Card className="rounded-[2.5rem] p-8 space-y-6">
                  <div className="space-y-3"><Label className="text-[10px] font-black uppercase">Shop Name</Label><Input value={shopName} onChange={e => setShopName(e.target.value)} className="h-14 rounded-2xl" /></div>
                  <div className="space-y-3"><Label className="text-[10px] font-black uppercase">Description</Label><Textarea value={shopDesc} onChange={e => setShopDesc(e.target.value)} className="min-h-[120px] rounded-xl" /></div>
                  <Button onClick={handleSaveShop} disabled={isSaving} className="w-full h-16 rounded-2xl gradient-bg font-black uppercase">{isSaving ? <Loader2 className="animate-spin" /> : "Update Storefront"}</Button>
                </Card>
              </TabsContent>
              <TabsContent value="inventory" className="grid lg:grid-cols-12 gap-8">
                 <div className="lg:col-span-5">
                    <Card className="rounded-[2.5rem] p-8 space-y-4">
                       <h3 className="font-black uppercase flex items-center gap-2"><Plus className="text-primary" /> Add Product</h3>
                       <Input value={newProductName} onChange={e => setNewProductName(e.target.value)} placeholder="Name" className="h-12 rounded-xl" />
                       <Input value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} placeholder="Price" className="h-12 rounded-xl" />
                       <Button onClick={handleAddProduct} disabled={isAddingProduct} className="w-full h-14 rounded-2xl gradient-bg font-black uppercase">Sync Listing</Button>
                    </Card>
                 </div>
                 <div className="lg:col-span-7 space-y-4">
                    {productsLoading ? <Loader2 className="animate-spin mx-auto opacity-20" /> : myProducts?.map((p: any) => (
                       <Card key={p.id} className="p-4 rounded-2xl flex items-center justify-between">
                          <div><h4 className="font-black">{p.name}</h4><p className="text-[10px] font-bold text-primary">${p.price}</p></div>
                          <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc(db, 'products', p.id))} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
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
  return <Suspense fallback={<Loader2 className="animate-spin" />}><SellerManageContent /></Suspense>;
}

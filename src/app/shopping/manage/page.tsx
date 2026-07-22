'use client';

import { useState, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Store, 
  Loader2, 
  Plus, 
  Trash2,
  Clock
} from 'lucide-react';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, updateDoc, collection, addDoc, serverTimestamp, query, where, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      const uRef = doc(db, 'users', user.uid);
      await updateDoc(uRef, { sellerStatus: 'pending' });
      toast({ title: "Application Sent", description: "Guardian review active. ✨" });
    } catch (e) {}
  };

  const handleSaveShop = async () => {
    if (!user || !db || !profile) return;
    setIsSaving(true);
    try {
      const shopRef = doc(db, 'shops', `shop-${user.uid}`);
      await setDoc(shopRef, {
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
      const productRef = collection(db, 'products');
      await addDoc(productRef, {
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

  const handleDeleteProduct = async (id: string) => {
    if (!db) return;
    try {
      const prodRef = doc(db, 'products', id);
      await deleteDoc(prodRef);
      toast({ title: "Product Removed", description: "Listing purged from registry." });
    } catch (e) {}
  };

  if (sellerStatus === 'pending') {
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-lg text-center">
           <Card className="rounded-[3rem] border-none shadow-2xl p-12 bg-white space-y-8">
              <Clock className="w-16 h-16 text-amber-500 mx-auto animate-pulse" />
              <h1 className="text-3xl font-black uppercase tracking-tighter">Pending Approval</h1>
              <p className="text-muted-foreground italic font-medium">Guardians are reviewing your artisan status. ❤️</p>
              <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest" onClick={() => router.push('/shopping')}>Return Home</Button>
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
            <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl"><Store className="w-12 h-12 text-primary" /></div>
            <h1 className="text-5xl font-black uppercase tracking-tighter">Launch Artisan Store</h1>
            <Button onClick={handleApply} className="h-16 px-12 rounded-[2rem] gradient-bg font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 transition-all active:scale-95">Apply for Seller Status</Button>
          </div>
        ) : (
          <div className="space-y-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Artisan Console</h1>
            <Tabs defaultValue="inventory" className="w-full space-y-8">
              <TabsList className="grid grid-cols-2 h-14 bg-white/50 rounded-2xl p-1 border">
                <TabsTrigger value="inventory" className="rounded-xl font-black uppercase text-[10px]">Inventory</TabsTrigger>
                <TabsTrigger value="storefront" className="rounded-xl font-black uppercase text-[10px]">Storefront</TabsTrigger>
              </TabsList>
              <TabsContent value="storefront">
                <Card className="rounded-[2.5rem] p-8 space-y-6 border-none shadow-xl bg-white">
                  <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Shop Name</Label><Input value={shopName} onChange={e => setShopName(e.target.value)} className="h-14 rounded-2xl bg-muted/20 border-none font-bold text-lg" /></div>
                  <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</Label><Textarea value={shopDesc} onChange={e => setShopDesc(e.target.value)} className="min-h-[120px] rounded-xl bg-muted/20 border-none font-medium italic" /></div>
                  <Button onClick={handleSaveShop} disabled={isSaving} className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20">{isSaving ? <Loader2 className="animate-spin" /> : "Update Storefront"}</Button>
                </Card>
              </TabsContent>
              <TabsContent value="inventory" className="grid lg:grid-cols-12 gap-8">
                 <div className="lg:col-span-5">
                    <Card className="rounded-[2.5rem] p-8 space-y-4 border-none shadow-xl bg-white">
                       <h3 className="font-black uppercase flex items-center gap-2"><Plus className="text-primary" /> Add Product</h3>
                       <Input value={newProductName} onChange={e => setNewProductName(e.target.value)} placeholder="Product Name" className="h-12 rounded-xl bg-muted/10 border-none font-bold" />
                       <Input value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} placeholder="Price" className="h-12 rounded-xl bg-muted/10 border-none font-bold" />
                       <Button onClick={handleAddProduct} disabled={isAddingProduct} className="w-full h-14 rounded-2xl gradient-bg font-black uppercase tracking-widest text-[10px] shadow-xl">Sync Listing</Button>
                    </Card>
                 </div>
                 <div className="lg:col-span-7 space-y-4">
                    {productsLoading ? <div className="flex justify-center py-20 opacity-20"><Loader2 className="animate-spin" /></div> : myProducts?.map((p: any) => (
                       <Card key={p.id} className="p-4 rounded-2xl border-none shadow-md bg-white flex items-center justify-between group">
                          <div className="pl-4">
                             <h4 className="font-black text-lg tracking-tight uppercase group-hover:text-primary transition-colors">{p.name}</h4>
                             <p className="text-[10px] font-bold text-primary tracking-widest uppercase">Price: ${p.price}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteProduct(p.id)} 
                            className="text-red-500 hover:bg-red-50 rounded-full h-12 w-12"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
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
  return <Suspense fallback={<div className="flex justify-center py-40 opacity-20"><Loader2 className="animate-spin" /></div>}><SellerManageContent /></Suspense>;
}

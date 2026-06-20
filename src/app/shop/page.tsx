'use client';

import { useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, ShoppingBag, Star, Zap, ShoppingCart, Search, Loader2, Heart } from 'lucide-react';
import Image from 'next/image';
import { useFirestore, useCollection, useUser, useDoc } from '@/firebase';
import { collection, query, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { createGiftPurchaseSession } from '@/lib/stripe-actions';
import { useSearchParams } from 'next/navigation';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

const GIFT_CATEGORIES = ["Flowers", "Jewelry", "Electronics", "Apparel", "Home", "Ornamental"];

function ShopContent() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: "Gift Secured!",
        description: "Your gift has been added to your inventory. Spark joy now! ❤️",
      });
    }
  }, [searchParams, toast]);

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'global_products'));
  }, [db]);

  const { data: dbProducts } = useCollection(productsQuery);

  const mockProducts = [
    { id: '1', name: 'Premium Roses', price: 29.99, category: 'Flowers', imageUrl: 'https://picsum.photos/seed/roses/300/300' },
    { id: '2', name: 'Diamond Pendant', price: 1299.99, category: 'Jewelry', imageUrl: 'https://picsum.photos/seed/diamond/300/300' },
    { id: '3', name: 'Smart Coffee Maker', price: 199.99, category: 'Home', imageUrl: 'https://picsum.photos/seed/coffee/300/300' },
    { id: '4', name: 'Designer Heels', price: 450.00, category: 'Apparel', imageUrl: 'https://picsum.photos/seed/shoes/300/300' },
    { id: '5', name: 'Gold Watch', price: 850.00, category: 'Jewelry', imageUrl: 'https://picsum.photos/seed/watch/300/300' },
    { id: '6', name: 'Crystal Vase', price: 75.00, category: 'Ornamental', imageUrl: 'https://picsum.photos/seed/vase/300/300' },
  ];

  const displayProducts = (dbProducts && dbProducts.length > 0) ? dbProducts : mockProducts;
  const filteredProducts = displayProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const userCurrency = profile?.currency || 'USD';

  const handlePurchase = async (product: any) => {
    if (!user) {
      toast({ variant: "destructive", title: "Login Required", description: "Please join the revolution to buy gifts." });
      return;
    }
    
    setIsPurchasing(product.id);
    try {
      await createGiftPurchaseSession(product.name, product.price, userCurrency, user.uid);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Payment redirect failed." });
      setIsPurchasing(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black tracking-tighter flex items-center justify-center md:justify-start gap-2">
              <ShoppingBag className="w-6 h-6 text-primary" />
              Gift Marketplace
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Premium gifts for your perfect Sparks.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input 
                placeholder="Search gifts..." 
                className="pl-8 h-9 rounded-full text-xs" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="rounded-full h-9 text-[10px] font-bold" asChild>
              <a href="/shop/manage">Seller Portal</a>
            </Button>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 no-scrollbar">
          {GIFT_CATEGORIES.map(cat => (
            <Badge key={cat} variant="secondary" className="px-3 py-1 text-[9px] font-black uppercase cursor-pointer hover:bg-primary hover:text-white transition-colors">
              {cat}
            </Badge>
          ))}
        </div>

        {searchParams.get('success') && (
          <Card className="mb-6 rounded-2xl border-none shadow-md bg-green-50 p-4 flex items-center gap-3 animate-in zoom-in-95 duration-500">
             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-sm shrink-0">
                <Heart className="w-5 h-5 fill-current" />
             </div>
             <div>
                <h3 className="font-black text-green-800 uppercase text-xs tracking-tight">Purchase Successful</h3>
                <p className="text-[10px] text-green-700 font-medium">Thank you for spreading happiness! ✨</p>
             </div>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product: any) => (
            <Card key={product.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group rounded-[1.5rem] bg-white">
              <div className="relative aspect-square">
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <Badge className="absolute top-2 right-2 bg-black/40 backdrop-blur-md border-none text-[7px] font-black uppercase tracking-widest">{product.category}</Badge>
              </div>
              <CardHeader className="p-3 pb-0">
                <CardTitle className="text-sm font-black truncate tracking-tight">{product.name}</CardTitle>
                <p className="text-primary font-black text-lg">{userCurrency === 'USD' ? '$' : ''}{product.price}</p>
              </CardHeader>
              <CardFooter className="p-3 pt-2">
                <Button 
                  size="sm"
                  className="w-full rounded-xl h-9 gradient-bg gap-1.5 font-bold text-xs shadow-md active:scale-95 transition-all" 
                  onClick={() => handlePurchase(product)}
                  disabled={isPurchasing === product.id}
                >
                  {isPurchasing === product.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShoppingCart className="w-3 h-3" />}
                  Buy Gift
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}>
      <ShopContent />
    </Suspense>
  );
}

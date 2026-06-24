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
import { useTranslation } from '@/components/providers/LanguageProvider';
import { CURRENCIES } from '@/lib/world-data';

const GIFT_CATEGORIES = ["Flowers", "Jewelry", "Electronics", "Apparel", "Home", "Ornamental"];

function ShopContent() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!db || !user) return null;
    return query(collection(db, 'global_products'));
  }, [db, user]);

  const { data: dbProducts, loading: productsLoading } = useCollection(productsQuery);

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
  const currencySymbol = CURRENCIES.find(c => c.code === userCurrency)?.symbol || '$';

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

  if (!mounted) return (
    <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24 relative">
      <Header />
      
      {isPurchasing && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
           <div className="w-24 h-24 bg-primary/10 rounded-[3rem] flex items-center justify-center mb-8 relative">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <ShoppingCart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary/40" />
           </div>
           <h2 className="text-3xl font-black tracking-tighter uppercase">Securing Shop Window</h2>
           <p className="text-muted-foreground text-lg font-medium italic mt-2">Opening the Payment Bridge... ❤️</p>
           <div className="mt-12 flex items-center gap-3 opacity-30">
              <Zap className="w-5 h-5 text-primary" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Encrypted Transaction Protocol</p>
           </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tighter flex items-center justify-center md:justify-start gap-3">
              <ShoppingBag className="w-8 h-8 text-primary" />
              {t('shop.title')}
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{t('shop.subtitle')}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto flex-wrap justify-center">
            <div className="relative flex-grow md:w-64 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              <Input 
                placeholder={t('shop.searchPlaceholder')} 
                className="pl-10 h-11 rounded-full text-sm bg-white border-none shadow-sm" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="rounded-full h-11 px-6 text-[10px] font-black uppercase tracking-widest border-2 hover:bg-white" asChild>
              <a href="/shop/manage">{t('shop.sellerPortal')}</a>
            </Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
          {GIFT_CATEGORIES.map(cat => (
            <Badge key={cat} variant="secondary" className="px-4 py-1.5 text-[10px] font-black uppercase cursor-pointer hover:bg-primary hover:text-white transition-colors whitespace-nowrap shadow-sm">
              {cat}
            </Badge>
          ))}
        </div>

        {searchParams.get('success') && (
          <Card className="mb-6 rounded-3xl border-none shadow-md bg-green-50 p-6 flex items-center gap-4 animate-in zoom-in-95 duration-500">
             <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-sm shrink-0">
                <Heart className="w-6 h-6 fill-current" />
             </div>
             <div>
                <h3 className="font-black text-green-800 uppercase text-sm tracking-tight">Purchase Successful</h3>
                <p className="text-xs text-green-700 font-medium">Thank you for spreading happiness! ✨</p>
             </div>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <Card key={product.id} className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all group rounded-[2rem] bg-white flex flex-col">
              <div className="relative aspect-square overflow-hidden">
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <Badge className="absolute top-3 right-3 bg-black/40 backdrop-blur-md border-none text-[8px] font-black uppercase tracking-widest px-2 h-5">{product.category}</Badge>
              </div>
              <CardHeader className="p-5 pb-0 flex-grow">
                <CardTitle className="text-base font-black truncate tracking-tight mb-1">{product.name}</CardTitle>
                <p className="text-primary font-black text-xl">{currencySymbol}{product.price}</p>
              </CardHeader>
              <CardFooter className="p-5 pt-3">
                <Button 
                  className="w-full h-12 rounded-2xl gradient-bg gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 active:scale-95 transition-all" 
                  onClick={() => handlePurchase(product)}
                  disabled={!!isPurchasing}
                >
                  {isPurchasing === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                  {t('shop.buy')}
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
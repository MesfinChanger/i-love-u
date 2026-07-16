
'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  ShoppingBag, 
  Star, 
  Zap, 
  ShoppingCart, 
  Search, 
  Loader2, 
  Heart,
  User,
  MapPin,
  AtSign,
  Phone,
  ArrowRight,
  Building2,
  Map,
  Hash,
  Store,
  ChevronRight,
  Sparkles,
  X,
  Package
} from 'lucide-react';
import Image from 'next/image';
import { useFirestore, useCollection, useUser, useDoc } from '@/firebase';
import { collection, query, addDoc, serverTimestamp, doc, where, limit, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createGiftPurchaseSession } from '@/lib/stripe-actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { CURRENCIES } from '@/lib/world-data';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const GIFT_CATEGORIES = ["All", "Flowers", "Jewelry", "Electronics", "Apparel", "Home", "Ornamental", "General"];

function ShopContent() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const recipientId = searchParams.get('recipientId');

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  const { data: myProfile } = useDoc(userRef);

  const recipientRef = useMemoFirebase(() => {
    if (!db || !recipientId) return null;
    return doc(db, 'users', recipientId);
  }, [db, recipientId]);
  const { data: recipientProfile } = useDoc(recipientRef);

  const targetLocation = useMemo(() => {
    if (recipientProfile) {
      return {
        city: recipientProfile.city,
        state: recipientProfile.state,
        country: recipientProfile.country,
        name: recipientProfile.displayName || recipientProfile.username || "Partner"
      };
    }
    return {
      city: myProfile?.city,
      state: myProfile?.state,
      country: myProfile?.country,
      name: "You"
    };
  }, [recipientProfile, myProfile]);

  const localShopsQuery = useMemoFirebase(() => {
    if (!db || !targetLocation.country) return null;
    return query(
      collection(db, 'shops'),
      where('country', '==', targetLocation.country),
      limit(10)
    );
  }, [db, targetLocation.country]);

  const { data: localShops, loading: shopsLoading } = useCollection(localShopsQuery);

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(50));
    if (activeCategory !== 'All') {
      q = query(collection(db, 'products'), where('category', '==', activeCategory), orderBy('createdAt', 'desc'), limit(50));
    }
    return q;
  }, [db, activeCategory]);

  const { data: products, loading: productsLoading } = useCollection(productsQuery);

  // Guest State
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [guestCity, setGuestCity] = useState('');
  const [guestState, setGuestState] = useState('');
  const [guestZip, setGuestZip] = useState('');
  const [pendingProduct, setPendingProduct] = useState<any>(null);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: "Gift Secured!",
        description: "Your gift has been added to your inventory. Spark joy now! ❤️",
      });
    }
  }, [searchParams, toast]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const userCurrency = myProfile?.currency || 'USD';
  const currencySymbol = CURRENCIES.find(c => c.code === userCurrency)?.symbol || '$';

  const handlePurchase = async (product: any) => {
    if (!user) {
      setPendingProduct(product);
      setShowGuestForm(true);
      return;
    }
    
    setIsPurchasing(product.id);
    try {
      const details = {
        email: myProfile?.email || user.email || '',
        phone: myProfile?.phoneNumber || '',
        address: myProfile?.address1 || '',
        city: myProfile?.city || '',
        state: myProfile?.state || '',
        zip: myProfile?.postalCode || ''
      };

      const result = await createGiftPurchaseSession(
        { id: product.id, name: product.name, price: product.price, sellerId: product.storeId },
        product.currency || userCurrency, 
        user.uid, 
        details
      );
      if (result?.url) {
        window.location.href = result.url;
      } else if (result?.error) {
        throw new Error(result.error);
      }
    } catch (e: any) {
      console.error(e);
      toast({ variant: "destructive", title: "Bridge Disconnected", description: e.message || "Payment bridge failure. ❤️" });
      setIsPurchasing(null);
    }
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingProduct) return;
    if (!guestAddress || !guestCity || !guestState || !guestZip) {
      toast({ variant: "destructive", title: "Location Required", description: "Full billing address is mandatory for guests. ❤️" });
      return;
    }
    if (!guestEmail && !guestPhone) {
      toast({ variant: "destructive", title: "Contact Required", description: "Please provide an email or phone number. ✨" });
      return;
    }

    setIsPurchasing(pendingProduct.id);
    setShowGuestForm(false);
    try {
      const result = await createGiftPurchaseSession(
        { id: pendingProduct.id, name: pendingProduct.name, price: pendingProduct.price, sellerId: pendingProduct.storeId },
        pendingProduct.currency || userCurrency, 
        'guest', 
        {
          email: guestEmail,
          phone: guestPhone,
          address: guestAddress,
          city: guestCity,
          state: guestState,
          zip: guestZip
        }
      );
      if (result?.url) {
        window.location.href = result.url;
      } else if (result?.error) {
        throw new Error(result.error);
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message || "Payment bridge failed." });
      setIsPurchasing(null);
    }
  };

  if (!mounted) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24 relative">
      <Header />
      
      <main className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tighter flex items-center justify-center md:justify-start gap-3">
              <ShoppingBag className="w-10 h-10 text-primary" />
              {t('shop.title')}
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">{t('shop.subtitle')}</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
             {recipientProfile && (
               <Badge className="bg-pink-100 text-pink-600 border-none px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-top-2">
                 <Heart className="w-3 h-3 fill-pink-600" />
                 Shopping for {targetLocation.name}
                 <button onClick={() => { router.replace('/shop'); }} className="ml-2 hover:opacity-70" aria-label="Clear recipient"><X className="w-3 h-3" /></button>
               </Badge>
             )}
             <div className="flex gap-2 w-full justify-center md:justify-end">
                <div className="relative flex-grow md:w-64 max-w-sm">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                  <Input 
                    placeholder={t('shop.searchPlaceholder')} 
                    className="pl-12 h-12 rounded-full text-sm bg-white border-none shadow-sm" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="rounded-full h-12 px-6 text-[10px] font-black uppercase tracking-widest border-2 hover:bg-white" asChild>
                  <a href="/shop/manage">{t('shop.sellerPortal')}</a>
                </Button>
             </div>
          </div>
        </div>

        <section className="mb-12 space-y-6">
          <div className="flex items-center justify-between px-2">
             <div className="space-y-1">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Local Artisans
                </h2>
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Supporting prosperity in {targetLocation.country}</p>
             </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {shopsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="min-w-[280px] h-32 bg-white rounded-[2rem] animate-pulse" />
              ))
            ) : localShops && localShops.length > 0 ? (
              localShops.map((shop: any) => (
                <Card key={shop.id} className="min-w-[300px] rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center relative shrink-0">
                       <Image src={shop.logo || `https://picsum.photos/seed/${shop.ownerId}/200/200`} alt={shop.name} fill className="object-cover rounded-2xl" />
                       {shop.verified && (
                         <div className="absolute -top-1 -right-1 bg-blue-500 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                         </div>
                       )}
                    </div>
                    <div className="min-w-0">
                       <h3 className="font-black text-lg truncate leading-none">{shop.name}</h3>
                       <p className="text-[10px] text-muted-foreground font-medium italic mt-1 truncate">{shop.country}</p>
                       <div className="flex items-center gap-1.5 mt-2">
                          <Star className="w-3 h-3 text-secondary fill-secondary" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{shop.rating || 5}.0 Rating</span>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="w-full p-10 text-center bg-white/40 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center gap-3">
                 <Building2 className="w-8 h-8 text-muted-foreground/20" />
                 <p className="text-xs font-bold text-muted-foreground italic">"Connecting to verified local artisans..."</p>
              </div>
            )}
          </div>
        </section>

        <div className="flex gap-2 overflow-x-auto pb-6 mb-6 no-scrollbar">
          {GIFT_CATEGORIES.map(cat => (
            <Badge 
              key={cat} 
              variant="secondary" 
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 text-[10px] font-black uppercase cursor-pointer transition-all whitespace-nowrap shadow-sm border-2",
                activeCategory === cat ? "bg-primary text-white border-primary" : "bg-white text-muted-foreground border-transparent hover:border-primary/20"
              )}
            >
              {cat}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {productsLoading ? (
             Array(10).fill(0).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white rounded-[2.5rem] animate-pulse" />
             ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product: any) => (
              <Card key={product.id} className="overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all group rounded-[2.5rem] bg-white flex flex-col relative">
                <div className="relative aspect-square overflow-hidden m-2 rounded-[2rem]">
                  <Image src={product.images?.[0] || 'https://picsum.photos/seed/product/400/400'} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <Badge className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md border-none text-[8px] font-black uppercase tracking-widest px-3 h-6">{product.category}</Badge>
                </div>
                <CardHeader className="p-6 pb-0 flex-grow">
                  <div className="flex justify-between items-start gap-2">
                     <CardTitle className="text-lg font-black truncate tracking-tight mb-1">{product.name}</CardTitle>
                     {product.inventory < 5 && <Badge className="bg-amber-100 text-amber-600 border-none text-[7px] font-black px-1.5 h-4 shrink-0">LOW STOCK</Badge>}
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-primary font-black text-2xl">{product.currency || currencySymbol}{product.price}</p>
                     {recipientProfile && <p className="text-[9px] font-black uppercase text-pink-500">For {targetLocation.name}</p>}
                  </div>
                </CardHeader>
                <CardFooter className="p-6 pt-4">
                  <Button 
                    className="w-full h-14 rounded-2xl gradient-bg gap-3 font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/10 active:scale-95 transition-all group/buy" 
                    onClick={() => handlePurchase(product)}
                    disabled={!!isPurchasing || product.inventory === 0}
                  >
                    {isPurchasing === product.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5 transition-transform group-hover/buy:-translate-y-1" />}
                    {product.inventory === 0 ? 'Out of Stock' : (recipientProfile ? 'Secure for Partner' : t('shop.buy'))}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-32 text-center opacity-20">
               <Package className="w-20 h-20 mx-auto mb-4" />
               <p className="text-xl font-black uppercase tracking-widest">No products found in this category.</p>
            </div>
          )}
        </div>
      </main>

      <Dialog open={showGuestForm} onOpenChange={setShowGuestForm}>
        <DialogContent className="sm:max-w-md rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden bg-white max-h-[90vh] overflow-y-auto">
           <DialogHeader className="p-8 bg-slate-900 text-white text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <ShoppingCart className="w-8 h-8 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">Purchase Listing</DialogTitle>
              <DialogDescription className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Unified Transaction Protocol</DialogDescription>
           </DialogHeader>
           <form onSubmit={handleGuestSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-primary" /> Street Address
                    </Label>
                    <Input 
                      value={guestAddress} 
                      onChange={e => setGuestAddress(e.target.value)} 
                      placeholder="123 Heart Lane" 
                      className="h-12 rounded-xl bg-muted/30 border-none font-bold"
                      required
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                         <Building2 className="w-3 h-3 text-primary" /> City
                       </Label>
                       <Input value={guestCity} onChange={e => setGuestCity(e.target.value)} placeholder="City" className="h-12 rounded-xl bg-muted/30 border-none font-bold" required />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                         <Map className="w-3 h-3 text-primary" /> State
                       </Label>
                       <Input value={guestState} onChange={e => setGuestState(e.target.value)} placeholder="State" className="h-12 rounded-xl bg-muted/30 border-none font-bold" required />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Hash className="w-3 h-3 text-primary" /> Zip / Postal Code
                    </Label>
                    <Input value={guestZip} onChange={e => setGuestZip(e.target.value)} placeholder="00000" className="h-12 rounded-xl bg-muted/30 border-none font-bold" required />
                 </div>
                 <div className="grid grid-cols-2 gap-4 border-t pt-4 border-dashed">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                         <AtSign className="w-3 h-3" /> Email
                       </Label>
                       <Input 
                         type="email" 
                         value={guestEmail} 
                         onChange={e => setGuestEmail(e.target.value)} 
                         placeholder="heart@example.com" 
                         className="h-12 rounded-xl bg-muted/30 border-none font-bold"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                         <Phone className="w-3 h-3" /> Phone
                       </Label>
                       <Input 
                         type="tel" 
                         value={guestPhone} 
                         onChange={e => setGuestPhone(e.target.value)} 
                         placeholder="+1..." 
                         className="h-12 rounded-xl bg-muted/30 border-none font-bold"
                       />
                    </div>
                 </div>
              </div>
              <Button type="submit" className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-xs tracking-widest shadow-xl gap-2">
                Pay Now <ArrowRight className="w-4 h-4" />
              </Button>
           </form>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>}>
      <ShopContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getStores } from "@/services/shopping.service";
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Store as StoreIcon, 
  Star, 
  MapPin, 
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Store } from '@/types/shopping';
import GuestAccessGuard from "@/components/GuestAccessGuard";

/**
 * @fileOverview 🛒 Shopping - High-Fidelity Marketplace Discovery.
 * Synchronized with the Store Discovery Protocol.
 */
export default function Shopping() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getStores();
        setStores(data as Store[]);
      } catch (e) {
        console.error("Store Discovery Ripple:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <GuestAccessGuard feature="shopping">
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center gap-3 text-primary justify-center md:justify-start">
                <ShoppingBag className="w-8 h-8 animate-pulse" />
                <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Artisan Marketplace</h1>
              </div>
              <p className="text-xl text-muted-foreground font-medium italic">"Support local prosperity by shopping from verified artisan stores."</p>
            </div>
            <Button variant="outline" className="h-16 px-10 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] gap-2 active:scale-95 transition-all" asChild>
              <Link href="/shop/manage">Open Store</Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm font-black uppercase tracking-widest">Scanning Marketplace...</p>
            </div>
          ) : stores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stores.map((store) => (
                <Card key={store.id} className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden group hover:scale-[1.02] transition-all flex flex-col">
                  <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                    <Image 
                      src={store.logoURL || `https://picsum.photos/seed/${store.id}/600/400`} 
                      alt={store.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint="artisan shop"
                    />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-black/40 backdrop-blur-md text-white border-none px-3 py-1 font-black text-[9px] uppercase tracking-[0.2em]">{store.category}</Badge>
                    </div>
                    {store.verified && (
                      <div className="absolute top-6 right-6">
                         <Badge className="bg-blue-500 text-white border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">Verified Store</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-8 space-y-4 flex-grow">
                    <CardTitle className="text-3xl font-black tracking-tighter truncate group-hover:text-primary transition-colors">{store.name}</CardTitle>
                    <p className="text-muted-foreground font-medium italic line-clamp-3 leading-relaxed">"{store.description}"</p>
                    
                    <div className="pt-4 flex items-center justify-between border-t border-dashed">
                       <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs font-black uppercase tracking-widest">{store.country}</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
                          <span className="text-[10px] font-black">{store.rating || 5}.0</span>
                       </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                    <Button 
                      className="w-full h-14 rounded-2xl gradient-bg font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all gap-2"
                      asChild
                    >
                      <Link href={`/shop?storeId=${store.id}`}>
                        View Products <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center opacity-20 space-y-6">
              <div className="relative inline-block">
                 <StoreIcon className="w-24 h-24 mx-auto mb-4" />
                 <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-xl font-black uppercase tracking-widest">The marketplace is quiet. Be the first artisan to open a store.</p>
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}

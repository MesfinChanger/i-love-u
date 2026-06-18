
'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, ShoppingBag, Star, Zap, ShoppingCart, Search } from 'lucide-react';
import Image from 'next/image';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const GIFT_CATEGORIES = ["Flowers", "Jewelry", "Electronics", "Apparel", "Home", "Ornamental"];

export default function ShopPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // In a real app, we'd fetch from shops collection. For MVP, we show mock items if DB empty.
  const { data: dbProducts } = useCollection(query(collection(db, 'global_products')));

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

  const handlePurchase = (product: any) => {
    toast({
      title: "Confirm Purchase",
      description: `Proceed with purchasing ${product.name} for $${product.price}?`,
      action: <Button onClick={() => toast({ title: "Purchase Successful", description: "Item added to your gift inventory!" })}>Confirm</Button>
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-primary" />
              Gift Marketplace
            </h1>
            <p className="text-muted-foreground">Premium gifts for your perfect Sparks.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search gifts..." 
                className="pl-9 rounded-full" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="rounded-full" asChild>
              <a href="/shop/manage">Become a Seller</a>
            </Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {GIFT_CATEGORIES.map(cat => (
            <Badge key={cat} variant="secondary" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition-colors">
              {cat}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <Card key={product.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all group">
              <div className="relative aspect-square">
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <Badge className="absolute top-2 right-2 bg-black/50 backdrop-blur-md border-none">{product.category}</Badge>
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg font-bold truncate">{product.name}</CardTitle>
                <p className="text-primary font-black text-xl">${product.price}</p>
              </CardHeader>
              <CardFooter className="p-4 pt-2">
                <Button className="w-full rounded-xl gradient-bg gap-2" onClick={() => handlePurchase(product)}>
                  <ShoppingCart className="w-4 h-4" />
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

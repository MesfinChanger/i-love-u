
"use client";

import { useState } from "react";
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { auth } from "@/lib/firebase";
import { createProduct } from "@/services/shop/product.service";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Sparkles, Package, Tag, DollarSign, Hash, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateProductPage() {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    currency: "USD",
    inventory: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  async function saveProduct() {
    const user = auth.currentUser;
    if (!user) return;

    setIsLoading(true);
    try {
      await createProduct({
        ...product,
        price: Number(product.price),
        inventory: Number(product.inventory),
        sellerId: user.uid,
        status: "active"
      });

      alert("🛒 Product Published");
      setProduct({ title: "", description: "", category: "", price: "", currency: "USD", inventory: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto p-6 space-y-8 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/shop"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tighter uppercase">🛒 Create Product</h1>
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 border-b p-8">
            <CardTitle className="text-2xl font-black uppercase tracking-tight text-center">New Listing</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <Input
                placeholder="Product Name"
                value={product.title}
                onChange={e => setProduct({ ...product, title: e.target.value })}
                className="rounded-xl h-12"
              />
              <Textarea
                placeholder="Description"
                value={product.description}
                onChange={e => setProduct({ ...product, description: e.target.value })}
                className="rounded-xl min-h-[120px]"
              />
              <Input
                placeholder="Category"
                value={product.category}
                onChange={e => setProduct({ ...product, category: e.target.value })}
                className="rounded-xl h-12"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Price"
                  type="number"
                  value={product.price}
                  onChange={e => setProduct({ ...product, price: e.target.value })}
                  className="rounded-xl h-12"
                />
                <Input
                  placeholder="Inventory"
                  type="number"
                  value={product.inventory}
                  onChange={e => setProduct({ ...product, inventory: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>
            </div>

            <Button
              onClick={saveProduct}
              disabled={isLoading}
              className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              {isLoading ? "Publishing..." : "Publish Product 🛒"}
            </Button>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}

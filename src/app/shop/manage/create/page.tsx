'use client';

import { useState } from "react";
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Plus, 
  Loader2, 
  Package, 
  Tag, 
  DollarSign, 
  Hash, 
  Sparkles,
  ArrowLeft,
  Store
} from "lucide-react";
import { useUser } from "@/firebase";
import { createProduct } from "@/services/shop/product.service";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

/**
 * @fileOverview Product Creation Page.
 * High-fidelity form for verified sellers to publish new prosperity listings.
 */
export default function CreateProductPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [product, setProduct] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    currency: "USD",
    inventory: ""
  });

  async function saveProduct() {
    if (!user) {
      toast({ variant: "destructive", title: "Identity Required", description: "Please sign in to publish products. ❤️" });
      return;
    }

    if (!product.title || !product.price) {
      toast({ variant: "destructive", title: "Missing Data", description: "Name and Price are mandatory fields. ✨" });
      return;
    }

    setIsSaving(true);
    try {
      await createProduct({
        name: product.title,
        description: product.description,
        category: product.category || "General",
        price: Number(product.price),
        inventory: Number(product.inventory || 1),
        sellerId: user.uid,
        status: "active",
        images: [`https://picsum.photos/seed/${product.title.length}/600/600`]
      });

      toast({ title: "Product Published", description: "Your listing is now live in the marketplace! ❤️" });
      router.push("/shop/manage");
    } catch (e) {
      toast({ variant: "destructive", title: "Sync Ripple", description: "Failed to publish listing." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <main className="container mx-auto px-6 py-10 max-w-2xl space-y-8">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" asChild className="rounded-full">
                <Link href="/shop/manage"><ArrowLeft className="w-5 h-5" /></Link>
             </Button>
             <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Publish Product</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mt-1">Marketplace Protocol Active</p>
             </div>
          </div>

          <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
            <CardHeader className="bg-primary/5 border-b p-8 text-center">
               <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-primary/5 mb-4">
                  <Plus className="w-10 h-10 text-primary" />
               </div>
               <CardTitle className="text-2xl font-black uppercase tracking-tight">New Listing</CardTitle>
               <CardDescription className="text-muted-foreground font-medium italic">
                  "Your craft builds global prosperity."
               </CardDescription>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Product Name</Label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                  <Input 
                    placeholder="e.g. Handcrafted Rose Vase" 
                    className="pl-12 h-14 rounded-2xl bg-muted/30 border-none font-bold"
                    value={product.title}
                    onChange={e => setProduct({ ...product, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mission Description</Label>
                <Textarea 
                  placeholder="What is the story behind this item?" 
                  className="min-h-[120px] rounded-[1.5rem] bg-muted/30 border-none p-6 font-medium italic"
                  value={product.description}
                  onChange={e => setProduct({ ...product, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                    <Input 
                      placeholder="General" 
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-none font-bold"
                      value={product.category}
                      onChange={e => setProduct({ ...product, category: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Initial Stock</Label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                    <Input 
                      type="number"
                      placeholder="10" 
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-none font-bold"
                      value={product.inventory}
                      onChange={e => setProduct({ ...product, inventory: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Price (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input 
                    type="number"
                    placeholder="0.00" 
                    className="pl-12 h-16 rounded-2xl bg-muted/30 border-none font-black text-2xl"
                    value={product.price}
                    onChange={e => setProduct({ ...product, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] space-y-4 shadow-xl border border-primary/20 relative overflow-hidden group">
                 <Sparkles className="absolute -bottom-2 -right-2 w-16 h-16 text-primary opacity-5 group-hover:rotate-12 transition-transform" />
                 <div className="flex items-center gap-3 text-primary">
                    <Store className="w-6 h-6" />
                    <h4 className="font-black text-sm uppercase tracking-widest text-white">Prosperity Protocol</h4>
                 </div>
                 <p className="text-[10px] text-white/70 leading-relaxed font-bold uppercase tracking-widest">
                    By publishing this listing, you vouch that the product adheres to the "Respect & Love" community energy. Every sale supports local growth.
                 </p>
              </div>

              <Button 
                onClick={saveProduct} 
                disabled={isSaving}
                className="w-full h-20 rounded-[2rem] gradient-bg text-xl font-black shadow-2xl shadow-primary/20 transition-all active:scale-95 gap-3"
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                Publish Product 🛒
              </Button>
            </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    </AuthGuard>
  );
}

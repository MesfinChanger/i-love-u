'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Package, 
  ArrowRight,
  Sparkles,
  Store,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';

/**
 * @fileOverview 🛒 Shopping - High-Fidelity Marketplace Hub.
 * Orchestrates marketplace access for products, services, and prosperity-driven businesses.
 */
export default function ShopPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-6 py-12 max-w-6xl space-y-12">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none flex items-center justify-center md:justify-start gap-4">
            <ShoppingBag className="w-12 h-12 text-primary" />
            Shopping
          </h1>
          <p className="text-xl text-muted-foreground font-medium italic max-w-2xl">
            "Marketplace for products, services, and prosperity-driven businesses."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/shop/manage/create" className="group">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 h-full hover:shadow-2xl transition-all group-hover:scale-[1.02] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                  <Plus className="w-24 h-24 text-primary" />
               </div>
               <CardContent className="p-0 space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                     <Plus className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Create Product</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">Open the seller center and list your craft.</p>
                  <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                     Open Protocol <ArrowRight className="w-3 h-3" />
                  </div>
               </CardContent>
            </Card>
          </Link>

          <Link href="/shopping" className="group">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 h-full hover:shadow-2xl transition-all group-hover:scale-[1.02] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                  <Search className="w-24 h-24 text-blue-500" />
               </div>
               <CardContent className="p-0 space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                     <Search className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Browse</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">Discover prosperity-driven listings globally.</p>
                  <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                     Explore Pool <ArrowRight className="w-3 h-3" />
                  </div>
               </CardContent>
            </Card>
          </Link>

          <Link href="/wallet" className="group">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white p-8 h-full hover:shadow-2xl transition-all group-hover:scale-[1.02] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                  <Package className="w-24 h-24 text-primary" />
               </div>
               <CardContent className="p-0 space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                     <Package className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Orders</h2>
                  <p className="text-sm text-white/60 leading-relaxed italic">Manage your purchases and transaction registry.</p>
                  <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                     View Registry <ArrowRight className="w-3 h-3" />
                  </div>
               </CardContent>
            </Card>
          </Link>
        </div>

        <div className="p-10 bg-white rounded-[3rem] shadow-xl border border-primary/5 relative overflow-hidden group">
           <Sparkles className="absolute top-0 right-0 p-8 w-48 h-48 text-primary opacity-5 group-hover:rotate-12 transition-transform duration-700" />
           <div className="relative z-10 max-w-2xl space-y-6">
              <div className="flex items-center gap-4 text-primary">
                 <Store className="w-8 h-8" />
                 <h3 className="text-2xl font-black uppercase tracking-tighter">Prosperity Mission</h3>
              </div>
              <p className="text-lg text-slate-600 font-medium italic leading-relaxed">
                "Every purchase fuels local growth." By shopping through verified artisan stores, you are creating jobs and helping to eliminate world poverty one connection at a time.
              </p>
           </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

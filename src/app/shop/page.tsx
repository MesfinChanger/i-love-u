
import Link from "next/link";
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ShoppingBag, Plus, Search, Package } from 'lucide-react';

export default function ShopPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter uppercase flex items-center gap-4">
            <ShoppingBag className="w-10 h-10 text-primary" />
            Shopping
          </h1>
          <p className="text-lg text-muted-foreground font-medium italic">
            Marketplace for products, services, and prosperity-driven businesses.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/shop/manage/create"
            className="group block"
          >
            <div className="border rounded-[2.5rem] p-8 bg-white shadow-sm hover:shadow-xl transition-all h-full flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-tight">Create Product</h2>
                <p className="mt-2 text-muted-foreground italic">Open seller center.</p>
              </div>
            </div>
          </Link>

          <div className="border rounded-[2.5rem] p-8 bg-white shadow-sm hover:shadow-xl transition-all h-full flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tight">Browse</h2>
              <p className="mt-2 text-muted-foreground italic">Discover products.</p>
            </div>
          </div>

          <div className="border rounded-[2.5rem] p-8 bg-white shadow-sm hover:shadow-xl transition-all h-full flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tight">Orders</h2>
              <p className="mt-2 text-muted-foreground italic">Manage purchases.</p>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

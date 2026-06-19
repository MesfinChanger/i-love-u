import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Compass, ArrowLeft } from 'lucide-react';

/**
 * @fileOverview Custom 404 page for the movement.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-[#fcfcfc] text-center">
      <div className="relative mb-10">
        <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-primary/20">
          <Compass className="w-10 h-10 text-primary opacity-20 animate-spin-slow" />
        </div>
        <Heart className="absolute -bottom-2 -right-2 w-8 h-8 text-primary fill-primary animate-heartbeat" />
      </div>

      <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-4">404</h1>
      <h2 className="text-2xl font-black tracking-tight text-slate-700 mb-4 uppercase">Path Disconnected</h2>
      <p className="text-muted-foreground max-w-xs mx-auto mb-10 font-medium italic">
        "Every journey has its detours, but every heart finds its way home."
      </p>

      <Button asChild className="h-16 px-10 rounded-2xl gradient-bg font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 group">
        <Link href="/discover">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Discovery
        </Link>
      </Button>

      <div className="mt-16 flex items-center justify-center gap-2 opacity-20">
         <p className="text-[9px] font-black uppercase tracking-[0.4em]">Eliminating World Poverty Together</p>
      </div>
    </div>
  );
}

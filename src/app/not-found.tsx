import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Compass, ArrowLeft } from 'lucide-react';

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
      <p className="text-muted-foreground max-w-xs mx-auto mb-10 font-medium italic">"Every heart finds its way home eventually."</p>
      <Button asChild className="h-16 px-10 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl shadow-primary/20 group">
        <Link href="/spark"><ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Spark Feed</Link>
      </Button>
    </div>
  );
}

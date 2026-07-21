'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { useUser } from '@/firebase';
import { discoverCircles, joinCircle } from '@/services/circle.service';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Circle } from '@/types';
import GuestAccessGuard from "@/components/GuestAccessGuard";

/**
 * @fileOverview 🤝 Circle - High-Fidelity Community Discovery Module.
 * Consolidates community gatherings with the Join Circle Protocol.
 */
export default function CirclePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [communities, setCommunities] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await discoverCircles();
        setCommunities(data as Circle[]);
      } catch (e) {
        console.error("Circle Discovery Ripple:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleJoin = async (circleId: string) => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-gate'));
      return;
    }
    
    setIsJoining(circleId);
    try {
      await joinCircle(circleId, user.uid);
      toast({ title: "Joined Community!", description: "Synchronized with this vibration. ✨" });
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Could not join circle." });
    } finally {
      setIsJoining(null);
    }
  };

  return (
    <GuestAccessGuard feature="circle">
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center gap-3 text-primary justify-center md:justify-start">
                <Users className="w-8 h-8 animate-pulse" />
                <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Community Circles</h1>
              </div>
              <p className="text-xl text-muted-foreground font-medium italic">"Gather around a shared mission of love and prosperity."</p>
            </div>
            <Button className="h-16 px-10 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl gap-2 active:scale-95 transition-all">
               <Plus className="w-5 h-5" /> Launch Circle
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 opacity-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm font-black uppercase mt-4">Scanning Frequencies...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {communities.map((circle) => (
                <Card key={circle.id} className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden group hover:scale-[1.02] transition-all flex flex-col">
                  <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                    <Image 
                      src={circle.imageURL || `https://picsum.photos/seed/${circle.id}/600/400`} 
                      alt={circle.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint="community gathering"
                    />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-black/40 backdrop-blur-md text-white border-none px-3 py-1 font-black text-[9px] uppercase tracking-[0.2em]">{circle.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-4 flex-grow">
                    <CardTitle className="text-3xl font-black tracking-tighter truncate group-hover:text-primary transition-colors">{circle.name}</CardTitle>
                    <p className="text-muted-foreground font-medium italic line-clamp-3 leading-relaxed">"{circle.description}"</p>
                    <div className="pt-4 border-t border-dashed flex justify-between items-center">
                       <span className="text-xs font-black uppercase tracking-widest">{circle.memberCount} Hearts</span>
                       <Badge variant="outline" className="text-[8px] uppercase">{circle.privacy}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                    <Button 
                      onClick={() => handleJoin(circle.id)} 
                      disabled={isJoining === circle.id}
                      className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] gap-2"
                    >
                      {isJoining === circle.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      Enter Circle
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}

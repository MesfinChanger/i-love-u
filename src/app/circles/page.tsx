'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Plus, 
  Loader2, 
  Search, 
  Sparkles, 
  Lock, 
  Globe, 
  ArrowRight
} from 'lucide-react';
import { useUser, db, useCollection } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, limit, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Image from 'next/image';
import { circleCategories } from '@/types/circle';
import GuestAccessGuard from "@/components/GuestAccessGuard";

/**
 * @fileOverview Circles Hub Module.
 */
export default function CirclesPage() {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [searchTerm, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCreateOpen, setIsOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [privacy, setPrivacy] = useState<'open' | 'private'>('open');
  const [isCreating, setIsCreating] = useState(false);

  const circlesQuery = useMemoFirebase(() => {
    if (!db) return null;
    let q = query(collection(db, 'communities'), orderBy('createdAt', 'desc'), limit(50));
    if (activeCategory !== 'All') {
      q = query(collection(db, 'communities'), where('category', '==', activeCategory), orderBy('createdAt', 'desc'), limit(50));
    }
    return q;
  }, [activeCategory]);

  const { data: circles, loading } = useCollection(circlesQuery);

  const filteredCircles = useMemo(() => {
    if (!circles) return [];
    return circles.filter((c: any) => 
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [circles, searchTerm]);

  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || isCreating) return;
    setIsCreating(true);
    try {
      await addDoc(collection(db, 'communities'), {
        name: name.trim(),
        description: description.trim(),
        category,
        ownerId: user.uid,
        imageURL: `https://picsum.photos/seed/${name.length}/600/400`,
        memberCount: 1,
        privacy,
        createdAt: serverTimestamp(),
      });
      toast({ title: "Circle Established", description: "Vibration registered! ✨" });
      setIsOpen(false);
      setName('');
      setDescription('');
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Cloud ripple occurred." });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <GuestAccessGuard feature="circle">
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <section className="bg-white border-b py-16 px-6 text-center">
           <div className="max-w-2xl mx-auto space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
                 <Users className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.9]">Community <br/><span className="gradient-text">Circles</span></h1>
              <p className="text-xl text-muted-foreground font-medium italic">"Gather around shared prosperity goals."</p>
           </div>
        </section>

        <main className="container mx-auto px-6 py-10 max-w-7xl space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
             <div className="relative w-full lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input placeholder="Find a circle..." className="pl-12 h-14 rounded-full border-none shadow-sm font-bold" value={searchTerm} onChange={e => setSearchQuery(e.target.value)} />
             </div>
             <Dialog open={isCreateOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                   <Button className="h-14 px-8 rounded-full gradient-bg font-black uppercase text-[10px] shadow-xl gap-2">
                      <Plus className="w-4 h-4" /> Establish Circle
                   </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-[3rem] p-0 overflow-hidden bg-white">
                   <div className="bg-primary/5 p-10 text-center border-b">
                      <DialogTitle className="text-2xl font-black uppercase">Establish Circle</DialogTitle>
                      <DialogDescription className="text-[10px] font-black uppercase tracking-widest mt-2">Unified Gathering Protocol</DialogDescription>
                   </div>
                   <form onSubmit={handleCreateCircle} className="p-8 space-y-6">
                      <div className="space-y-4">
                         <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase">Circle Name</Label><Input required value={name} onChange={e => setName(e.target.value)} className="h-12 rounded-xl bg-muted/20 border-none font-bold" /></div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase">Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger className="h-12 rounded-xl bg-muted/20 border-none font-bold"><SelectValue /></SelectTrigger><SelectContent>{circleCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase">Privacy</Label><Select value={privacy} onValueChange={(v: any) => setPrivacy(v)}><SelectTrigger className="h-12 rounded-xl bg-muted/20 border-none font-bold"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="private">Private</SelectItem></SelectContent></Select></div>
                         </div>
                         <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase">Description</Label><Textarea required value={description} onChange={e => setDescription(e.target.value)} className="min-h-[100px] rounded-xl bg-muted/20 border-none p-4" /></div>
                      </div>
                      <Button type="submit" disabled={isCreating} className="w-full h-16 rounded-2xl gradient-bg font-black uppercase">
                         {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Launch"}
                      </Button>
                   </form>
                </DialogContent>
             </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {loading ? <Loader2 className="animate-spin mx-auto opacity-20" /> : filteredCircles.map((circle: any) => (
               <Card key={circle.id} className="rounded-[2.5rem] border-none shadow-lg overflow-hidden bg-white hover:shadow-2xl transition-all group flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                     <Image src={circle.imageURL || `https://picsum.photos/seed/${circle.id}/600/400`} alt={circle.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <CardContent className="p-8 flex-grow flex flex-col justify-between">
                     <p className="text-sm text-muted-foreground font-medium italic line-clamp-3 mb-6 leading-relaxed">"{circle.description}"</p>
                     <div className="flex items-center justify-between pt-6 border-t border-dashed">
                        <span className="text-[10px] font-black">{circle.memberCount} Hearts</span>
                        <Button variant="ghost" size="sm" className="rounded-xl h-10 px-4 text-[9px] font-black uppercase gap-2">Enter Circle <ArrowRight className="w-3 h-3" /></Button>
                     </div>
                  </CardContent>
               </Card>
             ))}
          </div>
        </main>
        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}

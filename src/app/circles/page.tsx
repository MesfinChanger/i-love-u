
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
  ArrowRight,
  Compass
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

export default function CirclesPage() {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [searchTerm, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCreateOpen, setIsOpen] = useState(false);
  
  // Create Circle State
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

      toast({ title: "Circle Established", description: "Your community has been registered in the cloud! ✨" });
      setIsOpen(false);
      setName('');
      setDescription('');
    } catch (e) {
      toast({ variant: "destructive", title: "Registration Ripple", description: "Could not establish circle." });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <section className="bg-white border-b py-16 px-6 text-center overflow-hidden relative">
         <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 translate-x-20">
            <Users className="w-96 h-96 text-primary" />
         </div>
         <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-8 ring-white">
               <Users className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.9]">
               Community <br/><span className="gradient-text">Circles</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium italic">
               "Gather around a shared mission of love and prosperity."
            </p>
         </div>
      </section>

      <main className="container mx-auto px-6 py-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
           <div className="flex gap-2 w-full lg:w-auto">
              <div className="relative flex-grow lg:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                 <Input 
                   placeholder="Find a circle..." 
                   className="pl-12 h-14 rounded-full bg-white border-none shadow-sm font-bold"
                   value={searchTerm}
                   onChange={e => setSearchQuery(e.target.value)}
                 />
              </div>
              
              <Dialog open={isCreateOpen} onOpenChange={setIsOpen}>
                 <DialogTrigger asChild>
                    <Button className="h-14 px-8 rounded-full gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 gap-2 shrink-0">
                       <Plus className="w-4 h-4" />
                       Launch Circle
                    </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-md rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                    <div className="bg-primary/5 p-10 text-center border-b">
                       <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                       <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Establish Circle</DialogTitle>
                       <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mt-1">Unified Gathering Protocol</DialogDescription>
                    </div>
                    <form onSubmit={handleCreateCircle} className="p-8 space-y-6">
                       <div className="space-y-4">
                          <div className="space-y-1.5">
                             <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Circle Name</Label>
                             <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Village Builders" className="h-12 rounded-xl bg-muted/20 border-none font-bold" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                   <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-none font-bold">
                                      <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent className="rounded-2xl border-none shadow-2xl">
                                      {circleCategories.map(cat => <SelectItem key={cat} value={cat} className="rounded-xl">{cat}</SelectItem>)}
                                   </SelectContent>
                                </Select>
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Privacy</Label>
                                <Select value={privacy} onValueChange={(v: any) => setPrivacy(v)}>
                                   <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-none font-bold">
                                      <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent className="rounded-2xl border-none shadow-2xl">
                                      <SelectItem value="open" className="rounded-xl">Open Access</SelectItem>
                                      <SelectItem value="private" className="rounded-xl">Verified Only</SelectItem>
                                   </SelectContent>
                                </Select>
                             </div>
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Description</Label>
                             <Textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="What is the vibration of this circle?" className="min-h-[100px] rounded-xl bg-muted/20 border-none p-4 font-medium italic text-sm" />
                          </div>
                       </div>
                       <Button type="submit" disabled={isCreating || !name || !description} className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-xs shadow-xl">
                          {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Launch"}
                       </Button>
                    </form>
                 </DialogContent>
              </Dialog>
           </div>

           <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full lg:w-auto">
              {['All', ...circleCategories].map(cat => (
                 <Button 
                   key={cat} 
                   variant={activeCategory === cat ? 'default' : 'ghost'}
                   onClick={() => setActiveCategory(cat)}
                   className={cn(
                     "rounded-full h-11 px-6 font-black uppercase text-[9px] tracking-widest shrink-0 shadow-sm",
                     activeCategory === cat ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"
                   )}
                 >
                    {cat}
                 </Button>
              ))}
           </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
             <Loader2 className="w-12 h-12 animate-spin text-primary" />
             <p className="text-[10px] font-black uppercase tracking-widest mt-4">Scanning Circles...</p>
          </div>
        ) : filteredCircles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {filteredCircles.map((circle: any) => (
               <Card key={circle.id} className="rounded-[2.5rem] border-none shadow-lg overflow-hidden bg-white hover:shadow-2xl transition-all group flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                     <Image 
                       src={circle.imageURL || `https://picsum.photos/seed/${circle.id}/600/400`} 
                       alt={circle.name} 
                       fill 
                       className="object-cover transition-transform duration-700 group-hover:scale-110" 
                       data-ai-hint="community gathering"
                     />
                     <div className="absolute top-4 left-4">
                        <Badge className="bg-black/40 backdrop-blur-md text-white border-none text-[8px] font-black uppercase tracking-widest px-3 h-6">
                           {circle.category}
                        </Badge>
                     </div>
                     <div className="absolute top-4 right-4">
                        {circle.privacy === 'private' ? (
                          <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white"><Lock className="w-3.5 h-3.5" /></div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-green-500/20 backdrop-blur-md flex items-center justify-center text-green-400"><Globe className="w-3.5 h-3.5" /></div>
                        )}
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                     <div className="absolute bottom-4 left-6 right-6">
                        <h3 className="text-white text-2xl font-black tracking-tighter truncate">{circle.name}</h3>
                     </div>
                  </div>
                  <CardContent className="p-8 flex-grow flex flex-col justify-between">
                     <p className="text-sm text-muted-foreground font-medium italic line-clamp-3 mb-6 leading-relaxed">
                        "{circle.description}"
                     </p>
                     
                     <div className="flex items-center justify-between pt-6 border-t border-dashed">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                              <Users className="w-4 h-4" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black leading-none">{circle.memberCount}</p>
                              <p className="text-[7px] font-bold text-muted-foreground uppercase">Hearts</p>
                           </div>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-xl h-10 px-4 text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-primary/5 hover:text-primary group-hover:translate-x-1 transition-all">
                           Enter Circle <ArrowRight className="w-3 h-3" />
                        </Button>
                     </div>
                  </CardContent>
               </Card>
             ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 opacity-20">
             <div className="relative">
                <Compass className="w-24 h-24 text-slate-400 animate-spin-slow" />
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-primary animate-pulse" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tighter uppercase">Quiet vibration</h3>
                <p className="text-sm font-bold uppercase tracking-widest max-w-[240px]">Be the spark and establish the first circle in this category.</p>
             </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

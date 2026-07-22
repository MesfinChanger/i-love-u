'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import {
  Users,
  Plus,
  Loader2,
  Search,
  ArrowRight
} from 'lucide-react';
import { useUser, db, useCollection } from '@/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  where
} from 'firebase/firestore';
import { createCircle as launchCircleService } from '@/services/circle.service';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
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

export default function CirclesPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [privacy, setPrivacy] = useState<"open" | "private">("open");
  const [creating, setCreating] = useState(false);

  const circlesQuery = useMemoFirebase(() => {
    if (!db) return null;
    if (activeCategory === "All") {
      return query(
        collection(db, "communities"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
    }
    return query(
      collection(db, "communities"),
      where("category", "==", activeCategory),
      orderBy("createdAt", "desc"),
      limit(50)
    );
  }, [activeCategory]);

  const { data: circles, loading } = useCollection(circlesQuery);

  const filteredCircles = useMemo(() => {
    if (!circles) return [];
    return circles.filter((circle: any) =>
      circle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      circle.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [circles, searchTerm]);

  async function createCircle(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setCreating(true);

    try {
      await launchCircleService({
        name: name.trim(),
        description: description.trim(),
        category,
        ownerId: user.uid,
        privacy,
        imageURL: `https://picsum.photos/seed/${name}/600/400`
      });

      toast({
        title: "Circle Created ✨",
        description: "Your community is now alive and you are the owner."
      });

      setOpen(false);
      setName("");
      setDescription("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: "Could not launch circle protocol."
      });
    } finally {
      setCreating(false);
    }
  }

  return (
    <GuestAccessGuard feature="circle">
      <div className="min-h-screen bg-muted/30 pb-24">
        <Header />
        <section className="bg-white py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl font-black tracking-tight uppercase">
              Community<br /><span className="text-primary">Circles</span>
            </h1>
            <p className="mt-4 text-muted-foreground italic text-lg">
              Gather around shared prosperity goals.
            </p>
          </div>
        </section>

        <main className="container mx-auto px-6 py-10 max-w-7xl space-y-8">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search circles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-14 rounded-full pl-12 bg-white"
              />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="h-14 px-8 rounded-full font-black uppercase gap-2">
                  <Plus /> Create Circle
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2.5rem]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black uppercase">Launch Circle</DialogTitle>
                  <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-primary/60">Build a global community.</DialogDescription>
                </DialogHeader>
                <form onSubmit={createCircle} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Name</Label>
                    <Input required value={name} onChange={e => setName(e.target.value)} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Description</Label>
                    <Textarea required value={description} onChange={e => setDescription(e.target.value)} className="min-h-[100px] rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {circleCategories.map(cat =>
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button disabled={creating} className="w-full h-14 rounded-xl gradient-bg font-black uppercase shadow-xl shadow-primary/10">
                    {creating ? <Loader2 className="animate-spin" /> : "Launch Circle"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <Loader2 className="animate-spin mx-auto opacity-20" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCircles.map((circle: any) => (
                <Card key={circle.id} className="rounded-[2.5rem] overflow-hidden bg-white border-none shadow-xl group">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={circle.imageURL || `https://picsum.photos/seed/${circle.id}/600/400`}
                      alt={circle.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-8 space-y-5">
                    <h2 className="text-2xl font-black uppercase tracking-tight">{circle.name}</h2>
                    <p className="text-muted-foreground italic line-clamp-3">"{circle.description}"</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary px-3 py-1 rounded-full">{circle.memberCount} Hearts</span>
                      <Link href={`/circles/${circle.id}`}>
                        <Button className="rounded-xl gap-2 font-black uppercase text-[10px] h-10">
                          Enter Circle <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
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

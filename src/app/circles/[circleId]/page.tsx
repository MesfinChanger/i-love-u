'use client';

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MessageSquare,
  Lightbulb,
  ShoppingBag,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Globe
} from "lucide-react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { joinCircle } from "@/services/circle.service";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import CircleAdminPanel from "@/components/circle/CircleAdminPanel";
import { useCircleRole } from "@/hooks/use-circle-role";

export default function CircleSpacePage({ params }: { params: Promise<{ circleId: string }> }) {
  const { circleId } = use(params);
  const { user } = useUser();
  const { toast } = useToast();

  const { isOwner, isModerator } = useCircleRole(circleId);
  const isAdmin = isOwner || isModerator;
  const roleLoading = false;

  const [circle, setCircle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    async function loadCircle() {
      if (!circleId || !db) return;
      try {
        const ref = doc(db, "communities", circleId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCircle({ id: snap.id, ...snap.data() });
        }
      } catch (error) {
        console.error("Circle loading ripple:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCircle();
  }, [circleId]);

  const handleJoin = async () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-gate'));
      return;
    }
    if (!circleId || !db || isJoining) return;
    setIsJoining(true);
    try {
      const joined = await joinCircle(circleId, user.uid);
      if (!joined) {
        toast({ title: "Already joined", description: "You are already a member." });
        setIsJoining(false);
        return;
      }
      await updateDoc(doc(db, "communities", circleId), { memberCount: increment(1) });
      toast({ title: "Joined Circle ✨", description: "Your frequency is now synchronized." });
      setCircle((prev: any) => ({ ...prev, memberCount: (prev?.memberCount || 0) + 1 }));
    } catch (error) {
      toast({ variant: "destructive", title: "Join failed", description: "Could not synchronize." });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <GuestAccessGuard feature="circle">
      <div className="min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto px-6 py-10 max-w-5xl">
          {loading ? (
            <div className="flex justify-center py-40">
              <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
            </div>
          ) : !circle ? (
            <Card className="rounded-[3rem] p-16 text-center border-none shadow-xl">
              <h1 className="text-3xl font-black uppercase">Circle Not Found</h1>
              <Button asChild className="mt-8 rounded-xl"><Link href="/circles">Return to Discovery</Link></Button>
            </Card>
          ) : (
            <div className="space-y-10">
              <Card className="rounded-[3rem] overflow-hidden border-none shadow-xl bg-white">
                <div className="h-72 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center relative overflow-hidden">
                  <Globe className="w-32 h-32 text-white opacity-20 animate-spin-slow" />
                </div>
                <CardContent className="p-10 space-y-6 relative">
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-primary/10 text-primary border-none uppercase text-[9px] font-black">{circle.category}</Badge>
                    <Badge variant="outline" className="uppercase text-[9px] font-black">{circle.privacy} SPACE</Badge>
                    <Badge variant="outline" className="uppercase text-[9px] font-black gap-1.5"><Users className="w-3 h-3" />{circle.memberCount || 0} Hearts</Badge>
                  </div>
                  <h1 className="text-5xl font-black tracking-tight uppercase leading-none">{circle.name}</h1>
                  <p className="text-lg italic text-muted-foreground leading-relaxed">"{circle.description}"</p>
                  <div className="flex gap-4 pt-2">
                    <Button onClick={handleJoin} disabled={isJoining} className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px]">
                      {isJoining ? <Loader2 className="w-5 h-5 animate-spin" /> : "Join Circle"}
                    </Button>
                  </div>
                  {!roleLoading && isAdmin && <CircleAdminPanel circleId={circleId} />}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <FeatureCard icon={<MessageSquare className="w-8 h-8" />} title="Circle Chat" text="Discuss and broadcast respectful moments." href={`/circles/${circleId}/chat`} />
                <FeatureCard icon={<Lightbulb className="w-8 h-8" />} title="Idea Pool" text="Create innovations together." href={`/circles/${circleId}/posts`} />
                <FeatureCard icon={<Users className="w-8 h-8" />} title="Registry" text="See community members." href={`/circles/${circleId}/members`} />
                <FeatureCard icon={<ShoppingBag className="w-8 h-8" />} title="Shared Shop" text="Trade artisan services." href="/shopping" />
              </div>
            </div>
          )}
        </main>
        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}

function FeatureCard({ icon, title, text, href }: any) {
  return (
    <Link href={href} className="group">
      <Card className="rounded-[2.5rem] border-none shadow-md hover:shadow-2xl transition-all h-full bg-white overflow-hidden p-8 flex flex-col gap-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary transition-transform group-hover:scale-110">{icon}</div>
        <div className="space-y-2 flex-grow">
          <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-muted-foreground font-medium italic leading-relaxed">{text}</p>
        </div>
      </Card>
    </Link>
  );
}

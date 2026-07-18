"use client";

import Link from "next/link";
import { useUser } from "@/firebase";
import AuthGuard from "@/components/AuthGuard";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Zap,
  Lightbulb,
  Globe,
  MessageCircle,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * @fileOverview High-Fidelity Mission Dashboard.
 * Primary command center for every heart in the Prosperity Revolution.
 */
export default function DashboardPage() {
  const { user } = useUser();

  const name =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Heart";

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <AuthGuard>
      <div className="min-h-screen pb-24 relative overflow-hidden bg-gradient-to-br from-white via-pink-50 to-blue-50">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-300/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/30 blur-3xl rounded-full" />

        <Header />

        <main className="relative z-10 container mx-auto px-6 py-10 max-w-5xl space-y-10">
          <section className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="text-sm font-bold text-primary uppercase tracking-widest">{greeting}</p>
              <h1 className="text-5xl font-black tracking-tight">{name} ❤️</h1>
              <p className="mt-3 text-muted-foreground italic">Your presence fuels the Prosperity Revolution.</p>
            </div>

            <div className="bg-white shadow-xl rounded-full px-6 py-4 flex items-center gap-3 border self-start">
              <ShieldCheck className="text-green-500" />
              <span className="text-xs font-black uppercase">Verified Heart</span>
            </div>
          </section>

          <div className="grid md:grid-cols-3 gap-6">
            <MetricCard title="Daily Sparks" value="12" icon={<Heart/>} href="/spark" color="text-pink-500" />
            <MetricCard title="Idea Pool" value="Active" icon={<Lightbulb/>} href="/ideas" color="text-yellow-500" />
            <MetricCard title="Global Circle" value="Connected" icon={<Globe/>} href="/circle" color="text-blue-500" />
          </div>

          <Card className="rounded-[3rem] border-none shadow-xl bg-white/90 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-4 text-primary">
                <Zap/>
                <CardTitle className="text-3xl font-black uppercase">Mission Control</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-lg italic text-slate-600">
                "Respect & Love is Mandatory." Every connection, idea, and action helps build a stronger world.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button asChild className="rounded-2xl h-14 px-8 font-black uppercase text-xs tracking-widest">
                  <Link href="/discover"><Sparkles className="mr-2"/> Discover</Link>
                </Button>
                <Button variant="outline" asChild className="rounded-2xl h-14 px-8 font-black uppercase text-xs tracking-widest border-2">
                  <Link href="/messages"><MessageCircle className="mr-2"/> Messages</Link>
                </Button>
                <Button variant="outline" asChild className="rounded-2xl h-14 px-8 font-black uppercase text-xs tracking-widest border-2">
                  <Link href="/shopping"><ShoppingBag className="mr-2"/> Shop</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    </AuthGuard>
  );
}

function MetricCard({ title, value, icon, href, color }: { title: string, value: string, icon: React.ReactNode, href: string, color: string }) {
  return (
    <Link href={href}>
      <Card className="rounded-[2.5rem] border-none shadow-lg hover:shadow-2xl transition group relative overflow-hidden bg-white">
        <CardContent className="p-8 space-y-4">
          <div className={cn("w-12 h-12 rounded-2xl bg-muted flex items-center justify-center transition-transform group-hover:scale-110", color)}>
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
            <p className="text-3xl font-black">{value}</p>
          </div>
          <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardContent>
      </Card>
    </Link>
  );
}

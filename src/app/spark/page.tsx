"use client";

import Link from "next/link";
import { 
  Heart, 
  Globe, 
  Settings, 
  Users, 
  MessageSquare, 
  ShieldCheck,
  Sparkles
} from "lucide-react";

/**
 * @fileOverview Spark Module Gateway.
 * The primary entry point for romantic and cultural discovery.
 */
export default function SparkPage() {
  return (
    <main className="p-6 space-y-6 pb-24 max-w-6xl mx-auto">
      {/* Header Section with Profile CTA */}
      <section className="rounded-[2.5rem] border-2 border-primary/5 bg-white p-8 shadow-sm group">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">❤️ Spark</h1>
          <p className="text-muted-foreground font-medium italic">
            "Discover meaningful connections built on respect, compatibility, and shared values."
          </p>
        </div>
        
        <div className="mt-8 flex flex-wrap gap-4">
          <Link 
            href="/spark/profile"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
          >
            ❤️ Create Spark Identity
          </Link>
        </div>
      </section>

      {/* Discovery Grid */}
      <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
        <SparkNavLink 
          href="/spark/discover" 
          icon={<Globe className="w-6 h-6" />} 
          title="Discover" 
          description="Explore new hearts."
        />

        <SparkNavLink 
          href="/spark/greetings" 
          icon={<MessageSquare className="w-6 h-6" />} 
          title="Greetings" 
          description="View outreach."
        />

        <SparkNavLink 
          href="/spark/preferences" 
          icon={<Settings className="w-6 h-6" />} 
          title="Preferences" 
          description="Define goals."
        />

        <SparkNavLink 
          href="/spark/connections" 
          icon={<Users className="w-6 h-6" />} 
          title="Connections" 
          description="Manage sparks."
        />
      </section>

      {/* Security Protocol Footer */}
      <section className="rounded-[2.5rem] bg-slate-900 text-white p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
           <h2 className="text-9xl font-black">🔐</h2>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-black tracking-tighter uppercase leading-none flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Secured Communication
          </h2>
          <p className="text-lg text-white/70 font-medium italic leading-relaxed max-w-lg">
            Messages are designed for private, end-to-end encrypted conversations. Your safety is our primary mission.
          </p>
          <Link
            href="/messages"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/20 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all active:scale-95"
          >
            💬 Open Messages
          </Link>
        </div>
      </section>
      
      <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 pt-4">
        Respect & Love is Mandatory ❤️ Prosperity Revolution
      </p>
    </main>
  );
}

function SparkNavLink({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <Link href={href} className="rounded-[2rem] border-2 border-primary/5 bg-white p-6 hover:border-primary/20 transition-all group shadow-sm hover:shadow-md flex flex-col gap-3">
      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors uppercase">{title}</h2>
        <p className="mt-1 text-[10px] text-muted-foreground font-medium italic uppercase tracking-wider">{description}</p>
      </div>
    </Link>
  );
}
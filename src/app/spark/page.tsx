"use client";

import Link from "next/link";

/**
 * @fileOverview Spark Module Gateway.
 * The primary entry point for romantic and cultural discovery.
 */
export default function SparkPage() {
  return (
    <main className="p-6 space-y-6 pb-24">
      {/* Header Section with Profile CTA */}
      <section className="rounded-[2.5rem] border-2 border-primary/5 bg-white p-8 shadow-sm group">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">❤️ Spark</h1>
          <p className="text-muted-foreground font-medium italic">
            "Discover meaningful connections built on respect, compatibility, and shared values."
          </p>
        </div>
        
        <div className="mt-8">
          <Link 
            href="/spark/profile"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
          >
            ❤️ Create Spark Identity
          </Link>
        </div>
      </section>

      {/* Discovery Grid */}
      <section className="grid md:grid-cols-3 gap-5">
        <Link href="/spark/discover" className="rounded-[2rem] border-2 border-primary/5 bg-white p-6 hover:border-primary/20 transition-all group shadow-sm hover:shadow-md">
          <h2 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">🌎 Discover Hearts</h2>
          <p className="mt-2 text-sm text-muted-foreground font-medium italic">Explore people who share your values.</p>
        </Link>

        <Link href="/spark/preferences" className="rounded-[2rem] border-2 border-primary/5 bg-white p-6 hover:border-primary/20 transition-all group shadow-sm hover:shadow-md">
          <h2 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">❤️ Preferences</h2>
          <p className="mt-2 text-sm text-muted-foreground font-medium italic">Define your connection goals.</p>
        </Link>

        <Link href="/spark/connections" className="rounded-[2rem] border-2 border-primary/5 bg-white p-6 hover:border-primary/20 transition-all group shadow-sm hover:shadow-md">
          <h2 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">🤝 Connections</h2>
          <p className="mt-2 text-sm text-muted-foreground font-medium italic">Manage your relationships.</p>
        </Link>
      </section>

      {/* Security Protocol Footer */}
      <section className="rounded-[2.5rem] bg-slate-900 text-white p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
           <h2 className="text-9xl font-black">🔐</h2>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Secured Communication</h2>
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

"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * @fileOverview Identity Hub - Unified Command Center.
 * Synchronized with the Prosperity Revolution authentication bridge.
 */
export default function IdentityPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Identity Hub Heartbeat:", currentUser?.uid);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="p-6 flex flex-col items-center justify-center min-h-[40vh] text-center">
        <div className="animate-pulse space-y-4">
          <p className="text-xl font-bold uppercase tracking-widest text-primary">
            🔄 Synchronizing Identity...
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Prosperity Revolution</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-3xl font-black tracking-tighter uppercase">👤 Identity Hub</h1>
        <div className="p-8 rounded-[2rem] bg-muted/30 border-2 border-dashed border-muted flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-medium italic text-muted-foreground">
            "Every spark needs a signature."
          </p>
          <p className="text-sm font-bold uppercase tracking-widest">Please sign in to identify your heart. ❤️</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-8 max-w-4xl mx-auto pb-24">
      <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
        👤 Identity Hub
      </h1>

      <div className="grid gap-6">
        {/* Personal Identity */}
        <section className="rounded-[2.5rem] border-2 border-primary/5 bg-white p-8 shadow-sm hover:shadow-md transition-all group">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">🪪</span>
            Personal Identity
          </h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm font-bold uppercase tracking-widest text-slate-600">
            <div className="p-4 bg-muted/30 rounded-2xl">
               <p className="text-[10px] text-muted-foreground mb-1 uppercase">Heart Signature</p>
               <p className="text-slate-900 truncate">
                 {user.isAnonymous ? "Guest Heart" : (user.displayName || user.email)}
               </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-2xl">
               <p className="text-[10px] text-muted-foreground mb-1 uppercase">Mission Status</p>
               <p className="text-primary">{user.isAnonymous ? "Guest" : "Member"}</p>
            </div>
          </div>
        </section>

        {/* Modular Registry Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          <RegistrySection icon="❤️" title="Social" items={["Spark Preferences", "Circle Memberships", "Connections"]} />
          <RegistrySection icon="🔐" title="Security" items={["Device Sessions", "Privacy Settings", "Account Protection"]} />
        </div>
      </div>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 pt-8">
        Happiness is Mandatory ❤️ Prosperity Revolution
      </p>
    </main>
  );
}

function RegistrySection({ icon, title, items }: { icon: string, title: string, items: string[] }) {
  return (
    <section className="rounded-[2.5rem] border-2 border-primary/5 bg-white p-8 hover:shadow-lg transition-all group">
      <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
        <span className="text-2xl group-hover:rotate-12 transition-transform">{icon}</span>
        {title}
      </h2>
      <ul className="mt-4 space-y-2">
        {items.map(item => (
          <li key={item} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-primary/20" />
             {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import SignOutButton from "@/components/SignOutButton";

/**
 * @fileOverview Identity Hub - Unified Command Center.
 * Orchestrates the synchronization of personal, social, and mission data.
 * Hardened with the Session Resilience Protocol.
 */
export default function IdentityHubPage() {
  const [user, setUser] = useState<User | null>(null);
  const [identity, setIdentity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Identity Hub Auth Heartbeat:", currentUser?.uid);

      if (!mounted) return;

      if (!currentUser) {
        setUser(null);
        setIdentity(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        if (db) {
          const identityRef = doc(db, "users", currentUser.uid);
          const snapshot = await getDoc(identityRef);

          if (snapshot.exists()) {
            setIdentity(snapshot.data());
          } else {
            // High-Fidelity Auto-Registration Protocol
            const newIdentity = {
              uid: currentUser.uid,
              name: currentUser.displayName || (currentUser.isAnonymous ? "Guest Heart" : "New User"),
              email: currentUser.email || (currentUser.isAnonymous ? "Guest Account" : ""),
              photoURL: currentUser.photoURL || "",
              accountType: currentUser.isAnonymous ? "Guest" : "Member",
              language: "English",
              country: "",
              skills: [],
              interests: [],
              createdAt: serverTimestamp()
            };

            await setDoc(identityRef, newIdentity);
            setIdentity(newIdentity);
          }
        }
      } catch (error) {
        console.error("Identity Hub Synchronization Ripple:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <main className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="animate-pulse space-y-4">
          <h1 className="text-3xl font-black uppercase tracking-tighter">👤 Identity Hub</h1>
          <p className="text-lg font-medium italic text-muted-foreground">Synchronizing heart data...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-8 text-center space-y-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-red-500">Access Restricted</h1>
        <p className="text-lg font-medium italic text-muted-foreground">Please sign in to identify your heart. ❤️</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-8 max-w-4xl mx-auto pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-dashed">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">👤 Identity Hub</h1>
          <p className="text-muted-foreground font-medium italic mt-1">
            "Your journey through the Prosperity Revolution."
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid gap-6">
        {/* Personal Identity */}
        <section className="rounded-[2.5rem] border-2 border-primary/5 bg-white p-8 shadow-sm hover:shadow-md transition-all group">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">🪪</span>
            Personal Identity
          </h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm font-bold uppercase tracking-widest text-slate-600">
            <div className="p-4 bg-muted/30 rounded-2xl">
               <p className="text-[10px] text-muted-foreground mb-1">Heart Signature</p>
               <p className="text-slate-900">{identity?.name}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-2xl">
               <p className="text-[10px] text-muted-foreground mb-1">Communication Channel</p>
               <p className="text-slate-900 truncate">{identity?.email}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-2xl">
               <p className="text-[10px] text-muted-foreground mb-1">Native Dialect</p>
               <p className="text-slate-900">{identity?.language}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-2xl">
               <p className="text-[10px] text-muted-foreground mb-1">Mission Status</p>
               <p className="text-primary">{identity?.accountType}</p>
            </div>
          </div>
        </section>

        {/* Modular Registry Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          <RegistrySection icon="❤️" title="Social" items={["Spark Preferences", "Circle Memberships", "Connections"]} />
          <RegistrySection icon="🎓" title="Learning" items={["Course Progress", "Certifications", "Verified Skills"]} />
          <RegistrySection icon="💼" title="Professional" items={["Active Projects", "Artisan Portfolio", "Career Path"]} />
          <RegistrySection icon="🌱" title="Impact" items={["Volunteer Hours", "Community Gifts", "Impact Score"]} />
        </div>

        {/* Security Registry */}
        <section className="rounded-[2.5rem] border-2 border-dashed p-8 bg-slate-50">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
             <span className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">🔐</span>
             Security Center
          </h2>
          <ul className="mt-6 space-y-3">
            {["Device Sessions", "Privacy Settings", "Account Protection"].map(item => (
              <li key={item} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 group cursor-pointer hover:border-primary/20 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900">{item}</span>
                <span className="text-[10px] text-primary font-bold">Manage →</span>
              </li>
            ))}
          </ul>
        </section>
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

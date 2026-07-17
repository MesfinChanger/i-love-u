"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { SignOutButton } from "@/components/SignOutButton";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ShieldCheck, User, Heart, Lock, Loader2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Identity Hub.
 * High-fidelity command center for the heart's personal and mission-aligned data.
 */
export default function IdentityPage() {
  const [user, setUser] = useState<any>(null);
  const [identity, setIdentity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!mounted) return;

      if (!currentUser) {
        setUser(null);
        setIdentity(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const identityRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(identityRef);

        if (snapshot.exists()) {
          setIdentity(snapshot.data());
        } else {
          const newIdentity = {
            uid: currentUser.uid,
            name: currentUser.displayName || "Guest Heart",
            email: currentUser.email || "Guest Account",
            photoURL: currentUser.photoURL || "",
            accountType: currentUser.isAnonymous ? "Guest" : "Member",
            language: "English",
            country: "",
            skills: [],
            interests: [],
            createdAt: serverTimestamp(),
          };

          await setDoc(identityRef, newIdentity);
          setIdentity(newIdentity);
        }
      } catch (error) {
        console.error("Identity Hub Error:", error);
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
      <main className="flex flex-col items-center justify-center min-h-screen bg-muted/30 p-6">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-6 text-muted-foreground animate-pulse">🔄 Synchronizing Identity...</p>
      </main>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <main className="container mx-auto px-6 py-12 max-w-4xl space-y-10">
          <div className="flex justify-between items-start">
             <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tighter uppercase">👤 Identity Hub</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Unified Heart Registry</p>
             </div>
             <SignOutButton />
          </div>

          <div className="grid gap-8">
             <section className="rounded-[2.5rem] border-none shadow-xl bg-white p-10 group hover:shadow-2xl transition-all">
                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                   <span className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">🪪</span>
                   Personal Identity
                </h2>
                
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                   <IdentityField label="Heart Signature" value={identity?.email || "Guest Account"} />
                   <IdentityField label="Account Type" value={identity?.accountType || (user?.isAnonymous ? "Guest" : "Member")} highlight />
                   <IdentityField label="Name" value={identity?.name || user?.displayName || "Mystery Heart"} />
                   <IdentityField label="Language" value={identity?.language || "English"} />
                </div>
             </section>

             <div className="grid sm:grid-cols-2 gap-8">
                <RegistrySection icon="❤️" title="Social" items={["Spark Preferences", "Circle Memberships", "Connections"]} />
                <RegistrySection icon="🔐" title="Security Center" items={["Device Sessions", "Privacy Settings", "Account Protection"]} />
             </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </AuthGuard>
  );
}

function IdentityField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="p-5 bg-muted/30 rounded-2xl border border-transparent hover:border-primary/5 transition-colors">
       <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
       <p className={cn("text-lg font-black tracking-tight truncate", highlight ? "text-primary" : "text-slate-900")}>{value}</p>
    </div>
  );
}

function RegistrySection({ icon, title, items }: { icon: string; title: string; items: string[] }) {
  return (
    <section className="rounded-[2.5rem] border-none shadow-lg bg-white p-8 hover:shadow-xl transition-all group">
       <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
          <span className="text-2xl group-hover:rotate-12 transition-transform">{icon}</span>
          {title}
       </h2>
       <div className="mt-6 space-y-3">
          {items.map(item => (
             <div key={item} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                {item}
             </div>
          ))}
       </div>
    </section>
  );
}

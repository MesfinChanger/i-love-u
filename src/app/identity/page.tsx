"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { SignOutButton } from "@/components/SignOutButton";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Loader2, ShieldCheck, UserCircle, MapPin, Mail, Globe } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { cn } from "@/lib/utils";
import { onAuthStateChanged } from "firebase/auth";

/**
 * @fileOverview High-Fidelity Identity Hub.
 * Orchestrates personal and mission-aligned heart data.
 */
export default function IdentityPage() {
  const [user, setUser] = useState<any>(null);
  const [identity, setIdentity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
            createdAt: serverTimestamp(),
          };
          await setDoc(identityRef, newIdentity);
          setIdentity(newIdentity);
        }
      } catch (error) {
        console.error("Identity Sync Error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-muted/30">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-6 text-muted-foreground animate-pulse">🔄 Synchronizing...</p>
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
                <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">👤 Identity Hub</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Unified Heart Registry</p>
             </div>
             <SignOutButton />
          </div>

          <section className="rounded-[2.5rem] border-none shadow-xl bg-white p-10 group hover:shadow-2xl transition-all relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform">
                <ShieldCheck className="w-48 h-48 text-primary" />
             </div>
             
             <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 relative z-10">
                <span className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">🪪</span>
                Personal Identity
             </h2>
             
             <div className="mt-8 grid gap-4 sm:grid-cols-2 relative z-10">
                <IdentityField label="Heart Signature" value={identity?.email || "Guest Account"} icon={<Mail className="w-4 h-4" />} />
                <IdentityField label="Account Type" value={identity?.accountType || "Member"} icon={<ShieldCheck className="w-4 h-4" />} highlight />
                <IdentityField label="Name" value={identity?.name || "Mystery Heart"} icon={<UserCircle className="w-4 h-4" />} />
                <IdentityField label="Language" value={identity?.language || "English"} icon={<Globe className="w-4 h-4" />} />
             </div>
          </section>

          <div className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-6 transition-transform">
                <Heart className="w-32 h-32 fill-primary text-primary" />
             </div>
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                   <ShieldCheck className="w-6 h-6" />
                   <h4 className="text-xl font-black uppercase tracking-tight">Mission Integrity</h4>
                </div>
                <p className="text-sm text-white/70 font-medium italic leading-relaxed uppercase tracking-widest">
                  "Respect & Love is Mandatory." Your identity is a sacred signature within the Prosperity Revolution. 
                </p>
             </div>
          </div>
        </main>
        <BottomNav />
      </div>
    </AuthGuard>
  );
}

function IdentityField({ label, value, icon, highlight }: { label: string; value: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="p-6 bg-muted/30 rounded-2xl border border-transparent hover:border-primary/5 transition-colors group">
       <div className="flex items-center gap-2 mb-2">
          <div className="text-muted-foreground/40 group-hover:text-primary transition-colors">{icon}</div>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
       </div>
       <p className={cn("text-lg font-black tracking-tight truncate", highlight ? "text-primary" : "text-slate-900")}>{value}</p>
    </div>
  );
}

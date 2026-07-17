"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { SignOutButton } from "@/components/SignOutButton";

/**
 * @fileOverview Identity Hub Protocol.
 * Unified command center for a heart's personal and mission-aligned data.
 */
export default function IdentityPage() {
  const [user, setUser] = useState<any>(null);
  const [identity, setIdentity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Identity Hub Auth User:", currentUser?.uid);
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
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter">👤 Identity Hub</h1>
        <p className="text-lg mt-4 animate-pulse">🔄 Synchronizing Identity...</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-8 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">👤 Identity Hub</h1>
        <SignOutButton />
      </div>

      <p className="text-muted-foreground italic font-medium">
        "Your personal, social, learning, professional and impact identity."
      </p>

      <div className="grid gap-6">
        {/* Personal Identity */}
        <section className="rounded-[2.5rem] border-2 border-primary/5 bg-white p-8 shadow-sm hover:shadow-md transition-all group">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">🪪</span>
            Personal Identity
          </h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm font-bold uppercase tracking-widest text-slate-600">
            <div className="p-4 bg-muted/30 rounded-2xl">
               <p className="text-[10px] text-muted-foreground mb-1 uppercase">Name</p>
               <p className="text-slate-900 truncate">{identity?.name || "Mystery Heart"}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-2xl">
               <p className="text-[10px] text-muted-foreground mb-1 uppercase">Heart Signature</p>
               <p className="text-slate-900 truncate">{identity?.email || "Guest Account"}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-2xl">
               <p className="text-[10px] text-muted-foreground mb-1 uppercase">Account Type</p>
               <p className="text-primary">{identity?.accountType || "Guest"}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-2xl">
               <p className="text-[10px] text-muted-foreground mb-1 uppercase">Language</p>
               <p className="text-slate-900">{identity?.language || "English"}</p>
            </div>
          </div>
        </section>

        {/* Modular Sections */}
        <div className="grid sm:grid-cols-2 gap-6">
           <RegistrySection icon="❤️" title="Social" items={["Spark Preferences", "Circle Memberships", "Connections"]} />
           <RegistrySection icon="🎓" title="Learning" items={["Courses", "Certificates", "Skills"]} />
           <RegistrySection icon="💼" title="Professional" items={["Projects", "Portfolio", "Career"]} />
           <RegistrySection icon="🌱" title="Impact" items={["Volunteer Activities", "Community Contributions", "Impact Score"]} />
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

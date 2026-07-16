
'use client';

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useUser, db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";

/**
 * @fileOverview Identity Discovery Profile - Refactored for High-Fidelity Mission.
 */
export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user || !db) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-12 py-12 space-y-6">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
          👤 Profile
        </h1>
        
        {(authLoading || !profile) ? (
          <p className="text-muted-foreground animate-pulse font-black uppercase text-[10px] tracking-widest">Synchronizing Identity...</p>
        ) : (
          <div className="space-y-4">
            <p className="text-xl text-muted-foreground font-medium italic">
              "You are the architect of your own heart."
            </p>
            <div className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-primary/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white font-black text-2xl">
                  {profile.displayName?.[0] || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{profile.displayName || profile.username}</h2>
                  <p className="text-[10px] font-black uppercase text-primary tracking-widest">{profile.accountType} Heart</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-dashed">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Authenticated Email</p>
                <p className="font-bold text-lg">{profile.email}</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

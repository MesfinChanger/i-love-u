"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * @fileOverview Identity Registry View.
 * Implements the requested profile loading pattern with explicit hydration states.
 */
export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const ref = doc(db, "users", user.uid);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          setProfile(snapshot.data());
        }
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-12 space-y-6 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="p-6 text-base font-bold animate-pulse text-primary tracking-widest uppercase">
          Synchronize profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 space-y-6">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-8">
          👤 Profile
        </h1>
        <div className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-primary/5 text-center">
          <p className="p-6 text-base">No profile found. ❤️</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 space-y-8">
      <h1 className="text-6xl font-black tracking-tighter uppercase mb-4">
        👤 Profile
      </h1>
      
      <div className="p-10 bg-white rounded-[3rem] shadow-2xl border border-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
          {profile.displayName || profile.name || "My Profile"}
        </h1>
        <p className="text-xl text-muted-foreground font-medium italic">
          {profile.email}
        </p>
        
        <div className="mt-8 pt-8 border-t border-dashed flex flex-wrap gap-4">
           <div className="bg-primary/5 px-4 py-2 rounded-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Account Status</p>
              <p className="text-xs font-bold uppercase">{profile.accountType || 'Active'}</p>
           </div>
           <div className="bg-slate-50 px-4 py-2 rounded-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Country</p>
              <p className="text-xs font-bold uppercase">{profile.country || 'Global'}</p>
           </div>
        </div>
      </div>
    </div>
  );
}

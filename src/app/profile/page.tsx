"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Globe, ShieldCheck } from 'lucide-react';

/**
 * @fileOverview Identity Registry View.
 * Implements the requested profile loading pattern with visually balanced headings.
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
      <div className="flex flex-col min-h-screen bg-muted/30">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
           <div className="text-base font-bold animate-pulse text-primary tracking-widest uppercase">
              Synchronize profile...
           </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen bg-muted/30">
        <Header />
        <main className="container mx-auto px-6 py-12 max-w-lg space-y-8">
          <h1 className="text-3xl font-bold tracking-tighter uppercase">👤 Profile</h1>
          <Card className="p-12 text-center rounded-[2.5rem] bg-white shadow-sm border-none">
            <p className="text-lg font-medium text-muted-foreground italic">No identity found in the registry. ❤️</p>
          </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-2xl space-y-10">
        <div className="flex items-center justify-between">
           <h1 className="text-3xl font-bold tracking-tighter uppercase">👤 Profile</h1>
           <Badge className="bg-primary/10 text-primary border-none px-4 h-8 uppercase font-black text-[10px] tracking-widest">
              {profile.accountType || 'Active'}
           </Badge>
        </div>
        
        <Card className="rounded-[3rem] border-none shadow-xl bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="p-10 space-y-8">
              <div className="space-y-2">
                 <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
                    {profile.displayName || profile.username || profile.name || "Mystery Heart"}
                 </h2>
                 <p className="text-lg text-muted-foreground font-medium italic flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-dashed">
                 <div className="bg-slate-50 p-6 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Globe className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Region</span>
                    </div>
                    <p className="text-base font-bold uppercase">{profile.country || 'Global Community'}</p>
                 </div>
                 <div className="bg-primary/5 p-6 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                       <ShieldCheck className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                    </div>
                    <p className="text-base font-bold uppercase">{profile.status || 'Verified'}</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-slate-900 p-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                 Happiness is Mandatory ❤️ Prosperity Revolution
              </p>
           </div>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}

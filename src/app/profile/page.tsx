
"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useUser } from "@/firebase";

/**
 * @fileOverview Identity Discovery Profile.
 */
export default function ProfilePage() {
  const { user, loading } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-12 py-12 space-y-6">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
          👤 Profile
        </h1>
        
        {loading ? (
          <p className="text-muted-foreground animate-pulse font-black uppercase text-[10px] tracking-widest">Synchronizing Identity...</p>
        ) : (
          <div className="space-y-4">
            <p className="text-xl text-muted-foreground font-medium italic">
              "You are the architect of your own heart." Manage your community identity and security protocols here.
            </p>
            {user && (
              <div className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-primary/5">
                <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Authenticated Email</p>
                <p className="font-bold text-lg">{user.email || "Guest Session"}</p>
                <div className="mt-6 pt-6 border-t border-dashed">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">User UID</p>
                  <p className="font-mono text-xs text-slate-500">{user.uid}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

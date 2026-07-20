"use client";

import { useEffect, useState } from "react";
import SparkCard from "@/components/spark/SparkCard";
import { discoverSparkProfiles } from "@/services/spark/spark.service";
import { Loader2, Sparkles } from "lucide-react";
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import GuestAccessGuard from "@/components/GuestAccessGuard";

/**
 * @fileOverview Hearts Discovery Hub.
 * Wrapped in the Guest Access Guard Protocol to enforce 30-minute mission limits.
 */
export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      try {
        const data = await discoverSparkProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Discovery Sync Error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfiles();
  }, []);

  return (
    <GuestAccessGuard feature="spark">
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        
        <main className="p-6 space-y-8 pb-24 max-w-6xl mx-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary">
               <Sparkles className="w-8 h-8 animate-pulse" />
               <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
                 Discover Hearts
               </h1>
            </div>
            <p className="text-muted-foreground font-medium italic">
              "Find people connected by values, interests, and shared prosperity goals."
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-20">
               <Loader2 className="w-12 h-12 animate-spin text-primary" />
               <p className="text-sm font-black uppercase tracking-widest">Scanning Frequencies...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {profiles.length > 0 ? (
                profiles.map((profile) => (
                  <SparkCard
                    key={profile.id}
                    id={profile.id}
                    name={profile.displayName || profile.username || "Mystery Heart"}
                    country={profile.country || "Global"}
                  />
                ))
              ) : (
                <div className="col-span-full py-32 text-center opacity-20 border-4 border-dashed rounded-[3rem] bg-white/50">
                   <p className="text-xl font-black uppercase tracking-widest italic">
                     "Scanning the horizon for new sparks..."
                   </p>
                </div>
              )}
            </div>
          )}

          <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 pt-12">
            Respect & Love is Mandatory ❤️ Prosperity Revolution
          </p>
        </main>
        
        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}

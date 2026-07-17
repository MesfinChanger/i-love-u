"use client";

import { useEffect, useState } from "react";
import SparkCard from "@/components/spark/SparkCard";
import { discoverSparkProfiles } from "@/services/spark/spark.service";

/**
 * @fileOverview Hearts Discovery Hub.
 * Primary matching engine for finding compatible hearts connected by mission and values.
 */
export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    async function loadProfiles() {
      try {
        const data = await discoverSparkProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Discovery Sync Error:", error);
      }
    }
    loadProfiles();
  }, []);

  return (
    <main className="p-6 space-y-8 pb-24 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
          🌎 Discover Hearts
        </h1>
        <p className="text-muted-foreground font-medium italic">
          "Find people connected by values, interests, and shared prosperity goals."
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <SparkCard
              key={profile.id}
              name={profile.displayName || profile.username || "Mystery Heart"}
              country={profile.country || "Global"}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center opacity-20">
             <p className="text-xl font-black uppercase tracking-widest italic">
               "Scanning the horizon for new sparks..."
             </p>
          </div>
        )}
      </div>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 pt-12">
        Happiness is Mandatory ❤️ Prosperity Revolution
      </p>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import SparkCard from "@/components/spark/SparkCard";

/**
 * @fileOverview Hearts Discovery Hub.
 * Primary matching engine for finding compatible hearts connected by mission and values.
 */
export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    // Discovery Protocol: Synchronizing demo profiles
    // This will later be replaced by the high-fidelity Firestore discovery query.
    setProfiles([
      {
        id: "1",
        name: "Amina",
        country: "Ethiopia",
        language: "Amharic",
        interest: "Technology",
      },
      {
        id: "2",
        name: "Daniel",
        country: "USA",
        language: "English",
        interest: "Entrepreneurship",
      },
      {
        id: "3",
        name: "Sofia",
        country: "Spain",
        language: "Spanish",
        interest: "Community Building",
      }
    ]);
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
        {profiles.map((profile) => (
          <SparkCard
            key={profile.id}
            name={profile.name}
            country={profile.country}
          />
        ))}
      </div>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 pt-12">
        Happiness is Mandatory ❤️ Prosperity Revolution
      </p>
    </main>
  );
}

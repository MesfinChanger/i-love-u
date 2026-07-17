"use client";

import { useEffect, useState } from "react";
import {
 doc,
 getDoc,
 setDoc
} from "firebase/firestore";
import {
 auth,
 db
} from "@/lib/firebase";

/**
 * @fileOverview Spark Profile Identity Protocol.
 * Manages the high-fidelity discovery data for romantic and cultural sparks.
 */
export default function SparkProfilePage(){
  const [profile, setProfile] = useState<any>({
    displayName: "",
    country: "",
    language: "",
    interests: "",
    values: "",
    goals: ""
  });

  useEffect(() => {
    async function loadProfile() {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "sparkProfiles", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      }
    }
    loadProfile();
  }, []);

  async function saveProfile() {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(
      doc(db, "sparkProfiles", user.uid),
      profile,
      { merge: true }
    );

    alert("❤️ Spark Profile Saved");
  }

  return (
    <main className="p-6 space-y-5">
      <h1 className="text-4xl font-bold tracking-tighter uppercase">❤️ Spark Profile</h1>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-1 block">Display Name</label>
          <input
            className="border p-3 rounded-xl w-full bg-white font-bold"
            placeholder="Community Nickname"
            value={profile.displayName}
            onChange={e => setProfile({ ...profile, displayName: e.target.value })}
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-1 block">Country</label>
          <input
            className="border p-3 rounded-xl w-full bg-white font-bold"
            placeholder="Your Region"
            value={profile.country}
            onChange={e => setProfile({ ...profile, country: e.target.value })}
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-1 block">Languages</label>
          <input
            className="border p-3 rounded-xl w-full bg-white font-bold"
            placeholder="Spoken Languages"
            value={profile.language}
            onChange={e => setProfile({ ...profile, language: e.target.value })}
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-1 block">Values & Interests</label>
          <textarea
            className="border p-3 rounded-xl w-full bg-white font-medium italic min-h-[120px]"
            placeholder="What defines your frequency?"
            value={profile.values}
            onChange={e => setProfile({ ...profile, values: e.target.value })}
          />
        </div>

        <button
          onClick={saveProfile}
          className="w-full bg-primary text-white rounded-xl px-6 py-4 font-black uppercase tracking-widest text-xs shadow-lg hover:bg-primary/90 transition-all active:scale-95"
        >
          Save Spark Identity ❤️
        </button>
      </div>
    </main>
  );
}

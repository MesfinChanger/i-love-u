
'use client';

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useUser } from "@/firebase";

export default function ProfilePage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="p-12 space-y-6">
      <h1 className="text-6xl font-black tracking-tighter uppercase">
        👤 Profile
      </h1>
      {profile ? (
        <div className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-primary/5">
          <h2 className="text-2xl font-black">{profile.displayName}</h2>
          <p className="text-muted-foreground">{profile.email}</p>
        </div>
      ) : (
        <p className="animate-pulse">Synchronizing Identity...</p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  auth,
  db
} from "@/lib/firebase";

import SignOutButton from "@/components/SignOutButton";

/**
 * @fileOverview Identity Hub Page.
 * Synchronizes heart identity and provides a unified command center.
 */
export default function IdentityHubPage() {
  const [user, setUser] = useState<User | null>(null);
  const [identity, setIdentity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        console.log(
          "Identity Hub Auth User:",
          currentUser?.uid
        );

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
            // High-Fidelity Auto-Initialization Protocol
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
              createdAt: serverTimestamp()
            };

            await setDoc(identityRef, newIdentity);
            setIdentity(newIdentity);
          }
        } catch (error) {
          console.error("Identity Hub Error:", error);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold">👤 Identity Hub</h1>
        <p className="text-lg mt-4">Synchronizing Identity...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold">👤 Identity Hub</h1>
        <p className="mt-4">Please sign in to continue.</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold tracking-tighter uppercase">👤 Identity Hub</h1>
        <SignOutButton />
      </div>
      
      <p className="text-gray-600 font-medium italic">
        Your personal, social, learning, professional and impact identity.
      </p>

      {/* Personal Identity */}
      <section className="rounded-2xl border p-5 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">🪪 Personal Identity</h2>
        <div className="mt-3 space-y-2">
          <p>
            <span className="font-bold uppercase text-[10px] text-slate-400">Name:</span>
            {" "} {identity?.name}
          </p>
          <p>
            <span className="font-bold uppercase text-[10px] text-slate-400">Email:</span>
            {" "} {identity?.email}
          </p>
          <p>
            <span className="font-bold uppercase text-[10px] text-slate-400">Language:</span>
            {" "} {identity?.language}
          </p>
          <p>
            <span className="font-bold uppercase text-[10px] text-slate-400">Account Type:</span>
            {" "} {identity?.accountType}
          </p>
        </div>
      </section>

      {/* Social Identity */}
      <section className="rounded-2xl border p-5 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">❤️ Social Identity</h2>
        <ul className="mt-3 space-y-2 font-medium">
          <li>❤️ Spark Preferences</li>
          <li>🤝 Circle Memberships</li>
          <li>💬 Connections</li>
        </ul>
      </section>

      {/* Learning Identity */}
      <section className="rounded-2xl border p-5 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">🎓 Learning Identity</h2>
        <ul className="mt-3 space-y-2 font-medium">
          <li>📚 Courses</li>
          <li>🏆 Certificates</li>
          <li>🧠 Skills</li>
        </ul>
      </section>

      {/* Professional Identity */}
      <section className="rounded-2xl border p-5 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">💼 Professional Identity</h2>
        <ul className="mt-3 space-y-2 font-medium">
          <li>🚀 Projects</li>
          <li>📁 Portfolio</li>
          <li>💼 Career</li>
        </ul>
      </section>

      {/* Impact Identity */}
      <section className="rounded-2xl border p-5 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">🌱 Impact Identity</h2>
        <ul className="mt-3 space-y-2 font-medium">
          <li>🤲 Volunteer Activities</li>
          <li>🌍 Community Contributions</li>
          <li>⭐ Impact Score</li>
        </ul>
      </section>

      {/* Security */}
      <section className="rounded-2xl border p-5 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">🔐 Security Center</h2>
        <ul className="mt-3 space-y-2 font-medium">
          <li>Device Sessions</li>
          <li>Privacy Settings</li>
          <li>Account Protection</li>
        </ul>
      </section>
    </main>
  );
}
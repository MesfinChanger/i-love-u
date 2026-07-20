"use client";

import GuestAccessGuard from "@/components/GuestAccessGuard";

// keep all your existing imports
// import { ... } from "firebase/firestore";
// import { ... } from "@/firebase";
// etc.


export default function MessagesPage() {

  // KEEP all your existing state
  // KEEP all your existing functions
  // KEEP all your Firebase queries


  return (
    <GuestAccessGuard feature="messages">

      <div>
        {/* KEEP EVERYTHING YOU ALREADY HAVE HERE */}

        {/* Example:
        <Header />

        <main>
          your messages UI
        </main>

        <BottomNav />
        */}

      </div>

    </GuestAccessGuard>
  );
}
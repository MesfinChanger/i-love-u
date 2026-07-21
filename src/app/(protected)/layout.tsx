"use client";

import { useUser } from "@/firebase";
import { redirect } from "next/navigation";
import { Loader2, Heart } from "lucide-react";

/**
 * @fileOverview Secure Mission Layout Protocol.
 * Orchestrates the synchronization of authenticated states for protected routes.
 * Ensures every heart signature is verified before granting access to mission modules.
 */
export default function ProtectedLayout({
 children,
}:{
 children:React.ReactNode
}){
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="space-y-8 text-center animate-in fade-in duration-700">
          <div className="relative">
            <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-8 ring-white relative z-10">
              <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
              Synchronizing Mission Credentials
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}

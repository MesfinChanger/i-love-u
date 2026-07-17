'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Loader2, Lock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * @fileOverview Guardian Authorization Protocol.
 * Exclusively permits platform administrators to access high-impact command centers.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile, loading: profileLoading } = useDoc(userRef);

  if (authLoading || profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-6 text-muted-foreground animate-pulse">Checking Credentials...</p>
      </div>
    );
  }

  // Admin Verification Logic
  const isAdmin = profile?.role === 'admin' || profile?.isAdmin === true;

  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-white">
        <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mb-8 border-2 border-dashed border-red-200">
           <Lock className="w-12 h-12 text-red-500" />
        </div>
        <div className="space-y-4 max-w-sm">
           <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Frequency Restricted</h1>
           <p className="text-lg text-muted-foreground font-medium italic">
             "Only community guardians can access this mission control center." ❤️
           </p>
        </div>
        <Button 
          onClick={() => router.push('/dashboard')} 
          className="mt-10 h-16 px-10 rounded-2xl gradient-bg font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
        >
          Return to Dashboard
        </Button>
        <p className="mt-12 text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
           Authorized Access Only • Protocol 403
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

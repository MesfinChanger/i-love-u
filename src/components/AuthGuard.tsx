'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * @fileOverview Identity Guard Protocol.
 * Ensures only synchronized hearts can access internal mission routes.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white">
        <div className="animate-pulse space-y-4">
           <div className="text-4xl">🔐</div>
           <p className="text-xl font-bold uppercase tracking-widest text-primary">Verifying Identity...</p>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Prosperity Revolution</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}


'use client';

import React from 'react';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { SparkAssistant } from '@/components/SparkAssistant';
import { RegistrationReminder } from '@/components/RegistrationReminder';
import { MissionNudge } from '@/components/MissionNudge';
import { LanguageProvider } from './LanguageProvider';
import { FeedbackBox } from '@/components/FeedbackBox';
import { IdleLogoutProvider } from './IdleLogoutProvider';
import { AuthGateDialog } from '@/components/AuthGateDialog';
import { Heart } from 'lucide-react';

/**
 * @fileOverview Identity Synchronizer.
 * Ensures the platform is "User Ready" (auth state determined) before rendering the core UI.
 * Prevents flickering and role-based logic mismatches during initial bridge synchronization.
 */
function IdentitySynchronizer({ children }: { children: React.ReactNode }) {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-6">
        <div className="relative">
          <Heart className="w-16 h-16 text-primary fill-primary animate-heartbeat" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse -z-10" />
        </div>
        <div className="mt-10 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary ml-[0.5em]">Synchronizing Hearts</p>
          <div className="w-40 h-1 bg-muted rounded-full overflow-hidden mx-auto relative">
             <div className="h-full bg-primary absolute top-0 left-0 animate-[loading-progress_2s_infinite_linear]" style={{ width: '40%' }} />
          </div>
          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Prosperity Revolution • Bridge Active</p>
        </div>
        <style jsx>{`
          @keyframes loading-progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * @fileOverview Wraps all client-side providers for the application.
 * Ensures the Toast system, AI Assistant, Language, Idle Monitor, and Firebase are correctly initialized.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <LanguageProvider>
        <IdentitySynchronizer>
          <IdleLogoutProvider>
            {children}
            <SparkAssistant />
            <AuthGateDialog />
            <FeedbackBox />
            <RegistrationReminder />
            <MissionNudge />
            <Toaster />
          </IdleLogoutProvider>
        </IdentitySynchronizer>
      </LanguageProvider>
    </FirebaseClientProvider>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { SparkAssistant } from '@/components/SparkAssistant';
import { RegistrationReminder } from '@/components/RegistrationReminder';
import { MissionNudge } from '@/components/MissionNudge';
import { LanguageProvider } from './LanguageProvider';
import { FeedbackBox } from '@/components/FeedbackBox';
import { IdleLogoutProvider } from './IdleLogoutProvider';
import { AuthGateDialog } from '@/components/AuthGateDialog';
import GuestNotice from '@/components/GuestNotice';

/**
 * @fileOverview Universal Client-Side Provider Registry.
 */

function IdentityStatus() {
  const { loading } = useUser();
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowStatus(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowStatus(false);
    }
  }, [loading]);

  if (!showStatus) return null;

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] bg-white/80 backdrop-blur-md shadow-2xl rounded-full px-6 py-3 text-[10px] font-black uppercase tracking-widest text-primary border animate-in fade-in slide-in-from-bottom-2"
    >
      Synchronizing Heart Connection...
    </div>
  );
}

export function ClientProviders({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      {/* DIAGNOSTIC MARKER 2: FIREBASE_OK */}
      <div id="diag-firebase-ok" className="fixed top-0 left-12 z-[9999] bg-black text-white text-[8px] px-2 py-0.5 pointer-events-none opacity-50">FIREBASE_OK</div>
      
      <LanguageProvider>
        {/* DIAGNOSTIC MARKER 3: LANGUAGE_OK */}
        <div id="diag-language-ok" className="fixed top-0 left-28 z-[9999] bg-black text-white text-[8px] px-2 py-0.5 pointer-events-none opacity-50">LANGUAGE_OK</div>
        
        <IdleLogoutProvider>
          {/* DIAGNOSTIC MARKER 4: PROVIDERS_OK */}
          <div id="diag-providers-ok" className="fixed top-0 left-44 z-[9999] bg-black text-white text-[8px] px-2 py-0.5 pointer-events-none opacity-50">PROVIDERS_OK</div>
          
          {children}
          <Toaster />
          <SparkAssistant />
          <RegistrationReminder />
          <MissionNudge />
          <FeedbackBox />
          <AuthGateDialog />
          <GuestNotice />
          <IdentityStatus />
        </IdleLogoutProvider>
      </LanguageProvider>
    </FirebaseClientProvider>
  );
}

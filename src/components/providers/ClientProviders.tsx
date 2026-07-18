'use client';

import React, { useEffect, useState } from 'react';
import {
  FirebaseClientProvider,
  useUser
} from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { SparkAssistant } from '@/components/SparkAssistant';
import { RegistrationReminder } from '@/components/RegistrationReminder';
import { MissionNudge } from '@/components/MissionNudge';
import { LanguageProvider } from './LanguageProvider';
import { FeedbackBox } from '@/components/FeedbackBox';
import { IdleLogoutProvider } from './IdleLogoutProvider';
import { AuthGateDialog } from '@/components/AuthGateDialog';

/**
 * @fileOverview Universal Client-Side Provider Registry.
 * Orchestrates the synchronization of Firebase, Language, and Mission-Critical UI components.
 */

/**
 * Non-blocking Firebase status monitor.
 */
function IdentityStatus() {
  const { loading } = useUser();
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowStatus(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
    setShowStatus(false);
  }, [loading]);

  if (!showStatus) return null;

  return (
    <div
      className="
      fixed
      bottom-5
      left-1/2
      -translate-x-1/2
      z-50
      bg-white
      shadow-xl
      rounded-full
      px-6
      py-3
      text-xs
      font-bold
      text-primary
      border
      animate-in fade-in slide-in-from-bottom-2
      "
    >
      Synchronizing Heart Connection...
    </div>
  );
}

export function ClientProviders({
  children
}:{
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <LanguageProvider>
        <IdleLogoutProvider>
          {children}

          {/* Non-blocking Firebase identity status */}
          <IdentityStatus />

          {/* Global Mission Components */}
          <SparkAssistant />
          <AuthGateDialog />
          <FeedbackBox />
          <RegistrationReminder />
          <MissionNudge />
          <Toaster />
        </IdleLogoutProvider>
      </LanguageProvider>
    </FirebaseClientProvider>
  );
}

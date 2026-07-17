'use client';

import React from 'react';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { SparkAssistant } from '@/components/SparkAssistant';
import { RegistrationReminder } from '@/components/RegistrationReminder';
import { MissionNudge } from '@/components/MissionNudge';
import { FeedbackBox } from '@/components/FeedbackBox';
import { AuthGateDialog } from '@/components/AuthGateDialog';
import { LanguageProvider } from './LanguageProvider';
import { IdleLogoutProvider } from './IdleLogoutProvider';

/**
 * Firebase authentication runs in the background.
 * Public pages should render immediately.
 */
function IdentitySynchronizer({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}

/**
 * Main client-side providers
 */
export function ClientProviders({
  children
}: {
  children: React.ReactNode;
}) {
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

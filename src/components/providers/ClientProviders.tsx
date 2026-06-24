
'use client';

import React from 'react';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { SparkAssistant } from '@/components/SparkAssistant';
import { RegistrationReminder } from '@/components/RegistrationReminder';
import { LanguageProvider } from './LanguageProvider';
import { FeedbackBox } from '@/components/FeedbackBox';
import { IdleLogoutProvider } from './IdleLogoutProvider';

/**
 * @fileOverview Wraps all client-side providers for the application.
 * Ensures the Toast system, AI Assistant, Language, Idle Monitor, and Firebase are correctly initialized.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <LanguageProvider>
        <IdleLogoutProvider>
          {children}
          <SparkAssistant />
          <FeedbackBox />
          <RegistrationReminder />
          <Toaster />
        </IdleLogoutProvider>
      </LanguageProvider>
    </FirebaseClientProvider>
  );
}

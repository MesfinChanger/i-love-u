'use client';

import React from 'react';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { SparkAssistant } from '@/components/SparkAssistant';
import { RegistrationReminder } from '@/components/RegistrationReminder';
import { LanguageProvider } from './LanguageProvider';

/**
 * @fileOverview Wraps all client-side providers for the application.
 * Ensures the Toast system, AI Assistant, Language, and Firebase are correctly initialized.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <LanguageProvider>
        {children}
        <SparkAssistant />
        <RegistrationReminder />
        <Toaster />
      </LanguageProvider>
    </FirebaseClientProvider>
  );
}

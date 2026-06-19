'use client';

import React from 'react';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { SparkAssistant } from '@/components/SparkAssistant';

/**
 * @fileOverview Wraps all client-side providers for the application.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      {children}
      <SparkAssistant />
      <Toaster />
    </FirebaseClientProvider>
  );
}

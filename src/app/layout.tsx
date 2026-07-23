import type { Metadata, Viewport } from 'next';
import './globals.css';
import MainNavigation from "@/components/navigation/MainNavigation";
import { ClientProviders } from '@/components/providers/ClientProviders';
import { Suspense } from 'react';

export const viewport: Viewport = {
  themeColor: '#FF3366',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'I LOVE U - The AI Dating Revolution ❤️',
  description: "Respect & Love is Mandatory. Ending world poverty through global job creation.",
};

/**
 * @fileOverview Fixed Root Layout Protocol.
 * Stabilized scope with Suspense to prevent MainNavigation from blocking the initial paint.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ClientProviders>
          <Suspense fallback={<div className="h-16 border-b bg-white/50 animate-pulse" />}>
            <MainNavigation />
          </Suspense>
          <main className="flex-grow">
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}

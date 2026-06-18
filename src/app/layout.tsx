"use client";

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>I Love U - Eliminate Poverty Through Global Job Creation ❤️</title>
        <meta name="description" content="I Love U: AI-powered dating and cultural exchange dedicated to eliminating poverty. Empowering every community through sustainable job creation." />
        <meta name="keywords" content="dating, poverty elimination, job creation, end poverty, global mission, employment, economic growth, I Love U" />
        
        {/* Open Graph / Facebook / Instagram */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://spark-dating.web.app/" />
        <meta property="og:title" content="I Love U - Ending Poverty Globally" />
        <meta property="og:description" content="One connection at a time. Join the mission to eliminate poverty through job creation in every village and city." />
        <meta property="og:image" content="https://picsum.photos/seed/iloveu-mission/1200/630" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://spark-dating.web.app/" />
        <meta property="twitter:title" content="I Love U - Global Job Mission" />
        <meta property="twitter:description" content="AI-powered dating on a mission to end world poverty through job creation." />
        <meta property="twitter:image" content="https://picsum.photos/seed/iloveu-mission/1200/630" />

        {/* Mobile & PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF3366" />
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/iloveu-logo/192/192" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

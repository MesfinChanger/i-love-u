
'use client';

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';

/**
 * Root Layout for Spark.
 * Note: Next.js 15 Metadata is typically handled in a Server Component.
 * Since this is a Client Component (due to Providers), we use a fallback 
 * or the user can define a separate layout.metadata.ts.
 * Here we include the head tags directly for compatibility.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Core SEO */}
        <title>Spark - Respect & Love is Mandatory ❤️</title>
        <meta name="description" content="AI-powered dating and cultural exchange. Find your perfect match in a community where respect is the foundation." />
        <meta name="keywords" content="dating, cultural exchange, AI dating, safe dating, spark, respect and love" />
        
        {/* Open Graph / Facebook / Instagram */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://spark-dating.web.app/" />
        <meta property="og:title" content="Spark - Find Your Perfect Match" />
        <meta property="og:description" content="Join the 100% free community where Respect & Love is Mandatory. AI-powered matching for real connections." />
        <meta property="og:image" content="https://picsum.photos/seed/spark-social/1200/630" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://spark-dating.web.app/" />
        <meta property="twitter:title" content="Spark - Respect & Love is Mandatory" />
        <meta property="twitter:description" content="AI-powered dating and cultural exchange for a respectful global community." />
        <meta property="twitter:image" content="https://picsum.photos/seed/spark-social/1200/630" />

        {/* Mobile & PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF3366" />
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/spark-logo/192/192" />
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

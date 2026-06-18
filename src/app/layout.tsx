
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
        <title>I Love U - Spark Love. End Poverty. ❤️</title>
        <meta name="description" content="I Love U: Join the connection revolution. Ending world poverty through global job creation. Respect & Love is Mandatory." />
        <meta name="keywords" content="dating, end poverty, prosperity, job creation, eliminate poverty, global mission, I Love U, respect mandatory" />
        
        {/* Open Graph / Facebook / Instagram */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://spark-dating.web.app/" />
        <meta property="og:title" content="I Love U - Prosperity through Connection" />
        <meta property="og:description" content="Connect hearts, create jobs, and help us end world poverty forever. Spark change now." />
        <meta property="og:image" content="https://picsum.photos/seed/iloveu-social/1200/630" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://spark-dating.web.app/" />
        <meta property="twitter:title" content="I Love U - Spark Change" />
        <meta property="twitter:description" content="A world without poverty starts with U. Join the Mandatory Respect & Love community." />
        <meta property="twitter:image" content="https://picsum.photos/seed/iloveu-social/1200/630" />

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


'use client';

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
        <title>I Love U - Global Mission ❤️ Reach & Help</title>
        <meta name="description" content="I Love U: AI-powered dating and global cultural exchange. Helping poor communities in rural and urban areas worldwide through happiness and connection." />
        <meta name="keywords" content="dating, cultural exchange, charity, help poor, rural aid, city empowerment, I Love U, mission" />
        
        {/* Open Graph / Facebook / Instagram */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://spark-dating.web.app/" />
        <meta property="og:title" content="I Love U - Global Impact & Happiness" />
        <meta property="og:description" content="Reach every community. Help poor people in rural and city areas. Join the mission where Love is Mandatory." />
        <meta property="og:image" content="https://picsum.photos/seed/iloveu-mission/1200/630" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://spark-dating.web.app/" />
        <meta property="twitter:title" content="I Love U - Global Mission" />
        <meta property="twitter:description" content="AI-powered dating with a mission to empower poor communities worldwide." />
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

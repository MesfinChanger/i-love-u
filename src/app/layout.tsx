import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';

export const viewport: Viewport = {
  themeColor: '#FF3366',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'I Love U - The AI Dating Revolution. Spark Love. End Poverty. ❤️',
  description: "I Love U: The world's most respectful AI dating platform. Join the connection revolution. Ending world poverty through global job creation. Respect & Love is Mandatory.",
  keywords: ['dating', 'dating app', 'ai dating', 'find love', 'end poverty', 'prosperity', 'job creation', 'eliminate poverty', 'global mission', 'I Love U', 'respect mandatory', 'matchmaking'],
  openGraph: {
    type: 'website',
    url: 'https://spark-dating.web.app/',
    title: 'I Love U - AI Dating & Prosperity',
    description: "Connect hearts on the world's first mission-driven dating app. Create jobs and help us end world poverty forever. Spark change now.",
    images: [{ url: 'https://picsum.photos/seed/iloveu-social/1200/630' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'I Love U - AI Dating Revolution',
    description: 'A dating app where your happiness ends world poverty. Join the Mandatory Respect & Love community.',
    images: ['https://picsum.photos/seed/iloveu-social/1200/630'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'I Love U',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

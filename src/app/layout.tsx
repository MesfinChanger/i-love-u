import type { Metadata, Viewport } from 'next';
import './globals.css';
import MainNavigation from "@/components/navigation/MainNavigation";
import { ClientProviders } from '@/components/providers/ClientProviders';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ClientProviders>
          <MainNavigation />
          <main className="flex-grow">
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold">Privacy Policy</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-10 prose prose-sm max-w-2xl">
        <h2 className="text-2xl font-black mb-6 tracking-tighter">Privacy Policy</h2>
        <p className="text-muted-foreground mb-4 italic">Last updated: {lastUpdated || '...'}</p>
        
        <section className="space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-2">1. Information We Collect</h3>
            <p>We collect information you provide directly to us:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Account details (Name, Age, Gender, Religion)</li>
              <li>Profile content (Bio, Interests, Photos)</li>
              <li>Communication data (Messages and interactions for safety moderation)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">2. How We Use Data</h3>
            <p>We use your data to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Facilitate compatibility matching via AI</li>
              <li>Ensure community safety through automated moderation</li>
              <li>Process voluntary donations</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">3. Data Retention & Deletion</h3>
            <p>You have the right to delete your account at any time via the Profile settings. Upon deletion, all your personal data, matches, and messages are permanently purged from our active databases within 30 days to ensure your privacy.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">4. AI Moderation & Safety</h3>
            <p>To protect our users, we use AI algorithms to monitor for harmful content. This processing is necessary to provide a safe dating environment. Flagged content may be reviewed by automated systems to prevent harassment.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">5. Third Party Services</h3>
            <p>We use Firebase (a Google service) for authentication and data storage. Your data is protected under Google's enterprise-grade security infrastructure.</p>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

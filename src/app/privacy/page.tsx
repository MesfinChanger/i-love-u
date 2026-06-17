'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
        <h2 className="text-2xl font-black mb-6">Privacy Policy</h2>
        <p className="text-muted-foreground mb-4 italic">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2">1. Data Collection</h3>
            <p>We collect information you provide directly to us when you create an account, including your name, age, gender, and bio. We also collect message data for safety moderation.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">2. Use of Information</h3>
            <p>We use your data to provide dating matches and ensure a safe community. Our AI models analyze interests to suggest better connections.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">3. Account Deletion</h3>
            <p>You have the right to delete your account at any time. Deletion removes all profile data, matches, and messages from our active servers instantly.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">4. AI Moderation</h3>
            <p>To protect users, we use AI to moderate profile content and messages. Flagged content may be reviewed to ensure compliance with our safety guidelines.</p>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
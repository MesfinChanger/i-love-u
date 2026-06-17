
'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold">Terms of Service</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-10 prose prose-sm max-w-2xl">
        <h2 className="text-2xl font-black mb-6">Terms of Service</h2>
        <p className="text-muted-foreground mb-4 italic">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2">1. Age Requirement</h3>
            <p>You must be at least 18 years old to use Spark. Use by anyone under 18 is strictly prohibited and accounts will be terminated.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">2. User Conduct</h3>
            <p>Users must be respectful. Harassment, insults, and spam are not tolerated. AI moderation is active to enforce these standards.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">3. Free Service</h3>
            <p>Spark is 100% free. We do not charge for matching or messaging. Donations are voluntary to support server costs.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">4. Termination</h3>
            <p>We reserve the right to suspend or terminate accounts that violate our safety policies or community guidelines.</p>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

'use client';

import { use, Suspense } from 'react';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import ChatWindow from '@/components/chat/ChatWindow';

/**
 * @fileOverview Messages Module Page Wrapper.
 * Orchestrates route synchronization and mounts the high-fidelity ChatWindow.
 */
export default function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="animate-spin text-primary opacity-20 w-10 h-10" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-screen overflow-hidden">
      <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary opacity-20" /></div>}>
        <ChatWindow conversationId={matchId} userId={user.uid} />
      </Suspense>
    </div>
  );
}
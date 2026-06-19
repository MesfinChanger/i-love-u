'use client';

import { Heart, RefreshCw } from 'lucide-react';

/**
 * @fileOverview Root Layout Error Boundary.
 * This is the final line of defense for the I Love U platform.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="font-sans antialiased bg-white">
        <div className="flex flex-col min-h-screen items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-heartbeat">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-4">CRITICAL RECOVERY MODE</h1>
          <p className="text-muted-foreground max-w-xs mx-auto mb-8 font-medium">
            The root of the Prosperity Revolution is stabilizing. Please click below to restart the mission.
          </p>
          <button 
            onClick={() => reset()} 
            className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors shadow-xl"
          >
            <RefreshCw className="w-4 h-4 inline-block mr-2" />
            Restart Platform
          </button>
        </div>
      </body>
    </html>
  );
}

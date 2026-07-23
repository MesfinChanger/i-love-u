import Hero from "@/components/home/Hero";
import AnimatedBackground from "@/components/home/AnimatedBackground";
import MissionCards from "@/components/home/MissionCards";

/**
 * @fileOverview High-Fidelity Mission Gateway.
 * The primary entry point for the I LOVE U Prosperity Revolution.
 * Refactored to a Server Component for maximum stability in Next.js 15.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen relative flex flex-col">
      {/* Animated Visual Layer */}
      <AnimatedBackground />
      
      {/* High-Impact Content Layer */}
      <div className="relative z-10 flex-grow flex flex-col">
        <Hero />
        <MissionCards />
      </div>

      {/* Trust Signal Footer */}
      <footer className="relative z-10 py-10 px-6 border-t border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">
             Eliminating World Poverty Together ❤️ Reaching Every Village
           </p>
           <div className="flex gap-8">
              <span className="text-[9px] font-black uppercase tracking-widest">Privacy Protocol</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Legal Controls</span>
           </div>
        </div>
      </footer>
    </main>
  );
}

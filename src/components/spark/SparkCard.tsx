import Card from "@/components/ui/Card";

/**
 * @fileOverview Spark Card Component.
 * High-fidelity visual container for heart profiles in the discovery pool.
 * Enhanced with Shared Values protocol and high-impact greeting trigger.
 */
export default function SparkCard({
  name,
  country
}: {
  name: string;
  country: string;
}) {
  return (
    <Card className="hover:scale-[1.02] transition-transform group border-primary/5">
      <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-none">
        ❤️ {name}
      </h2>

      <p className="mt-2 text-sm font-medium text-muted-foreground italic">
        🌍 {country}
      </p>

      <div className="mt-3">
        <span className="inline-flex items-center gap-1.5 border border-primary/10 bg-primary/5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
          ✨ Shared Values
        </span>
      </div>

      <button
        className="mt-6 w-full bg-white hover:bg-primary hover:text-white border-2 border-primary/10 hover:border-primary rounded-xl px-5 py-4 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-sm hover:shadow-primary/20"
      >
        👋 Send Greeting
      </button>
    </Card>
  );
}

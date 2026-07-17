import Card from "@/components/ui/Card";

/**
 * @fileOverview Spark Card Component.
 * High-fidelity visual container for heart profiles in the discovery pool.
 */
export default function SparkCard({
  name,
  country
}: {
  name: string;
  country: string;
}) {
  return (
    <Card className="hover:scale-[1.02] transition-transform">
      <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
        ❤️ {name}
      </h2>
      <p className="mt-1 text-sm font-medium text-muted-foreground italic">
        🌍 {country}
      </p>
      <button className="mt-6 w-full bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 rounded-xl px-4 py-3 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95">
        👋 Say Hello
      </button>
    </Card>
  );
}

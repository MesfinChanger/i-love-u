import { Card } from "@/components/ui/Card";

/**
 * @fileOverview Identity Card Component.
 * Provides a high-fidelity visual summary of a heart's primary signature.
 */
export default function IdentityCard({
  name,
  type
}: {
  name: string;
  type: string;
}) {
  return (
    <Card>
      <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
        <span className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center">🪪</span>
        {name}
      </h2>
      <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
        Account Type: <span className="text-primary">{type}</span>
      </p>
    </Card>
  );
}

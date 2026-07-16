
'use client';

/**
 * @fileOverview Idea Pool Module.
 * Deep dives into the global consciousness.
 */
export default function IdeasPage() {
  const categories = ["Economics", "Technology", "Politics", "Philosophy", "General"];

  return (
    <div className="p-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
          💡 Idea Pool
        </h1>
        <p className="text-xl text-muted-foreground font-medium italic max-w-lg">
          "Swim in the ocean of knowledge." Explore deep thoughts across our community pillars.
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <li key={cat} className="p-8 rounded-[2rem] bg-muted/30 border-2 border-dashed border-muted flex items-center justify-center font-black uppercase text-xs tracking-widest hover:bg-white hover:shadow-lg transition-all cursor-pointer">
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
}

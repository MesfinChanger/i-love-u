
'use client';

/**
 * @fileOverview 💡 Idea Pool - Global Consciousness Module.
 */
export default function Ideas() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-black tracking-tighter">💡 Idea Pool</h1>
      <ul className="space-y-4">
        {['Economics', 'Technology', 'Politics', 'Philosophy', 'General'].map((topic) => (
          <li key={topic} className="p-4 bg-muted/50 rounded-2xl font-bold uppercase tracking-widest text-sm border border-dashed border-primary/10">
            {topic}
          </li>
        ))}
      </ul>
    </div>
  );
}

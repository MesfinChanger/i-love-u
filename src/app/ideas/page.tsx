export default function Ideas() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-black mb-4">💡 Idea Pool</h1>
      <ul className="space-y-4 mt-6">
        {['Economics', 'Technology', 'Politics', 'Philosophy', 'General'].map((topic) => (
          <li key={topic} className="p-4 bg-muted/50 rounded-2xl font-bold uppercase tracking-widest text-sm">
            {topic}
          </li>
        ))}
      </ul>
    </div>
  );
}
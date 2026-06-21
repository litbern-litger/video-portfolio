export default function CategoryChips({ categories, counts, active, onSelect, total }) {
  const chip = (id, label, emoji, color, count, isActive) => (
    <button
      key={id}
      onClick={() => onSelect(id)}
      className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-700 transition-all duration-200 ${
        isActive
          ? "text-white shadow-lg"
          : "bg-white text-ink/70 ring-1 ring-black/5 hover:-translate-y-0.5 hover:text-ink"
      }`}
      style={isActive ? { backgroundColor: color } : undefined}
    >
      <span>{emoji}</span>
      <span>{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          isActive ? "bg-white/25" : "bg-black/5"
        }`}
      >
        {count}
      </span>
    </button>
  );

  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
      {chip("all", "All Work", "✨", "#1f1235", total, active === "all")}
      {categories.map((c) =>
        chip(c.id, c.label, c.emoji, c.color, counts[c.id] || 0, active === c.id)
      )}
    </div>
  );
}

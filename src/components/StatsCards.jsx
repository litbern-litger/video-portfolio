import { useCountUp } from "../hooks/useCountUp.js";

function StatCard({ emoji, value, label, accent, animate = true }) {
  const [count, ref] = useCountUp(typeof value === "number" ? value : 0);
  const display = animate && typeof value === "number" ? count : value;

  return (
    <div
      ref={ref}
      className="flex items-center gap-4 rounded-3xl bg-white/80 p-5 shadow-[0_8px_30px_rgba(31,18,53,0.08)] ring-1 ring-black/5 backdrop-blur"
    >
      <div
        className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl"
        style={{ backgroundColor: `${accent}22` }}
      >
        {emoji}
      </div>
      <div className="leading-tight">
        <div className="font-display text-3xl font-800" style={{ color: accent }}>
          {display}
        </div>
        <div className="text-sm font-500 text-ink/60">{label}</div>
      </div>
    </div>
  );
}

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard emoji="🎬" value={stats.videoCount} label="Videos" accent="#ff5b7f" />
      <StatCard emoji="📁" value={stats.categoryCount} label="Categories" accent="#8b5cf6" />
      <StatCard emoji="📅" value={stats.yearRange} label="Active Years" accent="#14b8c4" animate={false} />
    </div>
  );
}

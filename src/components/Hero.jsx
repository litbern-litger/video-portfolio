import ShaderBackground from "./ShaderBackground.jsx";
import { useCountUp } from "../hooks/useCountUp.js";

function StatTile({ emoji, value, label, animate = true }) {
  const [count, ref] = useCountUp(typeof value === "number" ? value : 0);
  const display = animate && typeof value === "number" ? count : value;
  return (
    <div
      ref={ref}
      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white shadow-lg backdrop-blur-md"
    >
      <span className="text-2xl">{emoji}</span>
      <div className="text-left leading-tight">
        <div className="font-display text-2xl font-800">{display}</div>
        <div className="text-sm text-white/70">{label}</div>
      </div>
    </div>
  );
}

export default function Hero({ profile, stats }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <ShaderBackground />
      </div>
      {/* Legibility overlays + fade into the bright page below */}
      <div className="absolute inset-0 -z-10 bg-ink/40" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(31,18,53,0.55))]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-b from-transparent to-cloud" />

      <div className="relative mx-auto max-w-5xl px-5 pt-20 pb-28 text-center sm:pt-28">
        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-600 text-white backdrop-blur-md">
          🎥 {profile.tagline}
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-800 leading-[1.05] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] sm:text-7xl">
          {profile.title.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="bg-gradient-to-r from-coral via-sun to-teal bg-clip-text text-transparent">
            {profile.title.split(" ").slice(-1)}
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/80 drop-shadow">{profile.subtitle}</p>

        <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-4">
          <StatTile emoji="🎬" value={stats.videoCount} label="Videos" />
          <StatTile emoji="📁" value={stats.categoryCount} label="Categories" />
          <StatTile emoji="📅" value={stats.yearRange} label="Active Years" animate={false} />
        </div>
      </div>
    </section>
  );
}

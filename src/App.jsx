import { useMemo, useState } from "react";
import data from "./data/portfolio.json";
import { computeStats, countByCategory } from "./lib/stats.js";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import StatsCards from "./components/StatsCards.jsx";
import CategoryChips from "./components/CategoryChips.jsx";
import VideoGrid from "./components/VideoGrid.jsx";
import VideoModal from "./components/VideoModal.jsx";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openVideo, setOpenVideo] = useState(null);

  const { profile, categories, videos } = data;

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );

  const stats = useMemo(() => computeStats(videos, categories), [videos, categories]);
  const counts = useMemo(() => countByCategory(videos), [videos]);

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? videos
        : videos.filter((v) => v.category === activeCategory),
    [videos, activeCategory]
  );

  return (
    <div className="mesh-bg relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 animate-float rounded-full bg-coral/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-96 h-80 w-80 animate-float rounded-full bg-teal/20 blur-3xl" />

      <Header name={profile.name} />
      <Hero profile={profile} />

      <main className="relative mx-auto max-w-6xl px-5 pb-24">
        <section className="mt-2">
          <StatsCards stats={stats} />
        </section>

        <section id="categories" className="mt-10">
          <CategoryChips
            categories={categories}
            counts={counts}
            active={activeCategory}
            onSelect={setActiveCategory}
            total={videos.length}
          />
        </section>

        <section id="work" className="mt-8">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-800 text-ink">
              {activeCategory === "all"
                ? "All Videos"
                : categoriesById[activeCategory]?.label}
            </h2>
            <span className="text-sm font-600 text-ink/50">
              {filtered.length} {filtered.length === 1 ? "video" : "videos"}
            </span>
          </div>
          <VideoGrid
            videos={filtered}
            categoriesById={categoriesById}
            onOpen={setOpenVideo}
          />
        </section>
      </main>

      <VideoModal
        video={openVideo}
        category={openVideo ? categoriesById[openVideo.category] : null}
        onClose={() => setOpenVideo(null)}
      />
    </div>
  );
}

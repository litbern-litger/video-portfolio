export default function Header({ name }) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-cloud/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-coral via-grape to-teal text-white shadow">
            ▶
          </span>
          <span className="font-display text-lg font-800 text-ink">{name}</span>
        </div>
        <nav className="hidden items-center gap-7 text-sm font-600 text-ink/60 sm:flex">
          <a href="#work" className="transition hover:text-ink">Work</a>
          <a href="#categories" className="transition hover:text-ink">Categories</a>
        </nav>
      </div>
    </header>
  );
}

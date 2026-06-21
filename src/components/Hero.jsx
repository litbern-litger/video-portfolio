export default function Hero({ profile }) {
  return (
    <section className="relative px-5 pt-12 pb-6 text-center sm:pt-16">
      <span className="inline-block rounded-full bg-white px-4 py-1.5 text-sm font-600 text-grape shadow-sm ring-1 ring-black/5">
        🎥 {profile.tagline}
      </span>
      <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-800 leading-[1.05] text-ink sm:text-6xl">
        {profile.title.split(" ").slice(0, -1).join(" ")}{" "}
        <span className="text-gradient">{profile.title.split(" ").slice(-1)}</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-ink/60">{profile.subtitle}</p>
    </section>
  );
}

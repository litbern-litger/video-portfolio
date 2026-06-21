export default function VideoCard({ video, category, onOpen }) {
  const isPortrait = video.orientation === "portrait";
  const bilingual = Object.keys(video.sources).length > 1;
  const color = category?.color || "#8b5cf6";

  return (
    <button
      onClick={() => onOpen(video)}
      className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-3xl bg-white text-left shadow-[0_8px_30px_rgba(31,18,53,0.08)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(31,18,53,0.18)]"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <div className={`relative overflow-hidden ${isPortrait ? "aspect-[9/16]" : "aspect-video"}`}>
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80" />

        <div className="absolute left-3 top-3 flex gap-2">
          {bilingual && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-700 text-ink shadow">
              EN · HE
            </span>
          )}
        </div>

        <span
          className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-600 text-white shadow"
          style={{ backgroundColor: color }}
        >
          {category?.emoji} {category?.label}
        </span>

        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 translate-y-1 place-items-center rounded-full bg-white/90 text-2xl text-ink opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            ▶
          </span>
        </div>

        <p className="absolute bottom-3 left-4 right-4 font-display text-lg font-700 leading-tight text-white drop-shadow">
          {video.title}
        </p>
      </div>
    </button>
  );
}

import { useEffect, useState } from "react";
import Player from "./Player.jsx";

export default function VideoModal({ video, category, onClose }) {
  const langs = video ? Object.keys(video.sources) : [];
  const [lang, setLang] = useState(langs[0] || "en");

  useEffect(() => {
    if (video) setLang(Object.keys(video.sources)[0]);
  }, [video]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = video ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [video, onClose]);

  if (!video) return null;

  const isPortrait = video.orientation === "portrait";
  const hasBoth = langs.length > 1;
  const isHe = lang === "he";
  const title = isHe && video.titleHe ? video.titleHe : video.title;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md sm:p-8"
      onClick={onClose}
    >
      <div
        dir={isHe ? "rtl" : "ltr"}
        className="animate-pop-in flex w-full max-w-5xl flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 text-white">
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-700 sm:text-2xl">{title}</p>
            {category && (
              <p className="text-sm text-white/60">
                {category.emoji} {isHe ? category.labelHe : category.label}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {hasBoth && (
              <div className="flex rounded-full bg-white/10 p-1 text-sm font-600">
                {langs.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`rounded-full px-3 py-1 transition ${
                      lang === l ? "bg-white text-ink" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            >
              ×
            </button>
          </div>
        </div>

        <div
          className={`mx-auto w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 ${
            isPortrait ? "aspect-[9/16] max-h-[78vh]" : "aspect-video"
          }`}
          style={isPortrait ? { maxWidth: "min(100%, 44vh)" } : undefined}
        >
          <Player
            key={`${video.id}-${lang}`}
            source={video.sources[lang]}
            poster={video.thumbnail}
          />
        </div>
      </div>
    </div>
  );
}

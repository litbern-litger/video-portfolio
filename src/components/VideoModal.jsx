import { useEffect, useState } from "react";
import Player from "./Player.jsx";
import { getAspect } from "../lib/aspect.js";

export default function VideoModal({ video, category, onClose }) {
  const langs = video ? Object.keys(video.sources) : [];
  const [lang, setLang] = useState(langs[0] || "en");
  const [ar, setAr] = useState(() => getAspect(video));

  useEffect(() => {
    if (video) setLang(Object.keys(video.sources)[0]);
  }, [video]);

  // Match the player frame to the video's true shape so the control bar sits
  // at the bottom (not floating mid-frame). The thumbnail shares the video's
  // aspect ratio, so we read it from the image and fall back to declared.
  useEffect(() => {
    if (!video) return;
    setAr(getAspect(video));
    if (!video.thumbnail) return;
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (ratio > 0.2 && ratio < 5) setAr(ratio);
    };
    img.src = video.thumbnail;
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
          className="mx-auto w-full overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/10"
          style={{
            aspectRatio: String(ar),
            maxWidth: `calc(${ar} * 80vh)`,
            maxHeight: "80vh",
          }}
        >
          <Player
            key={`${video.id}-${lang}`}
            source={video.sources[lang]}
            poster={video.thumbnail}
            aspect={ar}
            autoFullscreen={
              typeof window !== "undefined" &&
              window.matchMedia &&
              window.matchMedia("(pointer: coarse)").matches
            }
          />
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { resolveSource } from "../lib/sources.js";

// Enter fullscreen and rotate the device to match the video orientation.
function goFullscreen(video, aspect) {
  if (!video) return;
  const want = aspect >= 1 ? "landscape" : "portrait";
  const lock = () => {
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock(want).catch(() => {});
      }
    } catch {
      /* orientation lock unsupported (e.g. iOS) — native fullscreen rotates on its own */
    }
  };

  if (video.webkitEnterFullscreen && !document.fullscreenEnabled) {
    video.webkitEnterFullscreen();
    return;
  }

  const target = video.closest("[data-fs-target]") || video;
  const req = target.requestFullscreen || target.webkitRequestFullscreen;
  if (req) {
    return Promise.resolve(req.call(target)).then(lock).catch(lock);
  } else if (video.webkitEnterFullscreen) {
    video.webkitEnterFullscreen();
  }
}

export default function Player({
  source,
  poster,
  aspect = 16 / 9,
  autoPlay = true,
  autoFullscreen = false,
}) {
  const videoRef = useRef(null);
  const resolved = resolveSource(source);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    setFallback(false);
  }, [source]);

  useEffect(() => {
    if (!resolved || resolved.mode !== "video" || fallback) return;
    const video = videoRef.current;
    if (!video) return;

    let hls;
    const isHls = resolved.kind === "hls" || resolved.url.endsWith(".m3u8");
    if (isHls && !video.canPlayType("application/vnd.apple.mpegurl") && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(resolved.url);
      hls.attachMedia(video);
    } else {
      video.src = resolved.url;
    }

    // Best-effort: open straight into fullscreen (works where the browser still
    // honors the click that opened the player). The button is the reliable path.
    let raf;
    if (autoFullscreen) {
      raf = requestAnimationFrame(() => goFullscreen(video, aspect));
    }

    return () => {
      if (hls) hls.destroy();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [resolved, fallback, autoFullscreen, aspect]);

  if (!resolved) return null;

  const showIframe = resolved.mode === "iframe" || fallback;
  if (showIframe) {
    const url = fallback ? resolved.fallbackIframe : resolved.url;
    return (
      <iframe
        title="video"
        src={url}
        className="h-full w-full border-0"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <div data-fs-target className="group/player relative h-full w-full bg-black">
      <video
        ref={videoRef}
        poster={poster}
        controls
        autoPlay={autoPlay}
        playsInline
        className="h-full w-full bg-black object-contain"
        onError={() => resolved.fallbackIframe && setFallback(true)}
      />
      <button
        type="button"
        onClick={() => goFullscreen(videoRef.current, aspect)}
        aria-label="Fullscreen"
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-sm font-600 text-white backdrop-blur transition hover:bg-black/80"
      >
        ⤢ Fullscreen
      </button>
    </div>
  );
}

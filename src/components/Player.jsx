import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { resolveSource } from "../lib/sources.js";

// Enter fullscreen. Only landscape videos rotate the device to landscape;
// portrait videos keep the device upright (no needless rotation).
function goFullscreen(video, aspect) {
  if (!video) return;
  const lock = () => {
    if (aspect < 1) return; // portrait video — leave orientation alone
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(() => {});
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
    Promise.resolve(req.call(target)).then(lock).catch(lock);
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
  onAspect,
}) {
  const videoRef = useRef(null);
  // Stable per source so the effects don't re-run on every render.
  const resolved = useMemo(() => resolveSource(source), [source]);
  const [fallback, setFallback] = useState(false);

  const isHls =
    resolved?.mode === "video" &&
    (resolved.kind === "hls" || resolved.url.endsWith(".m3u8"));

  // Keep latest aspect without making it an effect dependency.
  const aspectRef = useRef(aspect);
  aspectRef.current = aspect;
  const didFullscreen = useRef(false);

  useEffect(() => {
    setFallback(false);
    didFullscreen.current = false;
  }, [resolved]);

  // HLS needs JS attach where the browser can't play .m3u8 natively.
  useEffect(() => {
    if (!isHls || fallback) return;
    const video = videoRef.current;
    if (!video || video.canPlayType("application/vnd.apple.mpegurl")) return;
    if (!Hls.isSupported()) return;
    const hls = new Hls({ enableWorker: true });
    hls.loadSource(resolved.url);
    hls.attachMedia(video);
    return () => hls.destroy();
  }, [resolved, isHls, fallback]);

  // Best-effort: open landscape videos straight into fullscreen (+rotate) once
  // on touch devices. Portrait videos play inline — no auto-fullscreen/rotation.
  useEffect(() => {
    if (!resolved || resolved.mode !== "video" || fallback) return;
    if (!autoFullscreen || didFullscreen.current) return;
    if (aspectRef.current < 1) return;
    const video = videoRef.current;
    if (!video) return;
    didFullscreen.current = true;
    const raf = requestAnimationFrame(() => goFullscreen(video, aspectRef.current));
    return () => cancelAnimationFrame(raf);
  }, [resolved, fallback, autoFullscreen]);

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
        src={isHls ? undefined : resolved.url}
        poster={poster}
        controls
        autoPlay={autoPlay}
        playsInline
        preload="auto"
        className="h-full w-full bg-black object-contain"
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          if (v.videoWidth && v.videoHeight && onAspect) {
            onAspect(v.videoWidth / v.videoHeight);
          }
        }}
        onError={() => resolved.fallbackIframe && setFallback(true)}
      />
      <button
        type="button"
        onClick={() => goFullscreen(videoRef.current, aspectRef.current)}
        aria-label="Fullscreen"
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-sm font-600 text-white backdrop-blur transition hover:bg-black/80"
      >
        ⤢ Fullscreen
      </button>
    </div>
  );
}

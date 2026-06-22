import { useEffect, useRef } from "react";
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
    Promise.resolve(req.call(target)).then(lock).catch(lock);
  } else if (video.webkitEnterFullscreen) {
    video.webkitEnterFullscreen();
  }
}

export default function Player({ source, poster, aspect = 16 / 9, autoPlay = true }) {
  const videoRef = useRef(null);
  const resolved = resolveSource(source);

  useEffect(() => {
    if (!resolved || resolved.mode !== "video") return;
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

    return () => {
      if (hls) hls.destroy();
    };
  }, [resolved]);

  if (!resolved) return null;

  if (resolved.mode === "iframe") {
    return (
      <iframe
        title="video"
        src={resolved.url}
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

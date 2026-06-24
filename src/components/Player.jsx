import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { resolveSource } from "../lib/sources.js";

export default function Player({
  source,
  poster,
  autoPlay = true,
  onAspect,
}) {
  const videoRef = useRef(null);
  // Stable per source so the effects don't re-run on every render.
  const resolved = useMemo(() => resolveSource(source), [source]);
  const [fallback, setFallback] = useState(false);

  const isHls =
    resolved?.mode === "video" &&
    (resolved.kind === "hls" || resolved.url.endsWith(".m3u8"));

  useEffect(() => {
    setFallback(false);
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
    </div>
  );
}

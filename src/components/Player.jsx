import { useEffect, useRef } from "react";
import Hls from "hls.js";

// Plays a single source. Supports:
//  - type "hls"  -> .m3u8 (hls.js, or native on Safari)
//  - type "mp4"  -> direct file
//  - type "iframe" -> Drive / YouTube / Vimeo embed
export default function Player({ source, poster, autoPlay = true }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!source || source.type === "iframe") return;
    const video = videoRef.current;
    if (!video) return;

    let hls;
    const isHls = source.type === "hls" || source.url.endsWith(".m3u8");

    if (isHls && !video.canPlayType("application/vnd.apple.mpegurl") && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(source.url);
      hls.attachMedia(video);
      if (autoPlay) hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
    } else {
      video.src = source.url;
      if (autoPlay) video.play().catch(() => {});
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [source, autoPlay]);

  if (!source) return null;

  if (source.type === "iframe") {
    return (
      <iframe
        title="video"
        src={source.url}
        className="h-full w-full"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      ref={videoRef}
      poster={poster}
      controls
      playsInline
      className="h-full w-full bg-black"
    />
  );
}

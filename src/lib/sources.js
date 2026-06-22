// Resolves a video source into something the player can use.
// Drive links become a native-playable direct URL (no account picker, real
// fullscreen + rotation), with the /preview iframe kept as a fallback.

export function extractDriveId(url) {
  if (!url) return null;
  let m = url.match(/\/d\/([^/?#]+)/);
  if (m) return m[1];
  m = url.match(/[?&]id=([^&]+)/);
  if (m) return m[1];
  return null;
}

export function driveDirectUrl(id) {
  return `https://drive.usercontent.google.com/download?id=${id}&export=download`;
}

export function drivePreviewUrl(id) {
  return `https://drive.google.com/file/d/${id}/preview`;
}

export function resolveSource(source) {
  if (!source) return null;
  const { type, url } = source;

  if (type === "mp4" || type === "hls") {
    return { mode: "video", url, kind: type };
  }

  if (type === "iframe") {
    const id = url && url.includes("drive.google.com") ? extractDriveId(url) : null;
    if (id) {
      return {
        mode: "video",
        kind: "mp4",
        url: driveDirectUrl(id),
        fallbackIframe: drivePreviewUrl(id),
      };
    }
    return { mode: "iframe", url };
  }

  return { mode: "iframe", url };
}

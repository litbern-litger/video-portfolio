// Resolves a video source into something the player can render.
//
// Google Drive files play in a native <video> via the direct content URL with
// `confirm=t` — this serves real video/mp4 with range support, so we get our
// own controls, true fullscreen + auto-rotate, and no Google pop-out button or
// account picker. The /preview embed is kept only as a last-resort fallback.
//
// Real mp4/hls files (e.g. our S3-hosted clips) play in a native <video> too.

export function extractDriveId(url) {
  if (!url) return null;
  let m = url.match(/\/d\/([^/?#]+)/);
  if (m) return m[1];
  m = url.match(/[?&]id=([^&]+)/);
  if (m) return m[1];
  return null;
}

export function driveDirectUrl(id) {
  return `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
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

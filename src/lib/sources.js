// Resolves a video source into something the player can render.
//
// Google Drive files play through Drive's own /preview embed: it streams
// reliably, has a real play button, and rotates in fullscreen on mobile.
// (Trying to play Drive's "direct download" URL natively is unreliable —
// it returns audio-only / interstitial pages for most files.)
//
// Real mp4/hls files (e.g. our S3-hosted clips) play in a native <video>.

export function extractDriveId(url) {
  if (!url) return null;
  let m = url.match(/\/d\/([^/?#]+)/);
  if (m) return m[1];
  m = url.match(/[?&]id=([^&]+)/);
  if (m) return m[1];
  return null;
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

  // Drive (or any iframe-style embed) → use the embed player directly.
  if (type === "iframe") {
    const id = url && url.includes("drive.google.com") ? extractDriveId(url) : null;
    return { mode: "iframe", url: id ? drivePreviewUrl(id) : url };
  }

  return { mode: "iframe", url };
}

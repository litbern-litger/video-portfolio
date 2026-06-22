// Returns the numeric width/height ratio for a video.
// Prefers an explicit `aspect` ("16/9", "4:5", or a number), else falls back
// to the coarse `orientation` field.
export function getAspect(video) {
  const a = video?.aspect;
  if (a != null) {
    if (typeof a === "number" && a > 0) return a;
    const parts = String(a).split(/[/:]/).map(Number);
    if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) return parts[0] / parts[1];
    const n = Number(a);
    if (n > 0) return n;
  }
  return video?.orientation === "portrait" ? 9 / 16 : 16 / 9;
}

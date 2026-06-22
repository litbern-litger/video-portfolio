# Video Portfolio ll

A playful, JSON-driven video portfolio. Built with React + Vite + Tailwind CSS v4.

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## How to add / edit videos

Everything is driven by **`src/data/portfolio.json`** — no code changes needed.

### Categories

```json
{ "id": "tech-promo", "label": "Tech Promo", "labelHe": "קידום טכנולוגי", "emoji": "🚀", "color": "#14b8c4" }
```

### A video

```json
{
  "id": "future-in-motion",
  "title": "Future in Motion",
  "titleHe": "העתיד בתנועה",
  "category": "tech-promo",
  "date": "2026-04",
  "orientation": "landscape",            // or "portrait"
  "thumbnail": "https://.../thumb.jpg",
  "sources": {
    "en": { "type": "hls", "url": "https://v.idomoo.com/.../video.m3u8" },
    "he": { "type": "mp4", "url": "https://v.idomoo.com/.../video.mp4" }
  }
}
```

- **`sources`**: include `en`, `he`, or both. If both exist, the player shows an EN/HE toggle automatically.
- **`type`**: `"hls"` (Idomoo `.m3u8` — preferred), `"mp4"` (direct file), or `"iframe"` (Drive/YouTube/Vimeo embed).
- **Idomoo**: paste the `.m3u8` URL with `type: "hls"`. The `.mp4` works too.
- The dashboard stats (video count, categories, year range) are computed automatically from this file.

### Using Google Drive links

1. In Drive, right-click the video → **Share** → set **General access** to **"Anyone with the link" → Viewer**. (If it's not shared, visitors can't play it.)
2. Copy the link. It looks like `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`. Grab the `FILE_ID` (the part between `/d/` and `/view`).
3. Use it like this:

```json
{
  "id": "my-drive-video",
  "title": "My Video",
  "category": "personal",
  "date": "2026-05",
  "orientation": "landscape",
  "thumbnail": "https://drive.google.com/thumbnail?id=FILE_ID&sz=w640",
  "sources": {
    "en": { "type": "iframe", "url": "https://drive.google.com/file/d/FILE_ID/preview" }
  }
}
```

- The `/preview` URL (not `/view`) is what embeds the player.
- `thumbnail` can reuse the same `FILE_ID` via the Drive thumbnail endpoint shown above.
- For a Hebrew + English pair, add both under `sources` with each file's own `FILE_ID`:

```json
"sources": {
  "en": { "type": "iframe", "url": "https://drive.google.com/file/d/EN_FILE_ID/preview" },
  "he": { "type": "iframe", "url": "https://drive.google.com/file/d/HE_FILE_ID/preview" }
}
```

> Note: Drive uses its own player (its controls, a pop-out button, limited autoplay). It works fine for showcasing, but when you're ready to polish, swapping `type` to `"hls"` with an Idomoo `.m3u8` URL gives the cleaner custom player.

## Deploy

Push to GitHub and import into **Vercel** or **Netlify** (framework: Vite). It deploys as a static site — no backend needed.

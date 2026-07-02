# Hero media

Drop the client's existing hero film here:

- **`hero.mp4`** ← the background film used in the `<Hero />` component
- **`hero-poster.jpg`** (optional) ← a still frame shown before the video loads / as a fallback

That's it — `src/components/Hero.tsx` already points at `/media/hero.mp4`.

Until `hero.mp4` exists, the hero shows an animated sunset-gradient fallback,
so the layout never looks broken.

## Recommended specs for the hero film
- **Format:** H.264 MP4 (most compatible). A `.webm` (VP9/AV1) twin is a nice-to-have for smaller size.
- **Resolution:** 1920×1080 is plenty (it's a background); 1280×720 is fine for a prototype.
- **Length:** 8–20 s, seamless loop.
- **Audio:** none needed — the video is muted/auto-playing.
- **Weight:** aim for < 5 MB. Compress with e.g.
  `ffmpeg -i input.mov -vcodec libx264 -crf 26 -preset slow -an -movflags +faststart hero.mp4`
- **Poster:** export one frame as `hero-poster.jpg` (~150–300 KB).

# Yandere Experience — trailer renderer

A 56s cinematic trailer for `/yandere`, drawn on a canvas and recorded by the browser
into a real MP4. No ffmpeg, no editor, no network.

## Use it

1. Double-click **`yandere-trailer.html`** (Chrome / Edge).
2. Pick an aspect ratio — 16:9 for X/YouTube, 9:16 for Reels/Shorts/TikTok, 1:1 for feeds.
3. **Preview** to watch it with sound. **Record video** to render it.
4. It takes 56 seconds of real time; you can use other tabs meanwhile. Click **Save** when it finishes.

Output is `.mp4` (H.264 + AAC) in Chrome/Edge. Other browsers fall back to `.webm`;
the status line says which you got. Then patch the duration (see below).

If the audio is silent when opened straight from disk, serve it instead:

```bash
node tools/trailer/serve.mjs
```

and open http://localhost:4599.

## The two gotchas, already handled

**Throttling.** A hidden tab throttles `setInterval` and `requestAnimationFrame` to ~1Hz,
which turns a recording into a slideshow. The frame clock therefore lives in a Worker
(not throttled) and frames are pushed with `captureStream(0)` + `track.requestFrame()`,
so recording never depends on the compositor.

**Duration.** MediaRecorder emits a *fragmented* MP4 whose `moov` claims an unknown
duration, so players show no length and cannot seek. Fix any recording with:

```bash
node tools/trailer/fixmp4.mjs out/yandere-trailer-16x9.mp4
```

It sums the real durations out of the `moof` fragments and writes them into
`mvhd`/`tkhd`/`mdhd`. Safe to re-run; sample data is never touched.

## Rendering without clicking

`serve.mjs` also accepts `POST /save?name=x`, and the page posts its finished blob there
when `window.__saveAs` is set. That is how the checked-in cuts in `out/` were produced:
set `__saveAs`, click Record, wait, then run `fixmp4.mjs`. `out/` is gitignored.

## Edit it

Never edit `yandere-trailer.html` — it is generated. Edit **`trailer.src.html`**, then:

```bash
node tools/trailer/build.mjs
```

which inlines `public/yandere/yandere.webp`, `yandere_2.webp`, `3.png` and `bg-audio.mp3`
as data URIs so the result is one portable file.

Everything lives in `trailer.src.html`:

- `T` — scene boundaries in seconds, `DUR` total length, `FPS` capture rate.
- `ART` — the source images plus the head-and-shoulders crop box used for every shot
  (`drawArt` widens that box rather than showing the raw frame, which keeps the
  trailer on her face and safe to post).
- `CHAT` — the opening message beats.
- `CHAPTERS` — the eight montage cards (chapter, permission surrendered, quote).
- `BOMB_WORDS` — the love-bombing popup text.
- `AudioEngine` — the synthesised score: `sub`, `braam`, `riser`, `reverseHit`, `stutter`,
  `heart`, `drone`, `blip`, plus a reverb send and a limiter. `score()` lays the whole
  thing on the timeline and ducks the ambient bed under each hit. The WebAudio clock also
  drives the animation, so picture and sound cannot drift apart.

Copy for the montage and quotes is pulled from the real chapter scripts in
`app/(experiences)/yandere/*/page.tsx` — if the chapters change, update `CHAPTERS` to match.

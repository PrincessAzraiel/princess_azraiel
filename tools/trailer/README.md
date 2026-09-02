# Trailer renderers

Cinematic trailers drawn on a canvas and recorded by the browser into a real MP4.
No ffmpeg, no editor, no network.

| Trailer | For | Length | Built file |
| --- | --- | --- | --- |
| `yandere` | `/yandere` | 56s | `yandere-trailer.html` |
| `typing2` | `/typing2` | 50s | `typing2-trailer.html` |

## Use it

1. Double-click the built `*-trailer.html` (Chrome / Edge), or run `node tools/trailer/serve.mjs`
   and open http://localhost:4599 for an index of both.
2. Pick an aspect ratio — 16:9 for X/YouTube, 9:16 for Reels/Shorts/TikTok, 1:1 for feeds.
3. **Preview** to watch it with sound. **Record video** to render it.
4. It takes the full run length in real time; you can use other tabs meanwhile.
   Click **Save** when it finishes.

Output is `.mp4` (H.264 + AAC) in Chrome/Edge. Other browsers fall back to `.webm`;
the status line says which you got. Then patch the duration (see below).

If the audio is silent when opened straight from disk, serve it instead:

```bash
node tools/trailer/serve.mjs
```

## The two gotchas, already handled

**Throttling.** A hidden tab throttles `setInterval` and `requestAnimationFrame` to ~1Hz,
which turns a recording into a slideshow. The frame clock therefore lives in a Worker
(not throttled) and frames are pushed with `captureStream(0)` + `track.requestFrame()`,
so recording never depends on the compositor.

**Duration.** MediaRecorder emits a *fragmented* MP4 whose `moov` claims an unknown
duration, so players show no length and cannot seek. Fix any recording with:

```bash
node tools/trailer/fixmp4.mjs out/typing-protocol-trailer-16x9.mp4
```

It sums the real durations out of the `moof` fragments and writes them into
`mvhd`/`tkhd`/`mdhd`. Safe to re-run; sample data is never touched.

## Rendering without clicking

`serve.mjs` also accepts `POST /save?name=x`, and the page posts its finished blob there
when `window.__saveAs` is set. That is how the checked-in cuts in `out/` were produced:
set `__saveAs`, click Record, wait, then run `fixmp4.mjs`. `out/` is gitignored.

## Layout

Never edit a built `*-trailer.html` — they are generated. The pieces are:

```
shell.html            page chrome + controls, with __TITLE__/__H1__/__DUR__ slots
engine.js             everything both trailers share
<name>.trailer.js     one trailer: timeline, scenes, score, art
build.mjs             stitches them together and inlines assets as data URIs
```

Rebuild after editing anything:

```bash
node tools/trailer/build.mjs
```

or `node tools/trailer/build.mjs typing2` for just one.

### What `engine.js` provides

The deterministic rng (`mulberry32`, `jitter`), math helpers (`clamp`, `lerp`, `prog`,
`easeIn/Out`, `hit`), tracked-text drawing (`setFont`, `tracked`, `fitTracked`,
`glitchTracked`, `wrapLines`, `typed`), the crop-aware `drawArt`, the overlays
(`drawNoise`, `drawScanlines`, `drawVignette`, `tearBands`, `flash`, `panel`), the whole
`AudioEngine` (`sub`, `braam`, `riser`, `reverseHit`, `stutter`, `heart`, `drone`, `blip`,
`tick`, `noise`, plus a reverb send and a limiter), and the playback/record harness.

### What a trailer module must define

| Name | Purpose |
| --- | --- |
| `T`, `DUR`, `FPS` | scene boundaries in seconds, total length, capture rate |
| `ART` | `[{ key, src, box }]` — `box` is the crop, normalised to the source image |
| `ASSET_AUDIO` | data URI for the ambient bed, or `""` for a synth-only score |
| `POSTER_T` | the timestamp drawn while idle |
| `OUTPUT_BASENAME` | file-name stem for the rendered video |
| `draw(t)` | paints one frame |
| `CUE(at, bg, bf, a)` | schedules the score; called with `this` = `AudioEngine` |

The module is emitted *before* the engine, so anything it evaluates at load time
(`ART`, a shuffled tile order) may not call engine helpers at that point — only from
inside `draw` / `CUE`.

### Adding a trailer

Add an entry to `TRAILERS` in `build.mjs` (module name, output name, title, length and
the asset tokens to inline), write `<name>.trailer.js`, add it to `TRAILERS` in
`serve.mjs`, and build. Asset tokens the config does not supply resolve to `""`, which is
how `typing2` ends up with no audio bed.

## The trailers

**`yandere.trailer.js`** — boot / chat / title / eight-chapter montage / love-bombing /
silence / end card. `CHAPTERS` copy is pulled from the real chapter scripts in
`app/(experiences)/yandere/*/page.tsx`; if the chapters change, update it to match.
Uses `public/yandere/` art and `bg-audio.mp3` as its bed.

**`typing2.trailer.js`** — open / transcribe / title / render / three strikes / owned /
end card. It advertises the mechanics the page actually has: `TYPE_LINES` are real lines
from `lib/typing-content.ts`, the reveal is the same 6×6 tile dissolve, and scene 5 walks
the punishment ladder (scold → lockout → she takes a line back, with the tiles closing
over her again). Art comes from `public/typing2/images/`; the score is fully synthesised,
which keeps the file at ~1.9 MB instead of the ~14 MB that inlining the 10 MB
`start.mp3` would cost.

Both trailers crop every shot to a head-and-shoulders box so they stay on her face and
stay postable.

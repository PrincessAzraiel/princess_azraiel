// MediaRecorder writes a fragmented MP4 whose moov claims an unknown (0xFFFFFFFF)
// duration, so players show no length and scrubbing/seeking breaks. This walks the
// moof fragments, sums the real per-track durations, and writes them back into
// mvhd / tkhd / mdhd (and mvex/mehd). Sample data is untouched, and re-running is safe.
//
// Usage: node tools/trailer/fixmp4.mjs out/yandere-trailer-16x9.mp4
import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
if (!file) { console.error("usage: node fixmp4.mjs <file.mp4>"); process.exit(1); }
const b = readFileSync(file);

const type = (o) => b.toString("latin1", o + 4, o + 8);
const size = (o) => b.readUInt32BE(o);
const version = (box) => b.readUInt8(box + 8);

function findBox(start, end, want) {
  for (let o = start; o + 8 <= end; o += size(o)) {
    if (size(o) < 8) break;
    if (type(o) === want) return o;
  }
  return -1;
}
function eachBox(start, end, want, fn) {
  for (let o = start; o + 8 <= end; o += size(o)) {
    if (size(o) < 8) break;
    if (type(o) === want) fn(o, o + size(o));
  }
}
// `wide` picks the 64-bit field layout; the value itself always fits in 32 bits here
function writeDur(fieldOffset, wide, value) {
  if (wide) { b.writeUInt32BE(0, fieldOffset); b.writeUInt32BE(value, fieldOffset + 4); }
  else b.writeUInt32BE(value, fieldOffset);
}

/* ---- 1. sum each track's duration out of the fragments ---- */
const frag = {};                       // trackId -> duration in that track's own timescale
for (let o = 0; o + 8 <= b.length; o += size(o)) {
  if (size(o) < 8) break;
  if (type(o) !== "moof") continue;
  for (let p = o + 8; p + 8 <= o + size(o); p += size(p)) {
    if (type(p) !== "traf") continue;
    let tid = 0, defDur = 0;
    for (let q = p + 8; q + 8 <= p + size(p); q += size(q)) {
      if (type(q) === "tfhd") {
        const fl = b.readUInt32BE(q + 8) & 0xffffff;
        tid = b.readUInt32BE(q + 12);
        let r = q + 16;
        if (fl & 0x1) r += 8;                       // base-data-offset
        if (fl & 0x2) r += 4;                       // sample-description-index
        if (fl & 0x8) defDur = b.readUInt32BE(r);   // default-sample-duration
      } else if (type(q) === "trun") {
        const fl = b.readUInt32BE(q + 8) & 0xffffff;
        const count = b.readUInt32BE(q + 12);
        let r = q + 16;
        if (fl & 0x1) r += 4;                       // data-offset
        if (fl & 0x4) r += 4;                       // first-sample-flags
        let sum = 0;
        for (let i = 0; i < count; i++) {
          let d = defDur;
          if (fl & 0x100) { d = b.readUInt32BE(r); r += 4; }
          if (fl & 0x200) r += 4;
          if (fl & 0x400) r += 4;
          if (fl & 0x800) r += 4;
          sum += d;
        }
        frag[tid] = (frag[tid] || 0) + sum;
      }
    }
  }
}
if (!Object.keys(frag).length) { console.error("no fragments found — nothing to fix"); process.exit(1); }

/* ---- 2. write the real durations into moov ----
   mvhd/tkhd/mdhd each come in a 32-bit (version 0) and 64-bit (version 1) flavour,
   and MediaRecorder emits version 1, which shifts every field after the header. */
const moov = findBox(0, b.length, "moov");
if (moov < 0) { console.error("no moov"); process.exit(1); }
const moovEnd = moov + size(moov);

const mvhd = findBox(moov + 8, moovEnd, "mvhd");
if (mvhd < 0) { console.error("no mvhd"); process.exit(1); }
const mvhdWide = version(mvhd) === 1;
const movieTimescale = b.readUInt32BE(mvhdWide ? mvhd + 28 : mvhd + 20);

let longest = 0, count = 0;
eachBox(moov + 8, moovEnd, "trak", (trak, trakEnd) => {
  const tkhd = findBox(trak + 8, trakEnd, "tkhd");
  const mdia = findBox(trak + 8, trakEnd, "mdia");
  if (tkhd < 0 || mdia < 0) return;
  const mdhd = findBox(mdia + 8, mdia + size(mdia), "mdhd");
  if (mdhd < 0) return;

  const tWide = version(tkhd) === 1;
  const trackId = b.readUInt32BE(tWide ? tkhd + 28 : tkhd + 20);
  const units = frag[trackId];
  if (!units) return;

  const mWide = version(mdhd) === 1;
  const timescale = b.readUInt32BE(mWide ? mdhd + 28 : mdhd + 20);
  const seconds = units / timescale;
  longest = Math.max(longest, seconds);

  writeDur(mWide ? mdhd + 32 : mdhd + 24, mWide, units);
  writeDur(tWide ? tkhd + 36 : tkhd + 28, tWide, Math.round(seconds * movieTimescale));
  count++;
  console.log(`  track ${trackId}: ${seconds.toFixed(3)}s @ ${timescale}Hz`);
});

const movieDur = Math.round(longest * movieTimescale);
writeDur(mvhdWide ? mvhd + 32 : mvhd + 24, mvhdWide, movieDur);

// mvex/mehd is what a player trusts for a fragmented file
const mvex = findBox(moov + 8, moovEnd, "mvex");
if (mvex >= 0) {
  const mehd = findBox(mvex + 8, mvex + size(mvex), "mehd");
  if (mehd >= 0) writeDur(mehd + 12, version(mehd) === 1, movieDur);
  else console.log("  (no mehd box — players will fall back to mvhd)");
}

writeFileSync(file, b);
console.log(`patched ${count} track(s) — duration ${longest.toFixed(2)}s @ ${movieTimescale}Hz written to ${file}`);

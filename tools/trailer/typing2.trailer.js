/* Typing Protocol (/typing2) — timeline, scenes and score.
   Shared canvas/audio/record machinery lives in engine.js.

   The trailer advertises what the page actually does: you transcribe her lines,
   she renders in as you go, and mistakes cost you ground. Scene 5 exists because
   the punishment ladder is the thing this experience has that nothing else does. */

/* ========= inlined assets ========= */
const ASSET_IMG_A = "__IMG_A__";
const ASSET_IMG_B = "__IMG_B__";
const ASSET_IMG_C = "__IMG_C__";
const ASSET_AUDIO = "__AUDIO__";   // empty — the score is entirely synthesised

/* ========= timeline ========= */
const T = {
  open:    [0.0,  7.0],   // a page she left open
  type:    [7.0,  16.0],  // the transcribe loop
  title:   [16.0, 21.0],  // title hit
  render:  [21.0, 31.0],  // she renders in, tile by tile
  punish:  [31.0, 38.5],  // three strikes
  owned:   [38.5, 43.0],  // 100%
  endcard: [43.0, 50.0],
};
const DUR = 50.0;
const FPS = 30;

const POSTER_T = 46.0;                    // idle frame: mid end-card
const OUTPUT_BASENAME = "typing-protocol-trailer";

const ROSE   = "#f43f5e";
const ROSE_L = "#fda4af";
const MONO   = '"Courier New", "Segoe UI Symbol", monospace';

/* ========= character art =========
   Same head-and-shoulders discipline as the yandere trailer: the source frames
   carry their own censor bars, and the crop box keeps every shot above them. */
const ART = [
  { key: "a", src: ASSET_IMG_A, box: [0.32, 0.02, 0.54, 0.40] },
  { key: "b", src: ASSET_IMG_B, box: [0.30, 0.02, 0.56, 0.40] },
  { key: "c", src: ASSET_IMG_C, box: [0.30, 0.02, 0.56, 0.40] },
];

/* ========= layout helpers ========= */
const wide = () => W / H > 1.2;

// the monitor chrome the site itself uses: traffic lights + a centred title bar
function monitor(x, y, w, h, title, accent, fill) {
  const acc = accent || "rgba(236,72,153,0.38)";
  panel(x, y, w, h, fill || "rgba(10,4,8,0.90)", acc, Math.max(1, 1.6 * U));
  const bar = Math.max(26 * U, h * 0.075);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(x + 1, y + 1, w - 2, bar);
  ctx.strokeStyle = acc;
  ctx.lineWidth = Math.max(1, U);
  ctx.beginPath(); ctx.moveTo(x, y + bar); ctx.lineTo(x + w, y + bar); ctx.stroke();

  const r = 4.5 * U, cy = y + bar / 2;
  const dots = ["#ff5f57", "#febc2e", "#28c840"];
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = dots[i];
    ctx.beginPath(); ctx.arc(x + 18 * U + i * 16 * U, cy, r, 0, Math.PI * 2); ctx.fill();
  }
  const ts = fitTracked(title, 14 * U, 0.16, w * 0.62, "bold", MONO);
  setFont(ts, "bold", MONO);
  ctx.fillStyle = "rgba(255,214,233,0.5)";
  tracked(title, x + w / 2, cy + ts * 0.36, ts * 0.16, "center");
  return y + bar;
}

// one line of the transcribe box: typed chars lit, caret block, the rest dim
function ghostLine(text, cx, y, size, done, bad) {
  setFont(size, "bold", MONO);
  const tr = size * 0.05;
  const w = trackedWidth(text, tr);
  let x = cx - w / 2;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const cw = ctx.measureText(ch).width;
    if (i === done) {
      ctx.fillStyle = bad ? ROSE : PINK;
      ctx.fillRect(x - tr * 0.4, y - size * 0.78, cw + tr * 0.8, size * 1.02);
      ctx.fillStyle = "#fff";
    } else if (i < done) {
      ctx.fillStyle = "#ffd9ec";
    } else {
      ctx.fillStyle = "rgba(249,168,212,0.20)";
    }
    ctx.fillText(ch, x, y);
    x += cw + tr;
  }
  return w;
}

function meter(x, y, w, pct, accent) {
  const h = 8 * U;
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = Math.max(1, U);
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  g.addColorStop(0, accent || PINK);
  g.addColorStop(1, "rgba(255,255,255,0.92)");
  ctx.fillStyle = g;
  ctx.shadowColor = accent || "rgba(236,72,153,0.8)";
  ctx.shadowBlur = 16 * U;
  ctx.fillRect(x, y, w * clamp(pct, 0, 1), h);
  ctx.shadowBlur = 0;
}

const TILE_COLS = 6, TILE_ROWS = 6, TILE_N = TILE_COLS * TILE_ROWS;
const TILE_ORDER = (function () {
  const r = mulberry32(90210);
  const a = [];
  for (let i = 0; i < TILE_N; i++) a.push(i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
})();

// her image behind a dissolving grid — the reveal mechanic, on screen
function tileReveal(entry, x, y, w, h, pct, expand, tint) {
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  drawArt(entry, x, y, w, h, 1, expand === undefined ? 0.05 : expand);
  ctx.fillStyle = "rgba(0,0,0," + (0.72 * (1 - pct)) + ")";
  ctx.fillRect(x, y, w, h);

  const shown = Math.round(clamp(pct, 0, 1) * TILE_N);
  const open = {};
  for (let i = 0; i < shown; i++) open[TILE_ORDER[i]] = 1;
  const tw = w / TILE_COLS, th = h / TILE_ROWS;
  for (let i = 0; i < TILE_N; i++) {
    if (open[i]) continue;
    const cx = i % TILE_COLS, cy = Math.floor(i / TILE_COLS);
    ctx.fillStyle = "rgba(0,0,0,0.88)";
    ctx.fillRect(x + cx * tw, y + cy * th, tw + 1, th + 1);
  }
  if (tint) { ctx.fillStyle = tint; ctx.fillRect(x, y, w, h); }
  // scanline glass over the render window
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = "#000";
  const step = Math.max(3, Math.round(4 * U));
  for (let yy = y; yy < y + h; yy += step) ctx.fillRect(x, yy, w, Math.max(1, step * 0.45));
  ctx.restore();
}

const STAGES = [
  [0.00, "DORMANT"], [0.25, "SYNCING"], [0.50, "BINDING"],
  [0.75, "YIELDING"], [1.00, "OWNED"],
];
const stageFor = p => {
  let s = STAGES[0][1];
  for (const st of STAGES) if (p >= st[0]) s = st[1];
  return s;
};

/* ========= scene 1 : a page she left open ========= */
const OPEN_LINES = [
  "> PROTOCOL 02 :: CONDITIONING",
  "> SUBJECT ....... YOU",
  "> REQUIRED ...... TWENTY-FOUR LINES",
  "> SHE IS WAITING FOR THE FIRST ONE.",
];
function sceneOpen(t) {
  const local = t - T.open[0];
  ctx.fillStyle = "#050204"; ctx.fillRect(0, 0, W, H);

  // she is already behind the terminal, before you agree to anything
  const ghost = 0.028 + 0.026 * Math.sin(local * 1.4);
  drawArt(IMG.a, 0, 0, W, H, local > 1.4 ? ghost : 0, 0.42);
  const peek = hit(local, 3.3, .12) + hit(local, 5.0, .09);
  if (peek > 0) drawArt(IMG.b, 0, 0, W, H, 0.18 + peek * 0.42, 0.06);

  const size = fitTracked(OPEN_LINES[2], 30 * U, 0.06, W * 0.80, "bold", MONO);
  setFont(size, "bold", MONO);
  const shown = typed(OPEN_LINES, local - 0.45, 27);
  const lh = size * 2.0;
  let bw0 = 0;
  for (const L of OPEN_LINES) bw0 = Math.max(bw0, trackedWidth(L, size * 0.06));
  const x = W / 2 - bw0 / 2;
  let y = H / 2 - lh * (OPEN_LINES.length + 2) / 2 + lh;

  for (let i = 0; i < shown.length; i++) {
    if (!shown[i]) { y += lh; continue; }
    ctx.fillStyle = i === 3 ? PINK : PINK_D;
    tracked(shown[i], x, y, size * 0.06, "left");
    y += lh;
  }

  if (local > 5.75) {
    const yes = local > 6.10;
    ctx.fillStyle = yes ? PINK_L : PINK;
    const q = "> BEGIN CONDITIONING ? [ Y / N ] " + (yes ? "Y" : "");
    tracked(q, x, y + lh * 0.4, size * 0.06, "left");
    if (!yes && Math.floor(local * 2.6) % 2 === 0) {
      const qw = trackedWidth(q, size * 0.06);
      ctx.fillRect(x + qw + size * 0.3, y + lh * 0.4 - size * 0.8, size * 0.6, size * 0.9);
    }
  }

  drawScanlines(t, 0.30);
  drawNoise(t, 0.05 + hit(local, 6.10, .5) * 0.25);
  drawVignette();
  tearBands(t, hit(local, 6.10, 0.85) * 1.2 + hit(local, 3.3, .2) * .5);
  flash(hit(local, 6.30, 1.0) * 0.85, "rgba(255,150,200,1)");
}

/* ========= scene 2 : the transcribe loop ========= */
const TYPE_LINES = [
  "i submit fully to princess azraiel",
  "her control over me is absolute",
  "my thoughts are hers to reshape",
];
const PRAISE = ["good pet", "she owns your focus now", "perfect obedience"];
function sceneType(t) {
  const local = t - T.type[0];
  const span = (T.type[1] - T.type[0]) / TYPE_LINES.length;
  const i = clamp(Math.floor(local / span), 0, TYPE_LINES.length - 1);
  const lp = (local - i * span) / span;
  const line = TYPE_LINES[i];
  const done = Math.floor(clamp(lp / 0.80, 0, 1) * line.length);

  ctx.fillStyle = "#060104"; ctx.fillRect(0, 0, W, H);
  drawArt(IMG.b, 0, 0, W, H, 0.05 + (i + lp) / TYPE_LINES.length * 0.07, 0.40);

  const pw = Math.min(W * 0.86, 1180 * U);
  const ph = Math.min(H * 0.46, 420 * U);
  const px = W / 2 - pw / 2, py = H / 2 - ph / 2;
  const top = monitor(px, py, pw, ph, "azraiel@sanctuary — conditioning.sys");

  // status strip
  const pad = 26 * U;
  setFont(23 * U, "bold", MONO);
  ctx.fillStyle = PINK_D;
  tracked("◆ " + stageFor((i + lp) / 24), px + pad, top + 44 * U, 23 * U * 0.18, "left");
  ctx.fillStyle = "rgba(249,168,212,0.50)";
  tracked("LINE " + String(i + 1).padStart(2, "0") + " / 24", px + pw - pad, top + 44 * U, 23 * U * 0.18, "right");

  const pct = (i + lp) / 24;
  meter(px + pad, top + 64 * U, pw - pad * 2, pct);
  setFont(20 * U, "bold", MONO);
  ctx.fillStyle = "rgba(249,168,212,0.55)";
  tracked(Math.round(pct * 100) + "% DEVOTION", px + pad, top + 104 * U, 20 * U * 0.18, "left");

  // the transcribe box
  const bx = px + pad, by = top + 126 * U, bw = pw - pad * 2, bh = ph - (top - py) - 152 * U;
  panel(bx, by, bw, bh, "rgba(0,0,0,0.55)", "rgba(236,72,153,0.42)", Math.max(1, 1.4 * U));
  setFont(17 * U, "bold", MONO);
  ctx.fillStyle = "rgba(249,168,212,0.34)";
  tracked("~$ TRANSCRIBE", bx + 20 * U, by + 32 * U, 17 * U * 0.18, "left");

  const ls = fitTracked(line, 40 * U, 0.05, bw - 44 * U, "bold", MONO);
  ghostLine(line, px + pw / 2, by + bh * 0.66, ls, done, false);

  // praise lands as the line closes out
  if (lp > 0.84) {
    const a = hit(lp, 0.84, 0.16);
    ctx.save();
    ctx.globalAlpha = clamp(a * 2.2, 0, 1);
    const ps = fitTracked(PRAISE[i], 32 * U, 0.22, W * 0.7, "bold", MONO);
    setFont(ps, "bold", MONO);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(236,72,153,0.9)"; ctx.shadowBlur = 26 * U;
    tracked(PRAISE[i].toUpperCase(), W / 2, py - 32 * U, ps * 0.22, "center");
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  drawScanlines(t, 0.26);
  drawNoise(t, 0.05);
  drawVignette();
  tearBands(t, hit(lp, 0.84, .14) * 0.9);
}

/* ========= scene 3 : title ========= */
function sceneTitle(t) {
  const local = t - T.title[0];
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);

  const stut = hit(local, 0.0, .10) + hit(local, 0.30, .07) + hit(local, 0.62, .05);
  drawArt(IMG.c, 0, 0, W, H, 0.10 + stut * 0.50, 0.08);

  const p = easeOut(prog(local, 0.15, 0.9));
  const gl = 0.9 * hit(local, 0.15, 0.55) + 0.22 + hit(local, 2.2, .3) * .8;
  const sc = lerp(1.14, 1, p) * (1 + Math.sin(local * 1.6) * 0.012);

  ctx.save();
  ctx.translate(W / 2, H * 0.46);
  ctx.scale(sc, sc);
  ctx.globalAlpha = p;
  ctx.shadowColor = "rgba(236,72,153,0.85)"; ctx.shadowBlur = 46 * U;
  glitchTracked("TYPING", 0, -34 * U, 122 * U, 0.20, "#ffe4f1", gl, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");
  glitchTracked("PROTOCOL", 0, 96 * U, 122 * U, 0.20, "#ffe4f1", gl, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.save(); ctx.globalAlpha = easeOut(prog(local, 1.0, 1.8));
  ctx.fillStyle = PINK_D;
  const sub = "TWENTY-FOUR LINES FOR PRINCESS AZRAIEL";
  const ts = fitTracked(sub, 26 * U, 0.36, W * 0.88, "bold", MONO);
  setFont(ts, "bold", MONO);
  tracked(sub, W / 2, H * 0.46 + 190 * U, ts * 0.36, "center");
  ctx.restore();

  drawScanlines(t, 0.24);
  drawNoise(t, 0.05 + stut * 0.25);
  drawVignette();
  tearBands(t, hit(local, 0.15, .45) * 1.6 + hit(local, 2.2, .2) * .9);
  flash(hit(local, 0.0, .35) * 0.8, "rgba(255,190,225,1)");
}

/* ========= scene 4 : she renders in ========= */
const RENDER_BEATS = [
  "every line you finish draws her in sharper",
  "she is watching the meter, not the words",
  "you stopped noticing you were still typing",
];
function sceneRender(t) {
  const local = t - T.render[0];
  const span = T.render[1] - T.render[0];
  const p = local / span;
  const pct = lerp(0.10, 0.78, p);            // 10% -> 78% devotion

  ctx.fillStyle = "#050204"; ctx.fillRect(0, 0, W, H);

  const two = wide();
  const gap = 26 * U;
  const boxW = two ? Math.min(W * 0.42, 720 * U) : Math.min(W * 0.84, 860 * U);
  const boxH = boxW;
  const bx = two ? W / 2 + gap / 2 : W / 2 - boxW / 2;
  const by = two ? H / 2 - boxH / 2 : H * 0.50 - boxH * 0.42;

  // the render window
  const rtop = monitor(bx, by, boxW, boxH + 34 * U, "render — subject.png");
  const rx = bx + 6 * U, ry = rtop + 6 * U, rw = boxW - 12 * U, rh = boxH - 12 * U;
  tileReveal(IMG.a, rx, ry, rw, rh, pct, 0.04);
  // readout sits in a gradient strip along the bottom of the render, the way
  // the page does it, so it never floats over her face
  const strip = 74 * U;
  const sg = ctx.createLinearGradient(0, ry + rh - strip, 0, ry + rh);
  sg.addColorStop(0, "rgba(0,0,0,0)");
  sg.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = sg;
  ctx.fillRect(rx, ry + rh - strip, rw, strip);
  setFont(20 * U, "bold", MONO);
  ctx.fillStyle = "rgba(249,168,212,0.75)";
  tracked("RENDER " + Math.round(pct * 100) + "%", rx + 18 * U, ry + rh - 24 * U, 20 * U * 0.18, "left");
  ctx.fillStyle = "#fff";
  tracked(stageFor(pct), rx + rw - 18 * U, ry + rh - 24 * U, 20 * U * 0.18, "right");

  // the copy beside (or above) it
  const i = clamp(Math.floor(p * RENDER_BEATS.length), 0, RENDER_BEATS.length - 1);
  const lp = p * RENDER_BEATS.length - i;
  const a = easeOut(clamp(lp / 0.18, 0, 1)) * (1 - easeIn(clamp((lp - 0.84) / 0.16, 0, 1)));

  ctx.save();
  ctx.globalAlpha = a;
  const colW = two ? Math.min(W * 0.42, 720 * U) : W * 0.86;
  const cx = two ? W / 2 - gap / 2 - colW / 2 : W / 2;
  const cy = two ? H / 2 - 30 * U : H * 0.14;
  const cs = fitTracked("you stopped noticing you were", 34 * U, 0.02, colW, "bold", MONO);
  setFont(cs, "bold", MONO);
  ctx.fillStyle = "#ffd9ec";
  wrapLines(RENDER_BEATS[i], colW).forEach(function (l, k) {
    ctx.fillText(l, cx - ctx.measureText(l).width / 2, cy + k * cs * 1.5);
  });
  ctx.restore();

  // the meter across the bottom
  const mw = Math.min(W * 0.78, 980 * U), mx = W / 2 - mw / 2, my = H * 0.885;
  setFont(22 * U, "bold", MONO);
  ctx.fillStyle = PINK_D;
  tracked("DEVOTION", mx, my - 18 * U, 22 * U * 0.26, "left");
  ctx.fillStyle = "#fff";
  tracked(Math.round(pct * 100) + "%", mx + mw, my - 18 * U, 22 * U * 0.26, "right");
  meter(mx, my, mw, pct);

  drawScanlines(t, 0.26);
  drawNoise(t, 0.05 + p * 0.05);
  drawVignette();
  tearBands(t, hit(lp, 0, .16) * 1.0);
  flash(hit(lp, 0, .12) * 0.14, "rgba(255,150,200,1)");
}

/* ========= scene 5 : three strikes =========
   The distinguishing mechanic: a mistake scolds, two freeze you, three take a
   line back — and the tiles you already earned close over her again. */
const STRIKES = [
  { at: 0.5, kind: "scold",  text: "SLOPPY" },
  { at: 2.4, kind: "lock",   text: "HOLD STILL" },
  { at: 4.6, kind: "revoke", text: "SHE TOOK ONE BACK" },
];
function scenePunish(t) {
  const local = t - T.punish[0];
  let stage = -1;
  for (let i = 0; i < STRIKES.length; i++) if (local >= STRIKES[i].at) stage = i;

  // devotion falls back on the third strike
  const pct = local < STRIKES[2].at ? 0.78
            : lerp(0.78, 0.70, easeOut(prog(local, STRIKES[2].at, STRIKES[2].at + 0.7)));

  const bad = stage >= 0 ? hit(local, STRIKES[stage].at, 0.55) : 0;
  ctx.fillStyle = "#0a0206"; ctx.fillRect(0, 0, W, H);
  drawArt(IMG.c, 0, 0, W, H, 0.07 + bad * 0.10, 0.30);

  const pw = Math.min(W * 0.86, 1180 * U);
  const ph = Math.min(H * 0.50, 440 * U);
  const px = W / 2 - pw / 2, py = H * 0.46 - ph / 2;
  const acc = stage >= 0 ? "rgba(244,63,94,0.75)" : "rgba(236,72,153,0.38)";
  const top = monitor(px, py, pw, ph, "azraiel@sanctuary — conditioning.sys", acc);

  const pad = 26 * U;
  setFont(23 * U, "bold", MONO);
  ctx.fillStyle = ROSE;
  tracked("◆ " + (stage >= 2 ? "REVOKED" : "YIELDING"), px + pad, top + 44 * U, 23 * U * 0.18, "left");
  ctx.fillStyle = "rgba(253,164,175,0.62)";
  const slips = Math.min(stage + 1, 3);
  tracked(slips + " SLIP" + (slips === 1 ? "" : "S"), px + pw - pad, top + 44 * U, 23 * U * 0.18, "right");
  meter(px + pad, top + 64 * U, pw - pad * 2, pct, ROSE);

  const bx = px + pad, by = top + 106 * U, bw = pw - pad * 2, bh = ph - (top - py) - 132 * U;
  panel(bx, by, bw, bh, "rgba(0,0,0,0.6)", acc, Math.max(1, 1.4 * U));

  const line = "her control over me is absolute";
  const ls = fitTracked(line, 40 * U, 0.05, bw - 44 * U, "bold", MONO);

  if (stage === 1 && local < STRIKES[2].at) {
    // the lockout: input is dead and she says so
    ctx.fillStyle = "rgba(0,0,0,0.86)";
    ctx.fillRect(bx + 1, by + 1, bw - 2, bh - 2);
    const hs = fitTracked("HOLD STILL", 40 * U, 0.34, bw * 0.8, "bold", MONO);
    setFont(hs, "bold", MONO);
    ctx.fillStyle = ROSE_L;
    ctx.shadowColor = "rgba(244,63,94,0.8)"; ctx.shadowBlur = 30 * U;
    tracked("HOLD STILL", px + pw / 2, by + bh * 0.48, hs * 0.34, "center");
    ctx.shadowBlur = 0;
    const ss = fitTracked("SHE IS NOT FINISHED WITH YOU", 20 * U, 0.28, bw * 0.86, "bold", MONO);
    setFont(ss, "bold", MONO);
    ctx.fillStyle = "rgba(253,164,175,0.45)";
    tracked("SHE IS NOT FINISHED WITH YOU", px + pw / 2, by + bh * 0.68, ss * 0.28, "center");
  } else {
    const done = stage >= 2 ? 0 : 14;
    ghostLine(line, px + pw / 2, by + bh * 0.62, ls, done, bad > 0.05);
  }

  // the scold, thrown over the top of everything
  if (stage >= 0) {
    const s = STRIKES[stage];
    const age = local - s.at;
    const a = easeOut(clamp(age / 0.16, 0, 1)) * (1 - clamp((age - 1.25) / 0.4, 0, 1));
    if (a > 0.01) {
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate((jitter(t, 3) - .5) * bad * 14 * U, 0);
      const size = s.kind === "revoke" ? 62 * U : 44 * U;
      const ss = fitTracked(s.text, size, 0.18, W * 0.86, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");
      setFont(ss, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");
      ctx.shadowColor = "rgba(244,63,94,0.95)"; ctx.shadowBlur = 34 * U;
      ctx.fillStyle = "#fff";
      tracked(s.text, W / 2, py - 34 * U, ss * 0.18, "center");
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }

  // the tiles she just closed over again
  if (local > STRIKES[2].at - 0.2) {
    const rw = Math.min(W * 0.30, 330 * U);
    const rx = W / 2 - rw / 2, ry = H * 0.80 - rw * 0.30;
    tileReveal(IMG.a, rx, ry, rw, rw * 0.6, pct, 0.04, "rgba(244,63,94,0.14)");
    setFont(19 * U, "bold", MONO);
    ctx.fillStyle = ROSE_L;
    tracked("-8% DEVOTION", W / 2, ry + rw * 0.6 + 26 * U, 19 * U * 0.24, "center");
  }

  drawScanlines(t, 0.30);
  drawNoise(t, 0.07 + bad * 0.16);
  drawVignette();
  tearBands(t, bad * 2.2);
  flash(bad * 0.30, "rgba(255,70,110,1)");
  const cut = prog(local, 7.1, 7.5);
  if (cut > 0) { ctx.fillStyle = "rgba(0,0,0," + cut + ")"; ctx.fillRect(0, 0, W, H); }
}

/* ========= scene 6 : owned ========= */
function sceneOwned(t) {
  const local = t - T.owned[0];
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);

  const pct = easeOut(prog(local, 0.2, 2.4));
  const boxW = Math.min(W * 0.62, H * 0.58, 700 * U);
  tileReveal(IMG.a, W / 2 - boxW / 2, H * 0.40 - boxW / 2, boxW, boxW, lerp(0.70, 1, pct), 0.02);

  const out = 1 - prog(local, 4.2, 4.5);
  ctx.save();
  ctx.globalAlpha = easeOut(prog(local, 1.6, 2.6)) * out;
  const s1 = fitTracked("SHE IS FULLY RENDERED.", 46 * U, 0.14, W * 0.86, "bold", MONO);
  setFont(s1, "bold", MONO);
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgba(236,72,153,0.55)"; ctx.shadowBlur = 30 * U;
  tracked("SHE IS FULLY RENDERED.", W / 2, H * 0.79, s1 * 0.14, "center");
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = easeOut(prog(local, 2.6, 3.4)) * out;
  ctx.fillStyle = PINK;
  const s2 = fitTracked("100% DEVOTION · OWNED", 26 * U, 0.34, W * 0.8, "bold", MONO);
  setFont(s2, "bold", MONO);
  tracked("100% DEVOTION · OWNED", W / 2, H * 0.87, s2 * 0.34, "center");
  ctx.restore();

  drawScanlines(t, 0.18);
  drawNoise(t, 0.035);
  drawVignette();
}

/* ========= scene 7 : end card ========= */
function sceneEnd(t) {
  const local = t - T.endcard[0];
  ctx.fillStyle = "#050204"; ctx.fillRect(0, 0, W, H);
  drawArt(IMG.a, 0, 0, W, H, 0.09 + hit(local, 0, .3) * 0.32, 0.12);

  const EY = H * 0.5 - 130 * U;
  const gl = hit(local, 0.0, .5) * 1.1 + hit(local, 2.6, .18) * .7 + 0.12;
  const p = easeOut(prog(local, 0.05, 0.7));

  ctx.save();
  ctx.globalAlpha = p;
  const sc = lerp(1.06, 1, p);
  ctx.translate(W / 2, EY); ctx.scale(sc, sc);
  ctx.shadowColor = "rgba(236,72,153,0.8)"; ctx.shadowBlur = 44 * U;
  glitchTracked("TYPING", 0, -30 * U, 100 * U, 0.14, "#ffe4f1", gl, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");
  glitchTracked("PROTOCOL", 0, 78 * U, 100 * U, 0.14, "#ffe4f1", gl, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.save(); ctx.globalAlpha = easeOut(prog(local, 0.8, 1.5));
  ctx.fillStyle = PINK;
  ctx.fillRect(W / 2 - Math.min(W * 0.30, 300 * U), EY + 140 * U, Math.min(W * 0.60, 600 * U), Math.max(1, 2 * U));
  const sub = "TWENTY-FOUR LINES · SHE TAKES THEM BACK IF YOU SLIP";
  const ss = fitTracked(sub, 20 * U, 0.24, W * 0.88, "bold", MONO);
  setFont(ss, "bold", MONO);
  ctx.fillStyle = PINK_L;
  tracked(sub, W / 2, EY + 196 * U, ss * 0.24, "center");
  ctx.restore();

  ctx.save(); ctx.globalAlpha = easeOut(prog(local, 1.6, 2.3));
  const url = "princessazraiel.com/typing2";
  const us = fitTracked(url, 40 * U, 0.10, W * 0.74, "bold", MONO);
  setFont(us, "bold", MONO);
  const uw = trackedWidth(url, us * 0.10);
  const bw = uw + 70 * U, bh = us * 2.5, bx = W / 2 - bw / 2, by = EY + 250 * U;
  panel(bx, by, bw, bh, "rgba(74,0,38,0.55)", PINK, Math.max(1, 2 * U));
  ctx.shadowColor = "rgba(236,72,153,0.65)"; ctx.shadowBlur = 30 * U;
  ctx.fillStyle = "#fff";
  setFont(us, "bold", MONO);
  tracked(url, W / 2, by + bh * 0.66, us * 0.10, "center");
  ctx.shadowBlur = 0;
  if (Math.floor(local * 1.8) % 2 === 0) {
    ctx.fillStyle = PINK_L;
    ctx.fillRect(W / 2 + uw / 2 + 10 * U, by + bh * 0.30, us * 0.50, us * 0.9);
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = easeOut(prog(local, 2.6, 3.4)) * (0.72 + 0.28 * Math.sin(local * 2.2));
  const hs = fitTracked("SIT DOWN AND TYPE FOR HER.", 24 * U, 0.30, W * 0.86, "bold", MONO);
  setFont(hs, "bold", MONO);
  ctx.fillStyle = PINK;
  tracked("SIT DOWN AND TYPE FOR HER.", W / 2, EY + 380 * U, hs * 0.30, "center");
  ctx.restore();

  ctx.save(); ctx.globalAlpha = easeOut(prog(local, 3.4, 4.2));
  const as = fitTracked("@PrincessAzraiel", 22 * U, 0.30, W * 0.7, "bold", MONO);
  setFont(as, "bold", MONO);
  ctx.fillStyle = PINK;
  tracked("@PrincessAzraiel", W / 2, H * 0.90, as * 0.30, "center");
  ctx.restore();

  drawScanlines(t, 0.24);
  drawNoise(t, 0.05);
  drawVignette();
  tearBands(t, hit(local, 0, .3) * 1.4 + hit(local, 2.6, .12) * .6);
  flash(hit(local, 0, .3) * 0.75, "rgba(255,190,225,1)");
  const fade = prog(local, DUR - T.endcard[0] - 1.1, DUR - T.endcard[0]);
  if (fade > 0) { ctx.fillStyle = "rgba(0,0,0," + fade + ")"; ctx.fillRect(0, 0, W, H); }
}

/* ========= master draw ========= */
function draw(t) {
  t = clamp(t, 0, DUR);
  if (inRange(t, T.open)) sceneOpen(t);
  else if (inRange(t, T.type)) sceneType(t);
  else if (inRange(t, T.title)) sceneTitle(t);
  else if (inRange(t, T.render)) sceneRender(t);
  else if (inRange(t, T.punish)) scenePunish(t);
  else if (inRange(t, T.owned)) sceneOwned(t);
  else sceneEnd(t);
}

/* ========= the score =========
   No audio bed on this one — the whole thing is synthesised, so the file stays
   small. Keystrokes carry the rhythm: ticks under the typing scenes, a sub on
   every completed line, and the punishment detuned against everything else. */
function CUE(at, bg, bf, a) {
  // --- a page she left open ---
  this.drone(at(0.2), 7.0, 0.075, 43.6);
  for (let i = 0; i < 24; i++) this.tick(at(0.50 + i * 0.135), 0.042, 1800 + (i % 7) * 340);
  this.stutter(at(3.30), 0.13, 0.09);
  this.reverseHit(at(5.30), 0.80, 0.26);
  this.sub(at(6.12), 76, 27, 1.9, 0.85);
  this.noise(at(6.12), 0.42, 0.26, 1150, 0.8);
  this.stutter(at(6.12), 0.26, 0.14, 60);
  this.noise(at(6.80), 0.50, 0.16, 2400, 1.4);

  // --- the transcribe loop: one tick per keystroke, a sub per finished line ---
  this.drone(at(T.type[0]), 9.2, 0.070, 49.0);
  const tspan = (T.type[1] - T.type[0]) / TYPE_LINES.length;
  for (let i = 0; i < TYPE_LINES.length; i++) {
    const base = T.type[0] + i * tspan;
    const keys = TYPE_LINES[i].length;
    for (let k = 0; k < keys; k++) {
      this.tick(at(base + (k / keys) * tspan * 0.80), 0.030 + (k / keys) * 0.014, 2500 + (k % 5) * 240);
    }
    this.blip(at(base + tspan * 0.84), 1180 - i * 120, 0.13);      // the praise
    this.sub(at(base + tspan * 0.84), 104 + i * 8, 32, 0.80, 0.34 + i * 0.07);
    this.noise(at(base + tspan * 0.84), 0.12, 0.13, 3800, 4);
  }
  this.riser(at(T.title[0] - 1.6), 1.58, 0.25);

  // --- title ---
  this.braam(at(T.title[0]), 3.4, 0.34, 51);
  this.sub(at(T.title[0]), 92, 26, 3.2, 0.95);
  this.noise(at(T.title[0]), 0.75, 0.30, 840, 0.7);
  this.stutter(at(T.title[0]), 0.30, 0.15, 55);
  this.sub(at(T.title[0] + 2.2), 70, 24, 1.2, 0.32);
  this.reverseHit(at(T.render[0] - 0.60), 0.58, 0.24);

  // --- she renders in: the pulse tightens as the meter climbs ---
  this.drone(at(T.render[0]), 10.2, 0.10, 55);
  const rspan = (T.render[1] - T.render[0]) / RENDER_BEATS.length;
  for (let i = 0; i < RENDER_BEATS.length; i++) {
    const c = at(T.render[0] + i * rspan);
    const k = i / (RENDER_BEATS.length - 1);
    this.sub(c, 108 + i * 9, 34, 0.85, 0.36 + k * 0.24);
    this.noise(c, 0.14, 0.13 + k * 0.10, 1700 + i * 260, 1.5);
    if (i >= 1) this.braam(c, rspan * 0.92, 0.10 + k * 0.09, 43.6 + i * 2);
    const sub = 3 + i;
    for (let j = 1; j < sub; j++) this.tick(c + (rspan / sub) * j, 0.05 + k * 0.05, 2600 + j * 480);
  }

  // --- three strikes: detuned, harsher, then a hole where the pulse was ---
  for (const s of STRIKES) {
    const c = at(T.punish[0] + s.at);
    if (s.kind === "scold") {
      this.noise(c, 0.16, 0.22, 2100, 3);
      this.sub(c, 88, 40, 0.5, 0.40);
    } else if (s.kind === "lock") {
      this.noise(c, 0.30, 0.26, 900, 1.2);
      this.sub(c, 70, 30, 1.4, 0.62);
      this.drone(c, 1.9, 0.14, 38.9);                 // a semitone under the bed
      this.stutter(c, 0.22, 0.12, 40);
    } else {
      this.reverseHit(c - 0.55, 0.55, 0.30);
      this.sub(c, 130, 24, 2.2, 1.0);
      this.noise(c, 0.55, 0.32, 700, 0.7);
      this.stutter(c, 0.36, 0.18, 70);
      this.braam(c, 2.4, 0.26, 38.9);
    }
  }
  this.drone(at(T.punish[0] + 5.4), 2.0, 0.09, 41.2);

  // --- owned: almost nothing, just her ---
  this.noise(at(T.owned[0]), 4.4, 0.020, 260, 0.6, "lowpass", 0.4);
  for (let i = 0; i < 4; i++) this.heart(at(T.owned[0] + 0.7 + i * 1.02), 0.26);
  this.reverseHit(at(T.endcard[0] - 0.64), 0.62, 0.30);

  // --- end card ---
  this.braam(at(T.endcard[0]), 4.2, 0.36, 51);
  this.sub(at(T.endcard[0]), 100, 26, 3.4, 0.95);
  this.noise(at(T.endcard[0]), 0.8, 0.30, 900, 0.7);
  this.stutter(at(T.endcard[0]), 0.28, 0.14, 55);
  this.drone(at(T.endcard[0]), 7.0, 0.10, 51);
  this.sub(at(T.endcard[0] + 2.6), 78, 24, 1.4, 0.28);
  this.blip(at(T.endcard[0] + 4.6), 900, 0.10);
}

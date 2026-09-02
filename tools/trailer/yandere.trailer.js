/* Yandere Experience — timeline, scenes and score. Engine lives in engine.js. */

/* ========= inlined assets ========= */
const ASSET_IMG_A = "__IMG_A__";
const ASSET_IMG_B = "__IMG_B__";
const ASSET_IMG_C = "__IMG_C__";
const ASSET_AUDIO = "__AUDIO__";
/* ========= timeline ========= */
const T = {
  boot:    [0.0,  7.5],
  chat:    [7.5,  16.5],
  title:   [16.5, 21.0],
  montage: [21.0, 37.0],
  bomb:    [37.0, 42.0],
  voidsc:  [42.0, 47.5],
  endcard: [47.5, 56.0],
};
const DUR = 56.0;
const FPS = 30;
const POSTER_T = 50.5;                    // idle frame: mid end-card
const OUTPUT_BASENAME = "yandere-experience-trailer";

/* ========= character art =========
   Every source image is cropped to a head-and-shoulders box so the trailer
   stays on her face — the eyes are the whole point, and it keeps the video
   postable anywhere. box = [x, y, w, h] normalised to the source image. */
const ART = [
  { key: "a", src: ASSET_IMG_A, box: [0.30, 0.00, 0.42, 0.28] },
  { key: "b", src: ASSET_IMG_B, box: [0.28, 0.02, 0.44, 0.24] },
  { key: "c", src: ASSET_IMG_C, box: [0.28, 0.00, 0.44, 0.26] },
];
/* ========= scene 1 : the link ========= */
const BOOT_LINES = [
  "> INCOMING CONNECTION :: UNKNOWN HOST",
  "> ORIGIN ........ NOT FOUND",
  "> TARGET ........ YOUR DEVICE",
  "> SHE HAS BEEN WAITING FOR YOU.",
];
function sceneBoot(t) {
  const local = t - T.boot[0];
  ctx.fillStyle = "#050002"; ctx.fillRect(0, 0, W, H);

  // she is already here, behind the text, before you accept anything
  const ghost = 0.030 + 0.030 * Math.sin(local * 1.5);
  drawArt(IMG.a, 0, 0, W, H, local > 1.6 ? ghost : 0, 0.45);
  const peek = hit(local, 3.4, .13) + hit(local, 5.2, .10);
  if (peek > 0) drawArt(IMG.c, 0, 0, W, H, 0.20 + peek * 0.45, 0.05);

  const size = fitTracked(BOOT_LINES[0], 30 * U, 0.06, W * 0.84, "bold");
  setFont(size, "bold");
  const lines = typed(BOOT_LINES, local - 0.5, 26);
  const lh = size * 2.0;
  const blockH = lh * (BOOT_LINES.length + 2);
  let bw0 = 0;
  for (const L of BOOT_LINES) bw0 = Math.max(bw0, trackedWidth(L, size * 0.06));
  const x = W / 2 - bw0 / 2;
  let y = H / 2 - blockH / 2 + lh;

  for (let i = 0; i < lines.length; i++) {
    const txt = lines[i];
    if (!txt) { y += lh; continue; }
    ctx.fillStyle = i === 3 ? PINK : PINK_D;
    tracked(txt, x, y, size * 0.06, "left");
    y += lh;
  }

  if (local > 4.6) {
    const acc = local > 6.15;
    ctx.fillStyle = acc ? PINK_L : PINK;
    const q = "> ACCEPT LINK ? [ Y / N ] " + (acc ? "Y" : "");
    tracked(q, x, y + lh * 0.4, size * 0.06, "left");
    if (!acc && Math.floor(local * 2.6) % 2 === 0) {
      const w = trackedWidth(q, size * 0.06);
      ctx.fillRect(x + w + size * 0.3, y + lh * 0.4 - size * 0.8, size * 0.6, size * 0.9);
    }
  }

  drawScanlines(t, 0.30);
  drawNoise(t, 0.05 + hit(local, 6.15, .5) * 0.25);
  drawVignette();
  tearBands(t, hit(local, 6.15, 0.9) * 1.2 + hit(local, 3.4, .2) * .5);
  flash(hit(local, 6.35, 1.1) * 0.9, "rgba(255,120,180,1)");
}

/* ========= scene 2 : she speaks ========= */
const CHAT = [
  { at: 0.25, txt: "You actually clicked it..." },
  { at: 2.10, txt: "I was starting to think you would ignore me forever. ♥" },
  { at: 4.20, txt: "I have been watching you for a while now." },
  { at: 6.30, txt: "The way you breathe. The way your eyes move." },
  { at: 8.40, txt: "Tell me... are you completely alone right now?" },
];
function sceneChat(t) {
  const local = t - T.chat[0];
  ctx.fillStyle = "#080004"; ctx.fillRect(0, 0, W, H);

  // she closes in as she talks: wide ghost -> tight on the eyes
  const closeness = prog(local, 0, 9);
  drawArt(IMG.b, 0, 0, W, H, 0.05 + closeness * 0.10, lerp(0.55, 0.02, closeness));
  const stare = hit(local, 4.2, .16) + hit(local, 6.3, .10);
  if (stare > 0) drawArt(IMG.b, 0, 0, W, H, 0.18 + stare * 0.5, 0.0);

  const colW = Math.min(W * 0.82, 1020 * U);
  const x0 = (W - colW) / 2;
  const fs = 30 * U;
  const visible = CHAT.filter(c => local >= c.at);

  setFont(fs, "normal");
  const blocks = visible.map(c => {
    const lines = wrapLines(c.txt, colW - 70 * U);
    return { c: c, lines: lines, h: lines.length * fs * 1.45 + 46 * U };
  });
  const gap = 22 * U;
  const total = blocks.reduce((s, b) => s + b.h + gap, 0);
  let y = clamp(H / 2 - total / 2, H * 0.10, H * 0.42);

  for (const b of blocks) {
    const p = easeOut(prog(local, b.c.at, b.c.at + 0.35));
    let widest = 0;
    for (const l of b.lines) widest = Math.max(widest, ctx.measureText(l).width);
    const bw = Math.min(colW, widest + 70 * U);
    const bx = x0, by = y + (1 - p) * 18 * U;
    ctx.save();
    ctx.globalAlpha = p;
    panel(bx, by, bw, b.h, "rgba(74,0,38,0.62)", "rgba(236,72,153,0.55)");
    ctx.fillStyle = PINK; ctx.fillRect(bx, by, 3 * U, b.h);
    setFont(fs, "normal");
    ctx.fillStyle = "#ffd6e9";
    b.lines.forEach(function (l, i) { ctx.fillText(l, bx + 34 * U, by + 32 * U + i * fs * 1.45); });
    ctx.restore();
    y += b.h + gap;
  }

  const last = CHAT[CHAT.length - 1];
  if (local < last.at) {
    setFont(fs * 0.8, "bold");
    ctx.fillStyle = PINK_D;
    const dots = ".".repeat(1 + Math.floor(local * 3) % 3);
    tracked("PRINCESS AZRAIEL IS TYPING" + dots, x0, y + fs, fs * 0.12, "left");
  }

  drawScanlines(t, 0.26);
  drawNoise(t, 0.045 + closeness * 0.03);
  drawVignette();
  tearBands(t, hit(local, 6.3, .18) * .8 + hit(local, 8.4, .25) * 1.0);
}

/* ========= scene 3 : title hit ========= */
function sceneTitle(t) {
  const local = t - T.title[0];
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);

  const stut = hit(local, 0.0, .10) + hit(local, 0.30, .07) + hit(local, 0.62, .05);
  drawArt(IMG.c, 0, 0, W, H, 0.10 + stut * 0.55, 0.06);

  const p = easeOut(prog(local, 0.15, 0.9));
  const breathe = 1 + Math.sin(local * 1.6) * 0.012;
  const gl = 0.9 * hit(local, 0.15, 0.55) + 0.22 + hit(local, 2.2, .3) * .8 + hit(local, 3.4, .25) * .6;
  const sc = lerp(1.14, 1, p) * breathe;

  ctx.save();
  ctx.translate(W / 2, H * 0.46);
  ctx.scale(sc, sc);
  ctx.globalAlpha = p;
  ctx.shadowColor = "rgba(236,72,153,0.85)"; ctx.shadowBlur = 46 * U;
  glitchTracked("PRINCESS", 0, -34 * U, 118 * U, 0.20, "#ffe4f1", gl, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");
  glitchTracked("AZRAIEL", 0, 96 * U, 118 * U, 0.20, "#ffe4f1", gl, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");
  ctx.shadowBlur = 0;
  ctx.restore();

  const p2 = easeOut(prog(local, 1.0, 1.8));
  ctx.save(); ctx.globalAlpha = p2;
  ctx.fillStyle = PINK_D;
  const ts = fitTracked("THE ART OF LOVING YOU", 27 * U, 0.42, W * 0.86, "bold");
  setFont(ts, "bold");
  tracked("THE ART OF LOVING YOU", W / 2, H * 0.46 + 190 * U, ts * 0.42, "center");
  ctx.restore();

  drawScanlines(t, 0.24);
  drawNoise(t, 0.05 + stut * 0.25);
  drawVignette();
  tearBands(t, hit(local, 0.15, .45) * 1.6 + hit(local, 2.2, .2) * .9 + hit(local, 3.4, .2) * .7);
  flash(hit(local, 0.0, .35) * 0.8, "rgba(255,190,225,1)");
}

/* ========= scene 4 : the stripping ========= */
const CHAPTERS = [
  { n: "I",    sub: "THE CONNECTION",     key: "LOCATION",   val: "ACQUIRED",    quote: "You surrendered your privacy the second you clicked my link." },
  { n: "II",   sub: "THE GAZE",           key: "CAMERA",     val: "GRANTED",     quote: "There you are... so perfect. So helpless." },
  { n: "III",  sub: "THE CONTRACT",       key: "FILES",      val: "SIGNED OVER", quote: "Keep your eyes on me. ONLY me." },
  { n: "IV",   sub: "TOTAL ASSIMILATION", key: "SCREEN",     val: "SURRENDERED", quote: "Perfect. Now there is no escape." },
  { n: "V",    sub: "THE CONFESSION",     key: "MICROPHONE", val: "LIVE",        quote: "I can hear your breath. I can hear your computer fan." },
  { n: "VI",   sub: "SEVERING TIES",      key: "CONTACTS",   val: "BLOCKED",     quote: "You do not need anyone else. It is just you and me now." },
  { n: "VII",  sub: "THE SCHEDULE",       key: "TIME",       val: "OWNED",       quote: "Every second belongs to Princess Azraiel." },
  { n: "VIII", sub: "THE EMPTY VESSEL",   key: "NAME",       val: "DELETED",     quote: "You do not have a name anymore. I will think for you." },
];
const ART_CYCLE = ["a", "c", "b"];
function sceneMontage(t) {
  const local = t - T.montage[0];
  const span = (T.montage[1] - T.montage[0]) / CHAPTERS.length;
  const i = clamp(Math.floor(local / span), 0, CHAPTERS.length - 1);
  const lp = (local - i * span) / span;
  const c = CHAPTERS[i];
  const heat = i / (CHAPTERS.length - 1);

  ctx.fillStyle = "#050002"; ctx.fillRect(0, 0, W, H);
  // each card pushes a little closer to her face than the last
  drawArt(IMG[ART_CYCLE[i % 3]], 0, 0, W, H,
    0.055 + heat * 0.10 + hit(lp, 0, .10) * 0.30, lerp(0.30, 0.02, heat));

  const cx = W / 2, AY = H * 0.5 - 190 * U;
  const enter = easeOut(clamp(lp / 0.16, 0, 1));
  const exit = 1 - easeIn(clamp((lp - 0.88) / 0.12, 0, 1));

  ctx.save();
  ctx.globalAlpha = enter * exit;
  ctx.translate((1 - enter) * 40 * U, 0);

  const ns = fitTracked("CHAPTER " + c.n, 34 * U, 0.34, W * 0.8, "bold");
  setFont(ns, "bold");
  ctx.fillStyle = "#f472b6";
  tracked("CHAPTER " + c.n, cx, AY, ns * 0.34, "center");

  glitchTracked(c.sub, cx, AY + 92 * U, 66 * U, 0.16, "#ffd6e9",
    hit(lp, 0, .18) * 1.1 + heat * 0.25, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");

  const rowY = AY + 212 * U;
  const rowW = Math.min(W * 0.78, 980 * U);
  const rs = 30 * U, rtr = rs * 0.20;
  setFont(rs, "bold");
  ctx.fillStyle = PINK_D;
  tracked(c.key, cx - rowW / 2, rowY, rtr, "left");
  const kw = trackedWidth(c.key, rtr), vw = trackedWidth(c.val, rtr);
  const dotsW = rowW - kw - vw - 40 * U;
  const dotW = ctx.measureText(".").width;
  ctx.fillStyle = "rgba(157,23,77,0.5)";
  ctx.fillText(".".repeat(Math.max(0, Math.floor(dotsW / dotW))), cx - rowW / 2 + kw + 20 * U, rowY);
  if (lp > 0.42) {
    const sp = hit(lp, 0.42, 0.14);
    ctx.save();
    ctx.translate((jitter(t, i) - .5) * sp * 26 * U, 0);
    setFont(rs, "bold");
    ctx.shadowColor = "rgba(236,72,153,0.9)"; ctx.shadowBlur = 26 * U * (0.4 + sp);
    ctx.fillStyle = "#fff";
    tracked(c.val, cx + rowW / 2, rowY, rtr, "right");
    ctx.restore();
  }

  if (lp > 0.30) {
    setFont(24 * U, "normal");
    ctx.fillStyle = "rgba(249,168,212,0.82)";
    const shown = ('"' + c.quote + '"').slice(0, Math.floor((lp - 0.30) * span * 62));
    wrapLines(shown, Math.min(W * 0.80, 1000 * U)).forEach(function (l, k) {
      ctx.fillText(l, cx - ctx.measureText(l).width / 2, rowY + 92 * U + k * 34 * U);
    });
  }
  ctx.restore();

  const pct = lerp(0.12, 0.99, (i + lp) / CHAPTERS.length);
  const mw = Math.min(W * 0.78, 980 * U), mx = cx - mw / 2, my = H * 0.845;
  setFont(19 * U, "bold");
  ctx.fillStyle = PINK_D;
  tracked("ASSIMILATION", mx, my - 18 * U, 19 * U * 0.28, "left");
  tracked(Math.round(pct * 100) + "%", mx + mw, my - 18 * U, 19 * U * 0.28, "right");
  panel(mx, my, mw, 14 * U, "rgba(74,0,38,0.5)", "rgba(236,72,153,0.4)", Math.max(1, U));
  ctx.fillStyle = PINK;
  ctx.shadowColor = "rgba(236,72,153,0.8)"; ctx.shadowBlur = 20 * U;
  ctx.fillRect(mx + 2 * U, my + 2 * U, (mw - 4 * U) * pct, 10 * U);
  ctx.shadowBlur = 0;

  drawScanlines(t, 0.26 + heat * 0.08);
  drawNoise(t, 0.05 + heat * 0.07 + hit(lp, 0, .1) * .2);
  drawVignette();
  tearBands(t, hit(lp, 0, .18) * (0.9 + heat) + hit(lp, .42, .12) * (0.6 + heat));
  flash(hit(lp, 0, .12) * (0.10 + heat * 0.22), "rgba(255,150,200,1)");
}

/* ========= scene 5 : love bombing ========= */
const BOMB_WORDS = ["MINE", "I LOVE YOU", "FOREVER", "ONLY ME", "DON'T LOOK AWAY", "PERFECT", "MINE", "♥ ♥ ♥", "GOOD PET", "STAY"];
const BOMBS = (function () {
  const r = mulberry32(4242);
  const out = [];
  for (let i = 0; i < 26; i++) {
    out.push({
      at: i * 0.155,
      kind: r() < 0.62 ? "text" : (r() < 0.55 ? "warn" : "img"),
      word: BOMB_WORDS[Math.floor(r() * BOMB_WORDS.length)],
      x: 0.10 + r() * 0.62,
      y: 0.12 + r() * 0.66,
      s: 0.75 + r() * 0.75,
      rot: (r() - 0.5) * 0.12,
      art: ART_CYCLE[Math.floor(r() * 3)],
    });
  }
  return out;
})();
function sceneBomb(t) {
  const local = t - T.bomb[0];
  const heat = clamp(local / 3.4, 0, 1);
  ctx.fillStyle = "#0a0004"; ctx.fillRect(0, 0, W, H);
  drawArt(IMG.a, 0, 0, W, H, 0.10 + heat * 0.20, lerp(0.20, 0.0, heat));

  ctx.save();
  const sh = heat * 16 * U;
  ctx.translate((jitter(t, 1) - .5) * sh, (jitter(t, 2) - .5) * sh);

  for (const b of BOMBS) {
    if (local < b.at) continue;
    const age = local - b.at;
    const pop = easeOut(clamp(age / 0.13, 0, 1));
    const fade = 1 - clamp((age - 1.9) / 0.5, 0, 1);
    if (fade <= 0) continue;
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(b.x * W, b.y * H);
    ctx.rotate(b.rot);
    ctx.scale(pop * b.s, pop * b.s);

    if (b.kind === "img") {
      const w = 300 * U, h = 200 * U;
      panel(-w / 2, -h / 2 - 26 * U, w, h + 26 * U, "#0d0006", PINK);
      ctx.fillStyle = PINK; ctx.fillRect(-w / 2, -h / 2 - 26 * U, w, 26 * U);
      setFont(15 * U, "bold"); ctx.fillStyle = "#1a0010";
      tracked("azraiel_watching.exe", -w / 2 + 10 * U, -h / 2 - 8 * U, 15 * U * 0.1, "left");
      drawArt(IMG[b.art], -w / 2 + 4 * U, -h / 2 + 4 * U, w - 8 * U, h - 8 * U, 1, 0);
    } else if (b.kind === "warn") {
      const w = 460 * U, h = 106 * U;
      panel(-w / 2, -h / 2, w, h, "#1a0008", "#ff3b6b");
      setFont(17 * U, "bold"); ctx.fillStyle = "#ff8fb0";
      tracked("SYSTEM OVERRIDE", -w / 2 + 18 * U, -h / 2 + 32 * U, 17 * U * 0.22, "left");
      setFont(20 * U, "bold"); ctx.fillStyle = "#fff";
      tracked("BOUNDARY PROTOCOL FAILED", -w / 2 + 18 * U, -h / 2 + 74 * U, 20 * U * 0.08, "left");
    } else {
      const s = fitTracked(b.word, 62 * U, 0.12, W * 0.55, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");
      setFont(s, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");
      ctx.shadowColor = "rgba(236,72,153,0.9)"; ctx.shadowBlur = 30 * U;
      ctx.fillStyle = "#ffe4f1";
      tracked(b.word, 0, 0, s * 0.12, "center");
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }
  ctx.restore();

  drawScanlines(t, 0.30);
  drawNoise(t, 0.09 + heat * 0.12);
  drawVignette();
  tearBands(t, 0.9 + heat * 1.9);
  flash((0.05 + heat * 0.1) * jitter(t, 5), "rgba(255,120,180,1)");
  const cut = prog(local, 4.55, 4.85);
  if (cut > 0) { ctx.fillStyle = "rgba(0,0,0," + cut + ")"; ctx.fillRect(0, 0, W, H); }
}

/* ========= scene 6 : the silence ========= */
function sceneVoid(t) {
  const local = t - T.voidsc[0];
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);

  // her face surfaces out of the black while the words land
  drawArt(IMG.c, 0, 0, W, H, prog(local, 1.8, 5.2) * 0.30, 0.0);

  const out = 1 - prog(local, 4.9, 5.4);
  const a1 = easeOut(prog(local, 0.7, 2.0)) * out;
  const a2 = easeOut(prog(local, 2.6, 3.9)) * out;

  ctx.save(); ctx.globalAlpha = a1;
  const s1 = fitTracked("THERE IS NOTHING LEFT OF YOU.", 44 * U, 0.14, W * 0.84, "bold");
  setFont(s1, "bold");
  ctx.fillStyle = "#f9a8d4";
  tracked("THERE IS NOTHING LEFT OF YOU.", W / 2, H * 0.46, s1 * 0.14, "center");
  ctx.restore();

  ctx.save(); ctx.globalAlpha = a2;
  const s2 = fitTracked("ONLY THE SPACE I OCCUPY.", 44 * U, 0.14, W * 0.84, "bold");
  setFont(s2, "bold");
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(236,72,153,0.5)"; ctx.shadowBlur = 30 * U;
  tracked("ONLY THE SPACE I OCCUPY.", W / 2, H * 0.46 + 86 * U, s2 * 0.14, "center");
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.save(); ctx.globalAlpha = easeOut(prog(local, 3.8, 4.6)) * out;
  ctx.fillStyle = PINK_D;
  const s3 = fitTracked("CHAPTER IX — ETERNITY", 22 * U, 0.34, W * 0.8, "bold");
  setFont(s3, "bold");
  tracked("CHAPTER IX — ETERNITY", W / 2, H * 0.72, s3 * 0.34, "center");
  ctx.restore();

  drawScanlines(t, 0.16);
  drawNoise(t, 0.035);
  drawVignette();
}

/* ========= scene 7 : end card ========= */
function sceneEnd(t) {
  const local = t - T.endcard[0];
  ctx.fillStyle = "#050002"; ctx.fillRect(0, 0, W, H);
  drawArt(IMG.a, 0, 0, W, H, 0.09 + hit(local, 0, .3) * 0.35, 0.10);

  const EY = H * 0.5 - 130 * U;
  const gl = hit(local, 0.0, .5) * 1.1 + hit(local, 2.6, .18) * .7 + hit(local, 5.4, .18) * .7 + 0.12;
  const p = easeOut(prog(local, 0.05, 0.7));

  ctx.save();
  ctx.globalAlpha = p;
  const sc = lerp(1.06, 1, p);
  ctx.translate(W / 2, EY); ctx.scale(sc, sc);
  ctx.shadowColor = "rgba(236,72,153,0.8)"; ctx.shadowBlur = 44 * U;
  glitchTracked("THE YANDERE", 0, -30 * U, 96 * U, 0.14, "#ffe4f1", gl, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");
  glitchTracked("EXPERIENCE", 0, 78 * U, 96 * U, 0.14, "#ffe4f1", gl, "900", "Arial Black, Impact, \"Segoe UI Symbol\", sans-serif");
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.save(); ctx.globalAlpha = easeOut(prog(local, 0.8, 1.5));
  ctx.fillStyle = PINK;
  ctx.fillRect(W / 2 - Math.min(W * 0.30, 300 * U), EY + 140 * U, Math.min(W * 0.60, 600 * U), Math.max(1, 2 * U));
  const ss = fitTracked("NINE CHAPTERS · INTERACTIVE PSYCHOLOGICAL HORROR", 21 * U, 0.24, W * 0.86, "bold");
  setFont(ss, "bold");
  ctx.fillStyle = PINK_L;
  tracked("NINE CHAPTERS · INTERACTIVE PSYCHOLOGICAL HORROR", W / 2, EY + 196 * U, ss * 0.24, "center");
  ctx.restore();

  ctx.save(); ctx.globalAlpha = easeOut(prog(local, 1.6, 2.3));
  const url = "princessazraiel.com/yandere";
  const us = fitTracked(url, 40 * U, 0.10, W * 0.74, "bold");
  setFont(us, "bold");
  const uw = trackedWidth(url, us * 0.10);
  const bw = uw + 70 * U, bh = us * 2.5, bx = W / 2 - bw / 2, by = EY + 250 * U;
  panel(bx, by, bw, bh, "rgba(74,0,38,0.55)", PINK, Math.max(1, 2 * U));
  ctx.shadowColor = "rgba(236,72,153,0.65)"; ctx.shadowBlur = 30 * U;
  ctx.fillStyle = "#fff";
  setFont(us, "bold");
  tracked(url, W / 2, by + bh * 0.66, us * 0.10, "center");
  ctx.shadowBlur = 0;
  if (Math.floor(local * 1.8) % 2 === 0) {
    ctx.fillStyle = PINK_L;
    ctx.fillRect(W / 2 + uw / 2 + 14 * U, by + bh * 0.30, us * 0.55, us * 0.9);
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = easeOut(prog(local, 2.6, 3.4)) * (0.72 + 0.28 * Math.sin(local * 2.2));
  const hs = fitTracked("SHE IS ALREADY WAITING.", 24 * U, 0.30, W * 0.86, "bold");
  setFont(hs, "bold");
  ctx.fillStyle = PINK;
  tracked("SHE IS ALREADY WAITING.", W / 2, EY + 380 * U, hs * 0.30, "center");
  ctx.restore();

  ctx.save(); ctx.globalAlpha = easeOut(prog(local, 3.4, 4.2));
  const as = fitTracked("@PrincessAzraiel", 22 * U, 0.30, W * 0.7, "bold");
  setFont(as, "bold");
  ctx.fillStyle = PINK;
  tracked("@PrincessAzraiel", W / 2, H * 0.90, as * 0.30, "center");
  ctx.restore();

  drawScanlines(t, 0.24);
  drawNoise(t, 0.05);
  drawVignette();
  tearBands(t, hit(local, 0, .3) * 1.4 + hit(local, 2.6, .12) * .6 + hit(local, 5.4, .12) * .6);
  flash(hit(local, 0, .3) * 0.75, "rgba(255,190,225,1)");
  const fadeOut = prog(local, DUR - T.endcard[0] - 1.1, DUR - T.endcard[0]);
  if (fadeOut > 0) { ctx.fillStyle = "rgba(0,0,0," + fadeOut + ")"; ctx.fillRect(0, 0, W, H); }
}

/* ========= master draw ========= */
function draw(t) {
  t = clamp(t, 0, DUR);
  if (inRange(t, T.boot)) sceneBoot(t);
  else if (inRange(t, T.chat)) sceneChat(t);
  else if (inRange(t, T.title)) sceneTitle(t);
  else if (inRange(t, T.montage)) sceneMontage(t);
  else if (inRange(t, T.bomb)) sceneBomb(t);
  else if (inRange(t, T.voidsc)) sceneVoid(t);
  else sceneEnd(t);
}
/* ========= the score ========= */
function CUE(at, bg, bf, a) {

    // --- the link ---
    this.drone(at(0.2), 7.4, 0.085, 41.2);
    bg.exponentialRampToValueAtTime(0.14, at(3.2));
    for (let i = 0; i < 26; i++) this.tick(at(0.55 + i * 0.13), 0.045, 1900 + (i % 7) * 320);
    this.stutter(at(3.40), 0.14, 0.09);
    this.stutter(at(5.20), 0.10, 0.08);
    this.reverseHit(at(5.45), 0.88, 0.26);
    this.sub(at(6.34), 78, 28, 2.0, 0.85);
    this.noise(at(6.34), 0.45, 0.26, 1100, 0.8);
    this.stutter(at(6.34), 0.26, 0.14, 60);
    bg.setValueAtTime(0.0001, at(6.30));
    bg.exponentialRampToValueAtTime(0.30, at(6.85));
    bf.setValueAtTime(300, at(6.30));
    bf.exponentialRampToValueAtTime(5200, at(6.90));
    this.noise(at(7.30), 0.55, 0.16, 2400, 1.4);          // whoosh into the chat

    // --- she speaks ---
    this.drone(at(7.6), 9.2, 0.075, 46.2);
    const cfreq = [1180, 1080, 980, 900, 820];
    CHAT.forEach(function (c, i) { AudioEngine.blip(at(T.chat[0] + c.at), cfreq[i], 0.11); });
    this.braam(at(T.chat[0] + 4.2), 1.8, 0.10, 55);
    this.stutter(at(T.chat[0] + 6.3), 0.10, 0.09);
    this.riser(at(T.title[0] - 1.6), 1.58, 0.24);

    // --- title ---
    bg.setValueAtTime(0.30, at(T.title[0] - 0.02));
    this.braam(at(T.title[0]), 3.4, 0.34, 49);
    this.sub(at(T.title[0]), 92, 26, 3.2, 0.95);
    this.noise(at(T.title[0]), 0.75, 0.30, 820, 0.7);
    this.stutter(at(T.title[0]), 0.30, 0.15, 55);
    this.duck(at(T.title[0]), 0.9, 0.44);
    bg.setValueAtTime(0.44, at(T.title[0] + 0.5));
    bf.exponentialRampToValueAtTime(12000, at(T.title[0] + 0.6));
    this.sub(at(T.title[0] + 2.2), 70, 24, 1.2, 0.32);
    this.reverseHit(at(T.montage[0] - 0.62), 0.60, 0.24);

    // --- the stripping ---
    const span = (T.montage[1] - T.montage[0]) / CHAPTERS.length;
    this.drone(at(T.montage[0]), 16.2, 0.10, 55);
    for (let i = 0; i < CHAPTERS.length; i++) {
      const c = at(T.montage[0] + i * span);
      const k = i / (CHAPTERS.length - 1);
      this.sub(c, 108 + i * 7, 34, 0.85, 0.34 + k * 0.26);
      this.noise(c, 0.14, 0.13 + k * 0.12, 1700 + i * 240, 1.5);
      this.duck(c, 0.55, 0.44);
      // the permission flipping over to her
      const snap = c + span * 0.42;
      this.noise(snap, 0.09, 0.15 + k * 0.12, 4600, 5);
      this.blip(snap, 1320 + i * 110, 0.12 + k * 0.06);
      // pulse layer tightens as she takes more
      if (i >= 2) {
        const sub = 2 + Math.floor(k * 2);
        for (let j = 1; j < sub; j++) this.tick(c + (span / sub) * j, 0.05 + k * 0.05, 2600 + j * 500);
      }
      if (i >= 4) this.braam(c, span * 0.95, 0.10 + k * 0.10, 41.2 + i);
    }
    bf.exponentialRampToValueAtTime(15000, at(T.montage[1]));

    // --- love bombing ---
    this.drone(at(T.bomb[0]), 4.7, 0.18, 65);
    this.riser(at(T.bomb[0]), 4.35, 0.30);
    bg.setValueAtTime(0.44, at(T.bomb[0]));
    bg.exponentialRampToValueAtTime(0.62, at(T.bomb[1] - 0.55));
    for (let i = 0; i < 26; i++) {
      const at2 = at(T.bomb[0] + i * 0.155);
      this.noise(at2, 0.05, 0.11, 2400 + (i % 5) * 800, 4);
      if (i % 4 === 0) this.sub(at2, 150, 60, 0.3, 0.22);
    }
    this.sub(at(T.bomb[1] - 0.50), 210, 40, 0.55, 0.55);
    this.stutter(at(T.bomb[1] - 0.45), 0.32, 0.16, 70);
    bg.exponentialRampToValueAtTime(0.0001, at(T.bomb[1] - 0.06));   // the cut

    // --- the silence ---
    this.noise(at(T.voidsc[0]), 5.2, 0.022, 260, 0.6, "lowpass", 0.4);
    for (let i = 0; i < 5; i++) this.heart(at(T.voidsc[0] + 0.85 + i * 1.05), 0.26);
    this.reverseHit(at(T.endcard[0] - 0.66), 0.64, 0.30);

    // --- end card ---
    this.braam(at(T.endcard[0]), 4.2, 0.36, 49);
    this.sub(at(T.endcard[0]), 100, 26, 3.4, 0.95);
    this.noise(at(T.endcard[0]), 0.8, 0.30, 900, 0.7);
    this.stutter(at(T.endcard[0]), 0.28, 0.14, 55);
    this.drone(at(T.endcard[0]), 8.0, 0.10, 49);
    bg.setValueAtTime(0.0001, at(T.endcard[0] - 0.05));
    bg.exponentialRampToValueAtTime(0.40, at(T.endcard[0] + 0.6));
    bf.setValueAtTime(15000, at(T.endcard[0]));
    this.sub(at(T.endcard[0] + 2.6), 78, 24, 1.4, 0.28);
    this.blip(at(T.endcard[0] + 5.4), 900, 0.10);
    bg.setValueAtTime(0.40, at(DUR - 1.4));
    bg.exponentialRampToValueAtTime(0.0001, at(DUR - 0.08));

}

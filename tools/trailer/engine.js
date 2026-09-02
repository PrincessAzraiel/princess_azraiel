/* Shared trailer engine — canvas helpers, overlays, synth voices and the
   record harness. Included verbatim in every built trailer by build.mjs.

   A trailer module (loaded BEFORE this file) must define:
     T, DUR, FPS        timeline map, total seconds, capture rate
     ART                [{ key, src, box:[x,y,w,h] }]  (box normalised to source)
     ASSET_AUDIO        data URI for the ambient bed, or "" for a synth-only score
     POSTER_T           the timestamp drawn while idle
     OUTPUT_BASENAME    file name stem for the rendered video
     draw(t)            paints one frame
     CUE(at, bg, bf, a) schedules the score; called with `this` = AudioEngine  */

const PINK   = "#ec4899";
const PINK_L = "#f9a8d4";
const PINK_D = "#9d174d";

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d", { alpha: false });
let W = 1920, H = 1080, U = 1;

function setSize(aspect) {
  if (aspect === "16:9") { W = 1920; H = 1080; }
  else if (aspect === "9:16") { W = 1080; H = 1920; }
  else { W = 1080; H = 1080; }
  canvas.width = W; canvas.height = H;
  U = Math.sqrt(W * H) / 1440;
  ctx.textBaseline = "alphabetic";
}
/* ========= tiny deterministic rng ========= */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function jitter(t, seed) { return mulberry32(Math.floor(t * 60) * 7919 + seed * 104729)(); }

/* ========= math helpers ========= */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const prog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const inRange = (t, r) => t >= r[0] && t < r[1];
const easeOut = p => 1 - Math.pow(1 - p, 3);
const easeIn = p => p * p * p;
const hit = (t, at, len) => t >= at && t < at + len ? 1 - (t - at) / len : 0;

/* ========= text helpers ========= */
function setFont(size, weight, family) {
  ctx.font = (weight || "normal") + " " + Math.round(size) + "px " + (family || "\"Courier New\", \"Segoe UI Symbol\", monospace");
}
function trackedWidth(text, tracking) {
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + tracking;
  return w - (text.length ? tracking : 0);
}
function tracked(text, x, y, tracking, align) {
  const w = trackedWidth(text, tracking);
  let cx = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + tracking;
  }
  return w;
}
function fitTracked(text, size, tracking, maxW, weight, family) {
  let s = size;
  for (let i = 0; i < 40; i++) {
    setFont(s, weight, family);
    if (trackedWidth(text, tracking * s) <= maxW) break;
    s *= 0.94;
  }
  return s;
}
function glitchTracked(text, x, y, size, trackEm, color, amount, weight, family) {
  const s = fitTracked(text, size, trackEm, W * 0.88, weight, family);
  const tr = trackEm * s;
  if (amount > 0.02) {
    const d = amount * 9 * U;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "rgba(0,220,255,0.55)"; tracked(text, x - d, y + amount * 2 * U, tr, "center");
    ctx.fillStyle = "rgba(255,0,80,0.55)";  tracked(text, x + d, y - amount * 2 * U, tr, "center");
    ctx.restore();
  }
  ctx.fillStyle = color;
  tracked(text, x, y, tr, "center");
  return s;
}
function wrapLines(text, maxW) {
  const words = text.split(" ");
  const out = []; let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) { out.push(line); line = w; }
    else line = test;
  }
  if (line) out.push(line);
  return out;
}
function typed(lines, elapsed, cps) {
  let budget = Math.max(0, elapsed) * cps;
  const out = [];
  for (const l of lines) {
    if (budget <= 0) { out.push(""); continue; }
    out.push(l.slice(0, Math.floor(budget)));
    budget -= l.length + 6;
  }
  return out;
}

const IMG = {};   // filled by loadArt(), keyed by ART[].key
function loadArt() {
  return Promise.all(ART.map(function (a) {
    return new Promise(function (res) {
      const im = new Image();
      im.onload = function () { res({ img: im, box: a.box, key: a.key }); };
      im.onerror = function () { res({ img: null, box: a.box, key: a.key }); };
      im.src = a.src;
    });
  })).then(function (r) { r.forEach(function (e) { IMG[e.key] = e; }); });
}
// cover-fit the (optionally widened) crop box into the destination rect
function drawArt(e, x, y, w, h, alpha, expand) {
  if (!e || !e.img || !e.img.complete || !e.img.naturalWidth) return;
  const a = clamp(alpha === undefined ? 1 : alpha, 0, 1);
  if (a <= 0.002) return;
  const iw = e.img.naturalWidth, ih = e.img.naturalHeight;
  const ex = expand === undefined ? 0 : clamp(expand, 0, 1);
  const bw = lerp(e.box[2], 1, ex), bh = lerp(e.box[3], 1, ex);
  const cx = (e.box[0] + e.box[2] / 2) * iw, cy = (e.box[1] + e.box[3] / 2) * ih;
  let sw = bw * iw, sh = bh * ih;
  const destAR = w / h;
  if (sw / sh < destAR) { sw = Math.min(iw, sh * destAR); sh = sw / destAR; }
  else { sh = Math.min(ih, sw / destAR); sw = sh * destAR; }
  const sx = clamp(cx - sw / 2, 0, Math.max(0, iw - sw));
  const sy = clamp(cy - sh * 0.42, 0, Math.max(0, ih - sh));
  ctx.save();
  ctx.globalAlpha = a;
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.drawImage(e.img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

/* ========= overlays ========= */
const noiseTiles = [];
function buildNoise() {
  noiseTiles.length = 0;
  for (let n = 0; n < 8; n++) {
    const c = document.createElement("canvas");
    c.width = c.height = 160;
    const x = c.getContext("2d");
    const img = x.createImageData(160, 160);
    const r = mulberry32(n * 1013 + 7);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = r() * 255;
      img.data[i] = v; img.data[i + 1] = v * 0.75; img.data[i + 2] = v * 0.85; img.data[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    noiseTiles.push(c);
  }
}
function drawNoise(t, alpha) {
  if (alpha <= 0) return;
  const tile = noiseTiles[Math.floor(t * 24) % noiseTiles.length];
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = "overlay";
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tile, -20, -20, W + 40, H + 40);
  ctx.restore();
}
function drawScanlines(t, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#000";
  const step = Math.max(3, Math.round(4 * U));
  const off = (t * 40) % step;
  for (let y = -step + off; y < H; y += step) ctx.fillRect(0, y, W, Math.max(1, step * 0.45));
  ctx.restore();
  const bandY = ((t * 0.35) % 1.6 - 0.3) * H;
  const g = ctx.createLinearGradient(0, bandY, 0, bandY + H * 0.16);
  g.addColorStop(0, "rgba(236,72,153,0)");
  g.addColorStop(0.5, "rgba(236,72,153,0.055)");
  g.addColorStop(1, "rgba(236,72,153,0)");
  ctx.fillStyle = g; ctx.fillRect(0, bandY, W, H * 0.16);
}
function drawVignette() {
  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.18, W / 2, H / 2, Math.max(W, H) * 0.72);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(0.62, "rgba(0,0,0,0.55)");
  g.addColorStop(1, "rgba(0,0,0,0.97)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function tearBands(t, amount) {
  if (amount <= 0.01) return;
  const r = mulberry32(Math.floor(t * 30) * 6151);
  const n = Math.round(amount * 7);
  for (let i = 0; i < n; i++) {
    const y = r() * H, h = (0.008 + r() * 0.05) * H, dx = (r() - 0.5) * amount * 90 * U;
    ctx.drawImage(canvas, 0, y, W, h, dx, y, W, h);
    if (r() > 0.72) {
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "rgba(255,0,90,0.10)"; ctx.fillRect(dx, y, W, h); ctx.restore();
    }
  }
}
function flash(alpha, color) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = color || "rgba(255,180,215,1)";
  ctx.globalAlpha = clamp(alpha, 0, 1);
  ctx.fillRect(0, 0, W, H); ctx.restore();
}
function panel(x, y, w, h, fill, stroke, lw) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = stroke; ctx.lineWidth = lw || Math.max(1, 1.5 * U);
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

/* ========= sound design =========
   Everything below is synthesised live except the ambient bed, which is
   optional: a trailer with ASSET_AUDIO = "" gets a purely synthetic score and
   the bed automation in its CUE simply has nothing to move.
   Signal path:  sources -> master -> limiter -> speakers + recording tap
                 sources -> reverb send -> master                            */
const AudioEngine = {
  actx: null, el: null, bed: null, bedFilter: null, master: null, limiter: null,
  verb: null, verbGain: null, dest: null, noiseBuf: null, t0: 0, voices: [],

  init: function () {
    if (this.actx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    this.actx = a;

    this.limiter = a.createDynamicsCompressor();
    this.limiter.threshold.value = -8;
    this.limiter.knee.value = 6;
    this.limiter.ratio.value = 12;
    this.limiter.attack.value = 0.003;
    this.limiter.release.value = 0.25;

    this.master = a.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.limiter);
    this.limiter.connect(a.destination);
    this.dest = a.createMediaStreamDestination();
    this.limiter.connect(this.dest);

    // noise
    const len = a.sampleRate * 3;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = buf;

    // a dark, long reverb built from decaying filtered noise
    const rl = Math.floor(a.sampleRate * 2.8);
    const ir = a.createBuffer(2, rl, a.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const o = ir.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < rl; i++) {
        const n = Math.random() * 2 - 1;
        lp = lp * 0.72 + n * 0.28;                       // roll the top off
        o[i] = lp * Math.pow(1 - i / rl, 3.2);
      }
    }
    this.verb = a.createConvolver();
    this.verb.buffer = ir;
    this.verbGain = a.createGain();
    this.verbGain.gain.value = 0.55;
    this.verb.connect(this.verbGain);
    this.verbGain.connect(this.master);

    // ambient bed, filtered so it can open up on the drops. The gain/filter
    // always exist so a score can automate them whether or not there is audio.
    this.bedFilter = a.createBiquadFilter();
    this.bedFilter.type = "lowpass";
    this.bedFilter.frequency.value = 320;
    this.bedFilter.Q.value = 0.5;
    this.bed = a.createGain();
    this.bed.gain.value = 0.0001;
    this.bedFilter.connect(this.bed); this.bed.connect(this.master);
    if (ASSET_AUDIO) {
      this.el = new Audio(ASSET_AUDIO);
      this.el.loop = true;
      a.createMediaElementSource(this.el).connect(this.bedFilter);
    }
  },

  // route a node to dry master + reverb send
  out: function (node, wet) {
    node.connect(this.master);
    if (wet > 0) {
      const s = this.actx.createGain();
      s.gain.value = wet;
      node.connect(s); s.connect(this.verb);
    }
  },
  track: function (n) { this.voices.push(n); },

  /* --- elements --- */
  // deep impact: pitch-dropping sine with a click transient
  sub: function (when, f0, f1, dur, gain, wet) {
    const a = this.actx, o = a.createOscillator(), g = a.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(f0, when);
    o.frequency.exponentialRampToValueAtTime(Math.max(18, f1), when + dur * 0.85);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain, when + 0.010);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(g); this.out(g, wet === undefined ? 0.12 : wet);
    o.start(when); o.stop(when + dur + 0.05);
    this.track(o);
    // transient click so it cuts through on phone speakers
    this.noise(when, 0.03, gain * 0.35, 2600, 0.8, "highpass", 0);
  },
  // the trailer horn — detuned saws through an opening filter
  braam: function (when, dur, gain, freq) {
    const a = this.actx, g = a.createGain(), f = a.createBiquadFilter();
    f.type = "lowpass"; f.Q.value = 3;
    f.frequency.setValueAtTime(180, when);
    f.frequency.exponentialRampToValueAtTime(1500, when + dur * 0.35);
    f.frequency.exponentialRampToValueAtTime(400, when + dur);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain, when + 0.09);
    g.gain.setValueAtTime(gain, when + dur * 0.45);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    const detunes = [-8, 0, 7, -3];
    const mults = [1, 1, 2, 0.5];
    for (let i = 0; i < 4; i++) {
      const o = a.createOscillator();
      o.type = i === 3 ? "square" : "sawtooth";
      o.frequency.value = freq * mults[i];
      o.detune.value = detunes[i];
      o.connect(f);
      o.start(when); o.stop(when + dur + 0.08);
      this.track(o);
    }
    f.connect(g); this.out(g, 0.42);
  },
  noise: function (when, dur, gain, hz, q, type, wet) {
    const a = this.actx, s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = this.noiseBuf;
    s.playbackRate.value = 0.85 + Math.random() * 0.3;
    f.type = type || "bandpass"; f.frequency.setValueAtTime(hz, when); f.Q.value = q || 1.2;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain, when + Math.min(0.012, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    s.connect(f); f.connect(g); this.out(g, wet === undefined ? 0.2 : wet);
    s.start(when, Math.random() * 1.5); s.stop(when + dur + 0.05);
    this.track(s);
  },
  // pressure building into a hit
  riser: function (when, dur, gain) {
    const a = this.actx, s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = this.noiseBuf; s.loop = true;
    f.type = "bandpass"; f.Q.value = 7;
    f.frequency.setValueAtTime(200, when);
    f.frequency.exponentialRampToValueAtTime(7000, when + dur);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain, when + dur * 0.94);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur + 0.05);
    s.connect(f); f.connect(g); this.out(g, 0.3);
    s.start(when); s.stop(when + dur + 0.1);
    this.track(s);
    // pitched partner, an octave rise
    const o = a.createOscillator(), og = a.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(70, when);
    o.frequency.exponentialRampToValueAtTime(280, when + dur);
    og.gain.setValueAtTime(0.0001, when);
    og.gain.exponentialRampToValueAtTime(gain * 0.5, when + dur * 0.94);
    og.gain.exponentialRampToValueAtTime(0.0001, when + dur + 0.05);
    o.connect(og); this.out(og, 0.2);
    o.start(when); o.stop(when + dur + 0.1);
    this.track(o);
  },
  // sucked-in swell that lands on `when + dur`
  reverseHit: function (when, dur, gain) {
    const a = this.actx, s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = this.noiseBuf; s.loop = true;
    f.type = "bandpass"; f.Q.value = 2.5;
    f.frequency.setValueAtTime(300, when);
    f.frequency.exponentialRampToValueAtTime(3800, when + dur);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain, when + dur);
    g.gain.linearRampToValueAtTime(0.0001, when + dur + 0.06);
    s.connect(f); f.connect(g); this.out(g, 0.35);
    s.start(when); s.stop(when + dur + 0.1);
    this.track(s);
  },
  tick: function (when, gain, hz) { this.noise(when, 0.022, gain, hz, 6, "bandpass", 0.05); },
  blip: function (when, freq, gain) {
    const a = this.actx, o = a.createOscillator(), g = a.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(freq, when);
    o.frequency.exponentialRampToValueAtTime(freq * 0.6, when + 0.18);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain, when + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.22);
    o.connect(g); this.out(g, 0.5);
    o.start(when); o.stop(when + 0.3);
    this.track(o);
  },
  // digital chatter
  stutter: function (when, dur, gain, rate) {
    const n = Math.max(2, Math.round(dur * (rate || 46)));
    for (let i = 0; i < n; i++) {
      const at = when + (i / n) * dur;
      this.noise(at, 0.012, gain * (0.5 + Math.random()), 900 + Math.random() * 5200, 5, "bandpass", 0.05);
    }
  },
  heart: function (when, gain) {
    this.sub(when, 62, 30, 0.42, gain, 0.25);
    this.sub(when + 0.33, 54, 26, 0.34, gain * 0.62, 0.25);
  },
  // continuous low tension
  drone: function (when, dur, gain, freq) {
    const a = this.actx, g = a.createGain(), f = a.createBiquadFilter();
    f.type = "lowpass"; f.Q.value = 1.2;
    f.frequency.setValueAtTime(220, when);
    f.frequency.linearRampToValueAtTime(900, when + dur);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain, when + Math.min(1.4, dur * 0.4));
    g.gain.setValueAtTime(gain, when + dur * 0.8);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    for (const dt of [-11, 4, 9]) {
      const o = a.createOscillator();
      o.type = "sawtooth"; o.frequency.value = freq; o.detune.value = dt;
      o.connect(f); o.start(when); o.stop(when + dur + 0.1);
      this.track(o);
    }
    f.connect(g); this.out(g, 0.3);
  },
  // pull the bed down under a hit so the impact reads
  duck: function (when, depth, level) {
    const g = this.bed.gain;
    g.setValueAtTime(Math.max(0.0001, level * (1 - depth)), when + 0.005);
    g.exponentialRampToValueAtTime(Math.max(0.0001, level), when + 0.34);
  },

  /* --- the score. t=0 is the first frame of the trailer --- */
  score: function () {
    const a = this.actx, t0 = a.currentTime + 0.15;
    this.t0 = t0;
    const bg = this.bed.gain, bf = this.bedFilter.frequency;
    const at = s => t0 + s;

    bg.cancelScheduledValues(a.currentTime);
    bf.cancelScheduledValues(a.currentTime);
    bg.setValueAtTime(0.0001, at(0));
    bf.setValueAtTime(300, at(0));

    CUE.call(this, at, bg, bf, a);

    if (this.el) {
      this.el.currentTime = 0;
      const pr = this.el.play();
      if (pr && pr.catch) pr.catch(function () {});
    }
  },

  stop: function () {
    this.t0 = 0;
    if (this.el) this.el.pause();
    if (!this.actx) return;
    const now = this.actx.currentTime;
    try {
      this.bed.gain.cancelScheduledValues(now);
      this.bed.gain.setValueAtTime(0.0001, now);
    } catch (e) {}
    for (const v of this.voices) { try { v.stop(now); } catch (e) {} }
    this.voices = [];
  }
};
/* ========= playback + recording ========= */
const elAspect = document.getElementById("aspect");
const elQuality = document.getElementById("quality");
const btnPreview = document.getElementById("preview");
const btnRecord = document.getElementById("record");
const btnStop = document.getElementById("stop");
const elStatus = document.getElementById("status");
const dlslot = document.getElementById("dlslot");

let raf = null, ticker = null, clockWorker = null, startMs = 0, running = false;
let recorder = null, recMime = "", chunks = [], recording = false, frameTrack = null;

function say(html) { elStatus.innerHTML = html; }
window.__done = false;
window.__saveAs = "";          // set before recording to POST the result to ./save

function pickMime() {
  const candidates = [
    'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm'
  ];
  for (const m of candidates) if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) return m;
  return "";
}

// Hidden tabs throttle setInterval and rAF to about 1Hz, which would turn a
// recording into a slideshow. A worker's timer is not throttled, so the frame
// clock lives off-thread and the tab is free to go to the background.
function startClock(cb) {
  const period = Math.round(1000 / FPS);
  try {
    const src = "var id=setInterval(function(){postMessage(0)}," + period + ");" +
                "onmessage=function(){clearInterval(id);close()}";
    clockWorker = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
    clockWorker.onmessage = cb;
    return true;
  } catch (e) {
    clockWorker = null;
    ticker = setInterval(cb, period);
    return false;
  }
}
function stopClock() {
  if (clockWorker) { clockWorker.terminate(); clockWorker = null; }
  if (ticker) { clearInterval(ticker); ticker = null; }
}

function now() {
  return AudioEngine.t0 ? (AudioEngine.actx.currentTime - AudioEngine.t0)
                        : (performance.now() - startMs) / 1000;
}
function step() {
  const t = now();
  draw(t);
  if (frameTrack && frameTrack.requestFrame) frameTrack.requestFrame();
  if (recording) {
    say("Recording <b>" + Math.round(clamp(t / DUR, 0, 1) * 100) + "%</b> &nbsp;·&nbsp; " +
        clamp(t, 0, DUR).toFixed(1) + "s / " + DUR + "s" +
        (document.hidden ? " &nbsp;·&nbsp; tab hidden — fine, the frame clock is off-thread" : ""));
  } else {
    say("Playing &nbsp;·&nbsp; " + clamp(t, 0, DUR).toFixed(1) + "s / " + DUR + "s");
  }
  if (t >= DUR) { finish(); return; }
  if (!recording) raf = requestAnimationFrame(step);
}

function start(rec) {
  if (running) return;
  running = true; recording = !!rec;
  window.__done = false;
  dlslot.innerHTML = "";
  btnPreview.disabled = true; btnRecord.disabled = true;
  elAspect.disabled = true; elQuality.disabled = true;
  btnStop.disabled = false;

  AudioEngine.init();
  const go = function () {
    if (rec) {
      recMime = pickMime();
      // pull frames explicitly so recording never depends on the compositor
      let stream;
      const supportsManual = typeof canvas.captureStream === "function";
      stream = canvas.captureStream(supportsManual ? 0 : FPS);
      frameTrack = stream.getVideoTracks()[0];
      if (!frameTrack || !frameTrack.requestFrame) {
        stream = canvas.captureStream(FPS);
        frameTrack = null;
      }
      const audio = AudioEngine.dest.stream.getAudioTracks()[0];
      if (audio) stream.addTrack(audio);
      chunks = [];
      const opts = { videoBitsPerSecond: parseInt(elQuality.value, 10), audioBitsPerSecond: 192000 };
      if (recMime) opts.mimeType = recMime;
      try { recorder = new MediaRecorder(stream, opts); }
      catch (e) { recorder = new MediaRecorder(stream); recMime = recorder.mimeType; }
      recorder.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      recorder.onstop = onRecordingStopped;
      recorder.start(1000);
    }
    startMs = performance.now();
    AudioEngine.score();
    if (rec) startClock(step);
    else raf = requestAnimationFrame(step);
  };

  if (AudioEngine.actx.state === "suspended") AudioEngine.actx.resume().then(go, go);
  else go();
}

function onRecordingStopped() {
  const type = (recMime || "video/webm").split(";")[0];
  const blob = new Blob(chunks, { type: type });
  const ext = type.indexOf("mp4") >= 0 ? "mp4" : "webm";
  const mb = (blob.size / 1048576).toFixed(1);
  const name = OUTPUT_BASENAME + "-" + elAspect.value.replace(":", "x") + "." + ext;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.className = "dl";
  a.download = name;
  a.textContent = "↓ Save " + ext.toUpperCase() + " (" + mb + " MB)";
  dlslot.innerHTML = ""; dlslot.appendChild(a);
  say("Done — <b>" + ext.toUpperCase() + "</b>, " + mb + " MB. Click save." +
      (ext === "webm" ? " (No MP4 recording in this browser; WebM plays on YouTube/Discord, convert it for X.)" : ""));
  window.__done = true;
  window.__result = { name: name, size: blob.size, type: type };

  if (window.__saveAs) {
    fetch("save?name=" + encodeURIComponent(window.__saveAs), { method: "POST", body: blob })
      .then(function (r) { return r.text(); })
      .then(function (txt) { say("Done — saved to disk: <b>" + txt + "</b>"); })
      .catch(function (e) { say("Done, but the save failed: " + e.message); });
  }
}

function finish() {
  if (!running) return;
  running = false;
  if (raf) { cancelAnimationFrame(raf); raf = null; }
  stopClock();
  AudioEngine.stop();
  if (recorder && recorder.state !== "inactive") { recorder.stop(); say("Encoding…"); }
  else say("Stopped.");
  recorder = null; recording = false; frameTrack = null;
  btnPreview.disabled = false; btnRecord.disabled = false;
  elAspect.disabled = false; elQuality.disabled = false;
  btnStop.disabled = true;
}

btnPreview.onclick = function () { start(false); };
btnRecord.onclick = function () { start(true); };
btnStop.onclick = function () { finish(); };
elAspect.onchange = function () { setSize(elAspect.value); draw(POSTER_T); };

/* ========= boot ========= */
setSize(elAspect.value);
buildNoise();
loadArt().then(function () {
  draw(POSTER_T);
  const m = pickMime();
  say("Ready — output format: <b>" + (m ? m.split(";")[0] : "browser default") + "</b>");
});

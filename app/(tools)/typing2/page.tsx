"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  sentenceSets,
  basePraises,
  spicyPraises,
  reprimands,
  idleScolds,
  shareTexts,
  buildTweetUrl,
  SHARE_URL,
  X_HANDLE,
  TOTAL_IMAGES,
  PENALTY_LOCKOUT_AT,
  PENALTY_RESET_AT,
  LOCKOUT_MS,
  getRandomFromArray,
  normalize,
} from "@/lib/typing-content";

const IMAGE_DIR = "/typing2/images";
const AUDIO_SRC = "/typing2/audio/start.mp3";

/** Reveal grid is independent of line count so it always finishes fully open. */
const TILE_COLS = 6;
const TILE_ROWS = 6;
const TILE_COUNT = TILE_COLS * TILE_ROWS;

/** Milestones within a single line that fire a praise line. */
const MILESTONES = [0.25, 0.5, 0.75];

type Stage = { at: number; label: string; tone: string };

const STAGES: Stage[] = [
  { at: 0, label: "DORMANT", tone: "text-pink-200/50" },
  { at: 0.25, label: "SYNCING", tone: "text-pink-300/80" },
  { at: 0.5, label: "BINDING", tone: "text-pink-300" },
  { at: 0.75, label: "YIELDING", tone: "text-pink-200" },
  { at: 1, label: "OWNED", tone: "text-white" },
];

const stageFor = (p: number) =>
  [...STAGES].reverse().find((s) => p >= s.at) ?? STAGES[0];

/** Only letters, digits and spaces are typeable; everything else is rejected. */
const isTypeable = (s: string) => /^[a-z0-9\s]*$/.test(s.toLowerCase());

/**
 * Most a single input event may add. Real typing adds one character; swipe
 * keyboards and IME commits can land a short word at once, so the ceiling is
 * generous. Paste is blocked at the event level — this only catches what gets
 * past that (drag-and-drop, autofill), so the line can never be filled in.
 */
const MAX_JUMP = 6;

/** Clean lines in a row that earn one absolution. */
const GRACE_EVERY = 3;
const MAX_GRACE = 2;

/** She notices when you stop: a nudge, then it costs you. */
const IDLE_NUDGE_MS = 6000;
const IDLE_STRIKE_MS = 13000;
/**
 * Idle strikes per absence before the run simply stalls. Without this, walking
 * away long enough unwinds every line you earned — which erases the session
 * instead of threatening it. She waits instead, and resumes when you do.
 */
const IDLE_STRIKES_BEFORE_STALL = 2;

/** Tiny synth so every keystroke has weight. No assets, no latency. */
const SFX = {
  ctx: null as AudioContext | null,
  on: true,
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as never as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx?.state === "suspended") this.ctx.resume().catch(() => {});
    return this.ctx;
  },
  tone(freq: number, dur: number, gain: number, type: OscillatorType, slideTo?: number) {
    if (!this.on) return;
    try {
      const a = this.ensure();
      if (!a) return;
      const t = a.currentTime;
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(a.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
    } catch {
      /* audio unavailable */
    }
  },
  key() { this.tone(1500 + Math.random() * 260, 0.028, 0.030, "square"); },
  reject() { this.tone(190, 0.16, 0.075, "sawtooth", 70); },
  lock() { this.tone(120, 0.5, 0.085, "sawtooth", 55); },
  revoke() { this.tone(260, 0.85, 0.095, "sawtooth", 48); },
  lineDone() {
    this.tone(880, 0.09, 0.055, "triangle");
    setTimeout(() => this.tone(1320, 0.14, 0.05, "triangle"), 70);
  },
  graceEarned() {
    this.tone(1046, 0.10, 0.05, "sine");
    setTimeout(() => this.tone(1568, 0.18, 0.045, "sine"), 90);
  },
};

const shuffled = (n: number) => {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

type LogEntry = { id: number; text: string; kind: "praise" | "sys" | "scold" };

const Typing2Page = () => {
  const [started, setStarted] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [imagePath, setImagePath] = useState("");
  const [tileOrder, setTileOrder] = useState<number[]>([]);

  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [shareText, setShareText] = useState("");
  /** The share button stays inert briefly so trailing keystrokes (or a Space
   *  landing on the freshly-focused button) can't fire the popup by accident. */
  const [armed, setArmed] = useState(false);

  const [log, setLog] = useState<LogEntry[]>([]);
  const [toast, setToast] = useState<{ text: string; bad: boolean } | null>(null);
  const [rejectPulse, setRejectPulse] = useState(false);
  const [locked, setLocked] = useState(false);
  const [wipe, setWipe] = useState(false);
  const [focused, setFocused] = useState(true);
  const [muted, setMuted] = useState(false);

  // Stats
  const [correctKeys, setCorrectKeys] = useState(0);
  const [errorKeys, setErrorKeys] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [revoked, setRevoked] = useState(0);
  const [grace, setGrace] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [stalled, setStalled] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const logId = useRef(0);
  const firedRef = useRef<number[]>([]);
  const lineErrorsRef = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastKeyAt = useRef(0);
  const nudgedRef = useRef(false);
  const idleStrikesRef = useRef(0);

  /** setTimeout that is cleaned up on unmount. */
  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    setLines(getRandomFromArray(sentenceSets));
    setImagePath(`${IMAGE_DIR}/${Math.floor(Math.random() * TOTAL_IMAGES) + 1}.png`);
    setTileOrder(shuffled(TILE_COUNT));
    setStartedAt(Date.now());
    lastKeyAt.current = Date.now();
  }, [started]);

  // Ticking clock for the WPM readout.
  useEffect(() => {
    if (!started || done) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [started, done]);

  const totalLines = lines.length;
  const target = lines[lineIndex] ?? "";
  const typedNorm = normalize(typed);

  /** Truthful 0..1 progress across the whole run. */
  const progress = useMemo(() => {
    if (!totalLines) return 0;
    const within = target ? Math.min(1, typedNorm.length / target.length) : 0;
    return Math.min(1, (lineIndex + within) / totalLines);
  }, [lineIndex, typedNorm, target, totalLines]);

  const devotion = Math.round(progress * 100);
  const stage = stageFor(progress);

  const revealedTiles = useMemo(() => {
    const n = Math.round(progress * TILE_COUNT);
    return new Set(tileOrder.slice(0, n));
  }, [progress, tileOrder]);

  const accuracy = useMemo(() => {
    const total = correctKeys + errorKeys;
    return total ? Math.round((correctKeys / total) * 100) : 100;
  }, [correctKeys, errorKeys]);

  const wpm = useMemo(() => {
    if (!startedAt || !correctKeys) return 0;
    const mins = Math.max((now || Date.now()) - startedAt, 1000) / 60000;
    return Math.round(correctKeys / 5 / mins);
  }, [startedAt, correctKeys, now]);

  const pushLog = useCallback((text: string, kind: LogEntry["kind"] = "praise") => {
    logId.current += 1;
    const entry = { id: logId.current, text, kind };
    setLog((prev) => [...prev.slice(-7), entry]);
  }, []);

  /** Picks from `pool` without repeating whatever was said last. */
  const lastSaid = useRef("");
  const say = useCallback(
    (pool: string[], kind: LogEntry["kind"]) => {
      let msg = getRandomFromArray(pool);
      for (let i = 0; i < 4 && msg === lastSaid.current; i++) {
        msg = getRandomFromArray(pool);
      }
      lastSaid.current = msg;
      pushLog(msg, kind);
      setToast({ text: msg, bad: kind === "scold" });
      later(() => setToast(null), 900);
    },
    [pushLog, later]
  );

  const praise = useCallback(
    (spicy: boolean) => say(spicy ? spicyPraises : basePraises, "praise"),
    [say]
  );

  const vibrate = (ms: number | number[]) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        /* unsupported */
      }
    }
  };

  const finish = useCallback(() => {
    setDone(true);
    const text = getRandomFromArray(shareTexts);
    setShareText(text);
    setRedirectUrl(buildTweetUrl(text));
    setArmed(false);
    later(() => setArmed(true), 800);
    pushLog("conditioning complete — she is fully rendered", "sys");
  }, [pushLog, later]);

  /**
   * One punishment ladder, shared by mistyping and by going idle. A stored
   * grace absorbs the strike outright before any of it runs.
   */
  const punish = useCallback(
    (reason: "typo" | "idle" | "paste") => {
      setErrorKeys((n) => n + 1);
      setRejectPulse(true);
      later(() => setRejectPulse(false), 150);

      if (grace > 0) {
        setGrace((g) => g - 1);
        pushLog("she lets that one go", "scold");
        setToast({ text: "forgiven — once", bad: true });
        later(() => setToast(null), 900);
        SFX.reject();
        vibrate(10);
        return;
      }

      setStreak(0);
      lineErrorsRef.current += 1;
      const n = lineErrorsRef.current;
      setStrikes(n);

      if (n >= PENALTY_RESET_AT) {
        // Third strike: the line is taken away and one earned line with it.
        lineErrorsRef.current = 0;
        firedRef.current = [];
        setStrikes(0);
        setTyped("");
        setWipe(true);
        later(() => setWipe(false), 400);
        vibrate([40, 60, 40]);
        SFX.revoke();
        const revoking = lineIndex > 0;
        if (revoking) {
          setRevoked((r) => r + 1);
          setLineIndex(lineIndex - 1);
        }
        pushLog(
          revoking ? "start again — from the line before" : "start that line again",
          "scold"
        );
        setToast({
          text: revoking ? "she took one back" : "start again",
          bad: true,
        });
        later(() => setToast(null), 1100);
        return;
      }

      if (n >= PENALTY_LOCKOUT_AT) {
        // Second strike: hold still.
        setLocked(true);
        vibrate(60);
        SFX.lock();
        later(() => setLocked(false), LOCKOUT_MS);
        pushLog("hold still", "scold");
        return;
      }

      vibrate(12);
      SFX.reject();
      if (reason === "idle") say(idleScolds, "scold");
      else if (reason === "paste") pushLog("type it yourself", "scold");
      else say(reprimands, "scold");
    },
    [grace, lineIndex, later, pushLog, say]
  );

  // She notices when your hands stop: a nudge first, then it costs you.
  useEffect(() => {
    if (!started || done || locked || stalled || !totalLines) return;
    const id = setInterval(() => {
      // Looking away on-page is fair game — the overlay warns you. A backgrounded
      // tab is not: you would come back to a revoked line with no idea why.
      // `hidden` alone is not enough — embedded/preview surfaces report hidden
      // while the user is actively typing — so require loss of focus too.
      if (
        typeof document !== "undefined" &&
        document.hidden &&
        !document.hasFocus()
      ) {
        lastKeyAt.current = Date.now();
        nudgedRef.current = false;
        return;
      }
      const idle = Date.now() - lastKeyAt.current;
      if (idle > IDLE_STRIKE_MS) {
        lastKeyAt.current = Date.now();
        nudgedRef.current = false;
        idleStrikesRef.current += 1;
        punish("idle");
        if (idleStrikesRef.current >= IDLE_STRIKES_BEFORE_STALL) {
          setStalled(true);
          pushLog("she will wait. she is good at waiting.", "sys");
        }
      } else if (idle > IDLE_NUDGE_MS && !nudgedRef.current) {
        nudgedRef.current = true;
        pushLog("she is watching you not type", "scold");
      }
    }, 700);
    return () => clearInterval(id);
  }, [started, done, locked, stalled, totalLines, punish, pushLog]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (done || locked) return;
    const raw = e.target.value;
    const val = normalize(raw);
    lastKeyAt.current = Date.now();
    nudgedRef.current = false;
    idleStrikesRef.current = 0;
    if (stalled) setStalled(false);

    const accepted = isTypeable(raw) && target.startsWith(val);
    const jump = val.length - typedNorm.length;

    // A correct prefix that appeared too fast was not typed. Refuse it outright
    // rather than letting a paste finish the line.
    if (accepted && jump > MAX_JUMP) {
      setToast({ text: "type it yourself", bad: true });
      later(() => setToast(null), 1000);
      punish("paste");
      return;
    }

    if (!accepted) {
      punish("typo");
      return;
    }

    if (jump > 0) {
      setCorrectKeys((n) => n + jump);
      SFX.key();
    }
    setTyped(raw);

    const ratio = val.length / Math.max(target.length, 1);
    const hit = MILESTONES.filter(
      (m) => ratio >= m && !firedRef.current.includes(m)
    );
    if (hit.length) {
      firedRef.current.push(...hit);
      praise(Math.max(...hit) >= 0.75);
    }

    if (val !== target) return;

    // Line complete.
    const clean = lineErrorsRef.current === 0;
    const nextStreak = clean ? streak + 1 : 0;
    setStreak(nextStreak);
    setBestStreak((b) => Math.max(b, nextStreak));

    // Every few clean lines she banks one absolution for you.
    if (clean && nextStreak > 0 && nextStreak % GRACE_EVERY === 0 && grace < MAX_GRACE) {
      setGrace((g) => Math.min(MAX_GRACE, g + 1));
      pushLog("she is feeling generous — one slip forgiven", "sys");
      SFX.graceEarned();
    } else {
      SFX.lineDone();
    }
    praise(true);
    vibrate(24);

    // Advance immediately: a delay here would swallow the next keystrokes of a
    // fast typist. The reveal animates off `progress` via CSS, so it still eases.
    firedRef.current = [];
    lineErrorsRef.current = 0;
    setStrikes(0);
    setTyped("");
    const next = lineIndex + 1;
    setLineIndex(next);
    if (next >= totalLines) finish();
  };

  const handleStart = () => {
    try {
      const audio = new Audio(AUDIO_SRC);
      audio.loop = true;
      audio.volume = 0.5;
      audioRef.current = audio;
      audio.play().catch(() => {});
    } catch {
      /* autoplay blocked */
    }
    setStarted(true);
  };

  const toggleMute = () => {
    const a = audioRef.current;
    setMuted((m) => {
      if (a) a.muted = !m;
      SFX.on = m;                 // m is the *previous* value, so this unmutes
      return !m;
    });
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const focusInput = () => inputRef.current?.focus();

  /* ── Gate ─────────────────────────────────────────────────────────── */
  if (!started) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-[#05020400] text-pink-200">
        <Backdrop intensity={0} />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-5">
          <div className="w-full max-w-md">
            <Monitor title="azraiel@sanctuary — conditioning.sys">
              <div className="p-6 text-center sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-pink-200/45">
                  Protocol 02 · Typing
                </p>
                <h1 className="mt-4 text-2xl font-semibold tracking-wide text-pink-100 sm:text-3xl">
                  Sit still and type for her.
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-pink-200/60">
                  Twenty-four lines. Every one you finish renders a little more
                  of her onto your screen.
                </p>
                <button
                  onClick={handleStart}
                  className="mt-7 w-full rounded-xl border border-pink-400/30 bg-pink-600 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(236,72,153,0.35)] transition hover:bg-pink-500 active:scale-[0.99]"
                >
                  Begin conditioning
                </button>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-pink-200/30">
                  Audio starts on entry · mute available
                </p>
              </div>
            </Monitor>
          </div>
        </div>
      </div>
    );
  }

  /* ── Session ──────────────────────────────────────────────────────── */
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-pink-200">
      <Backdrop intensity={progress} />

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-24 z-40 flex justify-center px-4">
          <div
            className={`animate-[toast_0.9s_ease-out_forwards] rounded-full border bg-black/80 px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] backdrop-blur-md ${
              toast.bad
                ? "border-rose-400/40 text-rose-200"
                : "border-pink-400/30 text-pink-100"
            }`}
          >
            {toast.text}
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto grid max-w-6xl gap-5 px-4 pb-10 pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:pt-28">
        {/* Left: the terminal */}
        <Monitor title="azraiel@sanctuary — conditioning.sys" scan>
          <div className="p-4 sm:p-5">
            {/* Status strip */}
            <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
              <span className={stage.tone}>◆ {stage.label}</span>

              {/* the ladder, made visible: filled pips are strikes on this
                  line, the ring is an absolution she is holding for you */}
              <span className="flex items-center gap-2" aria-label={`${strikes} of ${PENALTY_RESET_AT} strikes, ${grace} forgiven`}>
                {grace > 0 && (
                  <span className="flex gap-1">
                    {Array.from({ length: grace }, (_, i) => (
                      <i
                        key={`g${i}`}
                        className="h-2 w-2 rounded-full border border-emerald-300/70 bg-emerald-400/20"
                      />
                    ))}
                  </span>
                )}
                <span className="flex gap-1">
                  {Array.from({ length: PENALTY_RESET_AT }, (_, i) => (
                    <i
                      key={`s${i}`}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        i < strikes
                          ? "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </span>
                <span className="text-pink-200/40">
                  {Math.min(lineIndex + 1, totalLines || 1)} / {totalLines || "—"}
                </span>
              </span>
            </div>

            {/* Devotion meter */}
            <div className="mt-3">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/5">
                <div
                  className="h-full rounded-full transition-[width] duration-300 ease-out"
                  style={{
                    width: `${devotion}%`,
                    background:
                      "linear-gradient(90deg, rgba(236,72,153,0.85), rgba(255,255,255,0.9))",
                    boxShadow: "0 0 12px rgba(236,72,153,0.6)",
                  }}
                />
              </div>
              <div className="mt-2 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-pink-200/45">
                <span>{devotion}% devotion</span>
                <span>
                  {wpm} wpm · {accuracy}% acc
                  {errorKeys > 0 ? ` · ${errorKeys} slip${errorKeys === 1 ? "" : "s"}` : ""}
                  {streak > 1 ? ` · ${streak}× clean` : ""}
                </span>
              </div>
            </div>

            {/* Typing surface */}
            {!done ? (
              <div
                onClick={focusInput}
                className={`relative mt-5 cursor-text rounded-xl border bg-black/50 p-4 transition ${
                  locked
                    ? "border-rose-500/70 shadow-[0_0_28px_rgba(244,63,94,0.28)]"
                    : rejectPulse || wipe
                      ? "animate-[nudge_0.15s_linear] border-rose-400/70"
                      : focused
                        ? "border-pink-500/40"
                        : "border-white/10"
                }`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-pink-200/35">
                  ~$ transcribe
                </p>

                <p className="mt-2 break-words font-mono text-lg leading-relaxed sm:text-xl">
                  {target.split("").map((ch, i) => {
                    const state =
                      i < typedNorm.length
                        ? "done"
                        : i === typedNorm.length
                          ? "cur"
                          : "todo";
                    return (
                      <span
                        key={i}
                        className={
                          state === "done"
                            ? "text-pink-100"
                            : state === "cur"
                              ? `rounded-sm px-[1px] ${
                                  rejectPulse
                                    ? "bg-rose-500/60 text-white"
                                    : "bg-pink-500/70 text-white"
                                }`
                              : "text-pink-200/25"
                        }
                      >
                        {ch === " " && state === "cur" ? " " : ch}
                      </span>
                    );
                  })}
                </p>

                <textarea
                  ref={inputRef}
                  value={typed}
                  onChange={handleChange}
                  readOnly={locked}
                  onPaste={(e) => {
                    e.preventDefault();
                    setToast({ text: "type it yourself", bad: true });
                    later(() => setToast(null), 1000);
                    pushLog("she saw that — type it yourself", "scold");
                    SFX.reject();
                  }}
                  onDrop={(e) => e.preventDefault()}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  autoFocus
                  spellCheck={false}
                  autoCapitalize="none"
                  autoCorrect="off"
                  aria-label="Type the line shown above"
                  className="absolute inset-0 h-full w-full resize-none bg-transparent p-4 font-mono text-lg text-transparent caret-transparent outline-none"
                />

                {locked && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 rounded-xl bg-black/85 backdrop-blur-[1px]">
                    <span className="font-mono text-sm uppercase tracking-[0.3em] text-rose-300">
                      hold still
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-rose-200/40">
                      she is not finished with you
                    </span>
                  </div>
                )}

                {!locked && stalled && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 rounded-xl bg-black/80 font-mono uppercase backdrop-blur-[1px]">
                    <span className="text-sm tracking-[0.3em] text-pink-200">
                      she is waiting
                    </span>
                    <span className="text-[10px] tracking-[0.2em] text-pink-200/40">
                      type to pick it back up
                    </span>
                  </div>
                )}

                {!locked && !stalled && !focused && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/70 font-mono text-[10px] uppercase tracking-[0.22em] text-pink-200/70">
                    click to keep typing
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-pink-500/40 bg-black/50 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-pink-200/40">
                  ~$ status
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-pink-100">
                  She is fully rendered.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-pink-200/60">
                  {totalLines} lines · {wpm} wpm · {accuracy}% accuracy · best
                  clean streak {bestStreak}
                  {grace > 0 ? ` · ${grace} absolution${grace === 1 ? "" : "s"} unspent` : ""}
                  {revoked > 0
                    ? ` · she took ${revoked} line${revoked === 1 ? "" : "s"} back`
                    : " · she never had to take one back"}
                  .
                </p>
                {/* Show the confession before they post it — the intent link
                    only pre-fills X, they still press Post themselves. */}
                <figure className="mt-5 rounded-lg border border-white/10 bg-black/40 p-3">
                  <figcaption className="font-mono text-[10px] uppercase tracking-[0.18em] text-pink-200/35">
                    your confession
                  </figcaption>
                  <blockquote className="mt-2 text-sm leading-relaxed text-pink-100/90">
                    “{shareText}”
                  </blockquote>
                  <p className="mt-2 font-mono text-[10px] text-pink-200/30">
                    {SHARE_URL} · via @{X_HANDLE}
                  </p>
                </figure>

                <button
                  onClick={() => {
                    if (armed && redirectUrl)
                      window.open(redirectUrl, "_blank", "noopener,noreferrer");
                  }}
                  disabled={!armed}
                  className="mt-3 w-full rounded-xl border border-pink-300/30 bg-pink-600 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white shadow-[0_0_26px_rgba(236,72,153,0.35)] transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  Confess on X
                </button>
                <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-pink-200/25">
                  opens X · you still press post
                </p>
              </div>
            )}

            {/* Praise log */}
            <div className="mt-4 h-28 overflow-hidden rounded-lg border border-white/5 bg-black/40 p-3">
              <div className="flex h-full flex-col justify-end gap-1 font-mono text-[11px]">
                {log.length === 0 && (
                  <p className="text-pink-200/20">awaiting input…</p>
                )}
                {log.map((l, i) => (
                  <p
                    key={l.id}
                    className={
                      l.kind === "sys"
                        ? "text-pink-100"
                        : l.kind === "scold"
                          ? "text-rose-300/80"
                          : "text-pink-300/70"
                    }
                    style={{ opacity: 0.35 + (i / Math.max(log.length - 1, 1)) * 0.65 }}
                  >
                    <span className="text-pink-200/25">›</span> {l.text}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-pink-200/25">
                letters and spaces only
              </p>
              <button
                onClick={toggleMute}
                className="rounded-md border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-pink-200/50 transition hover:border-pink-400/40 hover:text-pink-200"
              >
                {muted ? "unmute" : "mute"}
              </button>
            </div>
          </div>
        </Monitor>

        {/* Right: the reveal */}
        <Monitor title="render — subject.png" scan>
          <div className="p-3 sm:p-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black">
              {imagePath && (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-[filter] duration-700"
                  style={{
                    backgroundImage: `url("${imagePath}")`,
                    filter: `blur(${(1 - progress) * 14}px) saturate(${0.5 + progress * 0.8})`,
                    transform: "scale(1.06)",
                  }}
                />
              )}

              {/* Global darkness that lifts to nothing */}
              <div
                className="absolute inset-0 bg-black transition-opacity duration-500"
                style={{ opacity: 0.8 * (1 - progress) }}
              />

              {/* Tile dissolve */}
              <div
                className="absolute inset-0 grid"
                style={{
                  gridTemplateColumns: `repeat(${TILE_COLS}, 1fr)`,
                  gridTemplateRows: `repeat(${TILE_ROWS}, 1fr)`,
                }}
              >
                {Array.from({ length: TILE_COUNT }, (_, i) => (
                  <div
                    key={i}
                    className="bg-black transition-opacity duration-700"
                    style={{ opacity: revealedTiles.has(i) ? 0 : 0.85 }}
                  />
                ))}
              </div>

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.28)_50%)] bg-[length:100%_3px] opacity-30 mix-blend-overlay" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
                <span className="text-pink-200/60">render {devotion}%</span>
                <span className={stage.tone}>{stage.label}</span>
              </div>
            </div>
          </div>
        </Monitor>
      </div>

      <style jsx global>{`
        @keyframes toast {
          0% { transform: translateY(6px) scale(0.98); opacity: 0; }
          25% { transform: translateY(0) scale(1); opacity: 1; }
          75% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes nudge {
          0%, 100% { transform: translateX(0); }
          33% { transform: translateX(-3px); }
          66% { transform: translateX(3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

/* ── Chrome ─────────────────────────────────────────────────────────── */

const Monitor = ({
  title,
  children,
  scan = false,
}: {
  title: string;
  children: React.ReactNode;
  scan?: boolean;
}) => (
  <div className="relative overflow-hidden rounded-xl border border-pink-500/25 bg-[rgba(10,4,8,0.85)] shadow-[0_30px_80px_-20px_rgba(236,72,153,0.35),inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl">
    {scan && (
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)",
          backgroundSize: "100% 3px",
        }}
      />
    )}
    <div className="relative z-10 flex items-center gap-2.5 border-b border-pink-500/15 bg-black/40 px-4 py-3">
      <div className="flex gap-1.5">
        <i className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <i className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <i className="h-2 w-2 rounded-full bg-[#28c840]" />
      </div>
      <div className="flex-1 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-pink-100/50">
        {title}
      </div>
      <div className="w-[38px]" />
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

const Backdrop = ({ intensity }: { intensity: number }) => (
  <>
    <div className="pointer-events-none fixed inset-0 bg-black" />
    <div
      className="pointer-events-none fixed inset-0 transition-opacity duration-700"
      style={{
        opacity: 0.35 + intensity * 0.5,
        background:
          "radial-gradient(900px 520px at 50% -10%, rgba(236,72,153,0.28), transparent 62%), radial-gradient(700px 460px at 12% 88%, rgba(155,92,255,0.18), transparent 58%)",
      }}
    />
    <div
      className="pointer-events-none fixed inset-0 opacity-[0.06] mix-blend-overlay"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0) 50%, rgba(255,255,255,0.5) 50%)",
        backgroundSize: "100% 3px",
      }}
    />
  </>
);

export default Typing2Page;

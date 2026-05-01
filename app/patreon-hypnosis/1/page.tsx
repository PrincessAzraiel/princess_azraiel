"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import "../hypnosis.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "welcome" | "session" | "end";
type Pref  = "goodboy" | "goodgirl" | "goodpuppy";

type SeqItem =
  | { kind: "seg";  file: string; label: string; key: string }
  | { kind: "aff";  key: string }
  | { kind: "task"; num: 1 | 2 };

// ─── Sequence ─────────────────────────────────────────────────────────────────

const SEQ: SeqItem[] = [
  { kind: "seg",  file: "seg01_welcome",       label: "Settling In",   key: "seg01" },
  { kind: "seg",  file: "seg02_induction",     label: "Induction",     key: "seg02" },
  { kind: "seg",  file: "seg03_deepener",      label: "Deepening",     key: "seg03" },
  { kind: "aff",  key: "aff01" },
  { kind: "seg",  file: "seg04_worship",       label: "Worship",       key: "seg04" },
  { kind: "aff",  key: "aff02" },
  { kind: "task", num: 1 },
  { kind: "seg",  file: "seg05_reinforcement", label: "Reinforcement", key: "seg05" },
  { kind: "aff",  key: "aff03" },
  { kind: "task", num: 2 },
  { kind: "aff",  key: "aff04" },
  { kind: "seg",  file: "seg06_wakeup",        label: "Returning",     key: "seg06" },
  { kind: "aff",  key: "aff05" },
];

// ─── Panning keyframes ────────────────────────────────────────────────────────
// Each entry: [normalizedTime 0–1, panValue -1–1]

const SEG_PAN: Record<string, Array<[number, number]>> = {
  seg01: [[0, 0], [1, -0.1]],
  seg02: [[0, 0], [0.5, 0], [0.65, -0.25], [0.8, 0.25], [1, 0]],
  seg03: [[0, 0], [0.5, -0.3], [0.75, -0.1], [1, 0]],
  seg04: [[0, 0], [0.4, -0.4], [0.6, 0.5], [0.85, 0], [1, 0]],
  seg05: [[0, 0], [0.2, -0.8], [0.5, 0.8], [0.75, -0.6], [1, 0]],
  seg06: [[0, -0.15], [0.25, 0.15], [0.5, -0.05], [0.8, 0], [1, 0]],
};

const AFF_PAN: Record<string, Array<[number, number]>> = {
  aff01: [[0, -0.8], [1, 0.8]],
  aff02: [[0, 0], [1, 0]],
  aff03: [[0, -0.9], [0.5, 0.9], [1, -0.5]],
  aff04: [[0, 0], [1, 0]],
  aff05: [[0, 0], [1, 0]],
};

const PREF_LABELS: Record<Pref, string> = {
  goodboy:  "Good Boy",
  goodgirl: "Good Girl",
  goodpuppy:"Good Puppy",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function panAt(kf: Array<[number, number]>, p: number): number {
  if (p <= kf[0][0]) return kf[0][1];
  if (p >= kf[kf.length - 1][0]) return kf[kf.length - 1][1];
  let i = 0;
  while (i < kf.length - 2 && kf[i + 1][0] <= p) i++;
  const t = (p - kf[i][0]) / (kf[i + 1][0] - kf[i][0]);
  return kf[i][1] + (kf[i + 1][1] - kf[i][1]) * t;
}

function affSrc(key: string, pref: Pref): string {
  return key === "aff04"
    ? "/hypnosis/audio/aff04_neutral.mp3"
    : `/hypnosis/audio/${key}_${pref}.mp3`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PatreonHypnosis1() {
  const [phase,        setPhase]        = useState<Phase>("welcome");
  const [pref,         setPref]         = useState<Pref | null>(null);
  const [seqIdx,       setSeqIdx]       = useState(-1);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [showTask,     setShowTask]     = useState(false);
  const [taskFading,   setTaskFading]   = useState(false);
  const [taskNum,      setTaskNum]      = useState<1 | 2>(1);
  const [taskInput,    setTaskInput]    = useState("");
  const [currentLabel, setCurrentLabel] = useState("");
  const [responses,    setResponses]    = useState<[string, string]>(["", ""]);

  const inputRef    = useRef<HTMLInputElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);

  // ── Audio nodes (never trigger re-render) ──────────────────────────────────
  const ctxRef          = useRef<AudioContext | null>(null);
  const mainElRef       = useRef<HTMLAudioElement | null>(null);
  const whisperElRef    = useRef<HTMLAudioElement | null>(null);
  const binauralElRef   = useRef<HTMLAudioElement | null>(null);
  const mainPanRef       = useRef<StereoPannerNode | null>(null);
  const whisperGainRef   = useRef<GainNode | null>(null);
  const binauralGainRef  = useRef<GainNode | null>(null);
  const heartbeatElRef   = useRef<HTMLAudioElement | null>(null);
  const heartbeatGainRef = useRef<GainNode | null>(null);
  const panKFRef         = useRef<Array<[number, number]>>([[0, 0], [1, 0]]);
  const rafRef           = useRef<number | null>(null);

  // ── Mutable mirrors of state (for use inside event callbacks) ─────────────
  const seqIdxRef      = useRef(-1);
  const prefRef        = useRef<Pref | null>(null);
  const taskInputRef   = useRef("");
  const whisperOnRef   = useRef(false);
  const heartbeatOnRef = useRef(false);
  const seg06OnRef     = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { seqIdxRef.current    = seqIdx;    }, [seqIdx]);
  useEffect(() => { prefRef.current      = pref;      }, [pref]);
  useEffect(() => { taskInputRef.current = taskInput; }, [taskInput]);

  // ── RAF — updates panning on every animation frame ────────────────────────
  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startRaf = useCallback(() => {
    const tick = () => {
      const el  = mainElRef.current;
      const pan = mainPanRef.current;
      if (el && pan && el.duration > 0 && !isNaN(el.duration)) {
        pan.pan.value = panAt(panKFRef.current, el.currentTime / el.duration);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── Core sequence engine ───────────────────────────────────────────────────
  const advance = useCallback((fromIdx: number) => {
    const nextIdx = fromIdx + 1;

    if (nextIdx >= SEQ.length) {
      stopRaf();
      setIsPlaying(false);
      setTimeout(() => setPhase("end"), 1500);
      return;
    }

    const item = SEQ[nextIdx];
    setSeqIdx(nextIdx);
    seqIdxRef.current = nextIdx;

    // ── Segment ──────────────────────────────────────────────────────────────
    if (item.kind === "seg") {
      const el  = mainElRef.current!;
      const ctx = ctxRef.current!;

      setCurrentLabel(item.label);

      // Start whisper sublayer when seg03 begins
      if (item.key === "seg03" && !whisperOnRef.current) {
        whisperOnRef.current = true;
        const wEl = whisperElRef.current!;
        const wg  = whisperGainRef.current!;
        wEl.play().catch(() => {});
        wg.gain.cancelScheduledValues(ctx.currentTime);
        wg.gain.setValueAtTime(0, ctx.currentTime);
        wg.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 5);
      }

      // Heartbeat enters at seg04, exits at end of seg05
      if (item.key === "seg04" && !heartbeatOnRef.current) {
        heartbeatOnRef.current = true;
        const hEl = heartbeatElRef.current!;
        const hg  = heartbeatGainRef.current!;
        hEl.play().catch(() => {});
        hg.gain.cancelScheduledValues(ctx.currentTime);
        hg.gain.setValueAtTime(0, ctx.currentTime);
        hg.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 4);
      }

      if (item.key === "seg06") {
        // Heartbeat should already be gone by seg06, but ensure silence
        const hg = heartbeatGainRef.current!;
        hg.gain.cancelScheduledValues(ctx.currentTime);
        hg.gain.setValueAtTime(hg.gain.value, ctx.currentTime);
        hg.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      }

      panKFRef.current = SEG_PAN[item.key] ?? [[0, 0], [1, 0]];

      // Clear previous handlers
      el.onended    = null;
      el.oncanplay  = null;
      el.onloadedmetadata = null;

      el.src  = `/hypnosis/audio/${item.file}.mp3`;
      el.loop = false;

      // Schedule fade-outs once duration is known
      el.onloadedmetadata = () => {
        el.onloadedmetadata = null;
        const dur = el.duration;

        // Heartbeat fades out over the last 15 % of seg05
        if (item.key === "seg05") {
          const hg = heartbeatGainRef.current!;
          hg.gain.cancelScheduledValues(ctx.currentTime);
          hg.gain.setValueAtTime(hg.gain.value, ctx.currentTime);
          hg.gain.linearRampToValueAtTime(0, ctx.currentTime + dur * 0.85);
        }

        if (item.key === "seg06" && !seg06OnRef.current) {
          seg06OnRef.current = true;
          const wg = whisperGainRef.current!;
          const bg = binauralGainRef.current!;
          // Whisper out by 30 % through seg06
          wg.gain.cancelScheduledValues(ctx.currentTime);
          wg.gain.setValueAtTime(wg.gain.value, ctx.currentTime);
          wg.gain.linearRampToValueAtTime(0, ctx.currentTime + dur * 0.3);
          // Binaural out by 80 % through seg06
          bg.gain.cancelScheduledValues(ctx.currentTime);
          bg.gain.setValueAtTime(bg.gain.value, ctx.currentTime);
          bg.gain.linearRampToValueAtTime(0, ctx.currentTime + dur * 0.8);
        }
      };

      el.oncanplay = () => {
        el.oncanplay = null;
        el.play().then(() => setIsPlaying(true)).catch(() => {});
      };

      el.onended = () => {
        el.onended = null;
        setIsPlaying(false);
        advance(seqIdxRef.current);
      };

      el.load();
    }

    // ── Affirmation ───────────────────────────────────────────────────────────
    if (item.kind === "aff") {
      const el = mainElRef.current!;
      const p  = prefRef.current!;

      panKFRef.current = AFF_PAN[item.key] ?? [[0, 0], [1, 0]];

      el.onended   = null;
      el.oncanplay = null;
      el.onloadedmetadata = null;

      el.src  = affSrc(item.key, p);
      el.loop = false;

      el.oncanplay = () => {
        el.oncanplay = null;
        el.play().then(() => setIsPlaying(true)).catch(() => {});
      };

      el.onended = () => {
        el.onended = null;
        setIsPlaying(false);
        advance(seqIdxRef.current);
      };

      el.load();
    }

    // ── Typing task ───────────────────────────────────────────────────────────
    if (item.kind === "task") {
      setTaskNum(item.num);
      setShowTask(true);
      setTaskInput("");
      taskInputRef.current = "";
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [stopRaf]);

  // ── Task submission ────────────────────────────────────────────────────────
  const submitTask = useCallback(() => {
    const val  = taskInputRef.current.trim();
    if (!val) return;
    const item = SEQ[seqIdxRef.current];
    if (item?.kind !== "task") return;

    setResponses(prev => {
      const next: [string, string] = [prev[0], prev[1]];
      next[item.num - 1] = val;
      return next;
    });

    setTaskFading(true);
    setTimeout(() => {
      setShowTask(false);
      setTaskFading(false);
      setTaskInput("");
      taskInputRef.current = "";
      advance(seqIdxRef.current);
    }, 900);
  }, [advance]);

  // ── Session initialisation (triggered by button press) ────────────────────
  const startSession = useCallback(async () => {
    if (!pref) return;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // Main voice element
    const mainEl = new Audio();
    mainElRef.current = mainEl;

    // Whisper sublayer
    const whisperEl      = new Audio("/hypnosis/audio/whisper_loop.mp3");
    whisperEl.loop       = true;
    whisperElRef.current = whisperEl;

    // Binaural beat
    const binauralEl      = new Audio("/hypnosis/40hz/40hz.mp3");
    binauralEl.loop       = true;
    binauralElRef.current = binauralEl;

    // Heartbeat pulse
    const heartbeatEl      = new Audio("/hypnosis/heartbeat_loop.mp3");
    heartbeatEl.loop       = true;
    heartbeatElRef.current = heartbeatEl;

    // Wire: main → panner → gain → out
    const mainSrc  = ctx.createMediaElementSource(mainEl);
    const mainPan  = ctx.createStereoPanner();
    const mainGain = ctx.createGain();
    mainGain.gain.value = 1;
    mainSrc.connect(mainPan);
    mainPan.connect(mainGain);
    mainGain.connect(ctx.destination);
    mainPanRef.current = mainPan;

    // Wire: whisper → gain → out
    const whisperSrc  = ctx.createMediaElementSource(whisperEl);
    const whisperGain = ctx.createGain();
    whisperGain.gain.value = 0;
    whisperSrc.connect(whisperGain);
    whisperGain.connect(ctx.destination);
    whisperGainRef.current = whisperGain;

    // Wire: binaural → gain → out
    const binauralSrc  = ctx.createMediaElementSource(binauralEl);
    const binauralGain = ctx.createGain();
    binauralGain.gain.value = 0;
    binauralSrc.connect(binauralGain);
    binauralGain.connect(ctx.destination);
    binauralGainRef.current = binauralGain;

    // Wire: heartbeat → gain → out (starts silent, rises at seg04)
    const heartbeatSrc  = ctx.createMediaElementSource(heartbeatEl);
    const heartbeatGain = ctx.createGain();
    heartbeatGain.gain.value = 0;
    heartbeatSrc.connect(heartbeatGain);
    heartbeatGain.connect(ctx.destination);
    heartbeatGainRef.current = heartbeatGain;

    await ctx.resume();

    // Binaural fades in over 5 s alongside seg01
    binauralEl.play().catch(() => {});
    binauralGain.gain.setValueAtTime(0, ctx.currentTime);
    binauralGain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 5);

    startRaf();
    setPhase("session");
    advance(-1);
  }, [pref, startRaf, advance]);

  // ── Restart ────────────────────────────────────────────────────────────────
  const restartSession = useCallback(() => {
    stopRaf();
    mainElRef.current?.pause();
    whisperElRef.current?.pause();
    binauralElRef.current?.pause();
    heartbeatElRef.current?.pause();
    ctxRef.current?.close().catch(() => {});

    ctxRef.current           = null;
    mainElRef.current        = null;
    whisperElRef.current     = null;
    binauralElRef.current    = null;
    heartbeatElRef.current   = null;
    mainPanRef.current       = null;
    whisperGainRef.current   = null;
    binauralGainRef.current  = null;
    heartbeatGainRef.current = null;
    whisperOnRef.current     = false;
    heartbeatOnRef.current   = false;
    seg06OnRef.current       = false;
    seqIdxRef.current       = -1;
    prefRef.current         = null;
    taskInputRef.current    = "";

    setPhase("welcome");
    setPref(null);
    setSeqIdx(-1);
    setResponses(["", ""]);
    setIsPlaying(false);
    setShowTask(false);
    setTaskFading(false);
    setCurrentLabel("");
    setTaskInput("");
  }, [stopRaf]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopRaf();
      mainElRef.current?.pause();
      whisperElRef.current?.pause();
      binauralElRef.current?.pause();
      heartbeatElRef.current?.pause();
      ctxRef.current?.close().catch(() => {});
    };
  }, [stopRaf]);

  // ─────────────────────────────────────────────────────────────────────────────

  const overallProgress = seqIdx >= 0 ? seqIdx / (SEQ.length - 1) : 0;

  return (
    <div className="hypnosis-root">

      {/* ── Spiral video background ── */}
      <video
        ref={videoRef}
        className="hypnosis-video-bg"
        src="/spirals.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* ── Welcome ── */}
      {phase === "welcome" && (
        <div className="screen-wrapper welcome-screen">
          <h1 className="welcome-title">Princess Azraiel</h1>
          <p className="welcome-tagline">Guided Session</p>

          <p className="welcome-intro">
            Find somewhere quiet. Put on your headphones.<br />
            When you are settled, choose how you would like to be addressed,
            then enter the session.
          </p>

          <div className="disclaimer">
            This is an immersive guided audio experience created exclusively for
            Princess Azraiel&rsquo;s Patreon members. It contains hypnotic induction
            techniques and is intended for willing participants only. Two brief
            typed responses will be asked of you during the session. Nothing more
            is required. Only enter if you consent to the experience.
          </div>

          <div>
            <p className="pref-label">How would you like to be addressed?</p>
            <div className="preference-group">
              {(["goodboy", "goodgirl", "goodpuppy"] as Pref[]).map(p => (
                <button
                  key={p}
                  className={`preference-btn${pref === p ? " selected" : ""}`}
                  onClick={() => setPref(p)}
                >
                  {PREF_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          <button
            className="enter-btn"
            disabled={!pref}
            onClick={startSession}
          >
            Enter the Session
          </button>
        </div>
      )}

      {/* ── Session ── */}
      {phase === "session" && (
        <div className="screen-wrapper session-screen">
          <p className="segment-label">{currentLabel}</p>

          <div className="pulse-ring-container">
            <div className={`pulse-ring${isPlaying ? " active" : ""}`} />
            <div className={`pulse-ring${isPlaying ? " active" : ""}`} />
            <div className={`pulse-ring${isPlaying ? " active" : ""}`} />
            <div className={`pulse-core${isPlaying ? " active" : ""}`} />
          </div>

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.round(overallProgress * 100)}%` }}
            />
          </div>

          {showTask && (
            <div className={`typing-task${taskFading ? " fade-out" : ""}`}>
              <p className="typing-prompt">
                {taskNum === 1
                  ? "Type her name. Just her name. Nothing else."
                  : "Tell her one thing you’re grateful for today. Just one."}
              </p>
              <input
                ref={inputRef}
                className="typing-input"
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") submitTask(); }}
                placeholder="…"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              <p className="typing-hint">press enter when ready</p>
            </div>
          )}
        </div>
      )}

      {/* ── End ── */}
      {phase === "end" && (
        <div className="screen-wrapper end-screen">
          <h2 className="end-title">Welcome back.</h2>

          <p className="end-message">
            You did beautifully.<br />
            Take a moment before you stand.
            This session will stay with you.
          </p>

          <div className="responses-container">
            <div className="response-item">
              <label>Her name</label>
              <p>{responses[0] || "—"}</p>
            </div>
            <div className="response-item">
              <label>Your gratitude</label>
              <p>{responses[1] || "—"}</p>
            </div>
          </div>

          <p className="water-reminder">Drink some water. Take care of yourself.</p>

          <button className="restart-btn" onClick={restartSession}>
            Begin Again
          </button>
        </div>
      )}

    </div>
  );
}

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import "../hypnosis.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "welcome" | "session" | "end";

// ─── Component ────────────────────────────────────────────────────────────────

export default function PatreonHypnosis2() {
  // ── UI state ──────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("welcome");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Audio nodes ───────────────────────────────────────────────────────────
  const ctxRef          = useRef<AudioContext | null>(null);
  const mainElRef       = useRef<HTMLAudioElement | null>(null);
  const whisperElRef    = useRef<HTMLAudioElement | null>(null);
  const whisperGainRef  = useRef<GainNode | null>(null);
  const rafRef          = useRef<number | null>(null);
  const wasPlayingRef  = useRef(false);

  // Page Visibility API — pause/resume on tab switch
  useEffect(() => {
    if (phase !== "session") return;
    const handle = () => {
      const el = mainElRef.current;
      const whisperEl = whisperElRef.current;
      if (!el || !whisperEl) return;
      if (document.hidden) {
        if (!el.paused) { 
          el.pause(); 
          whisperEl.pause();
          wasPlayingRef.current = true; 
        }
      } else {
        if (wasPlayingRef.current) { 
          el.play().catch(() => {}); 
          whisperEl.play().catch(() => {});
          wasPlayingRef.current = false; 
        }
      }
    };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, [phase]);

  // RAF — continuous progress update
  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startRaf = useCallback(() => {
    const tick = () => {
      const el = mainElRef.current;
      if (el && el.duration > 0 && !isNaN(el.duration)) {
        setProgress(el.currentTime / el.duration);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Handle finishing the single session file
  const endSession = useCallback(() => {
    stopRaf();
    setIsPlaying(false);
    
    if (ctxRef.current) {
      const wg = whisperGainRef.current;
      if (wg) {
        wg.gain.cancelScheduledValues(ctxRef.current.currentTime);
        wg.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 2);
      }
    }

    setTimeout(() => {
      mainElRef.current?.pause();
      whisperElRef.current?.pause();
      setPhase("end");
    }, 2000);
  }, [stopRaf]);

  // Session init
  const startSession = useCallback(async () => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const mainEl = new Audio();
    const whisperEl = new Audio("/hypnosis/hypnosis-2/whisper_loop.mp3");
    
    whisperEl.loop = true;
    mainElRef.current = mainEl;
    whisperElRef.current = whisperEl;

    const wire = (el: HTMLAudioElement, gainVal: number) => {
      const src  = ctx.createMediaElementSource(el);
      const gain = ctx.createGain();
      gain.gain.value = gainVal;
      src.connect(gain);
      gain.connect(ctx.destination);
      return gain;
    };

    wire(mainEl, 1);
    const whisperGain = wire(whisperEl, 0);
    whisperGainRef.current = whisperGain;

    await ctx.resume();

    mainEl.src = "/hypnosis/hypnosis-2/hypno-2.mp3";
    mainEl.loop = false;

    mainEl.onloadedmetadata = () => {
      mainEl.play().then(() => {
        setIsPlaying(true);
        
        whisperEl.play().catch(() => {});
        whisperGain.gain.setValueAtTime(0, ctx.currentTime);
        // Fade the whisper in slowly over the first 10 seconds
        whisperGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 10);
      }).catch(() => {});
    };

    mainEl.onended = () => {
      endSession();
    };
    
    mainEl.load();

    startRaf();
    setPhase("session");
  }, [startRaf, endSession]);

  // Restart
  const restartSession = useCallback(() => {
    stopRaf();
    mainElRef.current?.pause();
    whisperElRef.current?.pause();
    ctxRef.current?.close().catch(() => {});

    ctxRef.current = mainElRef.current = whisperElRef.current = null;
    whisperGainRef.current = null;
    wasPlayingRef.current = false;
    setProgress(0);

    setPhase("welcome");
    setIsPlaying(false);
  }, [stopRaf]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRaf();
      mainElRef.current?.pause();
      whisperElRef.current?.pause();
      ctxRef.current?.close().catch(() => {});
    };
  }, [stopRaf]);

  return (
    <div className="hypnosis-root">

      <video
        ref={videoRef}
        className="hypnosis-video-bg"
        src="/spirals.mp4"
        autoPlay muted loop playsInline preload="auto"
        aria-hidden="true"
      />

      {phase === "welcome" && (
        <div className="screen-wrapper welcome-screen">
          <h1 className="welcome-title">Princess Azraiel</h1>
          <p className="welcome-tagline">Guided Session 2</p>

          <p className="welcome-intro">
            Find somewhere quiet. Put on your headphones.<br />
            When you are settled, enter the session.
          </p>

          <div className="disclaimer">
            This is an immersive guided audio experience created exclusively for
            Princess Azraiel&rsquo;s Patreon members. It contains hypnotic induction
            techniques and is intended for willing participants only. Only enter 
            if you consent to the experience.
          </div>

          <button className="enter-btn" onClick={startSession}>
            Enter the Session
          </button>
        </div>
      )}

      {phase === "session" && (
        <div className="screen-wrapper session-screen">

          <p className="segment-label" style={{ opacity: 1 }}>
            Deep Trance
          </p>

          <div className="pulse-ring-container">
            <div className={`pulse-ring${isPlaying ? " active" : ""}`} />
            <div className={`pulse-ring${isPlaying ? " active" : ""}`} />
            <div className={`pulse-ring${isPlaying ? " active" : ""}`} />
            <div className={`pulse-core${isPlaying ? " active" : ""}`} />
          </div>

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}

      {phase === "end" && (
        <div className="screen-wrapper end-screen">
          <h2 className="end-title">Welcome back.</h2>

          <p className="end-message">
            You did beautifully.<br />
            Take a moment before you stand.
            This session will stay with you.
          </p>

          <p className="water-reminder">Drink some water. Take care of yourself.</p>

          <a
            className="tribute-btn"
            href="https://throne.com/princessazraiel/item/1b06acfb-83ca-4694-bcc3-01aa15ca78af"
            target="_blank"
            rel="noopener noreferrer"
          >
            Send Tribute
          </a>

          <button className="restart-btn" onClick={restartSession}>
            Begin Again
          </button>
        </div>
      )}

    </div>
  );
}
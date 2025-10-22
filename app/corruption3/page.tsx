"use client";
export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";

/** =========================
 *  GLOBAL ASSET SWITCHES
 *  (change sources here)
 *  ========================= */
const ASSETS = {
  IMAGE_COUNT: 88,                                // total corrupt images available
  IMAGE_PATH_PREFIX: "/corrupt",                  // base dir for images
  SPIRAL_VIDEO_SRC: "/spirlas2.mp4",               // spiral video (unchanged)
  AMBIENT_AUDIO_SRC: "/bam_images/bam_start.mp3", // looped audio (unchanged)
};

/** =========================
 *  HALLOWEEN TUNING
 *  ========================= */
const HALLOWEEN = {
  imageOpacity: 0.68,
  videoOpacity: 0.32,
  videoBlend: "screen" as React.CSSProperties["mixBlendMode"],

  fogOpacity: 0.14,
  vignetteOpacity: 0.55,

  flickerMin: 1200,
  flickerMax: 2600,

  lightningEveryMin: 7000,
  lightningEveryMax: 15000,
  lightningDuration: 320,

  batCountDesktop: 8,
  batCountMobile: 4,

  videoPlaybackRate: 1.0,

  // Flashlight sizing (tweak to taste)
  flashlightRadiusVmin: 18,     // radius of the circular spotlight
  beamWidthVmin: 22,            // width of the elongated beam
  beamLengthVmin: 60,           // length of the elongated beam
  beamOpacity: 0.25,            // 0..1
};

// Desktop breakpoint
const DESKTOP_QUERY = "(min-width: 768px)";

// Pool + preloading
const POOL_SIZE = 28;
const PRELOAD_COUNT = 14;

// Glitch texts (+ a few spooky lines)
const GLITCH_TEXTS = [
  "SUBMIT", "CORRUPT", "💕", "OBEY", "PRINCESS", "OFFER MORE",
  "NO ESCAPE", "AZRAIEL", "GLITCHED", "💗", "LOVE YOURSELF", "CUTE",
  "SLEEP", "💞", "DEEPER", "SURRENDER", "DREAM", "RELAX", "LET GO",
  "FOCUS", "DRIFT", "FALL", "TRANCE", "💓", "YES", "EMPTY", "💖", "FOLLOW",
  "MELT", "SINK", "SOFT", "BLANK", "DOWN", "DEEP", "YOURS", "THIGHS",
  "go drink water dummy <3",
  // Halloween vibes:
  "🎃 TRICK", "🦇 TREAT", "BEWARE", "DON'T LOOK BACK", "BREATHE",
  "CANDLELIGHT", "SHADOWS", "🕸", "EMPTY HALLS", "COLD", "FROST", "THE DOOR",
  "💘",
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotVel: number;
  width: number;
  imgIdx: number;
};

export default function CorruptionRainPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const spiralVideoRef = useRef<HTMLVideoElement>(null);

  const imgElsRef = useRef<HTMLImageElement[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const targetRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.3 });

  const [flashText, setFlashText] = useState<string | null>(GLITCH_TEXTS[0]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [audioStarted, setAudioStarted] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(DESKTOP_QUERY).matches : true
  );

  // Lightning + flicker states
  const [lightning, setLightning] = useState(false);
  const [flickerOn, setFlickerOn] = useState(false);

  // Flashlight cursor (CSS variables)
  const mousePosRef = useRef<{ x: number; y: number; angle: number }>({ x: 0.5, y: 0.5, angle: 0 });

  // Responsive flag
  useEffect(() => {
    const mm = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(mm.matches);
    mm.addEventListener?.("change", onChange);
    onChange();
    return () => mm.removeEventListener?.("change", onChange);
  }, []);

  // Cycle glitch text
  useEffect(() => {
    const t = window.setTimeout(() => {
      setFlashText(null);
      setCurrentTextIndex((prev) => (prev + 1) % GLITCH_TEXTS.length);
    }, 2000);
    return () => clearTimeout(t);
  }, [currentTextIndex]);

  useEffect(() => {
    setFlashText(GLITCH_TEXTS[currentTextIndex]);
  }, [currentTextIndex]);

  // Preload small, reusable subset of images
  const [preloadedSrcs] = useState<string[]>(() => {
    const picks = new Set<number>();
    while (picks.size < PRELOAD_COUNT) {
      picks.add(Math.floor(Math.random() * ASSETS.IMAGE_COUNT) + 1);
    }
    return Array.from(picks).map((n) => `${ASSETS.IMAGE_PATH_PREFIX}/${n}.png`);
  });

  useEffect(() => {
    preloadedSrcs.forEach((src) => {
      const i = new Image();
      i.src = src;
    });
  }, [preloadedSrcs]);

  // Pointer attractor + flashlight position
  useEffect(() => {
    const onMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
      let cx: number, cy: number;
      if ("touches" in e && e.touches[0]) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else {
        const me = e as MouseEvent;
        cx = me.clientX;
        cy = me.clientY;
      }
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetRef.current = { x: cx / w, y: cy / h };

      // update flashlight CSS vars
      const root = containerRef.current;
      if (root) {
        const mx = `${(cx / w) * 100}%`;
        const my = `${(cy / h) * 100}%`;
        root.style.setProperty("--mx", mx);
        root.style.setProperty("--my", my);

        // beam angle (pointing slightly upward): derive from center to mouse
        const dx = cx - w / 2;
        const dy = cy - h / 2;
        const angle = Math.atan2(dy, dx); // radians
        mousePosRef.current = { x: cx, y: cy, angle };
        root.style.setProperty("--beam-rot", `${(angle * 180) / Math.PI - 90}deg`);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchstart", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });

    // init center
    const root = containerRef.current;
    if (root) {
      root.style.setProperty("--mx", "50%");
      root.style.setProperty("--my", "50%");
      root.style.setProperty("--beam-rot", "-90deg");
      root.style.setProperty("--flashlightR", `${HALLOWEEN.flashlightRadiusVmin}vmin`);
      root.style.setProperty("--beamW", `${HALLOWEEN.beamWidthVmin}vmin`);
      root.style.setProperty("--beamL", `${HALLOWEEN.beamLengthVmin}vmin`);
      root.style.setProperty("--beamO", `${HALLOWEEN.beamOpacity}`);
    }

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchstart", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  // Small helper for random spawn
  function spawnParticle(p: Particle, w: number, desktop: boolean) {
    const width = desktop ? 240 + Math.random() * 180 : 96 + Math.random() * 64;
    const x = Math.random() * (w - width);
    const y = -(50 + Math.random() * 200);
    const vy = desktop ? 120 + Math.random() * 220 : 90 + Math.random() * 160;
    const vx = (Math.random() - 0.5) * 40;
    const rot = Math.random() * 30 - 15;
    const rotVel = (Math.random() - 0.5) * 40; // deg/sec
    const imgIdx = Math.floor(Math.random() * PRELOAD_COUNT);

    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.rot = rot;
    p.rotVel = rotVel;
    p.width = width;
    p.imgIdx = imgIdx;
  }

  // Initialize pool once
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    particlesRef.current = new Array(POOL_SIZE).fill(0).map(() => {
      const p: Particle = { x: 0, y: 0, vx: 0, vy: 0, rot: 0, rotVel: 0, width: 120, imgIdx: 0 };
      spawnParticle(p, w, isDesktop);
      p.y = Math.random() * h;
      return p;
    });
    imgElsRef.current = new Array(POOL_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // RAF loop (physics + render)
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const gravity = 520; // px/s^2
    let windBase = 0; // slow changing wind
    let windTimer = 0;

    const step = (ts: number) => {
      if (document.hidden) {
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const last = lastTsRef.current ?? ts;
      let dt = (ts - last) / 1000;
      if (dt > 0.05) dt = 0.05;
      lastTsRef.current = ts;

      const w = window.innerWidth;
      const h = window.innerHeight;

      // evolve wind slowly
      windTimer += dt;
      if (windTimer > 0.6) {
        windTimer = 0;
        windBase = (Math.random() - 0.5) * (isDesktop ? 55 : 35);
      }

      const target = targetRef.current;
      const tx = target.x * w;
      const ty = target.y * h;

      const parts = particlesRef.current;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];

        // attraction to pointer
        const dx = tx - (p.x + p.width * 0.5);
        const dy = ty - (p.y + p.width * 0.25);
        const dist = Math.hypot(dx, dy) || 1;
        const strength = isDesktop ? 18 : 12;
        p.vx += (dx / dist) * strength * dt * 0.6;

        // wind sway
        p.vx += windBase * 0.25 * dt;

        // gravity
        p.vy += gravity * dt;

        // integrate
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.rotVel * dt;

        // recycle if off-screen
        if (p.y > h + 120 || p.x < -400 || p.x > w + 400) {
          spawnParticle(p, w, isDesktop);
        }

        // draw
        const el = imgElsRef.current[i];
        if (el) {
          el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg)`;
          el.style.width = `${p.width}px`;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isDesktop]);

  // Handle resize (nudge particles to recycle soon)
  useEffect(() => {
    const onResize = () => {
      particlesRef.current.forEach((p) => (p.y -= 20));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Start audio on first interaction
  const startAudio = async () => {
    if (audioRef.current && !audioStarted) {
      try {
        await audioRef.current.play();
        setAudioStarted(true);
      } catch {
        // autoplay blocked; hint stays visible
      }
    }
  };

  // Spiral video playback & reduced motion
  useEffect(() => {
    const v = spiralVideoRef.current;
    if (!v) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    v.playbackRate = HALLOWEEN.videoPlaybackRate;

    const tryPlay = async () => {
      try {
        if (!prefersReduced) await v.play();
      } catch {
        // ignore autoplay errors
      }
    };

    tryPlay();

    const onVisibility = () => {
      if (document.hidden) {
        v.pause();
      } else if (!prefersReduced) {
        v.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Flicker loop (candlelight vibe)
  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (!alive) return;
      const next = randInt(HALLOWEEN.flickerMin, HALLOWEEN.flickerMax);
      setFlickerOn(true);
      setTimeout(() => {
        setFlickerOn(false);
        setTimeout(loop, randInt(400, 900));
      }, randInt(120, 280));
    };
    loop();
    return () => {
      alive = false;
    };
  }, []);

  // Lightning loop (rare white flash + shake + CRT tear)
  useEffect(() => {
    let alive = true;
    const trigger = () => {
      if (!alive) return;
      setLightning(true);
      setTimeout(() => {
        setLightning(false);
        setTimeout(
          trigger,
          randInt(HALLOWEEN.lightningEveryMin, HALLOWEEN.lightningEveryMax)
        );
      }, HALLOWEEN.lightningDuration);
    };
    setTimeout(
      trigger,
      randInt(HALLOWEEN.lightningEveryMin, HALLOWEEN.lightningEveryMax)
    );
    return () => {
      alive = false;
    };
  }, []);

  const batCount = isDesktop ? HALLOWEEN.batCountDesktop : HALLOWEEN.batCountMobile;

  return (
    <div
      ref={containerRef}
      className={`min-h-screen w-full relative overflow-hidden text-pink-300 font-bold text-xl select-none halloween-root ${lightning ? "shake-and-flash crt-on" : ""} ${audioStarted ? "pulse-ambient" : ""}`}
      onClick={startAudio}
      onTouchStart={startAudio}
      role="application"
      aria-label="Corruption rain visual"
    >
      {/* Audio */}
      <audio ref={audioRef} src={ASSETS.AMBIENT_AUDIO_SRC} loop preload="auto" />

      {/* Tap hint */}
      {!audioStarted && (
        <div
          className="absolute inset-x-0 top-4 mx-auto w-fit px-4 py-2 rounded-xl"
          style={{ background: "rgba(255,105,235,0.12)", backdropFilter: "blur(6px)", zIndex: 99 }}
        >
          Tap / click to enable audio
        </div>
      )}

      {/* Subtle grain */}
      <div aria-hidden className="noise-layer pointer-events-none" />

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 0,
          background:
            `radial-gradient(120% 90% at 50% 40%, rgba(0,0,0,0) 40%, rgba(0,0,0,${HALLOWEEN.vignetteOpacity}) 100%)`,
        }}
      />

      {/* Drifting fog */}
      <div
        aria-hidden
        className="fog-layer pointer-events-none absolute inset-0"
        style={{ zIndex: 1, opacity: HALLOWEEN.fogOpacity }}
      />

      {/* Candlelight flicker aura */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${flickerOn ? "flicker-on" : "flicker-off"}`}
        style={{
          zIndex: 2,
          background:
            "radial-gradient(40% 28% at 50% 60%, rgba(255,120,40,0.18) 0%, rgba(255,120,40,0.06) 45%, rgba(0,0,0,0) 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Fixed, recycled pool of sprites */}
      {new Array(POOL_SIZE).fill(0).map((_, i) => (
        <img
          key={i}
          ref={(el) => {
            if (el) imgElsRef.current[i] = el;
          }}
          src={preloadedSrcs[i % preloadedSrcs.length]}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            willChange: "transform",
            opacity: HALLOWEEN.imageOpacity,
            filter: "drop-shadow(0 0 10px #ff7ad6)",
            pointerEvents: "none",
            zIndex: 3,
            transform: "translate3d(-9999px,-9999px,0)",
          }}
        />
      ))}

      {/* Spiral video overlay */}
      <video
        ref={spiralVideoRef}
        src={ASSETS.SPIRAL_VIDEO_SRC}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: HALLOWEEN.videoOpacity,
          mixBlendMode: HALLOWEEN.videoBlend,
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      {/* Bats */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ zIndex: 5 }}>
        {Array.from({ length: batCount }).map((_, i) => {
          const delay = Math.random() * 8;
          const duration = 8 + Math.random() * 6;
          const top = Math.random() * 70 + 5; // 5%..75%
          const scale = isDesktop ? 0.9 + Math.random() * 0.8 : 0.6 + Math.random() * 0.5;
          const flapDelay = Math.random() * 2;
          return (
            <div
              key={i}
              className="bat"
              style={
                {
                  "--delay": `${delay}s`,
                  "--duration": `${duration}s`,
                  "--top": `${top}%`,
                  "--scale": scale,
                  "--flapDelay": `${flapDelay}s`,
                } as React.CSSProperties
              }
            >
              🦇
            </div>
          );
        })}
      </div>

      {/* Glitch text */}
      {flashText && (
        <div
          className="glitch-text"
          style={{
            position: "absolute",
            top: "45vh",
            left: 0,
            width: "100%",
            textAlign: "center",
            fontSize: "10vw",
            animation: "flash 2s ease-in-out",
            color: "#ff69eb",
            opacity: 0.78,
            textShadow:
              "0 0 6px #ff69eb, 0 0 12px #ff69eb, 0 0 22px #ff69eb, 0 0 36px rgba(255,120,40,0.35)",
            pointerEvents: "none",
            zIndex: 6,
            mixBlendMode: "screen",
          }}
        >
          {flashText}
        </div>
      )}

      {/* FLASHLIGHT: dark overlay with masked spotlight + beam */}
      <div aria-hidden className="flashlight-overlay pointer-events-none" />

      {/* CRT tear + scanlines overlay (only visible during lightning) */}
      <div aria-hidden className={`crt-layer pointer-events-none ${lightning ? "crt-visible" : ""}`} />

      {/* Screen webs (subtle) */}
      <div aria-hidden className="web web-1" />
      <div aria-hidden className="web web-2" />
      <div aria-hidden className="web web-3" />

      <style>{`
        /* Base: moody backdrop */
        .halloween-root {
          background:
            radial-gradient(120% 90% at 50% 20%, rgba(16, 2, 18, 0.92) 0%, rgba(7, 0, 10, 1) 55%, #000 100%),
            linear-gradient(180deg, #050006 0%, #000 100%);
        }

        /* Subtle grain */
        .noise-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          mix-blend-mode: soft-light;
          pointer-events: none;
        }

        /* Fog layer (soft moving gradients) */
        .fog-layer::before,
        .fog-layer::after {
          content: "";
          position: absolute;
          inset: -20%;
          background:
            radial-gradient(40% 30% at 20% 30%, rgba(255,255,255,0.04) 0%, transparent 60%),
            radial-gradient(45% 35% at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 65%),
            radial-gradient(35% 30% at 60% 70%, rgba(255,255,255,0.035) 0%, transparent 60%);
          animation: fogMove 38s ease-in-out infinite alternate;
          filter: blur(22px);
        }
        .fog-layer::after {
          animation-duration: 52s;
          animation-delay: 2s;
          transform: scaleX(-1);
          opacity: 0.8;
        }

        @keyframes fogMove {
          0% { transform: translate3d(-2%, -1%, 0) scale(1.02); }
          100% { transform: translate3d(2%, 1%, 0) scale(1.05); }
        }

        /* Candle flicker toggles */
        .flicker-on { opacity: 1; transition: opacity 140ms ease; }
        .flicker-off { opacity: 0; transition: opacity 380ms ease; }

        /* Lightning + camera shake */
        .shake-and-flash::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(80% 60% at 50% 50%, rgba(255,255,255,0.65), rgba(255,255,255,0.0) 70%);
          mix-blend-mode: screen;
          animation: flashBlink ${HALLOWEEN.lightningDuration}ms ease;
          z-index: 90;
          pointer-events: none;
        }
        .shake-and-flash {
          animation: camShake 320ms cubic-bezier(.36,.07,.19,.97);
        }
        @keyframes flashBlink {
          0% { opacity: 0; }
          10% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes camShake {
          10% { transform: translate(-1px, 2px) rotate(-0.2deg); }
          20% { transform: translate(2px, -1px) rotate(0.2deg); }
          30% { transform: translate(-3px, 1px) rotate(0.1deg); }
          40% { transform: translate(3px, -2px) rotate(-0.1deg); }
          50% { transform: translate(-2px, 3px) rotate(0.15deg); }
          60% { transform: translate(2px, 1px) rotate(-0.15deg); }
          70% { transform: translate(-1px, -2px) rotate(0.1deg); }
          80% { transform: translate(1px, 2px) rotate(-0.05deg); }
          100% { transform: translate(0,0) rotate(0); }
        }

        /* Ambient heartbeat when audio is on */
        .pulse-ambient {
          animation: ambientPulse 5.5s ease-in-out infinite;
        }
        @keyframes ambientPulse {
          0% { filter: saturate(0.96) brightness(0.96); }
          4% { filter: saturate(1.12) brightness(1.06); }
          8% { filter: saturate(0.98) brightness(0.98); }
          100% { filter: saturate(0.96) brightness(0.96); }
        }

        /* Bats (emoji) flying left->right */
        .bat {
          position: absolute;
          left: -10%;
          top: var(--top);
          transform: scale(var(--scale));
          filter: drop-shadow(0 0 4px rgba(255,120,40,0.35));
          animation:
            fly var(--duration) linear var(--delay) infinite,
            flap 0.8s ease-in-out calc(var(--flapDelay)) infinite alternate;
          font-size: clamp(18px, 3vw, 36px);
          opacity: 0.9;
          user-select: none;
          z-index: 5;
        }
        @keyframes fly {
          0%   { transform: translateX(0) translateY(0) scale(var(--scale)); opacity: 0; }
          5%   { opacity: 1; }
          50%  { transform: translateX(110vw) translateY(-12px) scale(var(--scale)); }
          95%  { opacity: 1; }
          100% { transform: translateX(120vw) translateY(0) scale(var(--scale)); opacity: 0; }
        }
        @keyframes flap {
          0%   { filter: drop-shadow(0 0 4px rgba(255,120,40,0.35)) hue-rotate(0deg); transform: translateY(0) scale(var(--scale)) rotate(-3deg); }
          100% { filter: drop-shadow(0 0 6px rgba(255,120,40,0.55)) hue-rotate(-12deg); transform: translateY(-6px) scale(var(--scale)) rotate(3deg); }
        }

        /* Glitch text */
        @keyframes flash {
          0% { opacity: 0; transform: scale(0.86); filter: hue-rotate(0deg); }
          45% { opacity: 1; transform: scale(1.08); filter: hue-rotate(25deg) contrast(1.15) saturate(1.2); }
          100% { opacity: 0; transform: scale(1.35); filter: hue-rotate(0deg); }
        }
        .glitch-text {
          font-weight: 900;
          font-family: 'Arial Black', system-ui, sans-serif;
          letter-spacing: 0.012em;
        }

        /* FLASHLIGHT OVERLAY
           - darken whole scene
           - cut a circular hole at (--mx, --my)
           - add an elongated, faint beam pointing from cursor
        */
        .flashlight-overlay {
          position: absolute;
          inset: 0;
          z-index: 88;
          pointer-events: none;

          /* Base dark veil */
          background:
            radial-gradient(60vmax 60vmax at 50% 50%, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 25%, rgba(0,0,0,0.32) 70%, rgba(0,0,0,0.55) 100%);

          /* Create a "hole" and beam with mask */
          -webkit-mask:
            radial-gradient(circle var(--flashlightR) at var(--mx) var(--my), transparent 0 99%, black 100%),
            conic-gradient(from 0deg at var(--mx) var(--my), transparent 0 360deg);
          mask:
            radial-gradient(circle var(--flashlightR) at var(--mx) var(--my), transparent 0 99%, black 100%),
            conic-gradient(from 0deg at var(--mx) var(--my), transparent 0 360deg);

          /* Faint beam: we paint it with ::after to allow rotation */
        }
        .flashlight-overlay::after {
          content: "";
          position: absolute;
          left: calc(var(--mx));
          top: calc(var(--my));
          transform: translate(-50%, -50%) rotate(var(--beam-rot));
          width: var(--beamW);
          height: var(--beamL);
          background:
            radial-gradient(60% 90% at 50% 0%, rgba(255,255,255,var(--beamO)) 0%, rgba(255,255,255,0.0) 70%);
          mix-blend-mode: screen;
          filter: blur(6px);
        }

        /* CRT TEAR + SCANLINES overlay */
        .crt-layer {
          position: absolute;
          inset: 0;
          z-index: 91;
          opacity: 0;
          pointer-events: none;
        }
        .crt-visible {
          opacity: 1;
          animation: crtFlash ${HALLOWEEN.lightningDuration}ms ease both;
        }
        .crt-layer::before,
        .crt-layer::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        /* Scanlines */
        .crt-layer::before {
          background:
            repeating-linear-gradient(
              to bottom,
              rgba(255,255,255,0.04) 0px,
              rgba(255,255,255,0.04) 1px,
              rgba(0,0,0,0.00) 2px,
              rgba(0,0,0,0.00) 3px
            );
          mix-blend-mode: overlay;
          filter: contrast(1.1) saturate(1.05);
          opacity: 0.8;
          animation: crtJitter ${HALLOWEEN.lightningDuration}ms steps(2, end);
        }
        /* Vertical tear band with slight RGB misalign */
        .crt-layer::after {
          --tearX: ${Math.floor(Math.random() * 50) + 25}%;
          left: 0; right: 0; top: 0; bottom: 0;
          background:
            linear-gradient(90deg,
              rgba(255,0,80,0.0) calc(var(--tearX) - 1%),
              rgba(255,0,80,0.25) calc(var(--tearX) - 0.2%),
              rgba(0,255,200,0.25) calc(var(--tearX) + 0.2%),
              rgba(0,255,200,0.0) calc(var(--tearX) + 1%)
            );
          mix-blend-mode: screen;
          animation: tearShift ${HALLOWEEN.lightningDuration}ms ease;
          filter: blur(0.4px);
          opacity: 0.9;
        }

        @keyframes crtFlash {
          0% { opacity: 0; filter: contrast(1) saturate(1); }
          10% { opacity: 1; filter: contrast(1.12) saturate(1.08) brightness(1.02); }
          100% { opacity: 0; filter: contrast(1) saturate(1); }
        }
        @keyframes crtJitter {
          0% { transform: translateY(-0.6px); }
          50% { transform: translateY(0.6px); }
          100% { transform: translateY(0); }
        }
        @keyframes tearShift {
          0% { transform: translateX(-1px) skewX(-0.4deg); opacity: 0.9; }
          50% { transform: translateX(1px) skewX(0.6deg); opacity: 0.75; }
          100% { transform: translateX(0); opacity: 0.0; }
        }

        /* Subtle corner webs using layered gradients */
        .web {
          position: absolute;
          pointer-events: none;
          z-index: 2;
          opacity: 0.18;
          filter: drop-shadow(0 0 6px rgba(255,120,40,0.18));
          mix-blend-mode: screen;
        }
        .web-1 {
          top: 0; left: 0; width: 38vmin; height: 38vmin;
          background:
            conic-gradient(from -45deg at 100% 0%, rgba(255,120,40,0.4) 2deg, transparent 3deg 12deg, rgba(255,120,40,0.35) 13deg, transparent 14deg 22deg, rgba(255,120,40,0.25) 23deg, transparent 24deg);
          mask: radial-gradient(100% 100% at 100% 0%, #000 55%, transparent 56%);
        }
        .web-2 {
          top: 0; right: 0; width: 34vmin; height: 34vmin;
          background:
            conic-gradient(from 0deg at 0% 0%, rgba(255,120,40,0.4) 2deg, transparent 3deg 12deg, rgba(255,120,40,0.35) 13deg, transparent 14deg 22deg, rgba(255,120,40,0.25) 23deg, transparent 24deg);
          mask: radial-gradient(100% 100% at 0% 0%, #000 55%, transparent 56%);
        }
        .web-3 {
          bottom: 0; left: 0; width: 28vmin; height: 28vmin;
          background:
            conic-gradient(from 180deg at 100% 100%, rgba(255,120,40,0.4) 2deg, transparent 3deg 12deg, rgba(255,120,40,0.35) 13deg, transparent 14deg 22deg, rgba(255,120,40,0.25) 23deg, transparent 24deg);
          mask: radial-gradient(100% 100% at 100% 100%, #000 55%, transparent 56%);
        }

        @media (prefers-reduced-motion: reduce) {
          video[aria-hidden="true"] { display: none; }
          .glitch-text { animation: none; opacity: 1; }
          .bat, .fog-layer::before, .fog-layer::after { animation: none !important; }
          .pulse-ambient, .shake-and-flash, .crt-layer { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/** Utils */
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

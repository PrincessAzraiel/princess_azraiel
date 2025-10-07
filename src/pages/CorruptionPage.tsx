import { useEffect, useRef, useState } from 'react';

const IMAGE_COUNT = 88;
const GLITCH_TEXTS = [
  'SUBMIT', 'CORRUPT', 'OBEY', 'PRINCESS', 'OFFER MORE',
  'NO ESCAPE', 'AZRAIEL', 'GLITCHED', '💗'
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotVel: number;
  width: number;
  imgIdx: number;     // index into preloaded src
};

const POOL_SIZE = 28;        // number of on-screen sprites (recycled)
const PRELOAD_COUNT = 14;    // how many unique images to load & reuse
const DESKTOP_QUERY = '(min-width: 768px)';

// --- visual tuning
const IMAGE_OPACITY = 0.68;      // slightly lower so spiral pops but rain stays visible
const SPIRAL_ALPHA = 0.62;       // spiral opacity (0..1)
const SPIRAL_ARMS = 3;           // number of spiral arms (try 4 for denser)
const SPIRAL_LINE_WIDTH = 7.5;   // thicker lines
const SPIRAL_GLOW = 28;          // stronger glow

// hypno zoom (breathing)
const SPIRAL_ZOOM_AMPLITUDE = 0.18; // 0.10..0.25 feels nice
const SPIRAL_ZOOM_SPEED = 0.45;     // cycles per second

export default function CorruptionRainPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const spiralCanvasRef = useRef<HTMLCanvasElement>(null);

  const imgElsRef = useRef<HTMLImageElement[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const targetRef = useRef<{x: number; y: number}>({ x: 0.5, y: 0.3 }); // normalized (0..1), pointer attractor

  const [flashText, setFlashText] = useState<string | null>(GLITCH_TEXTS[0]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [audioStarted, setAudioStarted] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(DESKTOP_QUERY).matches : true
  );

  // --- responsive flag
  useEffect(() => {
    const mm = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(mm.matches);
    mm.addEventListener?.('change', onChange);
    onChange();
    return () => mm.removeEventListener?.('change', onChange);
  }, []);

  // --- cycle glitch text
  useEffect(() => {
    const t = window.setTimeout(() => {
      setFlashText(null);
      setCurrentTextIndex(prev => (prev + 1) % GLITCH_TEXTS.length);
    }, 2000);
    return () => clearTimeout(t);
  }, [currentTextIndex]);

  useEffect(() => {
    setFlashText(GLITCH_TEXTS[currentTextIndex]);
  }, [currentTextIndex]);

  // --- preload a small, reusable subset of images
  const [preloadedSrcs] = useState<string[]>(() => {
    const picks = new Set<number>();
    while (picks.size < PRELOAD_COUNT) {
      picks.add(Math.floor(Math.random() * IMAGE_COUNT) + 1);
    }
    return Array.from(picks).map(n => `/corrupt/${n}.png`);
  });

  useEffect(() => {
    preloadedSrcs.forEach(src => {
      const i = new Image();
      i.src = src;
    });
  }, [preloadedSrcs]);

  // --- pointer attractor (they "follow" your cursor a bit)
  useEffect(() => {
    const onMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
      let x: number;
      let y: number;

      if ('touches' in e && e.touches[0]) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        const me = e as MouseEvent;
        x = me.clientX;
        y = me.clientY;
      }
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetRef.current = { x: x / w, y: y / h };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('touchstart', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchstart', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, []);

  // --- small helper for random spawn
  function spawnParticle(p: Particle, w: number, desktop: boolean) {
    const width = desktop ? 240 + Math.random() * 180 : 96 + Math.random() * 64;
    const x = Math.random() * (w - width);
    const y = - (50 + Math.random() * 200);  // start slightly above the top
    const vy = desktop ? (120 + Math.random() * 220) : (90 + Math.random() * 160);
    const vx = (Math.random() - 0.5) * 40;   // initial tiny drift
    const rot = (Math.random() * 30 - 15);
    const rotVel = (Math.random() - 0.5) * 40; // deg/sec
    const imgIdx = Math.floor(Math.random() * PRELOAD_COUNT);

    p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.rot = rot; p.rotVel = rotVel; p.width = width; p.imgIdx = imgIdx;
  }

  // --- initialize pool once
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    particlesRef.current = new Array(POOL_SIZE).fill(0).map(() => {
      const p: Particle = { x: 0, y: 0, vx: 0, vy: 0, rot: 0, rotVel: 0, width: 120, imgIdx: 0 };
      spawnParticle(p, w, isDesktop);
      p.y = Math.random() * h; // stagger starts across height
      return p;
    });

    imgElsRef.current = new Array(POOL_SIZE);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // once

  // --- helper: size & clear spiral canvas
  const resizeCanvas = () => {
    const c = spiralCanvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.floor((c.clientWidth || window.innerWidth) * dpr);
    const ch = Math.floor((c.clientHeight || window.innerHeight) * dpr);
    if (c.width !== cw || c.height !== ch) {
      c.width = cw;
      c.height = ch;
    }
  };

  // --- draw spiral overlay (logarithmic spiral arms) with glow + breathing zoom
  function drawSpiralOverlay(ts: number) {
    const c = spiralCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    resizeCanvas();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = c.width;
    const h = c.height;

    // clear canvas with transparent background
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const minDim = Math.min(w, h);

    // logarithmic spiral params
    const a = 0.6;             // base radius factor
    const b = 0.145;           // growth factor
    const turns = 3.5;         // how many rotations to draw
    const thetaMax = turns * Math.PI * 2;

    // time & motion
    const t = ts / 1000;                       // seconds
    const rotation = t * 0.25;                 // rad/s rotation
    const zoom = 1 + SPIRAL_ZOOM_AMPLITUDE * Math.sin(t * Math.PI * 2 * SPIRAL_ZOOM_SPEED);
    const alphaPulse = 0.04 * Math.sin(t * 2.1) + SPIRAL_ALPHA; // subtle alpha wobble

    // styling
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.lineWidth = SPIRAL_LINE_WIDTH * dpr;
    ctx.shadowBlur = SPIRAL_GLOW * dpr;
    ctx.shadowColor = 'rgba(255,105,235,0.95)';

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, `rgba(255,105,235,${alphaPulse})`);
    grad.addColorStop(1, `rgba(255,182,244,${alphaPulse * 0.92})`);
    ctx.strokeStyle = grad;

    // prefers-reduced-motion: freeze rotation & zoom but keep glow
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rot = prefersReduced ? 0 : rotation;
    const zm = prefersReduced ? 1 : zoom;

    for (let arm = 0; arm < SPIRAL_ARMS; arm++) {
      const armOffset = (arm / SPIRAL_ARMS) * Math.PI * 2;
      ctx.beginPath();
      let started = false;

      for (let theta = 0; theta <= thetaMax; theta += 0.03) {
        const th = theta + rot + armOffset;
        const r = zm * (minDim * a) * Math.exp(b * theta) * 0.06;
        const x = cx + r * Math.cos(th);
        const y = cy + r * Math.sin(th);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- main RAF loop (physics + render + spiral draw)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // respect user setting

    const gravity = 520;  // px/s^2
    let windBase = 0;     // slow changing wind
    let windTimer = 0;

    const step = (ts: number) => {
      if (document.hidden) { // pause when tab hidden
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const last = lastTsRef.current ?? ts;
      let dt = (ts - last) / 1000;
      if (dt > 0.05) dt = 0.05; // clamp dt
      lastTsRef.current = ts;

      const w = window.innerWidth;
      const h = window.innerHeight;

      // evolve wind slowly
      windTimer += dt;
      if (windTimer > 0.6) {
        windTimer = 0;
        windBase = (Math.random() - 0.5) * (isDesktop ? 55 : 35); // px/s side wind
      }

      const target = targetRef.current; // normalized
      const tx = target.x * w;
      const ty = target.y * h;

      const parts = particlesRef.current;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];

        // attraction to pointer (very subtle so it "follows")
        const dx = tx - (p.x + p.width * 0.5);
        const dy = ty - (p.y + p.width * 0.25);
        const dist = Math.hypot(dx, dy) || 1;
        const strength = isDesktop ? 18 : 12; // px/s max
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

        // draw (transform only, no React re-render)
        const el = imgElsRef.current[i];
        if (el) {
          el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg)`;
          el.style.width = `${p.width}px`;
        }
      }

      // draw spiral overlay last
      drawSpiralOverlay(ts);

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isDesktop]);

  // --- handle resize (recycle off-screen soon) & canvas resize
  useEffect(() => {
    const onResize = () => {
      particlesRef.current.forEach(p => (p.y -= 20));
      resizeCanvas();
      drawSpiralOverlay(performance.now());
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // --- start audio on first interaction
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

  return (
    <div
      ref={containerRef}
      className="magic-bg min-h-screen w-full relative overflow-hidden text-pink-300 font-bold text-xl select-none"
      onClick={startAudio}
      onTouchStart={startAudio}
      role="application"
      aria-label="Corruption rain visual"
    >
      <audio ref={audioRef} src="/audio/glitch.mp3" loop preload="auto" />

      {!audioStarted && (
        <div
          className="absolute inset-x-0 top-4 mx-auto w-fit px-4 py-2 rounded-xl"
          style={{ background: 'rgba(255,105,235,0.12)', backdropFilter: 'blur(6px)', zIndex: 4 }}
        >
          Tap / click to enable audio
        </div>
      )}

      {/* Fixed, recycled pool of sprites */}
      {new Array(POOL_SIZE).fill(0).map((_, i) => (
        <img
          key={i}
          ref={el => { if (el) imgElsRef.current[i] = el; }}
          src={preloadedSrcs[i % preloadedSrcs.length]}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            willChange: 'transform',
            opacity: IMAGE_OPACITY,
            filter: 'drop-shadow(0 0 10px pink)',
            pointerEvents: 'none',
            zIndex: 1,
            transform: 'translate3d(-9999px,-9999px,0)'
          }}
        />
      ))}

      {/* Spiral overlay canvas (above images, below glitch text) */}
      <canvas
        ref={spiralCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Glitch text */}
      {flashText && (
        <div
          className="glitch-text"
          style={{
            position: 'absolute',
            top: '45vh',
            left: 0,
            width: '100%',
            textAlign: 'center',
            fontSize: '10vw',
            animation: 'flash 2s ease-in-out',
            color: '#ff69eb',
            opacity: 0.7,
            textShadow: '0 0 5px #ff69eb, 0 0 12px #ff69eb, 0 0 20px #ff69eb',
            pointerEvents: 'none',
            zIndex: 3
          }}
        >
          {flashText}
        </div>
      )}

      <style>{`
        @keyframes flash {
          0% { opacity: 0; transform: scale(0.86); filter: hue-rotate(0deg); }
          45% { opacity: 1; transform: scale(1.08); filter: hue-rotate(25deg); }
          100% { opacity: 0; transform: scale(1.35); filter: hue-rotate(0deg); }
        }
        .glitch-text {
          font-weight: 900;
          font-family: 'Arial Black', system-ui, sans-serif;
          mix-blend-mode: screen;
        }
        @media (prefers-reduced-motion: reduce) {
          .glitch-text { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

"use client";
import { useEffect, useState, useRef, useCallback } from 'react';

const IMAGE_COUNT = 88;
const GLITCH_TEXTS = [
  'SUBMIT', 'CORRUPT', 'OBEY', 'PRINCESS', 'OFFER MORE',
  'NO ESCAPE', 'AZRAIEL', 'GLITCHED', '💗'
];

type GlitchImage = {
  id: number;
  src: string;
  style: React.CSSProperties;
};

const MAX_IMAGES = 48; // cap to prevent runaway DOM/memory
const DESKTOP_QUERY = '(min-width: 768px)';

export default function CorruptionRainPage() {
  const [images, setImages] = useState<GlitchImage[]>([]);
  const [flashText, setFlashText] = useState<string | null>(GLITCH_TEXTS[0]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [audioStarted, setAudioStarted] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(() => typeof window !== 'undefined' ? window.matchMedia(DESKTOP_QUERY).matches : true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const idRef = useRef<number>(0);
  const timeoutsRef = useRef<number[]>([]);

  // Cycle the glitch text
  useEffect(() => {
    const t = window.setTimeout(() => {
      setFlashText(null);
      setCurrentTextIndex(prev => (prev + 1) % GLITCH_TEXTS.length);
    }, 2000);
    timeoutsRef.current.push(t);
    return () => clearTimeout(t);
  }, [currentTextIndex]);

  useEffect(() => {
    setFlashText(GLITCH_TEXTS[currentTextIndex]);
  }, [currentTextIndex]);

  // MatchMedia for responsive sizing that reacts to resize/rotation
  useEffect(() => {
    const mm = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(mm.matches);
    mm.addEventListener?.('change', onChange);
    onChange();
    return () => mm.removeEventListener?.('change', onChange);
  }, []);

  // Image creation loop (interval + document visibility guard)
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.hidden) return; // pause when tab not visible

      // Respect reduced motion: spawn slower
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced && Math.random() < 0.7) return;

      const id = ++idRef.current;
      const width = isDesktop ? 300 + Math.random() * 200 : 100 + Math.random() * 80;
      const top = `${Math.random() * 90}vh`;
      const left = `${Math.random() * 90}vw`;

      const newImage: GlitchImage = {
        id,
        src: `/corrupt/${Math.floor(Math.random() * IMAGE_COUNT) + 1}.png`,
        style: {
          position: 'absolute',
          top,
          left,
          width: `${width}px`,
          opacity: 0.8,
          transform: `rotate(${Math.random() * 30 - 15}deg)`,
          filter: 'drop-shadow(0 0 10px pink)',
          transition: 'opacity 1000ms ease-out',
          pointerEvents: 'none',
          zIndex: 1
        }
      };

      setImages(prev => {
        const next = [...prev, newImage];
        // enforce cap
        if (next.length > MAX_IMAGES) next.splice(0, next.length - MAX_IMAGES);
        return next;
      });

      const to = window.setTimeout(() => {
        setImages(prev => prev.filter(img => img.id !== id));
      }, 4000);
      timeoutsRef.current.push(to);
    }, 600);

    return () => clearInterval(interval);
  }, [isDesktop]);

  const startAudio = useCallback(async () => {
    if (audioRef.current && !audioStarted) {
      try {
        await audioRef.current.play();
        setAudioStarted(true);
      } catch {
        // Some browsers block; keep the hint visible
      }
    }
  }, [audioStarted]);

  // Cleanup any pending timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <div
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
          style={{ background: 'rgba(255,105,235,0.12)', backdropFilter: 'blur(6px)', zIndex: 3 }}
        >
          Tap / click to enable audio
        </div>
      )}

      {images.map(img => (
        <img
          key={img.id}
          src={img.src}
          style={img.style}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      ))}

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
            zIndex: 2
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function NotFound() {
  return (
    <div className="crt-on relative min-h-screen w-full bg-[#050306] overflow-hidden selection:bg-pink-500 selection:text-black flex flex-col items-center justify-center px-6">
      
      {/* ─── STYLE ENGINE (Techdom V4.1) ─── */}
      <style jsx global>{`
        :root {
          --bg: #050306;
          --ink: #fdf2f8;
          --pink: #ec4899;
          --pink-hot: #ff1493;
          --cyan: #00e5ff;
          --line: rgba(253, 242, 248, 0.08);
        }

        /* Background Layers */
        .bg-layer { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .bg-fill { background: var(--bg); }
        .bg-diag {
          background-image: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.018) 0, rgba(255, 255, 255, 0.018) 1px, transparent 1px, transparent 50%);
          background-size: 28px 28px;
          z-index: 1;
        }
        .bg-scan {
          background-image: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.22) 50%), linear-gradient(90deg, rgba(255, 0, 128, 0.02), rgba(0, 229, 255, 0.008), rgba(255, 105, 235, 0.02));
          background-size: 100% 3px, 3px 100%;
          z-index: 3;
          opacity: 0.7;
        }
        .bg-grain { opacity: 0.04; z-index: 2; }
        .bg-grain::after {
          content: ''; position: absolute; inset: -200%; width: 400%; height: 400%;
          background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
          animation: grainShift 0.5s steps(2) infinite;
        }

        .aurora { position: fixed; border-radius: 50%; pointer-events: none; z-index: 1; filter: blur(170px); animation: aurora 18s ease-in-out infinite; will-change: transform; }
        .aurora.a1 { top: -20%; left: -10%; width: 60vw; height: 60vw; background: rgba(134, 25, 143, 0.18); }
        .aurora.a2 { bottom: -20%; right: -10%; width: 50vw; height: 50vw; background: rgba(131, 24, 67, 0.12); animation-delay: -9s; }

        @keyframes grainShift {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-5%, -5%); }
          50% { transform: translate(-8%, 4%); }
          75% { transform: translate(4%, -8%); }
          100% { transform: translate(8%, 8%); }
        }
        @keyframes aurora {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4%, -6%) scale(1.07); }
          66% { transform: translate(-3%, 5%) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes crtFlicker { 0%, 4%, 100% { opacity: 0.98; } 2% { opacity: 0.86; } 50% { opacity: 0.94; } }
        .crt { animation: crtFlicker 6s infinite; }
        @keyframes blink { 0%, 70% { opacity: 1; } 71%, 100% { opacity: 0.2; } }
        .blink { animation: blink 1.1s infinite; }

        /* Monitor / Terminal CSS */
        .monitor {
          background: rgba(10, 4, 8, 0.78); border: 1px solid rgba(236, 72, 153, 0.25); border-radius: 10px; overflow: hidden;
          box-shadow: 0 30px 80px -20px rgba(236, 72, 153, 0.35), inset 0 0 0 1px rgba(255, 255, 255, 0.02); backdrop-filter: blur(8px); position: relative;
        }
        .monitor::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.18) 50%); background-size: 100% 3px; }

        /* Custom Glitch */
        @keyframes glitch {
          0% { text-shadow: 3px 0 var(--pink-hot), -3px 0 var(--cyan); }
          20% { text-shadow: -3px 0 var(--pink-hot), 3px 0 var(--cyan); }
          40% { text-shadow: 3px 2px var(--pink-hot), -3px -2px var(--cyan); }
          60% { text-shadow: -1px -1px var(--pink-hot), 1px 1px var(--cyan); }
          80% { text-shadow: 1px -2px var(--pink-hot), -1px 2px var(--cyan); }
          100% { text-shadow: 3px 0 var(--pink-hot), -3px 0 var(--cyan); }
        }
        .animate-glitch {
          animation: glitch 1.5s infinite;
        }
      `}</style>

      {/* ─── BG Elements ─── */}
      <div className="bg-layer bg-fill" />
      <div className="bg-layer bg-diag" />
      <div className="bg-layer bg-grain" />
      <div className="aurora a1" />
      <div className="aurora a2" />
      <div className="bg-layer bg-scan crt" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(140%_100%_at_50%_50%,transparent_55%,rgba(0,0,0,0.6)_100%)]" />

      <FloatingHearts />

      {/* ─── CONTENT ─── */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_both]">
        
        {/* Error Pill */}
        <div className="inline-flex items-center gap-2 border border-[#ff1493]/20 bg-[#ff1493]/10 backdrop-blur px-4 py-1.5 rounded-full mb-8">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1493] opacity-70" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff1493]" />
          </span>
          <span className="font-syncopate text-[8px] uppercase tracking-[0.44em] text-pink-100/70">
            System Error · Sector Null
          </span>
        </div>

        {/* Glitch Title */}
        <h1 className="font-italiana text-[5rem] sm:text-[7rem] md:text-[8rem] leading-[0.8] tracking-tight text-white mb-8 drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]">
          <span className="inline-block animate-glitch">404</span>
        </h1>

        {/* Terminal Monitor */}
        <div className="monitor w-full text-left mb-10">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-pink-500/15 font-mono text-[9px] tracking-[0.16em] text-pink-100/50 uppercase bg-black/40">
            <div className="flex gap-1.5">
              <i className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <i className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <i className="w-2 h-2 rounded-full bg-[#28c840]" />
            </div>
            <span className="flex-1 text-center">azraiel@sanctuary — err.log</span>
          </div>
          
          <div className="p-5 sm:p-6 font-mono text-[11px] sm:text-[12px] leading-[1.8] text-[#fbcfe8]">
            <div className="flex gap-2 mb-3">
              <Terminal className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-pink-500">azraiel@sanctuary:~$</span> locate target_page
              </div>
            </div>
            <div className="pl-6 space-y-1">
              <p className="text-pink-100/40"># scanning sector...</p>
              <p className="text-[#facc15]">WARNING: Target consumed by Corruption Protocol.</p>
              <p className="text-pink-100/60">
                &gt; The page you seek no longer exists in reality.
              </p>
              <p className="text-pink-100/60">
                &gt; You have wandered too far from her code.
              </p>
              <p className="mt-4">
                <span className="text-[#00e5ff]">Action Required:</span> Return to the root directory immediately.<span className="inline-block w-[7px] h-[12px] bg-pink-500 align-[-1px] ml-[3px] blink"></span>
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link 
          href="/"
          className="group inline-flex items-center gap-4 font-syncopate text-[11px] tracking-[0.3em] uppercase font-bold bg-pink-500 text-black px-8 py-4 rounded-full shadow-[0_0_32px_rgba(236,72,153,0.42)] transition-all duration-400 hover:bg-[#ff1493] hover:shadow-[0_0_44px_rgba(255,20,147,0.6)] hover:-translate-y-0.5"
        >
          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center transition-transform duration-300 group-hover:-translate-x-1">
            <ArrowLeft className="w-3.5 h-3.5 text-pink-500" />
          </div>
          Find Your Way Home
        </Link>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   FLOATING HEARTS
────────────────────────────────────────────── */
type Heart = { id: number; left: number; dur: number; delay: number; size: number; op: number; };

function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setHearts(
      Array.from({ length: 12 }).map((_, i) => ({
        id: i, left: Math.random() * 100, dur: 15 + Math.random() * 20, delay: Math.random() * 16, size: 7 + Math.random() * 15, op: 0.02 + Math.random() * 0.08,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute bottom-[-10%] text-pink-500 will-change-transform"
          style={{
            left: `${h.left}%`, width: h.size, height: h.size, opacity: h.op,
            animation: `floatUp ${h.dur}s linear ${h.delay}s infinite`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
      <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          20% { opacity: var(--tw-bg-opacity, 0.5); }
          100% { transform: translateY(-115vh) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, Send, Sparkles } from "lucide-react";

const STORAGE_KEY = "azraiel_send_total_usd_v1";
const INCREMENT = 8;

function formatUSD(n: number) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function SendPage() {
  const reduceMotion = useReducedMotion();

  const [total, setTotal] = useState<number>(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastId, setToastId] = useState(0);

  // tiny burst particles
  const [bursts, setBursts] = useState<
    { id: number; x: number; y: number; dx: number; dy: number; s: number; r: number }[]
  >([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? Number(raw) : 0;
      if (!Number.isNaN(parsed) && parsed >= 0) setTotal(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(total));
    } catch {
      // ignore
    }
  }, [total]);

  const nextTotal = useMemo(() => total + INCREMENT, [total]);

  function triggerBurst() {
    if (reduceMotion) return;

    const idBase = Date.now();
    const count = 18;
    const next = Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 90;
      return {
        id: idBase + i,
        x: 50 + (Math.random() * 8 - 4),
        y: 58 + (Math.random() * 8 - 4),
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 40,
        s: 2 + Math.random() * 3.5,
        r: Math.random() * 360,
      };
    });
    setBursts(next);

    // clear after animation
    window.setTimeout(() => setBursts([]), 900);
  }

  function onSend() {
    setTotal((t) => t + INCREMENT);

    setToastId((x) => x + 1);
    setToastOpen(true);
    triggerBurst();

    window.setTimeout(() => setToastOpen(false), reduceMotion ? 900 : 1400);
  }

  function onReset() {
    setTotal(0);
    try {
      localStorage.setItem(STORAGE_KEY, "0");
    } catch {
      // ignore
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-pink-50 selection:bg-pink-500 selection:text-black">
      {/* --- GLOBAL STYLES --- */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;600&family=Syncopate:wght@400;700&display=swap");

        .font-italiana {
          font-family: "Italiana", serif;
        }
        .font-manrope {
          font-family: "Manrope", sans-serif;
        }
        .font-syncopate {
          font-family: "Syncopate", sans-serif;
        }

        .scanlines {
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.2) 50%
          );
          background-size: 100% 4px;
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 50;
          opacity: 0.15;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 0.55;
          }
          100% {
            transform: translateY(-120vh) scale(1.2);
            opacity: 0;
          }
        }

        .animate-float {
          animation: floatUp linear infinite;
        }
      `}</style>

      {/* --- ATMOSPHERE --- */}
      <div className="scanlines" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-10 brightness-150 contrast-150" />
      <div className="fixed top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-fuchsia-900/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-pink-900/10 blur-[100px] pointer-events-none" />

      <FloatingHearts />

      {/* --- CONTENT --- */}
      <main className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 py-12 md:py-20">
        <div className="w-full max-w-xl mx-auto space-y-10">
          {/* TOP BAR */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-white/60 hover:text-pink-200 transition-colors font-manrope text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </Link>

            <div className="inline-flex items-center gap-3 border border-pink-500/30 bg-pink-500/5 px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              <span className="font-syncopate text-[9px] uppercase tracking-[0.25em] text-pink-200">
                Transfer Console
              </span>
            </div>
          </div>

          {/* TITLE */}
          <header className="text-center space-y-4">
            <h1 className="font-italiana text-4xl md:text-5xl leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-pink-900/50 drop-shadow-[0_0_30px_rgba(255,100,200,0.18)]">
              Send Protocol
            </h1>
            <p className="font-manrope text-white/55 text-sm md:text-base">
              Click. Confirm. Collect the spike.
            </p>
          </header>

          {/* PANEL */}
          <section className="relative border border-white/10 bg-white/5 backdrop-blur-md p-6 md:p-7 overflow-hidden">
            {/* subtle left rail */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500/60" />

            {/* Burst particles */}
            <div className="absolute inset-0 pointer-events-none">
              <AnimatePresence>
                {bursts.map((b) => (
                  <motion.span
                    key={b.id}
                    initial={{
                      opacity: 0.9,
                      x: `${b.x}%`,
                      y: `${b.y}%`,
                      rotate: b.r,
                      scale: 1,
                    }}
                    animate={{
                      opacity: 0,
                      x: `calc(${b.x}% + ${b.dx}px)`,
                      y: `calc(${b.y}% + ${b.dy}px)`,
                      rotate: b.r + 120,
                      scale: 0.2,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.85, ease: "easeOut" }}
                    className="absolute block rounded-sm bg-pink-400"
                    style={{ width: b.s, height: b.s }}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="space-y-6 relative z-10">
              {/* TOTAL */}
              <div className="text-center space-y-2">
                <p className="font-syncopate text-[9px] uppercase tracking-[0.35em] text-white/35">
                  Total Sent
                </p>

                <motion.div
                  key={total} // re-trigger pop per change
                  initial={reduceMotion ? false : { scale: 0.98, opacity: 0.7 }}
                  animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="font-syncopate text-3xl md:text-4xl tracking-wide text-pink-100 drop-shadow-[0_0_22px_rgba(236,72,153,0.25)]"
                >
                  {formatUSD(total)}
                </motion.div>

                <p className="font-manrope text-xs text-white/35">
                  Next click adds <span className="text-pink-200">{formatUSD(INCREMENT)}</span> (→{" "}
                  <span className="text-white/60">{formatUSD(nextTotal)}</span>)
                </p>
              </div>

              {/* SEND BUTTON */}
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={onSend}
                  className="group relative w-full max-w-sm flex items-center justify-center gap-3 px-6 py-4 border border-pink-500/30 bg-pink-950/20 hover:bg-pink-900/30 hover:border-pink-500 transition-all duration-300"
                  aria-label={`Send ${INCREMENT} dollars to Princess Azraiel`}
                >
                  {/* hover line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                  <span className="inline-flex items-center justify-center p-2 bg-pink-500 text-black">
                    <Send className="w-5 h-5" />
                  </span>
                  <span className="font-syncopate text-xs uppercase tracking-[0.28em] text-pink-100">
                    Send
                  </span>
                </button>

                {/* controls */}
                {/* <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={onReset}
                    className="px-4 py-2 font-manrope text-xs uppercase tracking-wider text-white/55 border border-white/10 bg-transparent hover:bg-white/5 transition-colors"
                    aria-label="Reset total"
                  >
                    Reset
                  </button>
                  <span className="font-manrope text-xs text-white/25">Local-only (saved in this browser)</span>
                </div> */}
              </div>

              {/* tiny lore line */}
              {/* <div className="pt-2 border-t border-white/10">
                <p className="font-manrope text-xs text-white/30">
                  Confirmation feed is simulated for clicker effect — connect this later to a real payment flow if you
                  want.
                </p>
              </div> */}
            </div>
          </section>
        </div>
      </main>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {toastOpen && (
          <motion.div
            key={toastId}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(6px)" }}
            transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: "easeOut" }}
            className="fixed left-1/2 bottom-6 -translate-x-1/2 z-[60] w-[92vw] max-w-md border border-pink-500/30 bg-[#070707]/90 backdrop-blur-md"
            role="status"
            aria-live="polite"
          >
            <div className="p-4 flex items-start gap-3">
              <div className="mt-0.5 inline-flex items-center justify-center p-2 bg-pink-500 text-black">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-manrope text-sm text-pink-50">
                  <span className="text-pink-200">{formatUSD(INCREMENT)}</span> sent to{" "}
                  <span className="font-italiana text-lg leading-none">Princess Azraiel</span> successfully.
                </p>
                <p className="font-manrope text-xs text-white/35 mt-1">
                  Total is now <span className="text-pink-200">{formatUSD(total)}</span>.
                </p>
              </div>
            </div>
            <div className="h-1 bg-pink-500/40">
              {!reduceMotion && (
                <motion.div
                  className="h-1 bg-pink-500"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 1.35, ease: "linear" }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- VISUAL EFFECTS ---

function FloatingHearts() {
  const [hearts, setHearts] = useState<
    { id: number; left: number; duration: number; delay: number; size: number; opacity: number }[]
  >([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const count = 10;
    const newHearts = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 16 + Math.random() * 18,
      delay: Math.random() * 10,
      size: 10 + Math.random() * 18,
      opacity: 0.09 + Math.random() * 0.22,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="animate-float absolute bottom-[-10%]"
          style={{
            left: `${h.left}%`,
            width: `${h.size}px`,
            height: `${h.size}px`,
            opacity: h.opacity,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-pink-500 w-full h-full drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

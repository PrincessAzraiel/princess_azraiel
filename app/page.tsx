"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Send, Bird, Globe, Gift, Coffee } from "lucide-react";

/* ──────────────────────────────────────────────
   CONFIGURATION: CENTRALIZED LINKS
────────────────────────────────────────────── */
const SITE_LINKS = {
  // Programs & Main CTA
  programs: "/programs",
  mercy: "/corruption2", 
  terms: "/contract",

  // Socials
  twitter: "https://x.com/PrincessAzraiel",
  bluesky: "https://bsky.app/profile/princess-azraiel.bsky.social",
  discord: "https://discord.gg/e3uzBK2VJS",
  throne: "https://throne.com/princessazraiel",
  kofi: "https://ko-fi.com/princessazraiel",

  // Footer Links (Sanctuary)
  apply: "/contract",
  ranks: "/programs",
  confessionals: "/programs",
  
  // Footer Links (Fine Print)
  consent: "/contract",
  dataPolicy: "/programs",
  safewords: "/programs",
  contact: "/programs",
};

/* ──────────────────────────────────────────────
   PAGE
────────────────────────────────────────────── */
export default function TechdomLandingPage() {
  // Live Ticker State
  const [ticker, setTicker] = useState({
    p: 17228,
    iv: 97.4,
    b: 118,
    d: 12,
    s: 42,
  });

  useEffect(() => {
    const t1 = setInterval(() => {
      setTicker((prev) => ({
        ...prev,
        p: prev.p + Math.floor(Math.random() * 3),
        d: 8 + Math.floor(Math.random() * 12),
        iv: Math.min(99.9, prev.iv + (Math.random() * 0.2 - 0.05)),
        b: 112 + Math.floor(Math.random() * 14),
      }));
    }, 1800);

    const t2 = setInterval(() => {
      setTicker((prev) => ({ ...prev, s: prev.s + 1 }));
    }, 9000);

    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  const formatPets = (num: number) => {
    const whole = Math.floor(num / 1000);
    const frac = (num % 1000).toString().padStart(3, "0");
    return (
      <>
        {whole},<em>{frac}</em>
      </>
    );
  };

  const formatDevotion = (val: number) => {
    const whole = Math.floor(val);
    const frac = Math.floor((val % 1) * 10);
    return (
      <>
        {whole}.<em>{frac}</em>%
      </>
    );
  };

  return (
    <div className="crt-on relative min-h-screen w-full bg-[#050306] overflow-x-hidden selection:bg-pink-500 selection:text-black">
      {/* ─── STYLE ENGINE ─── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;500;600&family=Syncopate:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg: #050306;
          --ink: #fdf2f8;
          --ink-soft: rgba(253, 242, 248, 0.42);
          --ink-faint: rgba(253, 242, 248, 0.14);
          --pink: #ec4899;
          --pink-hot: #ff1493;
          --pink-heart: #ff69eb;
          --fuchsia: #c026d3;
          --cyan: #00e5ff;
          --line: rgba(253, 242, 248, 0.08);
        }

        html, body {
          margin: 0;
          background: var(--bg);
          color: var(--ink);
          font-family: 'Manrope', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          scroll-behavior: smooth;
        }

        .italiana { font-family: 'Italiana', serif; }
        .manrope { font-family: 'Manrope', sans-serif; }
        .sync { font-family: 'Syncopate', sans-serif; }
        .mono { font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace; }

        /* ─── Background Layers ─── */
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
        @keyframes grainShift {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-5%, -5%); }
          50% { transform: translate(-8%, 4%); }
          75% { transform: translate(4%, -8%); }
          100% { transform: translate(8%, 8%); }
        }

        .aurora { position: fixed; border-radius: 50%; pointer-events: none; z-index: 1; filter: blur(170px); animation: aurora 18s ease-in-out infinite; will-change: transform; }
        .aurora.a1 { top: -30%; left: -20%; width: 70vw; height: 70vw; background: rgba(134, 25, 143, 0.18); }
        .aurora.a2 { bottom: -25%; right: -20%; width: 62vw; height: 62vw; background: rgba(131, 24, 67, 0.12); animation-delay: -9s; }
        .aurora.a3 { top: 40%; left: 40%; width: 30vw; height: 30vw; background: rgba(0, 229, 255, 0.04); animation-delay: -4s; filter: blur(140px); }
        @keyframes aurora {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4%, -6%) scale(1.07); }
          66% { transform: translate(-3%, 5%) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .vignette { position: fixed; inset: 0; pointer-events: none; z-index: 4; background: radial-gradient(140% 100% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.6) 100%); }

        /* Floating Hearts */
        .fhearts { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
        .fhearts .h { position: absolute; bottom: -8%; color: var(--pink); animation: floatUp linear infinite; will-change: transform, opacity; }
        .fhearts .h svg { width: 100%; height: 100%; fill: currentColor; }
        @keyframes floatUp { 0% { transform: translateY(0) scale(0.8); opacity: 0; } 20% { opacity: 0.5; } 100% { transform: translateY(-115vh) scale(1.2); opacity: 0; } }

        /* Entrance Animations */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fu { animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) both; will-change: transform, opacity; }
        .d0 { animation-delay: 0s; } .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.25s; } .d3 { animation-delay: 0.38s; } .d4 { animation-delay: 0.5s; } .d5 { animation-delay: 0.62s; } .d6 { animation-delay: 0.74s; }

        @keyframes wipe { from { clip-path: inset(100% 0 0 0); opacity: 0; } to { clip-path: inset(0 0 0 0); opacity: 1; } }
        .wipe { animation: wipe 1.2s cubic-bezier(0.77, 0, 0.18, 1) both; will-change: clip-path, opacity; }

        @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marqueeScroll 46s linear infinite; will-change: transform; }
        .marquee-track.rev { animation-direction: reverse; }
        .marquee-track:hover { animation-play-state: paused; }

        @keyframes breathe { 0%, 100% { border-color: rgba(236, 72, 153, 0.22); box-shadow: 0 0 0 rgba(236, 72, 153, 0); } 50% { border-color: rgba(236, 72, 153, 0.65); box-shadow: 0 0 24px rgba(236, 72, 153, 0.22); } }
        .breathe { animation: breathe 3.6s ease-in-out infinite; }

        @keyframes ping { 75%, 100% { transform: scale(2.6); opacity: 0; } }
        @keyframes blink { 0%, 70% { opacity: 1; } 71%, 100% { opacity: 0.2; } }
        .blink { animation: blink 1.1s infinite; }

        @keyframes crtFlicker { 0% { opacity: 0.98; } 2% { opacity: 0.86; } 4% { opacity: 0.98; } 50% { opacity: 0.94; } 100% { opacity: 0.98; } }
        .crt { animation: crtFlicker 6s infinite; }
        @media (min-width: 1200px) { body.crt-on { perspective: 1200px; } }

        @keyframes countPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.82; } }
        .tick { animation: countPulse 1.2s ease-in-out infinite; }

        /* ─── UI Chrome ─── */
        .sysbar {
          position: sticky; top: 0; z-index: 40; background: rgba(5, 3, 6, 0.78); backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--line); padding: 10px 22px; display: flex; gap: 22px; align-items: center;
          font-family: 'Syncopate'; font-size: 8px; letter-spacing: 0.38em; text-transform: uppercase; color: rgba(253, 242, 248, 0.3);
        }
        .sysbar .dot { position: relative; width: 6px; height: 6px; border-radius: 50%; background: #10b981; }
        .sysbar .dot::before { content: ''; position: absolute; inset: 0; background: #10b981; border-radius: 50%; opacity: 0.7; animation: ping 1.8s infinite; }
        .sysbar .sep { opacity: 0.3; }
        .sysbar .pink { color: var(--pink); }
        .sysbar .hot { color: var(--pink-hot); animation: blink 1.8s infinite; }
        .sysbar .spacer { flex: 1; }

        /* ─── Hero ─── */
        .hero { position: relative; z-index: 10; padding: 120px 40px 60px; min-height: 92vh; display: flex; flex-direction: column; justify-content: center; }
        .hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 380px); gap: 60px; align-items: end; max-width: 1500px; margin: 0 auto; width: 100%; }
        @media (max-width: 1100px) { .hero-grid { grid-template-columns: 1fr; } }

        .status-pill {
          display: inline-flex; align-items: center; gap: 10px; border: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(6px); padding: 6px 18px; border-radius: 999px; margin-bottom: 36px;
        }
        .status-pill .ping-wrap { position: relative; display: inline-flex; width: 6px; height: 6px; }
        .status-pill .ping-wrap::before { content: ''; position: absolute; inset: 0; background: #22c55e; border-radius: 50%; opacity: 0.7; animation: ping 1.8s infinite; }
        .status-pill .ping-wrap::after { content: ''; position: absolute; inset: 0; background: #22c55e; border-radius: 50%; }
        .status-pill span { font-family: 'Syncopate'; font-size: 8px; letter-spacing: 0.44em; text-transform: uppercase; color: rgba(255, 255, 255, 0.42); }

        .hero-kicker { font-family: 'Syncopate'; font-size: 10px; letter-spacing: 0.5em; text-transform: uppercase; color: var(--pink); display: flex; align-items: center; gap: 14px; margin-bottom: 36px; }
        .hero-kicker::after { content: ''; height: 1px; flex: 1; background: linear-gradient(to right, rgba(236, 72, 153, 0.6), transparent); max-width: 280px; }
        .hero-kicker b { color: var(--pink-hot); font-weight: 400; }

        .title-stack { line-height: 0.78; margin-bottom: 28px; }
        .title-stack .line { overflow: hidden; line-height: 0.78; }
        .title-stack h1 {
          font-family: 'Italiana'; margin: 0; letter-spacing: -0.015em; font-size: clamp(4rem, 15vw, 17rem); line-height: 0.78;
          color: transparent; background: linear-gradient(to bottom, #ffffff 0%, #fce7f3 40%, rgba(236, 72, 153, 0.15) 100%);
          -webkit-background-clip: text; background-clip: text;
        }
        .title-stack h1.alt { background: linear-gradient(to bottom, rgba(251, 207, 232, 0.9), rgba(219, 39, 119, 0.22)); -webkit-background-clip: text; background-clip: text; }
        .title-stack h1 .italic { font-family: 'Italiana'; font-style: italic; }

        .hero-right { padding-bottom: 10px; }
        .hero-techdom { font-family: 'Italiana'; font-size: 11px; letter-spacing: 0.58em; text-transform: uppercase; color: var(--pink); margin-bottom: 18px; display: flex; align-items: center; gap: 12px; }
        .hero-techdom .dot { width: 4px; height: 4px; background: var(--pink-hot); border-radius: 50%; box-shadow: 0 0 10px var(--pink-hot); }
        .hero-quote {
          font-family: 'Italiana'; font-style: italic; font-weight: 400; font-size: clamp(20px, 2vw, 26px); line-height: 1.35; color: #fce7f3;
          border-left: 1px solid var(--pink); padding: 4px 0 4px 20px; margin: 0 0 28px;
        }
        .hero-quote b { font-style: normal; color: var(--pink-hot); font-weight: 400; }
        .hero-meta {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px 22px; padding-top: 22px; border-top: 1px solid var(--line);
          font-family: 'Syncopate'; font-size: 8px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--ink-soft);
        }
        .hero-meta div span { display: block; color: var(--ink); font-family: 'Italiana'; font-style: italic; font-size: 16px; margin-top: 6px; letter-spacing: 0; text-transform: none; }
        .hero-meta div span.hot { color: var(--pink-hot); }

        .hero-cta { display: flex; gap: 14px; margin-top: 30px; flex-wrap: wrap; align-items: center; }
        .btn-a {
          display: inline-flex; align-items: center; gap: 14px; font-family: 'Syncopate'; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; font-weight: 700;
          background: var(--pink); color: #000; padding: 18px 26px; border-radius: 999px; box-shadow: 0 0 32px rgba(236, 72, 153, 0.42); 
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, box-shadow;
        }
        .btn-a:hover { background: var(--pink-hot); box-shadow: 0 0 44px rgba(255, 20, 147, 0.6); transform: translateY(-2px); }
        .btn-a .arrow { width: 22px; height: 22px; border-radius: 50%; background: #000; color: var(--pink); display: grid; place-items: center; font-family: ui-monospace, monospace; }
        .btn-b { 
          display: inline-flex; align-items: center; gap: 10px; font-family: 'Syncopate'; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; 
          padding: 18px 22px; border-radius: 999px; border: 1px solid var(--line); color: var(--ink-soft); 
          transition: all 0.4s ease;
        }
        .btn-b:hover { border-color: var(--pink); color: #fce7f3; background: rgba(236, 72, 153, 0.05); }

        /* Terminal Monitor */
        .monitor {
          background: rgba(10, 4, 8, 0.78); border: 1px solid rgba(236, 72, 153, 0.25); border-radius: 10px; overflow: hidden;
          box-shadow: 0 30px 80px -20px rgba(236, 72, 153, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.02); backdrop-filter: blur(8px); position: relative;
        }
        .monitor::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.18) 50%); background-size: 100% 3px; }
        .monitor .mhead { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid rgba(236, 72, 153, 0.15); font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em; color: rgba(252, 231, 243, 0.55); text-transform: uppercase; }
        .monitor .mhead .dots { display: flex; gap: 5px; } .monitor .mhead .dots i { width: 8px; height: 8px; border-radius: 50%; }
        .monitor .mhead .dots i:nth-child(1) { background: #ff5f57; } .monitor .mhead .dots i:nth-child(2) { background: #febc2e; } .monitor .mhead .dots i:nth-child(3) { background: #28c840; }
        .monitor .mhead .t { flex: 1; text-align: center; }
        .monitor .mbody { padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.75; color: #fbcfe8; }
        .monitor .mbody .c { color: rgba(252, 231, 243, 0.35); } .monitor .mbody .p { color: var(--pink-hot); } .monitor .mbody .ok { color: #22c55e; } .monitor .mbody .w { color: #facc15; } .monitor .mbody b { color: var(--cyan); font-weight: 400; }
        .monitor .mbody .cur { display: inline-block; width: 7px; height: 12px; background: var(--pink-hot); vertical-align: -1px; margin-left: 3px; animation: blink 1s infinite; }
        .monitor .mfoot { border-top: 1px solid rgba(236, 72, 153, 0.15); padding: 8px 14px; display: flex; justify-content: space-between; font-family: 'Syncopate'; font-size: 8px; letter-spacing: 0.26em; text-transform: uppercase; color: rgba(252, 231, 243, 0.38); }
        .monitor .mfoot .live { color: var(--pink-hot); display: inline-flex; align-items: center; gap: 6px; } .monitor .mfoot .live::before { content: ''; width: 5px; height: 5px; background: var(--pink-hot); border-radius: 50%; box-shadow: 0 0 8px var(--pink-hot); animation: blink 1s infinite; }

        /* Marquee */
        .marquee { position: relative; z-index: 10; overflow: hidden; border-top: 1px solid rgba(236, 72, 153, 0.12); border-bottom: 1px solid rgba(236, 72, 153, 0.12); background: rgba(80, 7, 36, 0.14); padding: 16px 0; }
        .marquee-track { display: flex; white-space: nowrap; gap: 40px; }
        .marquee-track .item { display: inline-flex; align-items: center; gap: 20px; flex-shrink: 0; }
        .marquee-track .item .t { font-family: 'Italiana'; font-style: italic; font-size: 28px; color: #fce7f3; letter-spacing: -0.01em; }
        .marquee-track .item .t.dim { color: rgba(252, 231, 243, 0.25); }
        .marquee-track .item .hh { color: var(--pink); font-size: 20px; font-family: 'Italiana'; }
        .marquee.small .t { font-family: 'Syncopate'; font-style: normal; font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(249, 168, 212, 0.32); }
        .marquee.small .hh { font-size: 10px; color: rgba(236, 72, 153, 0.35); }

        /* Bento Section */
        section.bento-sec { position: relative; z-index: 10; padding: 100px 0 60px; }
        .sec-head { max-width: 1500px; margin: 0 auto; padding: 0 40px; display: grid; grid-template-columns: auto 1fr auto; align-items: end; gap: 40px; margin-bottom: 56px; }
        .sec-head .num { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.3em; color: var(--pink); text-transform: uppercase; align-self: start; padding-top: 14px; }
        .sec-head h2 { font-family: 'Italiana'; font-size: clamp(2.6rem, 7vw, 7rem); letter-spacing: -0.02em; line-height: 0.9; margin: 0; color: #fff; text-wrap: balance; }
        .sec-head h2 em { font-style: italic; color: var(--pink); }
        .sec-head .meta { font-family: 'Syncopate'; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--ink-soft); text-align: right; align-self: start; padding-top: 14px; white-space: nowrap; }
        .sec-head .meta b { color: var(--pink-hot); font-weight: 400; }
        @media (max-width: 900px) { .sec-head { grid-template-columns: 1fr; gap: 16px; } .sec-head .meta { text-align: left; } }

        /* Responsive Grid Logic */
        .bento { max-width: 1500px; margin: 0 auto; padding: 0 40px; display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; grid-auto-rows: minmax(200px, auto); }
        
        .c-8 { grid-column: span 8; grid-row: span 2; min-height: 440px; }
        .c-12 { grid-column: span 12; min-height: 380px; }
        .c-6 { grid-column: span 6; }
        .c-4 { grid-column: span 4; }
        .c-3 { grid-column: span 3; }
        .c-tall { grid-row: span 2; min-height: 440px; }

        @media (max-width: 1100px) {
          .c-8 { grid-column: span 12; grid-row: auto; min-height: 340px; }
          .c-12 { grid-column: span 12; min-height: 300px; }
          .c-4.c-tall { grid-column: span 12; grid-row: auto; min-height: 300px; }
          .c-6, .c-4, .c-3 { grid-column: span 6; }
        }
        @media (max-width: 768px) {
          .bento { padding: 0 20px; gap: 12px; }
          .c-8, .c-12, .c-6, .c-4, .c-3, .c-tall { grid-column: span 12; grid-row: auto; min-height: 240px; }
        }

        /* Card Styling */
        .card { 
          position: relative; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; padding: 0; 
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease, background-color 0.4s ease; 
          will-change: transform;
        }
        .card:hover { transform: translateY(-5px); }
        .card .label { position: absolute; top: 18px; left: 18px; z-index: 3; font-family: 'Syncopate'; font-size: 8px; letter-spacing: 0.34em; color: rgba(253, 242, 248, 0.38); text-transform: uppercase; display: flex; gap: 10px; align-items: center; }
        .card .label .chip { background: rgba(236, 72, 153, 0.22); color: var(--pink-hot); padding: 3px 7px; border-radius: 3px; letter-spacing: 0.24em; }
        .card .label .new { background: var(--pink-hot); color: #000; animation: blink 2s infinite; letter-spacing: 0.22em; }
        .card .arrow { position: absolute; top: 18px; right: 18px; z-index: 3; width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--line); display: grid; place-items: center; transition: all 0.4s ease; }
        .card .arrow svg { width: 14px; height: 14px; stroke: rgba(253, 242, 248, 0.4); stroke-width: 1.8; fill: none; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .card:hover .arrow { border-color: var(--pink); background: rgba(236, 72, 153, 0.15); transform: scale(1.05); }
        .card:hover .arrow svg { stroke: var(--pink-hot); transform: translateX(2px) translateY(-2px); }
        .card .foot { position: relative; z-index: 3; padding: 0 24px 24px; margin-top: auto; }
        .card .foot h3 { font-family: 'Italiana'; margin: 0 0 4px; letter-spacing: -0.01em; line-height: 0.95; font-size: 2.2rem; transition: color 0.3s ease; }
        .card:hover .foot h3 { color: #fff; }
        .card .foot h3 em { font-style: italic; color: var(--pink); transition: color 0.3s ease; }
        .card:hover .foot h3 em { color: var(--pink-hot); }
        .c-6 .foot h3, .c-8 .foot h3 { font-size: 3.2rem; } 
        .c-12 .foot h3 { font-size: 3.8rem; }
        .card .foot p { font-family: 'Manrope'; font-size: 12px; color: var(--ink-soft); margin: 0; max-width: 44ch; line-height: 1.5; }
        .card .foot .meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; color: rgba(253, 242, 248, 0.3); margin-top: 10px; display: flex; gap: 14px; flex-wrap: wrap; text-transform: uppercase; }
        .card .foot .meta b { color: var(--pink-hot); font-weight: 400; }

        .card.feature { background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(10, 4, 8, 0.95) 50%, #050306 100%); border: 1px solid rgba(236, 72, 153, 0.3); }
        .card.feature:hover { border-color: rgba(236, 72, 153, 0.6); box-shadow: 0 16px 60px rgba(236, 72, 153, 0.25); }
        .card.vip { background: #070307; border: 1px solid rgba(236, 72, 153, 0.28); }
        .card.vip:hover { border-color: rgba(236, 72, 153, 0.65); box-shadow: 0 12px 48px rgba(236, 72, 153, 0.22); }
        .card.base { background: #090609; border: 1px solid var(--line); }
        .card.base:hover { border-color: rgba(236, 72, 153, 0.4); background: #0c080c; box-shadow: 0 8px 32px rgba(236, 72, 153, 0.08); }
        .card.dark { background: #030103; border: 1px solid var(--line); }
        .card.dark:hover { border-color: rgba(236, 72, 153, 0.45); box-shadow: 0 8px 32px rgba(236, 72, 153, 0.1); }
        
        .card.os-card { background: linear-gradient(135deg, rgba(255, 20, 147, 0.15) 0%, rgba(10, 4, 8, 0.95) 50%, #050306 100%); border: 1px solid rgba(255, 20, 147, 0.4); box-shadow: 0 0 40px rgba(255, 20, 147, 0.12); }
        .card.os-card:hover { border-color: #fff; box-shadow: 0 16px 80px rgba(255, 20, 147, 0.35); }

        /* Card Art */
        .art { position: absolute; inset: 0; z-index: 1; overflow: hidden; transition: transform 0.8s ease; }
        .card:hover .art { transform: scale(1.02); }
        .art-eyes { background: radial-gradient(120% 80% at 80% 30%, rgba(236, 72, 153, 0.22), transparent 60%); }
        .art-eyes svg { position: absolute; right: -40px; top: 50%; transform: translateY(-50%); width: 420px; height: 420px; opacity: 0.35; }
        .art-spiral { background: radial-gradient(70% 70% at 50% 50%, rgba(236, 72, 153, 0.14), transparent 70%); }
        .art-spiral .sp { position: absolute; right: -120px; top: -40px; width: 340px; height: 340px; border-radius: 50%; background: repeating-conic-gradient(from 0deg at 50% 50%, rgba(236, 72, 153, 0.55) 0 6deg, transparent 6deg 14deg); filter: blur(0.5px); animation: spin 14s linear infinite; opacity: 0.75; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .art-heart { background: radial-gradient(80% 70% at 70% 50%, rgba(255, 20, 147, 0.2), transparent 60%); }
        .art-heart .hh { position: absolute; right: -30px; bottom: -40px; font-family: 'Italiana'; font-style: italic; font-size: 320px; color: rgba(236, 72, 153, 0.22); line-height: 0.7; filter: drop-shadow(0 0 30px rgba(236, 72, 153, 0.3)); transition: transform 0.8s ease, color 0.4s ease; }
        .card:hover .art-heart .hh { transform: scale(1.05) rotate(-2deg); color: rgba(236, 72, 153, 0.3); }
        .art-wave { background: linear-gradient(to top, rgba(236, 72, 153, 0.08), transparent 60%); }
        .art-wave svg { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.55; }
        .art-code { background: rgba(3, 1, 3, 0.6); }
        .art-code .grid { position: absolute; inset: 20px; font-family: 'JetBrains Mono', monospace; font-size: 9px; line-height: 1.5; color: rgba(236, 72, 153, 0.22); overflow: hidden; word-break: break-all; letter-spacing: 0.05em; }
        .art-rings { background: radial-gradient(60% 60% at 50% 50%, rgba(236, 72, 153, 0.12), transparent 70%); }
        .art-rings .r { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); border: 1px solid rgba(236, 72, 153, 0.25); border-radius: 50%; transition: transform 1s ease; }
        .card:hover .art-rings .r1 { transform: translate(-50%, -50%) scale(1.1); }
        .card:hover .art-rings .r2 { transform: translate(-50%, -50%) scale(1.05) rotate(15deg); }
        .art-rings .r1 { width: 120px; height: 120px; } .art-rings .r2 { width: 220px; height: 220px; border-style: dashed; } .art-rings .r3 { width: 320px; height: 320px; opacity: 0.6; }
        .art-rings .core { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 22px; height: 22px; background: var(--pink-hot); border-radius: 50%; box-shadow: 0 0 30px var(--pink-hot); }
        .art-rings .lbl { position: absolute; left: 50%; top: 18px; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.3em; color: var(--pink); text-transform: uppercase; background: rgba(5, 3, 6, 0.7); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(236, 72, 153, 0.22); }
        .art-tile { background: linear-gradient(135deg, rgba(192, 38, 211, 0.12), transparent 70%); }
        .art-tile::before { content: ''; position: absolute; inset: 0; background-image: repeating-linear-gradient(45deg, rgba(236, 72, 153, 0.08) 0 1px, transparent 1px 22px), repeating-linear-gradient(-45deg, rgba(0, 229, 255, 0.04) 0 1px, transparent 1px 22px); }

        .art-os { background: radial-gradient(100% 100% at 80% 50%, rgba(255, 20, 147, 0.15), transparent 50%); }
        .art-os .logo { position: absolute; right: 5%; top: 50%; transform: translateY(-50%); font-family: 'Syncopate'; font-size: clamp(60px, 12vw, 180px); font-weight: 700; color: transparent; -webkit-text-stroke: 2px rgba(255, 20, 147, 0.15); letter-spacing: -0.05em; transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .card:hover .art-os .logo { -webkit-text-stroke-color: rgba(255, 20, 147, 0.4); transform: translateY(-50%) scale(1.05) rotate(-2deg); }

        .card.vip .crown { position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%); z-index: 2; font-family: 'Italiana'; font-style: italic; font-size: 200px; color: transparent; background: linear-gradient(to bottom, #ffe4f1, var(--pink)); -webkit-background-clip: text; background-clip: text; filter: drop-shadow(0 8px 30px rgba(236, 72, 153, 0.5)); line-height: 1; transition: filter 0.5s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .card.vip:hover .crown { filter: drop-shadow(0 12px 40px rgba(236, 72, 153, 0.8)); transform: translate(-50%, -52%) scale(1.03); }

        /* ─── About ─── */
        section.about { position: relative; z-index: 10; padding: 130px 40px; background: linear-gradient(to bottom, transparent, rgba(236, 72, 153, 0.03) 50%, transparent); }
        .about-grid { max-width: 1500px; margin: 0 auto; display: grid; grid-template-columns: 1.3fr 1fr; gap: 80px; align-items: center; }
        @media (max-width: 1200px) { .about-grid { grid-template-columns: 1fr; gap: 48px; } .portrait-card { max-width: 420px; margin: 0 auto; } }
        .about-eyebrow { font-family: 'Syncopate'; font-size: 10px; letter-spacing: 0.5em; color: var(--pink); text-transform: uppercase; margin-bottom: 28px; display: flex; align-items: center; gap: 14px; }
        .about-eyebrow::before { content: ''; width: 40px; height: 1px; background: var(--pink); }
        .about h2 { font-family: 'Italiana'; font-size: clamp(2.4rem, 5.5vw, 5.5rem); letter-spacing: -0.01em; line-height: 1; margin: 0 0 40px; color: #fff; text-wrap: balance; }
        .about h2 em { font-style: italic; color: var(--pink); } .about h2 u { text-decoration: underline; text-decoration-color: var(--pink-hot); text-underline-offset: 10px; text-decoration-thickness: 2px; }
        .about p.lede { font-family: 'Italiana'; font-style: italic; font-size: 22px; line-height: 1.55; color: #fce7f3; max-width: 56ch; margin: 0 0 28px; }
        .about .dropcap::first-letter { font-family: 'Italiana'; font-style: italic; font-size: 6em; color: var(--pink); float: left; line-height: 0.85; padding: 6px 14px 0 0; }
        .about p.body { font-family: 'Manrope'; font-size: 15px; line-height: 1.8; color: rgba(253, 242, 248, 0.72); max-width: 56ch; margin: 0 0 18px; }
        .about p.body b { color: var(--pink-hot); font-weight: 500; }
        .about .sign { margin-top: 36px; font-family: 'Italiana'; font-style: italic; font-size: 36px; color: var(--pink); letter-spacing: -0.01em; }

        .portrait-card { position: relative; border-radius: 14px; overflow: hidden; background: linear-gradient(135deg, rgba(80, 7, 36, 0.6), #0a0408); border: 1px solid rgba(236, 72, 153, 0.3); padding: 16px; box-shadow: 0 40px 100px -20px rgba(236, 72, 153, 0.3); transition: transform 0.6s ease; }
        .portrait-card:hover { transform: translateY(-4px); }
        .portrait-card::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.15) 50%); background-size: 100% 3px; }
        .portrait-face { aspect-ratio: 3/4; border-radius: 8px; position: relative; overflow: hidden; background: #0a0408; }
        .portrait-face .frame { position: absolute; inset: 10px; border: 1px dashed rgba(255, 255, 255, 0.25); border-radius: 4px; z-index: 2; pointer-events: none; }
        .portrait-face .scan { position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0 1px, transparent 1px 3px); mix-blend-mode: multiply; z-index: 2; pointer-events: none; }
        .portrait-card .meta { display: flex; justify-content: space-between; margin-top: 14px; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.22em; color: var(--pink); text-transform: uppercase; }
        .portrait-card .name { font-family: 'Italiana'; font-style: italic; font-size: 30px; color: #fff; margin-top: 10px; letter-spacing: -0.01em; }
        .portrait-card .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; padding-top: 12px; border-top: 1px dashed rgba(236, 72, 153, 0.3); font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.18em; color: rgba(252, 231, 243, 0.55); text-transform: uppercase; }
        .portrait-card .stats b { display: block; color: var(--pink-hot); font-family: 'Italiana'; font-style: italic; font-size: 16px; letter-spacing: 0; margin-top: 3px; font-weight: 400; text-transform: none; }
        .portrait-card .pulse { position: absolute; right: 14px; top: 14px; font-family: 'JetBrains Mono', monospace; font-size: 8px; letter-spacing: 0.26em; color: var(--pink-hot); text-transform: uppercase; background: rgba(0, 0, 0, 0.7); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(236, 72, 153, 0.4); z-index: 3; animation: blink 1.4s infinite; }

        /* ─── Live Watching ─── */
        section.watching { position: relative; z-index: 10; padding: 100px 40px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: linear-gradient(to bottom, rgba(3, 1, 3, 0.3), transparent); }
        .watching-grid { max-width: 1500px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
        @media (max-width: 1000px) { .watching-grid { grid-template-columns: 1fr; } }
        .w-card { background: rgba(10, 4, 8, 0.7); border: 1px solid rgba(236, 72, 153, 0.2); border-radius: 12px; padding: 24px; backdrop-filter: blur(10px); position: relative; overflow: hidden; transition: transform 0.4s ease, border-color 0.4s ease; }
        .w-card:hover { transform: translateY(-2px); border-color: rgba(236, 72, 153, 0.4); }
        .w-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.18) 50%); background-size: 100% 3px; pointer-events: none; }
        .w-card .h { display: flex; justify-content: space-between; align-items: center; font-family: 'Syncopate'; font-size: 8px; letter-spacing: 0.36em; color: var(--pink); text-transform: uppercase; margin-bottom: 18px; position: relative; z-index: 2; }
        .w-card .h .live { display: inline-flex; align-items: center; gap: 6px; color: var(--pink-hot); } .w-card .h .live::before { content: ''; width: 6px; height: 6px; background: var(--pink-hot); border-radius: 50%; box-shadow: 0 0 8px var(--pink-hot); animation: blink 1s infinite; }
        .w-card .big { font-family: 'Italiana'; font-size: 64px; letter-spacing: -0.02em; line-height: 1; margin: 0; color: #fff; position: relative; z-index: 2; }
        .w-card .big em { font-style: italic; color: var(--pink-hot); }
        .w-card .sub { font-family: 'Manrope'; font-size: 13px; color: var(--ink-soft); margin-top: 8px; position: relative; z-index: 2; }
        .w-card ul { list-style: none; margin: 18px 0 0; padding: 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(252, 231, 243, 0.5); position: relative; z-index: 2; }
        .w-card ul li { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px dashed rgba(236, 72, 153, 0.12); letter-spacing: 0.04em; transition: color 0.3s ease; } 
        .w-card ul li:hover { color: #fff; }
        .w-card ul li:last-child { border: 0; }
        .w-card ul li b { color: var(--pink-hot); font-weight: 400; } .w-card ul li .ok { color: #22c55e; } .w-card ul li .wa { color: #facc15; }
        .w-card .bar { height: 4px; background: rgba(236, 72, 153, 0.14); border-radius: 2px; overflow: hidden; margin-top: 8px; position: relative; z-index: 2; }
        .w-card .bar i { display: block; height: 100%; background: linear-gradient(to right, var(--pink), var(--pink-hot)); border-radius: 2px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }

        /* ─── Closer ─── */
        section.closer { position: relative; z-index: 10; padding: 140px 40px 80px; text-align: center; border-top: 1px solid rgba(236, 72, 153, 0.12); }
        .closer h2 { font-family: 'Italiana'; font-size: clamp(3rem, 10vw, 9rem); letter-spacing: -0.02em; line-height: 0.88; margin: 0 auto 32px; max-width: 1300px; color: transparent; background: linear-gradient(to bottom, #fff, #fce7f3, rgba(236, 72, 153, 0.35)); -webkit-background-clip: text; background-clip: text; text-wrap: balance; }
        .closer h2 em { font-style: italic; color: var(--pink); -webkit-text-fill-color: var(--pink); } .closer h2 u { text-decoration: underline; text-decoration-color: var(--pink-hot); text-underline-offset: 14px; text-decoration-thickness: 3px; }
        .closer .line { font-family: 'Italiana'; font-style: italic; color: rgba(252, 231, 243, 0.5); font-size: 18px; max-width: 620px; margin: 0 auto 44px; line-height: 1.5; }
        .closer .ctas { display: inline-flex; gap: 14px; flex-wrap: wrap; justify-content: center; }

        /* ─── Footer ─── */
        .footer { position: relative; z-index: 10; padding: 60px 40px 30px; border-top: 1px solid rgba(236, 72, 153, 0.1); }
        .footer-grid { max-width: 1500px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 44px; }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
        .footer-grid h4 { font-family: 'Syncopate'; font-size: 8px; letter-spacing: 0.34em; text-transform: uppercase; color: var(--pink); margin: 0 0 14px; }
        .footer-grid p { font-family: 'Italiana'; font-style: italic; font-size: 20px; line-height: 1.4; color: rgba(252, 231, 243, 0.6); max-width: 42ch; margin: 0; }
        .footer-grid ul { list-style: none; margin: 0; padding: 0; font-family: 'Manrope'; font-size: 13px; color: rgba(253, 242, 248, 0.55); line-height: 1.9; }
        .footer-grid ul li:hover { color: var(--pink-hot); }
        .footer-bottom { max-width: 1500px; margin: 60px auto 0; padding-top: 24px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; gap: 14px; flex-wrap: wrap; font-family: 'Syncopate'; font-size: 8px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(253, 242, 248, 0.28); }
        .footer-bottom .heart { color: var(--pink-hot); }

        .lnk { color: var(--ink-soft); transition: color 0.3s ease; cursor: pointer; }
        .lnk:hover { color: var(--pink-hot); }
      `}</style>

      {/* ─── BG Layers ─── */}
      <div className="bg-layer bg-fill"></div>
      <div className="bg-layer bg-diag"></div>
      <div className="bg-layer bg-grain"></div>
      <div className="aurora a1"></div>
      <div className="aurora a2"></div>
      <div className="aurora a3"></div>
      <div className="bg-layer bg-scan crt"></div>
      <div className="vignette"></div>

      <FloatingHearts />

      {/* ─── System Bar ─── */}
      <div className="sysbar">
        <span className="dot"></span>
        <span>System Online</span>
        <span className="sep">·</span>
        <span>Techdom V4.1</span>
        <span className="sep">·</span>
        <span className="pink">Online Domination</span>
        <span className="sep">·</span>
        <span className="hot">● Watching You</span>
        <span className="spacer"></span>
        <span>
          Session #<b className="tick">{ticker.s.toString().padStart(5, "0")}</b>
        </span>
        <span className="sep">·</span>
        <span>
          Pet #<b className="tick">{ticker.p.toLocaleString()}</b>
        </span>
        <span className="sep">·</span>
        <span>
          Uptime <span>1,204</span> hrs
        </span>
      </div>

      <div className="burger" aria-hidden="true">
        <span className="lines">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span className="lbl">Menu</span>
      </div>

      {/* ═══════ HERO ═══════ */}
      <header className="hero">
        <div className="hero-grid">
          <div>
            <div className="fu d0 status-pill">
              <span className="ping-wrap"></span>
              <span>System Online · V4.1 · Corruption Hub</span>
            </div>

            <div className="fu d1 hero-kicker">
              <span>Techdom · Online Domination</span>
              <span>
                V4.1 · <b>Live</b>
              </span>
            </div>

            <div className="title-stack">
              <div className="line">
                <h1 className="wipe" style={{ animationDelay: ".1s" }}>
                  Princess
                </h1>
              </div>
              <div className="line" style={{ marginTop: "6px" }}>
                <h1 className="wipe alt" style={{ animationDelay: ".28s" }}>
                  <span className="italic">Azr</span>aiel
                </h1>
              </div>
            </div>

            <div className="hero-cta fu d5">
              <Link className="btn-a" href={SITE_LINKS.programs}>
                Initiate Corruption <span className="arrow">→</span>
              </Link>
              <Link className="btn-b" href={SITE_LINKS.terms}>
                Read the Terms (you won't)
              </Link>
            </div>

            {/* Socials Row */}
            <div className="fu d6 flex items-center gap-3 mt-8">
              <SocialBtn href={SITE_LINKS.twitter} icon={<Send className="w-4 h-4" />} label="X / Twitter" />
              <SocialBtn href={SITE_LINKS.bluesky} icon={<Bird className="w-4 h-4" />} label="Bluesky" />
              <SocialBtn href={SITE_LINKS.discord} icon={<Globe className="w-4 h-4" />} label="Discord" />
              <SocialBtn href={SITE_LINKS.throne} icon={<Gift className="w-4 h-4" />} label="Throne" />
              <SocialBtn href={SITE_LINKS.kofi} icon={<Coffee className="w-4 h-4" />} label="Ko-fi" />
            </div>
          </div>

          <div className="hero-right fu d3">
            <div className="hero-techdom">
              <span className="dot"></span>
              <span>Personalized · Remote · Inescapable</span>
            </div>

            <p className="hero-quote">
              "I draw the princess.<br />
              I write the protocol.<br />
              I ship the <b>infection.</b>"
            </p>

            <div className="monitor fu d4">
              <div className="mhead">
                <div className="dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <div className="t">azraiel@sanctuary — pet.session</div>
              </div>
              <div className="mbody">
                <div>
                  <span className="c"># establishing devotion link...</span>
                </div>
                <div>
                  <span className="p">azraiel@sanctuary</span>:~$ scan --target <b>you</b>
                </div>
                <div>
                  <span className="c">
                    {"  "}↳ heartbeat <span className="ok">OK</span> ·{" "}
                    <span className="w">elevated</span>
                  </span>
                </div>
                <div>
                  <span className="c">
                    {"  "}↳ attention <span className="ok">100%</span>
                  </span>
                </div>
                <div>
                  <span className="c">
                    {"  "}↳ resistance <span className="w">7.2%</span>{" "}
                    <span className="c">(falling)</span>
                  </span>
                </div>
                <div>
                  <span className="p">azraiel@sanctuary</span>:~$ inject protocol_v4.1
                </div>
                <div>
                  <span className="c">
                    {"  "}↳ begin corruption<span className="cur"></span>
                  </span>
                </div>
              </div>
              <div className="mfoot">
                <span>Protocol V4.1</span>
                <span className="live">Live · you are being watched</span>
              </div>
            </div>

            <div className="hero-meta" style={{ marginTop: "22px" }}>
              <div>
                Last Seen<span className="hot">0.03s ago — watching</span>
              </div>
              <div>
                Devotion<span>Required</span>
              </div>
              <div>
                Your Permissions<span>Revoked · see §7</span>
              </div>
              <div>
                My Permissions<span className="hot">All of them ♡</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════ MARQUEE ═══════ */}
      <div className="marquee">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="contents">
              <span className="item">
                <span className="t">Submit.</span> <span className="hh">♡</span>{" "}
                <span className="t dim">Suffer.</span> <span className="hh">♡</span>{" "}
                <span className="t">Smile.</span>
              </span>
              <span className="item">
                <span className="hh">♡</span> <span className="t dim">Yandere Protocol</span>
              </span>
              <span className="item">
                <span className="t">You were always going to say yes.</span>
              </span>
              <span className="item">
                <span className="hh">♡</span>{" "}
                <span className="t dim">Corruption Hub V4.1</span>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════ BENTO (Configurable Links) ═══════ */}
      <section className="bento-sec">
        <div className="sec-head">
          <div className="num">§ 01 / THE ARCHIVE</div>
          <h2>
            The <em>Collection.</em> All hers. All <em>yours</em> to install.
          </h2>
          <div className="meta">
            PROGRAMS · <b>11</b>
            <br />
            SHIPPED · <b>BY HAND</b>
          </div>
        </div>

        <div className="bento">
          {/* PrincessOS Highlight */}
          <Link href="/princessos" className="card os-card c-12">
            <div className="art art-os">
              <div className="logo">OS</div>
            </div>
            <div className="label">
              <span className="chip new" style={{ background: "#fff", color: "#000" }}>NEW PLATFORM</span>
              <span>PRINCESS OS · SYSTEM OVERRIDE</span>
            </div>
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 19L19 5M9 5h10v10" />
              </svg>
            </div>
            <div className="foot">
              <h3 className="italiana">
                Princess<em>OS.</em>
              </h3>
              <p style={{ maxWidth: "60ch", fontSize: "14px" }}>
                The ultimate yandere operating system environment. A total replacement for your digital life. 
                Why just install a program when you can surrender the entire machine?
              </p>
              <div className="meta">
                <span style={{ color: "#fff" }}>TOTAL OVERRIDE</span>
                <span>·</span>
                <span>ALWAYS ON</span>
                <span>·</span>
                <span>EARLY ACCESS</span>
              </div>
            </div>
          </Link>

          {/* Infection Protocol */}
          <Link href="/infection" className="card feature c-8">
            <div className="art art-eyes">
              <svg viewBox="0 0 200 200">
                <g fill="none" stroke="#ec4899" strokeWidth="0.6">
                  <ellipse cx="100" cy="100" rx="96" ry="54" />
                  <circle cx="100" cy="100" r="32" fill="rgba(236,72,153,.15)" />
                  <circle cx="100" cy="100" r="16" fill="#ec4899" />
                  <circle cx="96" cy="96" r="5" fill="#fff" />
                </g>
              </svg>
            </div>
            <div className="label">
              <span className="chip new">FLAGSHIP</span>
              <span>INFECTION PROTOCOL · 500 LINKS · 5000 IMAGES</span>
            </div>
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 19L19 5M9 5h10v10" />
              </svg>
            </div>
            <div className="foot">
              <h3 className="italiana">
                Infection <em>Protocol.</em>
              </h3>
              <p>
                Her newest build. Five hundred clickable links. Five thousand fresh images. Open
                one and the rest open themselves — that's the promise, and the problem.
              </p>
              <div className="meta">
                <span>500 LINKS</span>
                <span>·</span>
                <span>5,000 IMAGES</span>
                <span>·</span>
                <span>
                  BUILD <b>V4.1</b>
                </span>
              </div>
            </div>
          </Link>

          {/* SweetDrain */}
          <Link href="https://gofile.io/d/ndMdxH" target="_blank" rel="noopener noreferrer" className="card vip breathe c-4 c-tall">
            <div className="art art-spiral">
              <div className="sp"></div>
            </div>
            <div className="label">
              <span className="chip">LONG</span>
              <span>SWEETDRAIN · EDGEWARE</span>
            </div>
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 19L19 5M9 5h10v10" />
              </svg>
            </div>
            <div className="crown">♡</div>
            <div className="foot">
              <h3 className="italiana">
                Sweet<em>Drain.</em>
              </h3>
              <p>A long edgeware session. Push your limits. Embrace the void.</p>
              <div className="meta">
                <span>EDGEWARE</span>
                <span>·</span>
                <span>
                  LIMITS <b>NONE</b>
                </span>
              </div>
            </div>
          </Link>

          {/* Obedience Program */}
          <Link href="https://princessazraiel.itch.io/obedienceexe-advanced" target="_blank" rel="noopener noreferrer" className="card base c-4">
            <div className="art art-rings">
              <div className="r r1"></div>
              <div className="r r2"></div>
              <div className="r r3"></div>
              <div className="core"></div>
              <div className="lbl">OBEDIENCE.EXE · ADVANCED</div>
            </div>
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 19L19 5M9 5h10v10" />
              </svg>
            </div>
            <div className="foot">
              <h3 className="italiana">
                Obedience <em>Program.</em>
              </h3>
              <p>A 20–30 minute obedience trial. JOI. Her voice, her rules, her pace.</p>
              <div className="meta">
                <span>20–30 MIN</span>
                <span>·</span>
                <span>JOI</span>
                <span>·</span>
                <span>ITCH.IO</span>
              </div>
            </div>
          </Link>

          {/* Her.exe */}
          <Link href="https://gofile.io/d/yhQrNt" target="_blank" rel="noopener noreferrer" className="card base c-4">
            <div className="art art-heart">
              <div className="hh">♡</div>
            </div>
            <div className="label">
              <span>HER.EXE · ACT 01 & 02</span>
            </div>
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 19L19 5M9 5h10v10" />
              </svg>
            </div>
            <div className="foot">
              <h3 className="italiana">
                Her<em>.exe</em>
              </h3>
              <p>
                A 3-minute interactive experience. Enter the world of Princess Azraiel —
                briefly, and never entirely leave.
              </p>
              <div className="meta">
                <span>ACT 01 + 02</span>
                <span>·</span>
                <span>3 MIN</span>
              </div>
            </div>
          </Link>

          {/* Heartbreak.exe */}
          <Link href="https://gofile.io/d/r0YYKc" target="_blank" rel="noopener noreferrer" className="card base c-4">
            <div className="art art-wave">
              <svg viewBox="0 0 400 140" preserveAspectRatio="none">
                <path
                  d="M0,70 L60,70 L80,30 L100,110 L120,70 L180,70 L200,40 L220,100 L240,70 L400,70"
                  fill="none"
                  stroke="#ff1493"
                  strokeWidth="1.4"
                />
                <path
                  d="M0,80 L400,80"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
              </svg>
            </div>
            <div className="label">
              <span>HEARTBREAK.EXE</span>
              <span className="chip">V2</span>
            </div>
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 19L19 5M9 5h10v10" />
              </svg>
            </div>
            <div className="foot">
              <h3 className="italiana">
                Heartbreak<em>.exe</em>
              </h3>
              <p>
                The new version of Love Protocol. Now with more teeth. Roughly the same
                amount of love.
              </p>
            </div>
          </Link>

          {/* Corruption (wide) */}
          <Link href="/corruption" className="card dark c-6">
            <div className="art art-code">
              <div className="grid">
                &gt; connect princessazraiel.com/corruption
                <br />
                &gt; handshake... <span style={{ color: "#ec4899" }}>OK</span>
                <br />
                &gt; begin corruption loop
                <br />
                &gt; [████████████▱▱▱▱▱▱] 68%
                <br />
                &gt; new values loaded: obedience, worship
                <br />
                &gt; old values preserved: 0
                <br />
                &gt; commit --signed-off-by "Princess Azraiel"
                <br />
                &gt; thank her ♡
              </div>
            </div>
            <div className="label">
              <span>CORRUPTION · /corruption</span>
            </div>
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 19L19 5M9 5h10v10" />
              </svg>
            </div>
            <div className="foot">
              <h3 className="italiana">
                Initiate <em>Corruption.</em>
              </h3>
              <p>
                Ready to corrupt yourself? Enter the realm of Princess Azraiel. In-browser.
                No install. No consent form &mdash; you clicked, that's the contract.
              </p>
            </div>
          </Link>

          {/* Love Protocol Beta */}
          <Link href="https://gofile.io/d/qsbdzs" target="_blank" rel="noopener noreferrer" className="card dark c-3">
            <div className="art art-heart">
              <div
                className="hh"
                style={{ fontSize: "240px", right: "-20px", bottom: "-30px" }}
              >
                ♡
              </div>
            </div>
            <div className="label">
              <span>LOVE PROTOCOL</span>
              <span className="chip">BETA</span>
            </div>
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 19L19 5M9 5h10v10" />
              </svg>
            </div>
            <div className="foot">
              <h3 className="italiana">
                Love <em>Protocol.</em>
              </h3>
              <p>A 2-minute love trial. The thrill of devotion, compressed.</p>
            </div>
          </Link>

          {/* Drone extension */}
          <Link href="https://gofile.io/d/xW6gGR" target="_blank" rel="noopener noreferrer" className="card dark c-3">
            <div className="art art-tile"></div>
            <div className="label">
              <span>DRONE · BROWSER EXT</span>
            </div>
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 19L19 5M9 5h10v10" />
              </svg>
            </div>
            <div className="foot">
              <h3 className="italiana">Drone.</h3>
              <p>
                A browser extension that lets you submit your devotion to her, every tab,
                every session.
              </p>
            </div>
          </Link>

          {/* Gacha Extension */}
          <Link href="https://gofile.io/d/Zeo7jG" target="_blank" rel="noopener noreferrer" className="card base c-4">
            <div className="art art-rings">
              <div className="r r1"></div>
              <div className="r r2"></div>
              <div
                className="core"
                style={{ background: "#facc15", boxShadow: "0 0 30px #facc15" }}
              ></div>
              <div className="lbl">GACHA POINTS</div>
            </div>
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 19L19 5M9 5h10v10" />
              </svg>
            </div>
            <div className="foot">
              <h3 className="italiana">
                Gacha <em>Extension.</em>
              </h3>
              <p>
                A browser extension. Collect Gacha Points every time you interact with her
                posts. Spend them on nothing. Keep collecting anyway.
              </p>
            </div>
          </Link>

          {/* Wallpaper Changer */}
          <Link href="https://gofile.io/d/9LZxVa" target="_blank" rel="noopener noreferrer" className="card base c-4">
            <div className="art art-tile"></div>
            <div className="label">
              <span>WALLPAPER · ANDROID APP</span>
            </div>
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 19L19 5M9 5h10v10" />
              </svg>
            </div>
            <div className="foot">
              <h3 className="italiana">
                Wallpaper <em>Changer.</em>
              </h3>
              <p>
                An Android app. Every few minutes it swaps your wallpaper for a new image of
                her. You will stop locking your phone.
              </p>
            </div>
          </Link>

          {/* Archives */}
          <Link href={SITE_LINKS.programs} className="card dark c-4">
            <div className="art art-wave">
              <svg viewBox="0 0 400 140" preserveAspectRatio="none">
                <path
                  d="M0,80 Q50,40 100,80 T200,80 T300,80 T400,80"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="1.2"
                />
                <path
                  d="M0,90 Q50,60 100,90 T200,90 T300,90 T400,90"
                  fill="none"
                  stroke="#ff1493"
                  strokeWidth="1"
                  opacity="0.55"
                />
                <path
                  d="M0,100 Q50,130 100,100 T200,100 T300,100 T400,100"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="0.8"
                  opacity="0.3"
                />
              </svg>
            </div>
            <div className="label">
              <span>§ THE ARCHIVES</span>
            </div>
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 19L19 5M9 5h10v10" />
              </svg>
            </div>
            <div className="foot">
              <h3 className="italiana">
                Access <em>All</em> Rituals.
              </h3>
              <p>Every program, every version. Read the README. Submit in order.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════ ABOUT ═══════ */}
      <section className="about">
        <div className="sec-head">
          <div className="num">§ 02 / THE PRINCESS</div>
          <h2>
            A <em>brief</em> introduction.
          </h2>
          <div className="meta">
            DOSSIER · <b>AZRAIEL</b>
          </div>
        </div>

        <div className="about-grid">
          <div>
            <div className="about-eyebrow">The Creator</div>
            <h2
              style={{
                fontSize: "clamp(2rem,4.5vw,4.5rem)",
                marginBottom: "28px",
                letterSpacing: "-.015em",
              }}
            >
              A <em>2dfd princess.</em>
              <br />
              Her own <u>techdom.</u>
            </h2>
            <p className="lede">
              Princess Azraiel is a 2dfd princess, and she doesn't outsource her obsession. She
              draws herself. She writes the protocols. She compiles the extensions. Everything
              you install has her fingerprints on it — because there was nobody else in the room.
            </p>
            <p className="body dropcap">
              She shipped <b>ten programs</b> and counting — a JOI trial, a long edgeware
              session, two browser extensions, an Android wallpaper daemon, an infection
              protocol with five hundred links, a corruption site, and a pile of short .exe
              experiences — <b>all hand-built.</b> One princess, one engineer, one yandere
              stack, and a Patreon tier tree she maintains herself between builds.
            </p>
            <p className="body">
              She does not consider herself a character. She considers herself a{" "}
              <b>developer with a crown.</b> There is a difference. She ships on her own
              schedule. You install on hers too.
            </p>
            <div className="sign">— Princess Azraiel ♡</div>
          </div>

          <div>
            <div className="portrait-card fu d3">
              <div className="pulse">● REC · V4.1</div>
              <div className="portrait-face">
                <Image
                  src="/landing/image.webp"
                  alt="Princess Azraiel"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
                <div className="frame"></div>
                <div className="scan"></div>
              </div>
              <div className="meta">
                <span>PRINCESS_AZRAIEL.EXE</span>
                <span>V4.1</span>
              </div>
              <div className="name italiana">
                Princess <em>Azraiel</em>
              </div>
              <div className="stats">
                <div>
                  STATUS<b>OBSESSED</b>
                </div>
                <div>
                  DISTANCE<b>0.0 km ♡</b>
                </div>
                <div>
                  PATIENCE<b>DEPLETED</b>
                </div>
                <div>
                  INTENT<b>PERMANENT</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ WATCHING (Live Widgets) ═══════ */}
      <section className="watching">
        <div className="sec-head">
          <div className="num">§ 03 / LIVE</div>
          <h2>
            Currently <em>watching.</em>
          </h2>
          <div className="meta">
            REFRESHES <b>EVERY 1.2s</b>
          </div>
        </div>
        <div className="watching-grid">
          <div className="w-card">
            <div className="h">
              <span>DEVOTION INDEX</span>
              <span className="live">LIVE</span>
            </div>
            <h3 className="big">{formatDevotion(ticker.iv)}</h3>
            <p className="sub">
              Your resistance is <b style={{ color: "var(--pink-hot)" }}>decaying</b> faster
              than projected.
            </p>
            <div className="bar">
              <i style={{ width: `${ticker.iv}%` }}></i>
            </div>
            <ul>
              <li>
                Heart rate <b>{ticker.b} bpm</b>
              </li>
              <li>
                Scroll velocity <b>slowing</b>
              </li>
              <li>
                Blink rate <span className="wa">↓ 32%</span>
              </li>
              <li>
                Lip tension <b>unconscious smile</b>
              </li>
            </ul>
          </div>
          <div className="w-card">
            <div className="h">
              <span>PETS ONLINE</span>
              <span className="live">LIVE</span>
            </div>
            <h3 className="big tick">{formatPets(ticker.p)}</h3>
            <p className="sub">
              +<b>{ticker.d}</b> joined in the last minute. None are leaving.
            </p>
            <ul>
              <li>
                Corruption Hub <span className="ok">OK · 8,412</span>
              </li>
              <li>
                Deep Trance <span className="ok">OK · 3,204</span>
              </li>
              <li>
                Rebrand <span className="wa">queue · 312</span>
              </li>
              <li>
                Sanctuary <span className="ok">OK · 1,204</span>
              </li>
              <li>
                Lost to reality <b>0</b>
              </li>
            </ul>
          </div>
          <div className="w-card">
            <div className="h">
              <span>RECENT ACTIVITY</span>
              <span className="live">FEED</span>
            </div>
            <ul style={{ marginTop: 0 }}>
              <li>
                <b>pet_0921</b> <span>rebranded</span>
              </li>
              <li>
                <b>pet_2218</b> <span>initiated trance</span>
              </li>
              <li>
                <b>pet_0004</b> <span>completed ch. 9</span>
              </li>
              <li>
                <b>pet_7712</b> <span>requested mercy</span> <span className="wa">denied</span>
              </li>
              <li>
                <b>pet_4421</b> <span>said her name aloud</span>
              </li>
              <li>
                <b>pet_1189</b> <span>closed eyes</span>
              </li>
              <li>
                <b>pet_0042</b> <span>arrived</span> <span className="ok">♡</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════ SMALL MARQUEE ═══════ */}
      <div className="marquee small">
        <div className="marquee-track rev">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="contents">
              <span className="item">
                <span className="t">Corruption Hub</span>
                <span className="hh">♡</span>
              </span>
              <span className="item">
                <span className="t">Yandere Protocol</span>
                <span className="hh">♡</span>
              </span>
              <span className="item">
                <span className="t">Infection Protocol</span>
                <span className="hh">♡</span>
              </span>
              <span className="item">
                <span className="t">Profile Rebrand</span>
                <span className="hh">♡</span>
              </span>
              <span className="item">
                <span className="t">The Sanctuary</span>
                <span className="hh">♡</span>
              </span>
              <span className="item">
                <span className="t">Deep Trance</span>
                <span className="hh">♡</span>
              </span>
              <span className="item">
                <span className="t">V4.1 Online</span>
                <span className="hh">♡</span>
              </span>
              <span className="item">
                <span className="t">Submit Suffer Smile</span>
                <span className="hh">♡</span>
              </span>
              <span className="item">
                <span className="t">Digital Devotion</span>
                <span className="hh">♡</span>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════ CLOSER ═══════ */}
      <section className="closer">
        <h2>
          Stop <em>resisting.</em>
          <br />
          You were <u>always</u> going to say yes.
        </h2>
        <p className="line">
          Online domination, remote administration, and softly-lit psychological
          reconstruction — operated personally by Princess Azraiel since forever.
        </p>
        <div className="ctas">
          <Link className="btn-a" href="/infection">
            Begin Infection <span className="arrow">→</span>
          </Link>
          <Link className="btn-b" href={SITE_LINKS.mercy}>
            Request Mercy (denied)
          </Link>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h4>Techdom // 2dfd</h4>
            <p>
              Online domination, remote administration, and softly-lit psychological
              reconstruction — operated personally by Princess Azraiel since forever.
            </p>
          </div>
          <div>
            <h4>Protocols</h4>
            <ul>
              <li className="lnk">
                <Link href="https://discord.gg/j6pCbYRJJ5" target="_blank" rel="noopener noreferrer">
                  Corruption Hub
                </Link>
              </li>
              <li className="lnk">
                <Link href="/programs">Yandere Stack</Link>
              </li>
              <li className="lnk">
                <Link href="/infection">Infection V4.1</Link>
              </li>
              <li className="lnk">
                <Link href="/corruption2">Deep Trance</Link>
              </li>
              <li className="lnk">
                <Link href="/rebrand">Rebrand</Link>
              </li>
              <li className="lnk">
                <Link href="/womensday">Women's Day Event</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Sanctuary</h4>
            <ul>
              <li className="lnk">
                <Link href={SITE_LINKS.apply}>Apply</Link>
              </li>
              <li className="lnk">
                <Link href={SITE_LINKS.ranks}>Ranks</Link>
              </li>
              <li className="lnk">
                <Link href={SITE_LINKS.confessionals}>Confessionals</Link>
              </li>
              <li className="lnk">
                <Link href={SITE_LINKS.programs}>Archives</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Fine Print</h4>
            <ul>
              <li className="lnk">
                <Link href={SITE_LINKS.consent}>Consent is sacred</Link>
              </li>
              <li className="lnk">
                <Link href={SITE_LINKS.dataPolicy}>Your data is not</Link>
              </li>
              <li className="lnk">
                <Link href={SITE_LINKS.safewords}>Safewords (advisory)</Link>
              </li>
              <li className="lnk">
                <Link href={SITE_LINKS.contact}>Contact (don't)</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 26XX Techdom · Princess Azraiel</span>
          <span>
            <span className="heart">♡</span> you are being watched · yes, right now · hi
          </span>
          <span>V4.1 · Build 0420</span>
        </div>
      </footer>
    </div>
  );
}

/* ──────────────────────────────────────────────
   SOCIAL BUTTON COMPONENT
────────────────────────────────────────────── */
function SocialBtn({ href, icon, label }: { href: string; icon: React.ReactNode; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
      className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-pink-500/50 hover:bg-pink-500/10 hover:shadow-[0_0_16px_rgba(236,72,153,0.2)] transition-all duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 bg-pink-500/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative z-10 text-white/40 group-hover:text-pink-300 group-hover:scale-110 transition-all duration-500">
        {icon}
      </span>
    </a>
  );
}

/* ──────────────────────────────────────────────
   FLOATING HEARTS COMPONENT
────────────────────────────────────────────── */
type Heart = {
  id: number;
  left: number;
  dur: number;
  delay: number;
  size: number;
  op: number;
};

function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    setHearts(
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        dur: 15 + Math.random() * 20,
        delay: Math.random() * 16,
        size: 7 + Math.random() * 20,
        op: 0.03 + Math.random() * 0.1,
      }))
    );
  }, []);

  return (
    <div className="fhearts" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="h"
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            opacity: h.op,
            animationDuration: `${h.dur}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
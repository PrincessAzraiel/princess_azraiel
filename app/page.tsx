"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles, Coffee, Gift, Bird, Send,
  Users, Wand2, ArrowRight, Globe,
  Eye, Crown, Heart,
} from "lucide-react";

const MARQUEE = [
  "Corruption Hub", "Yandere Protocol", "Infection Protocol",
  "Profile Rebrand", "The Sanctuary", "Deep Trance",
  "V4.1 Online", "Submit Suffer Smile", "Digital Devotion",
];

/* ──────────────────────────────────────────────
   PAGE
────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#060606] text-pink-50 selection:bg-pink-500 selection:text-black">

      {/* ─── STYLE ENGINE ─── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;500;600&family=Syncopate:wght@400;700&display=swap');
        .font-italiana  { font-family: 'Italiana', serif; }
        .font-manrope   { font-family: 'Manrope', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }

        /* diagonal grid background */
        .diag-grid {
          background-image: repeating-linear-gradient(
            -45deg,
            rgba(255,255,255,0.016) 0,
            rgba(255,255,255,0.016) 1px,
            transparent 0, transparent 50%
          );
          background-size: 32px 32px;
        }

        /* CSS grain — no external URL */
        .grain::after {
          content: '';
          position: fixed;
          inset: -200%;
          width: 400%; height: 400%;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
          animation: grainShift 0.5s steps(2) infinite;
          z-index: 5;
        }
        @keyframes grainShift {
          0%  { transform: translate(0,0); }
          25% { transform: translate(-5%,-5%); }
          50% { transform: translate(-8%,4%); }
          75% { transform: translate(4%,-8%); }
          100%{ transform: translate(8%,8%); }
        }

        /* aurora blobs */
        @keyframes aurora {
          0%   { transform: translate(0%,0%)   scale(1); }
          33%  { transform: translate(4%,-6%)  scale(1.07); }
          66%  { transform: translate(-3%,5%)  scale(0.95); }
          100% { transform: translate(0%,0%)   scale(1); }
        }
        .animate-aurora { animation: aurora 18s ease-in-out infinite; }

        /* entrance animations */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fu   { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) both; }
        .d0   { animation-delay: 0s; }
        .d1   { animation-delay: 0.12s; }
        .d2   { animation-delay: 0.25s; }
        .d3   { animation-delay: 0.38s; }
        .d4   { animation-delay: 0.50s; }
        .d5   { animation-delay: 0.62s; }
        .d6   { animation-delay: 0.73s; }
        .d7   { animation-delay: 0.82s; }

        /* title clip wipe */
        @keyframes wipe {
          from { clip-path: inset(100% 0 0 0); opacity:0; }
          to   { clip-path: inset(0% 0 0 0);   opacity:1; }
        }
        .title-wipe { animation: wipe 1s cubic-bezier(.77,0,.18,1) both; }

        /* marquee scroll */
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marqueeScroll 36s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover { animation-play-state: paused; }

        /* floating hearts */
        @keyframes floatUp {
          0%   { transform:translateY(0) scale(0.8); opacity:0; }
          20%  { opacity:0.5; }
          100% { transform:translateY(-115vh) scale(1.2); opacity:0; }
        }
        .float-up { animation: floatUp linear infinite; }

        /* card shimmer */
        @keyframes shimmer {
          from { transform: translateX(-160%) skewX(-14deg); }
          to   { transform: translateX(380%)  skewX(-14deg); }
        }

        /* VIP card breathing border */
        @keyframes breathe {
          0%,100% { border-color:rgba(236,72,153,0.22); box-shadow:0 0 0 rgba(236,72,153,0); }
          50%     { border-color:rgba(236,72,153,0.65); box-shadow:0 0 22px rgba(236,72,153,0.18); }
        }
        .breathe-border { animation: breathe 3.5s ease-in-out infinite; }

        /* bento card hover lift */
        .bc {
          transition: transform 0.4s cubic-bezier(.16,1,.3,1),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease,
                      background-color 0.3s ease;
        }
        .bc:hover { transform: translateY(-3px) scale(1.008); }
        .bc.wide:hover { transform: translateY(-2px) scale(1.003); }
      `}</style>

      {/* ─── BACKGROUND ─── */}
      <div className="fixed inset-0 bg-[#060606]" />
      <div className="fixed inset-0 diag-grid pointer-events-none z-0" />
      <div className="grain fixed inset-0 pointer-events-none z-0" />
      <div className="animate-aurora fixed top-[-30%] left-[-20%] w-[70vw] h-[70vw] rounded-full bg-fuchsia-900/16 blur-[170px] pointer-events-none z-0" />
      <div className="animate-aurora fixed bottom-[-25%] right-[-20%] w-[62vw] h-[62vw] rounded-full bg-pink-900/10 blur-[160px] pointer-events-none z-0" style={{ animationDelay: "-9s" }} />
      <div className="animate-aurora fixed top-[40%] left-[40%] w-[30vw] h-[30vw] rounded-full bg-rose-800/6 blur-[120px] pointer-events-none z-0" style={{ animationDelay: "-4s" }} />

      <FloatingHearts />

      {/* ══════════════════════════════════════════
          HERO HEADER — centered editorial
      ══════════════════════════════════════════ */}
      <header className="relative z-20 flex flex-col items-center text-center pt-24 pb-10 px-6">

        {/* Status pill */}
        <div className="fu d0 flex items-center gap-2.5 border border-white/[0.07] bg-white/[0.02] backdrop-blur px-4 py-1.5 rounded-full mb-10">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-70" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
          </span>
          <span className="font-syncopate text-[7.5px] uppercase tracking-[0.42em] text-white/32">
            System Online · V4.1 · Corruption Hub
          </span>
        </div>

        {/* Giant name — clip-wipe reveal */}
        <div className="overflow-hidden leading-none mb-0.5">
          <h1 className="title-wipe d1 font-italiana tracking-tight text-[4.2rem] sm:text-[5.8rem] md:text-[8rem] lg:text-[10.5rem] xl:text-[13rem] leading-[0.83] text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100/95 to-pink-100/10">
            Princess
          </h1>
        </div>
        <div className="overflow-hidden leading-none mb-9">
          <h1 className="title-wipe d2 font-italiana tracking-tight text-[4.2rem] sm:text-[5.8rem] md:text-[8rem] lg:text-[10.5rem] xl:text-[13rem] leading-[0.83] text-transparent bg-clip-text bg-gradient-to-b from-pink-200/85 to-pink-600/20">
            Azraiel
          </h1>
        </div>

        {/* Ornamental divider */}
        <div className="fu d3 flex items-center gap-5 w-full max-w-[340px] md:max-w-[500px] mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-pink-500/30" />
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-pink-500/45 shrink-0">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-pink-500/30" />
        </div>

        {/* Quote */}
        <p className="fu d3 font-manrope italic text-sm md:text-[15px] text-pink-100/38 leading-relaxed mb-8 max-w-xs">
          "Submit. Suffer. Smile.<br />Your digital devotion is required."
        </p>

        {/* Social buttons */}
        <div className="fu d4 flex items-center gap-2">
          <SocialBtn href="https://x.com/PrincessAzraiel"                               icon={<Send  className="w-3.5 h-3.5" />} label="X / Twitter" />
          <SocialBtn href="https://bsky.app/profile/princess-azraiel.bsky.social"      icon={<Bird  className="w-3.5 h-3.5" />} label="Bluesky" />
          <SocialBtn href="https://discord.gg/e3uzBK2VJS"                              icon={<Globe className="w-3.5 h-3.5" />} label="Discord" />
          <SocialBtn href="https://throne.com/princessazraiel"                         icon={<Gift  className="w-3.5 h-3.5" />} label="Throne" />
          <SocialBtn href="https://ko-fi.com/princessazraiel"                          icon={<Coffee className="w-3.5 h-3.5" />} label="Ko-fi" />
        </div>

      </header>

      {/* ══════════════════════════════════════════
          MARQUEE STRIP
      ══════════════════════════════════════════ */}
      <div className="fu d4 relative z-20 overflow-hidden border-y border-pink-500/10 bg-pink-950/12 py-2.5">
        <div className="marquee-track flex whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-5">
              <span className="font-syncopate text-[7.5px] uppercase tracking-[0.38em] text-pink-300/25">
                {item}
              </span>
              <span className="text-pink-500/18 text-[10px]">♡</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BENTO GRID
      ══════════════════════════════════════════ */}
      <main className="relative z-20 px-4 md:px-8 lg:px-12 xl:px-16 py-12 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[minmax(220px,auto)]">

          {/* ── YANDERE — 2 cols wide ── */}
          <div className="fu d3 md:col-span-2 lg:col-span-2">
            <BentoCard
              href="/yandere"
              label="The Yandere Experience"
              sub="Interactive Psychological Horror"
              meta="9 Chapters · Free to Play"
              icon={<Eye className="w-[18px] h-[18px]" />}
              tag="NEW"
              variant="accent"
            />
          </div>

          {/* ── PATREON — tall (row-span-2) ── */}
          <div className="fu d3 lg:row-span-2 lg:col-start-3 lg:row-start-1">
            <BentoCard
              href="https://www.patreon.com/cw/PrincessAzraiel"
              label="Unlock Early Access"
              sub="Patreon Exclusives & Chapters"
              icon={<Crown className="w-[18px] h-[18px]" />}
              tag="VIP"
              variant="vip"
              tall
            />
          </div>

          {/* ── DISCORD ── */}
          <div className="fu d4">
            <BentoCard
              href="https://discord.gg/q9nsnSKvtu"
              label="The Sanctuary"
              sub="Elite Community"
              icon={<Users className="w-[18px] h-[18px]" />}
              variant="base"
            />
          </div>

          {/* ── CORRUPTION ── */}
          <div className="fu d4">
            <BentoCard
              href="/corruption"
              label="Initiate Corruption"
              sub="The Standard Protocol"
              icon={<Heart className="w-[18px] h-[18px]" />}
              variant="base"
            />
          </div>

          {/* ── HYPNOSIS ── */}
          <div className="fu d5">
            <BentoCard
              href="/corruption2"
              label="Hypnosis V2"
              sub="Deep Trance"
              icon={<Sparkles className="w-[18px] h-[18px]" />}
              variant="base"
            />
          </div>

          {/* ── REBRAND ── */}
          <div className="fu d5">
            <BentoCard
              href="/rebrand"
              label="Rebrand Profile"
              sub="Identity Overwrite"
              icon={<Wand2 className="w-[18px] h-[18px]" />}
              variant="base"
            />
          </div>

          {/* ── ARCHIVES — full width footer ── */}
          <div className="fu d6 md:col-span-2 lg:col-span-3">
            <BentoCard
              href="/programs"
              label="Archives"
              sub="Access All Programs & Protocols"
              icon={<ArrowRight className="w-[18px] h-[18px]" />}
              variant="dim"
              wide
            />
          </div>

        </div>

        {/* Page footer note */}
        <p className="fu d7 text-center font-syncopate text-[7px] uppercase tracking-[0.4em] text-white/12 mt-10">
          Consent is sacred · Optimize your obedience
        </p>
      </main>

    </div>
  );
}


/* ──────────────────────────────────────────────
   BENTO CARD
────────────────────────────────────────────── */
type BentoVariant = "accent" | "vip" | "base" | "dim";

function BentoCard({
  href, label, sub, meta, icon, tag,
  variant = "base",
  tall = false,
  wide = false,
}: {
  href: string;
  label: string;
  sub?: string;
  meta?: string;
  icon: React.ReactNode;
  tag?: string;
  variant?: BentoVariant;
  tall?: boolean;
  wide?: boolean;
}) {
  const isExternal = href.startsWith("http");

  /* ── Variant styles ── */
  const styles: Record<BentoVariant, {
    wrap: string;
    iconBox: string;
    shimmer: boolean;
  }> = {
    accent: {
      wrap: "bg-gradient-to-br from-pink-950/40 via-[#0a0408]/95 to-[#080408] border border-pink-500/22 hover:border-pink-500/50 shadow-[0_4px_32px_rgba(236,72,153,0.07)] hover:shadow-[0_8px_40px_rgba(236,72,153,0.14)]",
      iconBox: "bg-pink-500 text-black shadow-[0_0_16px_rgba(236,72,153,0.4)]",
      shimmer: true,
    },
    vip: {
      wrap: "breathe-border bg-[#080408] border border-pink-500/30 shadow-[0_4px_32px_rgba(236,72,153,0.10)]",
      iconBox: "bg-pink-500 text-black shadow-[0_0_14px_rgba(236,72,153,0.35)]",
      shimmer: true,
    },
    base: {
      wrap: "bg-[#0a0a0a] border border-white/[0.065] hover:border-pink-500/22 hover:bg-[#0d0a0d] hover:shadow-[0_4px_24px_rgba(236,72,153,0.06)]",
      iconBox: "bg-white/[0.04] text-pink-300/70 border border-white/[0.04] group-hover:bg-pink-500/12 group-hover:text-pink-300",
      shimmer: false,
    },
    dim: {
      wrap: "bg-[#080808] border border-white/[0.04] hover:border-white/[0.09] opacity-50 hover:opacity-75",
      iconBox: "bg-white/[0.03] text-white/30 border border-white/[0.04]",
      shimmer: false,
    },
  };

  const s = styles[variant];

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block w-full h-full"
    >
      <div className={`bc ${wide ? "wide" : ""} group relative h-full rounded-xl overflow-hidden ${s.wrap}`}>

        {/* Shimmer sweep */}
        {s.shimmer && (
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-0">
            <div className="absolute h-full w-[38%] bg-gradient-to-r from-transparent via-pink-400/[0.04] to-transparent -skew-x-12 animate-[shimmer_5s_1.5s_infinite]" />
          </div>
        )}

        <div className={`relative z-10 flex flex-col h-full ${tall ? "p-7 md:p-9" : wide ? "p-6 md:p-8" : "p-6 md:p-8"}`}>

          {/* ── TOP ROW: tag + icon + arrow ── */}
          <div className="flex items-start justify-end gap-2">
            {tag && (
              <span className={`font-syncopate text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-fuchsia-600/80 text-white backdrop-blur ${tag === "NEW" ? "animate-pulse" : ""}`}>
                {tag}
              </span>
            )}
            {/* Icon box — skip for tall layout, goes in middle instead */}
            {!tall && (
              <div className={`p-2 rounded-lg transition-all duration-300 ${s.iconBox}`}>
                {icon}
              </div>
            )}
            {/* Arrow circle */}
            <div className="w-7 h-7 rounded-full border border-white/[0.08] flex items-center justify-center transition-all duration-300 group-hover:border-pink-500/45 group-hover:bg-pink-500/10">
              <ArrowRight className="w-3.5 h-3.5 text-white/18 group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
          </div>

          {/* ── MIDDLE: icon (tall layout only) ── */}
          {tall && (
            <div className="flex-1 flex items-center py-6">
              <div className={`p-3.5 rounded-xl transition-all duration-300 ${s.iconBox}`}>
                {icon}
              </div>
            </div>
          )}

          {/* ── SPACER (non-tall) ── */}
          {!tall && <div className="flex-1" />}

          {/* ── BOTTOM: title + sub + meta ── */}
          <div className="pt-2">
            <h3 className={`
              font-italiana leading-none mb-1 group-hover:text-white transition-colors duration-300
              ${wide  ? "text-[1.75rem] md:text-[2rem]"   : ""}
              ${tall  ? "text-[1.95rem] md:text-[2.3rem]" : ""}
              ${!wide && !tall ? "text-[1.65rem] md:text-[1.85rem]" : ""}
            `}>
              {label}
            </h3>
            {sub && (
              <p className="font-manrope text-[10px] text-white/28 uppercase tracking-widest group-hover:text-pink-300/60 transition-colors duration-300">
                {sub}
              </p>
            )}
            {meta && (
              <p className="font-syncopate text-[7px] text-white/15 uppercase tracking-widest mt-1.5 group-hover:text-white/25 transition-colors duration-300">
                {meta}
              </p>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}


/* ──────────────────────────────────────────────
   SOCIAL BUTTON
────────────────────────────────────────────── */
function SocialBtn({ href, icon, label }: { href: string; icon: React.ReactNode; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
      className="group relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-pink-500/50 hover:bg-pink-500/10 hover:shadow-[0_0_14px_rgba(236,72,153,0.14)] transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-pink-500/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="relative z-10 text-white/38 group-hover:text-pink-300 group-hover:scale-110 transition-all duration-300">
        {icon}
      </span>
    </a>
  );
}


/* ──────────────────────────────────────────────
   FLOATING HEARTS
────────────────────────────────────────────── */
type Heart = { id: number; left: number; dur: number; delay: number; size: number; op: number };

function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setHearts(
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        left:  Math.random() * 100,
        dur:   15 + Math.random() * 20,
        delay: Math.random() * 16,
        size:  7 + Math.random() * 18,
        op:    0.025 + Math.random() * 0.09,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {hearts.map((h) => (
        <div
          key={h.id}
          className="float-up absolute bottom-[-8%]"
          style={{ left: `${h.left}%`, width: h.size, height: h.size, opacity: h.op, animationDuration: `${h.dur}s`, animationDelay: `${h.delay}s` }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-500 w-full h-full">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

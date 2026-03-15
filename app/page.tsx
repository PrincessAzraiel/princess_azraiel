"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Heart, Sparkles, Coffee, Gift, Bird, Send,
  Users, Wand2, ArrowRight, Globe, Zap, FileText,
  Eye, Crown,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#030303] text-pink-50 selection:bg-pink-500 selection:text-black">

      {/* ─── VISUAL ENGINE ─── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;600&family=Syncopate:wght@400;700&display=swap');

        .font-italiana  { font-family: 'Italiana', serif; }
        .font-manrope   { font-family: 'Manrope', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }

        /* Subtle grid */
        .tech-grid {
          background-size: 60px 60px;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.022) 1px, transparent 1px);
        }

        /* CSS film grain — no external URL */
        .grain::after {
          content: '';
          position: fixed;
          inset: -200%;
          width: 400%;
          height: 400%;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
          animation: grainShift 0.5s steps(2) infinite;
          z-index: 5;
        }

        @keyframes grainShift {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(-5%, -5%); }
          50%  { transform: translate(-8%, 4%); }
          75%  { transform: translate(4%, -8%); }
          100% { transform: translate(8%, 8%); }
        }

        /* Aurora blobs */
        @keyframes aurora {
          0%   { transform: translate(0%,  0%)  scale(1);    }
          33%  { transform: translate(4%, -7%)  scale(1.06); }
          66%  { transform: translate(-3%, 5%)  scale(0.96); }
          100% { transform: translate(0%,  0%)  scale(1);    }
        }
        .animate-aurora { animation: aurora 14s ease-in-out infinite; }

        /* Page entrance */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .anim-enter    { animation: fadeSlideUp 0.65s ease both; }
        .anim-delay-1  { animation-delay: 0.05s; }
        .anim-delay-2  { animation-delay: 0.18s; }
        .anim-delay-3  { animation-delay: 0.32s; }
        .anim-delay-4  { animation-delay: 0.46s; }
        .anim-delay-5  { animation-delay: 0.58s; }

        /* Floating hearts */
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(0.8); opacity: 0; }
          20%  { opacity: 0.6; }
          100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
        }
        .animate-float { animation: floatUp linear infinite; }

        /* Card shimmer sweep */
        @keyframes shimmer {
          0%   { transform: translateX(-160%) skewX(-14deg); }
          100% { transform: translateX(360%)  skewX(-14deg); }
        }

        /* Breathing border on glow card */
        @keyframes borderFlow {
          0%   { border-color: rgba(236,72,153,0.28); box-shadow: 0 0 6px rgba(236,72,153,0.08); }
          50%  { border-color: rgba(236,72,153,0.75); box-shadow: 0 0 22px rgba(236,72,153,0.35); }
          100% { border-color: rgba(236,72,153,0.28); box-shadow: 0 0 6px rgba(236,72,153,0.08); }
        }
        .animate-border-flow { animation: borderFlow 3s ease-in-out infinite; }

        /* Identity card corner glow on hover */
        .identity-card:hover .corner-glow {
          opacity: 1;
        }
        .corner-glow {
          transition: opacity 0.4s;
          opacity: 0;
        }
      `}</style>

      {/* ─── BG LAYERS ─── */}
      <div className="fixed inset-0 bg-[#050505]" />
      <div className="fixed inset-0 tech-grid pointer-events-none z-0" />
      <div className="grain fixed inset-0 pointer-events-none z-0" />

      {/* Aurora */}
      <div className="animate-aurora fixed top-[-25%] left-[-15%] w-[65vw] h-[65vw] rounded-full bg-fuchsia-900/20 blur-[150px] pointer-events-none z-0" />
      <div className="animate-aurora fixed bottom-[-20%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-pink-900/12 blur-[140px] pointer-events-none z-0" style={{ animationDelay: "-7s" }} />
      <div className="animate-aurora fixed top-[35%] right-[15%] w-[28vw] h-[28vw] rounded-full bg-rose-700/8 blur-[100px] pointer-events-none z-0" style={{ animationDelay: "-3s" }} />

      <FloatingHearts />

      {/* ─── MAIN ─── */}
      <main className="relative z-20 min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-16 pt-20 lg:pt-16">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">

          {/* ══════════════════════════════
              LEFT — Identity Module
          ══════════════════════════════ */}
          <section className="w-full lg:w-[38%] lg:sticky lg:top-24 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">

            <div className="anim-enter anim-delay-1 w-full">
              <SpotlightCard className="identity-card w-full rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.01] border border-white/[0.09] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_12px_60px_rgba(0,0,0,0.55)]">

                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-11 h-11 border-t-2 border-l-2 border-pink-500/35 rounded-tl-2xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-11 h-11 border-t-2 border-r-2 border-pink-500/35 rounded-tr-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-11 h-11 border-b-2 border-l-2 border-pink-500/35 rounded-bl-2xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-11 h-11 border-b-2 border-r-2 border-pink-500/35 rounded-br-2xl pointer-events-none" />

                {/* Corner glow pulse on hover */}
                <div className="corner-glow absolute top-0 left-0 w-24 h-24 bg-pink-500/8 rounded-tl-2xl blur-2xl pointer-events-none" />
                <div className="corner-glow absolute bottom-0 right-0 w-24 h-24 bg-pink-500/8 rounded-br-2xl blur-2xl pointer-events-none" />

                <div className="relative z-10 p-8 md:p-10">

                  {/* Status pill */}
                  <div className="inline-flex items-center gap-2.5 border border-green-500/15 bg-green-950/25 px-3.5 py-1.5 rounded-full mb-8 backdrop-blur-md">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-70" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="font-syncopate text-[8.5px] uppercase tracking-[0.26em] text-green-300/75">
                      System Online
                    </span>
                  </div>

                  {/* Title */}
                  <div className="space-y-3 mb-7 relative z-10">
                    <h1 className="font-italiana text-[4rem] md:text-[5rem] xl:text-[5.5rem] leading-[0.82] text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-pink-300/30">
                      Princess<br />Azraiel
                    </h1>
                    <div className="flex items-center gap-3 justify-center lg:justify-start mt-4">
                      <div className="h-px flex-1 max-w-[48px] bg-gradient-to-r from-pink-500/70 to-transparent" />
                      <p className="font-syncopate text-[8px] uppercase tracking-[0.32em] text-pink-400/80">
                        V4.1 // Corruption Hub
                      </p>
                      <div className="h-px flex-1 max-w-[48px] bg-gradient-to-l from-pink-500/70 to-transparent" />
                    </div>
                  </div>

                  {/* Quote — left-bordered */}
                  <div className="relative mb-8 pl-4 border-l-2 border-pink-500/25 text-left">
                    <p className="font-manrope text-pink-50/65 text-sm md:text-[15px] italic leading-relaxed">
                      "Submit. Suffer. Smile."
                    </p>
                    <p className="font-manrope text-pink-200/30 text-xs mt-1 not-italic">
                      Your digital devotion is required.
                    </p>
                  </div>

                  {/* Social row */}
                  <div className="border-t border-white/[0.05] pt-6">
                    <p className="font-syncopate text-[7.5px] uppercase tracking-[0.3em] text-white/18 mb-3.5 text-center lg:text-left">
                      Connect
                    </p>
                    <div className="grid grid-cols-5 gap-2.5 relative z-20">
                      <SocialBtn href="https://x.com/PrincessAzraiel"                               icon={<Send  className="w-4 h-4" />} label="X / Twitter" />
                      <SocialBtn href="https://bsky.app/profile/princess-azraiel.bsky.social"      icon={<Bird  className="w-4 h-4" />} label="Bluesky" />
                      <SocialBtn href="https://discord.gg/e3uzBK2VJS"                              icon={<Globe className="w-4 h-4" />} label="Discord" />
                      <SocialBtn href="https://throne.com/princessazraiel"                         icon={<Gift  className="w-4 h-4" />} label="Throne" />
                      <SocialBtn href="https://ko-fi.com/princessazraiel"                          icon={<Coffee className="w-4 h-4" />} label="Ko-fi" />
                    </div>
                  </div>

                </div>
              </SpotlightCard>
            </div>

            <p className="anim-enter anim-delay-2 hidden lg:block font-manrope text-xs text-white/22 pl-4 border-l border-white/[0.08] leading-relaxed">
              Consent is sacred.<br />Optimize your obedience.
            </p>
          </section>


          {/* ══════════════════════════════
              RIGHT — Command Grid
          ══════════════════════════════ */}
          <nav aria-label="Navigation" className="w-full lg:w-[62%] grid grid-cols-1 md:grid-cols-2 gap-3.5">

            {/* Hero — full width */}
            <div className="anim-enter anim-delay-2 md:col-span-2">
              <LinkCard
                href="/yandere"
                label="The Yandere Experience"
                sub="Interactive Psychological Horror"
                meta="9 Chapters · Free to Play"
                icon={<Eye className="w-6 h-6" />}
                variant="primary"
                isHero
                tag="NEW"
              />
            </div>

            {/* Row 2 */}
            <div className="anim-enter anim-delay-3">
              <LinkCard
                href="https://www.patreon.com/cw/PrincessAzraiel"
                label="Unlock Early Access"
                sub="Patreon Exclusives & Chapters"
                meta="VIP Members Only"
                icon={<Crown className="w-5 h-5" />}
                tag="VIP"
                variant="glow"
              />
            </div>

            <div className="anim-enter anim-delay-3">
              <LinkCard
                href="https://discord.gg/q9nsnSKvtu"
                label="The Sanctuary"
                sub="Elite Community"
                icon={<Users className="w-5 h-5" />}
                variant="glass"
              />
            </div>

            {/* Row 3 */}
            <div className="anim-enter anim-delay-4">
              <LinkCard
                href="/corruption"
                label="Initiate Corruption"
                sub="The Standard Protocol"
                icon={<Heart className="w-5 h-5" />}
                variant="glass"
              />
            </div>

            <div className="anim-enter anim-delay-4">
              <LinkCard
                href="/corruption2"
                label="Hypnosis V2"
                sub="Deep Trance"
                icon={<Sparkles className="w-5 h-5" />}
                variant="glass"
              />
            </div>

            {/* Row 4 */}
            <div className="anim-enter anim-delay-4">
              <LinkCard
                href="/rebrand"
                label="Rebrand Profile"
                sub="Identity Overwrite"
                icon={<Wand2 className="w-5 h-5" />}
                variant="glass"
              />
            </div>

            <div className="anim-enter anim-delay-4">
              <LinkCard
                href="/infection"
                label="Infection Protocol"
                sub="Bots that ruin you slowly"
                icon={<Zap className="w-5 h-5" />}
                variant="ghost"
              />
            </div>

            {/* Row 5 */}
            <div className="anim-enter anim-delay-5">
              <LinkCard
                href="https://azraielforms.vercel.app/"
                label="Azraiel Forms"
                sub="The Dom's Toolkit"
                icon={<FileText className="w-5 h-5" />}
                variant="glass"
              />
            </div>

            {/* Archives — full width footer */}
            <div className="anim-enter anim-delay-5 md:col-span-2 mt-1">
              <LinkCard
                href="/programs"
                label="Archives"
                sub="Access All Programs"
                icon={<ArrowRight className="w-5 h-5" />}
                variant="ghost"
              />
            </div>

            {/* Mobile footer note */}
            <div className="md:hidden col-span-1 pt-6 text-center pb-14">
              <p className="font-manrope text-xs text-white/20">
                Consent is sacred. Optimize your obedience.
              </p>
            </div>

          </nav>
        </div>
      </main>
    </div>
  );
}


/* ─────────────────────────────────────────────
   SPOTLIGHT CARD — mouse-reactive inner glow
───────────────────────────────────────────── */
function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Fill glow */}
      <div
        className="pointer-events-none absolute -inset-px z-10 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(550px circle at ${pos.x}px ${pos.y}px, rgba(236,72,153,0.09), transparent 40%)`,
        }}
      />
      {/* Border glow (mask trick) */}
      <div
        className="pointer-events-none absolute -inset-px z-10 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(380px circle at ${pos.x}px ${pos.y}px, rgba(236,72,153,0.55), transparent 40%)`,
          maskImage: `linear-gradient(black,black) content-box, linear-gradient(black,black)`,
          maskComposite: `exclude`,
          WebkitMaskComposite: `xor`,
          padding: "1px",
        }}
      />
      {children}
    </div>
  );
}


/* ─────────────────────────────────────────────
   LINK CARD
───────────────────────────────────────────── */
function LinkCard({
  href,
  label,
  sub,
  icon,
  tag,
  meta,
  variant = "glass",
  isHero = false,
}: {
  href: string;
  label: string;
  sub?: string;
  icon: React.ReactNode;
  tag?: string;
  meta?: string;
  variant?: "primary" | "glass" | "glow" | "ghost";
  isHero?: boolean;
}) {
  const variantStyles: Record<string, string> = {
    primary: `
      bg-gradient-to-br from-pink-950/65 via-black/80 to-black/90
      backdrop-blur-xl backdrop-saturate-150
      border border-pink-500/30
      shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_40px_rgba(236,72,153,0.10)]
    `,
    glass: `
      bg-gradient-to-b from-white/[0.065] to-white/[0.01]
      backdrop-blur-xl backdrop-saturate-150
      border border-white/[0.08]
      shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]
      hover:bg-white/[0.055] hover:border-white/[0.13]
    `,
    glow: `
      bg-black/80 backdrop-blur-xl
      animate-border-flow border border-pink-500
      shadow-[inset_0_0_22px_rgba(236,72,153,0.07),0_4px_24px_rgba(236,72,153,0.12)]
    `,
    ghost: `
      bg-transparent border border-white/[0.05]
      hover:bg-white/[0.03] hover:border-white/[0.10]
      opacity-55 hover:opacity-85 backdrop-blur-sm
    `,
  };

  const isExternal = href.startsWith("http");
  const pad = isHero ? "p-7 md:p-9" : "p-5 md:p-6";
  const accent = variant === "primary" || variant === "glow";

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block w-full h-full"
    >
      <SpotlightCard className={`h-full rounded-xl ${variantStyles[variant]}`}>
        <div className={`group relative w-full h-full flex flex-col justify-between transition-all duration-500 ease-out ${pad}`}>

          {/* Shimmer sweep on accent cards */}
          {accent && (
            <div className="absolute inset-0 z-0 overflow-hidden rounded-xl pointer-events-none">
              <div className="absolute top-0 h-full w-[45%] bg-gradient-to-r from-transparent via-pink-400/6 to-transparent -skew-x-12 animate-[shimmer_4.5s_1.5s_infinite]" />
            </div>
          )}

          {/* Top row: icon + tag + arrow */}
          <div className="flex justify-between items-start mb-5 relative z-10">
            <div className={`
              p-2.5 rounded-lg border transition-all duration-300
              ${accent
                ? "bg-pink-500/90 text-black border-pink-400/40 shadow-[0_0_18px_rgba(236,72,153,0.3)]"
                : "bg-white/[0.05] text-pink-200 border-white/[0.05] group-hover:bg-pink-500 group-hover:text-black group-hover:border-pink-400/40 group-hover:shadow-[0_0_18px_rgba(236,72,153,0.3)]"}
            `}>
              {icon}
            </div>

            <div className="flex items-center gap-2">
              {tag && (
                <span className={`
                  font-syncopate text-[7.5px] font-bold tracking-wider uppercase
                  bg-fuchsia-600/85 text-white px-2 py-0.5 rounded-md shadow-md shadow-pink-500/15
                  backdrop-blur
                  ${tag === "NEW" ? "animate-pulse" : ""}
                `}>
                  {tag}
                </span>
              )}
              <div className="w-7 h-7 rounded-full border border-white/[0.09] flex items-center justify-center transition-all duration-300 group-hover:border-pink-500/50 group-hover:bg-pink-500/10">
                <ArrowRight className="w-3.5 h-3.5 text-white/25 group-hover:text-pink-300 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Bottom row: label + sub + meta */}
          <div className="relative z-10">
            <h3 className={`
              font-italiana leading-none mb-1.5 transition-colors duration-300
              group-hover:text-white
              ${isHero ? "text-[2.4rem] md:text-[3rem]" : "text-[1.7rem] md:text-[2rem]"}
            `}>
              {label}
            </h3>
            {sub && (
              <p className="font-manrope text-[10px] text-white/38 uppercase tracking-widest group-hover:text-pink-300/75 transition-colors duration-300">
                {sub}
              </p>
            )}
            {meta && (
              <p className="font-syncopate text-[7px] text-white/18 uppercase tracking-widest mt-1.5 group-hover:text-white/28 transition-colors duration-300">
                {meta}
              </p>
            )}
          </div>

        </div>
      </SpotlightCard>
    </Link>
  );
}


/* ─────────────────────────────────────────────
   SOCIAL BUTTON
───────────────────────────────────────────── */
function SocialBtn({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
      className="group relative flex items-center justify-center w-full aspect-square rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-pink-500/55 hover:bg-pink-500/10 hover:shadow-[0_0_18px_rgba(236,72,153,0.18)] transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-pink-500/12 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="relative z-10 text-white/45 group-hover:text-pink-300 group-hover:scale-110 transition-all duration-300">
        {icon}
      </span>
    </a>
  );
}


/* ─────────────────────────────────────────────
   FLOATING HEARTS
───────────────────────────────────────────── */
function FloatingHearts() {
  const [hearts, setHearts] = useState<
    { id: number; left: number; duration: number; delay: number; size: number; opacity: number }[]
  >([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setHearts(
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 14 + Math.random() * 20,
        delay: Math.random() * 14,
        size: 8 + Math.random() * 20,
        opacity: 0.03 + Math.random() * 0.10,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
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
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-500 w-full h-full drop-shadow-[0_0_8px_rgba(236,72,153,0.35)]">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

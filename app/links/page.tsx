"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Lock } from "lucide-react";

const secretLinks = [
  { label: "Tribute Now", url: "https://throne.com/princessazraiel" },
  {
    label: "Spread the Gospel",
    url: "https://twitter.com/intent/tweet?text=I+just+offered+my+devotion+to+Princess+Azraiel+~+come+submit+too+%F0%9F%92%96+https://princessazraiel.vercel.app/",
  },
  { label: "Discord Entry", url: "https://discord.gg/sCusdWXxZF" },
  { label: "Corrupt Me More", url: "https://gofile.io/d/2uZY0d" },
  {
    label: "Steam Wishlist",
    url: "https://store.steampowered.com/wishlist/profiles/76561199854908095/?sort=discount",
  },
];

export default function SecretButtonsPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-pink-50 selection:bg-pink-500 selection:text-black">
      {/* --- GLOBAL STYLES (same as LandingPage) --- */}
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
            opacity: 0.6;
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

      {/* ATMOSPHERE */}
      <div className="scanlines" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-10 brightness-150 contrast-150" />

      {/* Deep Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-fuchsia-900/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-pink-900/10 blur-[100px] pointer-events-none" />

      <FloatingHearts />

      {/* CONTENT */}
      <main className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 py-12 md:py-20">
        <div className="w-full max-w-2xl mx-auto space-y-10">
          {/* HEADER */}
          <header className="text-center space-y-6 relative">
            <div className="inline-flex items-center gap-3 border border-pink-500/30 bg-pink-500/5 px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
              </span>
              <span className="font-syncopate text-[9px] uppercase tracking-[0.25em] text-pink-200">
                Classified Access // Tier Ω
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-italiana text-4xl md:text-6xl lg:text-7xl leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-pink-900/50 drop-shadow-[0_0_30px_rgba(255,100,200,0.2)]">
                Secret Devotion Panel
              </h1>
              <p className="font-syncopate text-[10px] md:text-xs uppercase tracking-[0.4em] text-pink-500/80 font-bold">
                Direct Channels To Please Your Princess
              </p>
            </div>

            <p className="font-manrope text-white/60 text-sm md:text-base italic max-w-md mx-auto leading-relaxed border-t border-b border-white/5 py-4">
              “Choose carefully. Every click is another data point of your
              obedience.”
            </p>
          </header>

          {/* SECRET LINKS */}
          <section className="space-y-4">
            {secretLinks.map((link, idx) => (
              <SecretLinkCard
                key={link.label}
                label={link.label}
                url={link.url}
                index={idx}
              />
            ))}
          </section>

          {/* FOOTER HINT */}
          <footer className="pt-6 border-t border-white/10 text-center space-y-2">
            <p className="font-syncopate text-[9px] uppercase tracking-[0.2em] text-white/30">
              Logs: unauthorized access attempts will be… repurposed.
            </p>
            <p className="font-manrope text-xs text-white/20">
              Return to{" "}
              <a
                href="/"
                className="underline underline-offset-4 decoration-pink-500/60 hover:text-pink-300 transition-colors"
              >
                main terminal
              </a>{" "}
              to resume standard protocols.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function SecretLinkCard({
  label,
  url,
  index,
}: {
  label: string;
  url: string;
  index: number;
}) {
  const isPrimary = index === 0; // Tribute Now gets the “primary” treatment

  const base =
    "group relative w-full flex items-center justify-between p-4 md:p-5 transition-all duration-500 border overflow-hidden";

  const variant = isPrimary
    ? "bg-pink-950/30 border-pink-500/40 hover:bg-pink-900/40 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]"
    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-pink-300/30";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
      aria-label={label}
    >
      <div className={`${base} ${variant}`}>
        {/* Left glow strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />

        <div className="flex items-center gap-4 md:gap-6 z-10">
          <div
            className={`p-3 rounded-sm ${
              isPrimary
                ? "bg-pink-500 text-black"
                : "bg-white/5 text-pink-200 group-hover:bg-pink-500 group-hover:text-black"
            } transition-colors duration-300`}
          >
            {isPrimary ? (
              <Lock className="w-5 h-5" />
            ) : (
              <ExternalLink className="w-5 h-5" />
            )}
          </div>
          <div className="text-left">
            <h3 className="font-italiana text-xl md:text-2xl leading-none mb-1 group-hover:text-pink-100 transition-colors">
              {label}
            </h3>
            <p className="font-manrope text-[10px] md:text-xs text-white/40 uppercase tracking-wider group-hover:text-pink-300/90 transition-colors">
              {isPrimary ? "Primary Offering Channel" : "External Link // New Tab"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10">
          {isPrimary && (
            <span className="font-syncopate text-[9px] font-bold bg-fuchsia-600 text-white px-2 py-1 uppercase tracking-wider animate-pulse">
              Preferred
            </span>
          )}
          <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-pink-400 transform group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </a>
  );
}

// --- FLOATING HEARTS (copied from LandingPage) ---

function FloatingHearts() {
  const [hearts, setHearts] = useState<
    { id: number; left: number; duration: number; delay: number; size: number; opacity: number }[]
  >([]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const count = 12;
    const newHearts = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      size: 10 + Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.3,
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

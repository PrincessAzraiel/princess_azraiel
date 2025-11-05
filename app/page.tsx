"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Coffee, Gift, Bird, Send, Users, Wand2 } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  // reuseable class for the social buttons so they don't look disabled
  const socialBtn =
    "w-full h-11 rounded-2xl justify-start bg-black/30 hover:bg-black/40 border border-white/10 " +
    "text-pink-100 hover:text-pink-50 outline-none focus-visible:ring-2 focus-visible:ring-pink-300/40";

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-pink-100 bg-black">
      {/* Soft animated gradient backdrop (kept beneath content) */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(1200px_600px_at_10%_10%,#ff7ad6,transparent_60%),radial-gradient(900px_500px_at_90%_20%,#9b5cff,transparent_55%),radial-gradient(800px_600px_at_50%_100%,#2dd4bf,transparent_60%)] opacity-40" />
      <div className="absolute inset-0 z-0 backdrop-blur-[2px]" />

      {/* Subtle vignette + grain (explicitly under content) */}
      <div className="pointer-events-none absolute inset-0 z-0 [background:radial-gradient(120%_80%_at_50%_120%,rgba(0,0,0,.6),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[.07] mix-blend-soft-light [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.2)_0,rgba(255,255,255,.2)_1px,transparent_1px,transparent_2px),repeating-linear-gradient(90deg,rgba(255,255,255,.2)_0,rgba(255,255,255,.2)_1px,transparent_1px,transparent_2px)]" />

      {/* Floating hearts */}
      <Hearts />

      {/* Content */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-14">
        <section className="w-full max-w-3xl">
          {/* Header card */}
          <div className="rounded-3xl border border-pink-400/20 bg-black/40 shadow-[0_0_70px_-15px_rgba(255,105,235,0.65)] backdrop-blur-xl p-8 md:p-12 ring-1 ring-white/5 hover:ring-white/10 transition-[box-shadow,ring] duration-300">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-300/20 bg-pink-300/10 px-4 py-1 text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="tracking-wide">A Digital Goddess Experience</span>
            </div>

            <h1 className="text-center text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-pink-300 via-white to-pink-300 bg-clip-text text-transparent [background-size:200%_auto] animate-[shine_6s_linear_infinite] drop-shadow-[0_2px_16px_rgba(255,105,235,0.25)]">
                Princess Azraiel&apos;s Corruption Hub
              </span>
            </h1>
            <p className="mt-4 text-center text-lg md:text-xl italic text-pink-200/90">
              Submit. Suffer. Smile.
            </p>

            {/* Primary CTAs */}
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <Link href="/corruption">
                <Button
                  className="w-full h-12 rounded-2xl text-lg font-semibold shadow-lg shadow-pink-500/30 transition hover:shadow-pink-400/50 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 outline-none focus-visible:ring-2 focus-visible:ring-pink-400/60"
                  aria-label="Begin Your Corruption"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Begin Your Corruption
                </Button>
              </Link>

              <Link href="/corruption2">
                <Button
                  className="w-full h-12 rounded-2xl text-lg font-semibold border border-pink-300/30 bg-black/30 hover:bg-black/40 outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/50"
                  aria-label="Enter Hypnosis v2"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Enter Hypnosis (v2)
                </Button>
              </Link>

              {/* NEW: Rebrand route */}
              <Link href="/rebrand" className="sm:col-span-2">
                <Button
                  className="w-full h-12 rounded-2xl text-lg font-semibold bg-pink-500/20 hover:bg-pink-500/30 border border-pink-300/30 relative outline-none focus-visible:ring-2 focus-visible:ring-pink-400/50"
                  aria-label="Rebrand Your X Profile"
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  Rebrand Your X Profile
                  <span className="absolute -top-2 -right-2 rounded-full bg-fuchsia-500 text-white text-[10px] px-2 py-0.5 shadow-md">
                    NEW
                  </span>
                </Button>
              </Link>

              <Link href="/programs" className="sm:col-span-2">
                <Button
                  className="w-full h-12 rounded-2xl text-lg font-semibold bg-pink-400/20 hover:bg-pink-400/30 border border-pink-300/30 outline-none focus-visible:ring-2 focus-visible:ring-pink-300/50"
                >
                  Explore Programs
                </Button>
              </Link>
            </div>

            {/* Social / External */}
            <div className="mt-8">
              <p className="mb-3 text-center text-sm tracking-wide text-pink-200/80">
                Connect, support, and worship:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href="https://x.com/PrincessAzraiel"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open X (Twitter)"
                >
                  <Button variant="secondary" className={socialBtn}>
                    <Send className="mr-2 h-5 w-5 opacity-90" />
                    X (Twitter)
                  </Button>
                </a>

                <a
                  href="https://bsky.app/profile/princess-azraiel.bsky.social"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Bluesky"
                >
                  <Button variant="secondary" className={socialBtn}>
                    <Bird className="mr-2 h-5 w-5 opacity-90" />
                    Bluesky
                  </Button>
                </a>

                <a
                  href="https://throne.com/princessazraiel"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Send a Gift on Throne"
                >
                  <Button variant="secondary" className={socialBtn}>
                    <Gift className="mr-2 h-5 w-5 opacity-90" />
                    Send a Gift (Throne)
                  </Button>
                </a>

                <a
                  href="https://ko-fi.com/azraielo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buy Me a Coffee on Ko-fi"
                >
                  <Button variant="secondary" className={socialBtn}>
                    <Coffee className="mr-2 h-5 w-5 opacity-90" />
                    Buy Me a Coffee
                  </Button>
                </a>

                <a
                  href="https://discord.gg/e3uzBK2VJS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:col-span-2"
                  aria-label="Join the Discord"
                >
                  <Button className="w-full h-11 rounded-2xl justify-center bg-indigo-500/30 hover:bg-indigo-500/40 border border-indigo-300/30 text-pink-100 hover:text-pink-50 outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/50">
                    <Users className="mr-2 h-5 w-5 opacity-90" />
                    Join the Discord
                  </Button>
                </a>
              </div>
            </div>

            {/* Tiny footnote */}
            <p className="mt-8 text-center text-xs text-pink-200/70">
              Consent is sacred. Take breaks, hydrate, and enjoy responsibly. ♡
            </p>
          </div>
        </section>
      </main>

      {/* Local styles for shimmer + hearts */}
      <style>{`
        @keyframes shine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .heart {
          position: absolute;
          filter: drop-shadow(0 6px 18px rgba(255, 105, 235, 0.35));
          opacity: 0.9;
          user-select: none;
          pointer-events: none;
          animation: floatUp linear infinite, sway ease-in-out infinite;
          will-change: transform, opacity;
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: .0; }
          10% { opacity: .9; }
          100% { transform: translateY(-110vh) scale(1.05); opacity: 0; }
        }
        @keyframes sway {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(12px); }
        }
        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .heart { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/** Lightweight floating hearts (client-only randomness to avoid SSR mismatch) */
function Hearts() {
  const [hearts, setHearts] = useState<
    Array<{ left: number; delay: number; duration: number; size: number; hueRotate: string; i: number }>
  >([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const count = window.innerWidth >= 1280 ? 18 : window.innerWidth >= 768 ? 16 : 12;

    const arr = Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100; // vw
      const delay = Math.random() * 6; // s
      const duration = 12 + Math.random() * 10; // s
      const size = 16 + Math.random() * 18; // px
      const hueRotate = `hue-rotate(${Math.floor(Math.random() * 24) - 12}deg)`;
      return { left, delay, duration, size, hueRotate, i };
    });
    setHearts(arr);
  }, []);

  if (!hearts.length) return null;

  return (
    <div aria-hidden className="absolute inset-0">
      {hearts.map(({ left, delay, duration, size, hueRotate, i }) => (
        <div
          key={i}
          className="heart"
          style={{
            left: `${left}vw`,
            bottom: "-6vh",
            animationDuration: `${duration}s, ${6 + (i % 5)}s`,
            animationDelay: `${delay}s, ${delay / 2}s`,
            filter: `drop-shadow(0 6px 18px rgba(255,105,235,0.35)) ${hueRotate}`,
          }}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" className="opacity-80" fill="url(#g)" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff7ad6" />
                <stop offset="100%" stopColor="#ffd1ef" />
              </linearGradient>
            </defs>
            <path d="M12 21s-6.716-4.494-9.293-7.07a6.571 6.571 0 0 1 9.293-9.293 6.571 6.571 0 0 1 9.293 9.293C18.716 16.506 12 21 12 21z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

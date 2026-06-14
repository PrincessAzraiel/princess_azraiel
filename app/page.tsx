"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Send, Bird, Globe, Gift, Coffee } from "lucide-react";

type Tab = "programs" | "about" | "links";

const QUICK_LINKS = [
  {
    label: "Tribute / Wishlist",
    href: "https://throne.com/princessazraiel",
    icon: <Gift className="w-4 h-4" />,
    external: true,
  },
  {
    label: "Discord Server",
    href: "https://discord.gg/e3uzBK2VJS",
    icon: <Globe className="w-4 h-4" />,
    external: true,
  },
  {
    label: "Spread the Gospel",
    href: "https://twitter.com/intent/tweet?text=I+just+offered+my+devotion+to+Princess+Azraiel+~+come+submit+too+%F0%9F%92%96+https://princessazraiel.com/",
    icon: <Send className="w-4 h-4" />,
    external: true,
  },
  {
    label: "Ko-fi Support",
    href: "https://ko-fi.com/princessazraiel",
    icon: <Coffee className="w-4 h-4" />,
    external: true,
  },
  {
    label: "Updates & Announcements",
    href: "/updates",
    icon: null,
    external: false,
  },
  {
    label: "Full Programs Archive",
    href: "/programs",
    icon: null,
    external: false,
  },
];

const SOCIALS = [
  {
    label: "X / Twitter",
    href: "https://x.com/PrincessAzraiel",
    icon: <Send className="w-4 h-4" />,
  },
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/princess-azraiel.bsky.social",
    icon: <Bird className="w-4 h-4" />,
  },
  {
    label: "Discord",
    href: "https://discord.gg/e3uzBK2VJS",
    icon: <Globe className="w-4 h-4" />,
  },
  {
    label: "Throne",
    href: "https://throne.com/princessazraiel",
    icon: <Gift className="w-4 h-4" />,
  },
  {
    label: "Ko-fi",
    href: "https://ko-fi.com/princessazraiel",
    icon: <Coffee className="w-4 h-4" />,
  },
];

const NAV_LINKS = [
  { label: "Infection Protocol", href: "/infection" },
  { label: "Corruption Hub", href: "/corruption" },
  { label: "PrincessOS", href: "/princessos" },
  { label: "Updates", href: "/updates" },
  { label: "Programs", href: "/programs" },
  { label: "Terms & Contract", href: "/contract" },
];

export default function LandingPage() {
  const [tab, setTab] = useState<Tab>("about");

  return (
    <div className="relative min-h-screen bg-[#050306] overflow-x-hidden text-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;500;600&family=Syncopate:wght@400;700&display=swap');
        .italiana { font-family: 'Italiana', serif; }
        .sync { font-family: 'Syncopate', sans-serif; }
        .manrope { font-family: 'Manrope', sans-serif; }

        @keyframes floatUp {
          0%   { transform: translateY(0) scale(0.8); opacity: 0; }
          15%  { opacity: 0.35; }
          100% { transform: translateY(-110vh) scale(1.1); opacity: 0; }
        }
      `}</style>

      {/* ── Static gradient background (no heavy animations) ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: "#050306" }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90vw 70vh at 20% -10%, rgba(134,25,143,0.18) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70vw 60vh at 85% 110%, rgba(131,24,67,0.12) 0%, transparent 55%)",
          }}
        />
      </div>

      <FloatingHearts />

      <div className="relative z-10 w-full max-w-xl mx-auto px-4 pt-20 pb-24">
        {/* ── Profile Header ── */}
        <header className="text-center mb-10">
          <div className="relative w-28 h-28 mx-auto mb-5">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-pink-500/40 shadow-[0_0_32px_rgba(236,72,153,0.22)] relative">
              <Image
                src="/landing/image.webp"
                alt="Princess Azraiel"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <span className="absolute bottom-0 right-0 flex items-center gap-1 bg-[#050306] border border-pink-500/40 text-[8px] px-1.5 py-0.5 rounded-full sync tracking-widest text-pink-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              LIVE
            </span>
          </div>

          <h1 className="italiana text-5xl text-white mb-2 leading-none">
            Princess <em className="italic text-pink-300">Azraiel</em>
          </h1>
          <p className="sync text-[8px] tracking-[0.45em] text-pink-400/70 uppercase mb-6">
            Techdom · 2dfd · Online Domination
          </p>

          <div className="flex justify-center gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                aria-label={s.label}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/[0.08] text-white/50 hover:text-pink-300 hover:border-pink-500/40 hover:bg-pink-500/10 transition-all duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>

          <Link
            href="/sessions"
            className="group mt-4 inline-flex w-full max-w-[260px] items-center justify-center rounded-lg border border-pink-500/35 bg-pink-500/[0.10] px-5 py-3 text-pink-100 shadow-[0_0_22px_rgba(236,72,153,0.12)] transition-all duration-300 hover:border-pink-400/60 hover:bg-pink-500/[0.16] hover:text-white"
          >
            <span className="sync text-[8px] uppercase tracking-[0.32em]">
              Sessions
            </span>
          </Link>
        </header>

        {/* ── News Banner ── */}
        <LatestNews />

        {/* ── Tab Bar ── */}
        <div className="flex gap-1 p-1 bg-white/[0.04] rounded-2xl mb-7 border border-white/[0.07]">
          {(["about", "links", "programs"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl sync text-[8px] tracking-[0.3em] uppercase transition-all duration-300 ${
                tab === t
                  ? "bg-pink-500/15 text-pink-200 border border-pink-500/30 shadow-[0_0_12px_rgba(236,72,153,0.1)]"
                  : "text-white/35 hover:text-white/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {tab === "programs" && <ProgramsTab />}
        {tab === "about" && <AboutTab />}
        {tab === "links" && <LinksTab />}
      </div>

      {/* ── Minimal Footer ── */}
      <footer className="relative z-10 text-center pb-8 px-4 border-t border-white/[0.05] pt-6">
        <p className="sync text-[7px] tracking-[0.35em] text-white/20 uppercase mb-2">
          © 26XX Techdom · Princess Azraiel · V4.1
        </p>
        <p className="manrope text-xs text-white/20">
          <Link href="/contract" className="hover:text-pink-400/60 transition-colors">
            Terms
          </Link>{" "}
          ·{" "}
          <Link href="/updates" className="hover:text-pink-400/60 transition-colors">
            Updates
          </Link>{" "}
          ·{" "}
          <Link href="/programs" className="hover:text-pink-400/60 transition-colors">
            All Programs
          </Link>{" "}
          ·{" "}
          <Link href="/infection" className="hover:text-pink-400/60 transition-colors">
            Infection Protocol
          </Link>
        </p>
      </footer>
    </div>
  );
}

/* ──────────────────────────────────────────────
   LATEST NEWS
────────────────────────────────────────────── */
function LatestNews() {
  return (
    <a
      href="https://www.patreon.com/cw/PrincessAzraiel/membership"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 w-full p-4 rounded-2xl border border-pink-500/30 bg-pink-500/[0.06] hover:bg-pink-500/[0.11] hover:border-pink-500/50 transition-all duration-300 mb-7"
    >
      <div className="flex-shrink-0 mt-0.5">
        <span className="sync text-[7px] tracking-[0.3em] uppercase px-2 py-1 rounded-md bg-pink-500/20 border border-pink-500/40 text-pink-300">
          New
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="italiana text-xl text-white group-hover:text-pink-100 transition-colors leading-snug mb-1">
          First hypnosis session — now live on Patreon
        </p>
        <p className="manrope text-xs text-white/45 group-hover:text-white/60 transition-colors">
          I am making hypno sessions and the first one just dropped for subscribers. Join to listen.
        </p>
      </div>
      <svg
        className="w-4 h-4 text-pink-400/50 group-hover:text-pink-300 transition-colors flex-shrink-0 mt-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </a>
  );
}

/* ──────────────────────────────────────────────
   PROGRAMS TAB
────────────────────────────────────────────── */
function ProgramsTab() {
  return (
    <section>
      <Link
        href="/programs"
        className="group flex items-center justify-between w-full p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-pink-500/[0.06] hover:border-pink-500/25 transition-all duration-300"
      >
        <div>
          <p className="sync text-[8px] tracking-[0.35em] text-pink-400/70 uppercase mb-2">
            § The Archive
          </p>
          <h2 className="italiana text-3xl text-white group-hover:text-pink-100 transition-colors leading-none mb-2">
            Programs Archive
          </h2>
          <p className="manrope text-sm text-white/50 group-hover:text-white/65 transition-colors">
            Every program, every version. Browse the full collection.
          </p>
        </div>
        <svg
          className="w-5 h-5 text-white/25 group-hover:text-pink-400/70 transition-colors flex-shrink-0 ml-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </section>
  );
}

/* ──────────────────────────────────────────────
   ABOUT TAB
────────────────────────────────────────────── */
function AboutTab() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <span className="sync text-[8px] tracking-[0.45em] text-pink-400 uppercase">
          § 02 / The Creator
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-pink-500/40 to-transparent" />
      </div>

      <h2 className="italiana text-4xl text-white mb-6 leading-tight">
        A <em className="italic text-pink-300">2dfd princess.</em>
        <br />
        Her own{" "}
        <span
          style={{
            textDecoration: "underline",
            textDecorationColor: "#ff1493",
            textUnderlineOffset: "6px",
            textDecorationThickness: "2px",
          }}
        >
          techdom.
        </span>
      </h2>

      <p
        className="italiana italic mb-5 leading-relaxed"
        style={{ fontSize: "20px", color: "#fce7f3" }}
      >
        Princess Azraiel is a 2dfd princess, and she doesn&apos;t outsource her obsession.
        She draws herself. She writes the protocols. She compiles the extensions.
        Everything you install has her fingerprints on it — because there was nobody else
        in the room.
      </p>

      <p
        className="manrope mb-4 leading-relaxed"
        style={{ fontSize: "14px", color: "rgba(253,242,248,0.68)" }}
      >
        She shipped{" "}
        <span style={{ color: "#ff1493", fontWeight: 500 }}>many programs</span> and more
        are coming — a long intensity session, two browser extensions, an Android wallpaper
        daemon, an infection protocol with five hundred links, a corruption site, and a
        pile of short .exe experiences —{" "}
        <span style={{ color: "#ff1493", fontWeight: 500 }}>all hand-built.</span> One
        princess, one engineer, one yandere stack, maintained herself between builds.
      </p>

      <p
        className="manrope mb-6 leading-relaxed"
        style={{ fontSize: "14px", color: "rgba(253,242,248,0.68)" }}
      >
        She does not consider herself a character. She considers herself a{" "}
        <span style={{ color: "#ff1493", fontWeight: 500 }}>developer with a crown.</span>{" "}
        There is a difference. She ships on her own schedule. You install on hers too.
      </p>

      <div className="mb-7">
        <div className="italiana italic text-3xl text-pink-400">
          — Princess Azraiel ♡
        </div>
      </div>

      {/* Portrait card */}
      <div className="p-4 rounded-2xl border border-pink-500/25 bg-pink-500/[0.04]">
        <div className="relative overflow-hidden rounded-xl bg-[#0a0408]" style={{ aspectRatio: "3/4" }}>
          <Image
            src="/landing/image.webp"
            alt="Princess Azraiel — portrait"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          {/* Light scanline overlay — CSS only, no animation */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0 1px, transparent 1px 3px)",
            }}
          />
        </div>
        <div className="mt-3 flex justify-between items-end">
          <div>
            <p className="sync text-[7px] tracking-widest text-pink-400/80 uppercase">
              Princess_Azraiel.exe
            </p>
            <p className="italiana italic text-2xl text-white mt-0.5">
              Online Domination <em className="text-pink-300">V4.1</em>
            </p>
          </div>
          <span className="flex items-center gap-1.5 sync text-[7px] tracking-[0.3em] text-pink-400 border border-pink-500/40 px-2 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            LIVE
          </span>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   LINKS TAB
────────────────────────────────────────────── */
function LinksTab() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <span className="sync text-[8px] tracking-[0.45em] text-pink-400 uppercase">
          Quick Access
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-pink-500/40 to-transparent" />
      </div>

      <div className="space-y-2.5 mb-8">
        {QUICK_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="group flex items-center justify-between w-full p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-pink-500/[0.06] hover:border-pink-500/25 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              {link.icon && (
                <span className="text-white/40 group-hover:text-pink-300 transition-colors">
                  {link.icon}
                </span>
              )}
              <span className="manrope text-sm text-white/70 group-hover:text-white transition-colors">
                {link.label}
              </span>
            </div>
            <svg
              className="w-4 h-4 text-white/20 group-hover:text-pink-400/70 transition-colors flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>

      <div className="border-t border-white/[0.07] pt-6">
        <p className="sync text-[8px] tracking-[0.35em] text-white/30 uppercase mb-3">
          Navigation
        </p>
        <div className="grid grid-cols-2 gap-2">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center gap-2 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-pink-500/25 hover:bg-pink-500/[0.05] transition-all duration-300"
            >
              <span className="italiana text-[15px] text-white/60 group-hover:text-white transition-colors leading-snug">
                {l.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   FLOATING HEARTS
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
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        dur: 18 + Math.random() * 22,
        delay: Math.random() * 20,
        size: 6 + Math.random() * 14,
        op: 0.03 + Math.random() * 0.08,
      }))
    );
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: "absolute",
            bottom: "-8%",
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            opacity: h.op,
            animation: `floatUp ${h.dur}s linear ${h.delay}s infinite`,
            color: "#ec4899",
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

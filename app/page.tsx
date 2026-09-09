import Link from "next/link";
import Image from "next/image";
import { Italiana, Manrope, Syncopate } from "next/font/google";
import {
  ArrowUpRight,
  Coffee,
  Gift,
  Globe,
  Radio,
  Send,
  Bird,
  Gamepad2,
} from "lucide-react";
import { links, routes, socials } from "@/lib/links";

/**
 * Self-hosted through next/font rather than the `@import url(fonts.googleapis)`
 * inside a <style> block that the older pages use. That pattern re-downloads
 * the same three families per route and flashes unstyled text on each one.
 */
const italiana = Italiana({ weight: "400", subsets: ["latin"], variable: "--f-display" });
const manrope = Manrope({ subsets: ["latin"], variable: "--f-body" });
const syncopate = Syncopate({ weight: ["400", "700"], subsets: ["latin"], variable: "--f-mono" });

/** lib/links.ts stays free of component imports, so icons are mapped here. */
const ICONS = {
  send: Send,
  bird: Bird,
  globe: Globe,
  gift: Gift,
  coffee: Coffee,
  gamepad: Gamepad2,
} as const;

const EXPERIENCES = [
  { label: "Yandere", href: routes.yandere, note: "9 chapters" },
  { label: "Amae", href: routes.amae, note: "visual novel" },
  { label: "Corruption", href: routes.corruption, note: "web" },
  { label: "PrincessOS", href: routes.princessos, note: "desktop" },
  { label: "Ascension", href: routes.ascension, note: "4 stages" },
  { label: "ProjectOS", href: routes.projectos, note: "terminal" },
];

/** Counted from the repo, not invented. */
const FACTS = [
  "10 programs in the archive",
  "9 AI personas in the Infection Protocol",
  "9 chapters of the Yandere Experience",
  "2 volumes of the comic",
  "Protocol V4.1",
];

function Panel({
  label,
  className = "",
  children,
}: {
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-pink-500/15 bg-[#0a0509]/80
                  p-5 shadow-[0_20px_60px_-30px_rgba(236,72,153,0.45)] ${className}`}
    >
      {label && (
        <div className="mb-3 font-[family-name:var(--f-mono)] text-[8.5px] uppercase tracking-[0.28em] text-pink-100/35">
          {label}
        </div>
      )}
      {children}
    </section>
  );
}

export default function LandingPage() {
  return (
    <div
      className={`${italiana.variable} ${manrope.variable} ${syncopate.variable}
                  relative min-h-screen bg-[#050306] text-pink-50
                  font-[family-name:var(--f-body)] selection:bg-pink-500 selection:text-black`}
    >
      {/* Ambience. Sits behind everything and eats no clicks. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_18%_-5%,rgba(236,72,153,0.16),transparent_62%),radial-gradient(760px_420px_at_88%_8%,rgba(147,51,234,0.12),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.5] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.22)_50%)] bg-[length:100%_3px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 pb-16 pt-24 sm:px-6">
        {/* pt-24 on the wrapper already clears the fixed nav burger. */}
        <header className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--f-display)] text-4xl leading-none tracking-tight text-pink-50 sm:text-5xl">
              Princess Azraiel
            </h1>
            <p className="mt-1 font-[family-name:var(--f-mono)] text-[9px] uppercase tracking-[0.3em] text-pink-500">
              a 2dfd princess
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-pink-100/55">
            {[
              ["Programs", routes.programs],
              ["Sessions", routes.sessions],
              ["Comic", routes.comic],
              ["Links", routes.links],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-pink-200">
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12">
          {/* ── Identity ─────────────────────────────────────────── */}
          <Panel label="About her" className="md:col-span-3 lg:col-span-3 lg:row-span-2">
            <div className="flex items-start gap-4">
              <Image
                src="/images/pfp.png"
                alt="Princess Azraiel"
                width={72}
                height={72}
                priority
                className="h-[72px] w-[72px] shrink-0 rounded-xl border border-pink-500/30 object-cover"
              />
              <p className="text-[13.5px] leading-relaxed text-pink-100/70">
                Interactive fiction, psychological horror and hypnosis experiences.
                Built to be clicked, obeyed and regretted.
              </p>
            </div>

            <ul className="mt-5 space-y-2">
              {FACTS.map((f) => (
                <li key={f} className="flex gap-2.5 text-[13px] text-pink-100/60">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-pink-500" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={routes.contract}
              className="mt-5 inline-flex items-center gap-1.5 font-[family-name:var(--f-mono)]
                         text-[9px] uppercase tracking-[0.2em] text-pink-400 transition hover:text-pink-200"
            >
              Read the contract <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Panel>

          {/* ── Flagship ─────────────────────────────────────────── */}
          <Link
            href={routes.infection}
            className="group relative col-span-1 min-h-[300px] overflow-hidden rounded-2xl
                       border border-pink-500/20 md:col-span-3 lg:col-span-6 lg:row-span-2"
          >
            {/* The art is square/portrait, so it lives in its own column rather
                than being letterboxed into a wide banner and cropped to a band. */}
            <div className="absolute inset-0 md:inset-y-0 md:left-auto md:right-0 md:w-[52%]">
              <Image
                src="/infection/og.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover object-top transition duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050306] via-[#050306]/80 to-[#050306]/35
                            md:bg-gradient-to-r md:via-[#050306]/85 md:to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:max-w-[62%]">
              <span className="mb-2 w-fit rounded-full border border-pink-500/40 bg-pink-500/10 px-2.5 py-1 font-[family-name:var(--f-mono)] text-[8px] uppercase tracking-[0.25em] text-pink-300">
                Flagship
              </span>
              <h2 className="font-[family-name:var(--f-display)] text-4xl leading-none text-pink-50 sm:text-5xl">
                Infection Protocol
              </h2>
              <p className="mt-2 max-w-md text-[13.5px] text-pink-100/60">
                Nine AI personas loose in your Discord DMs. Pick how hard it
                floods — a gentle drip, or all of them at once.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 font-[family-name:var(--f-mono)] text-[9px] uppercase tracking-[0.2em] text-pink-300">
                Enter <ArrowUpRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>

          {/* ── Status ───────────────────────────────────────────── */}
          <Panel label="Status" className="md:col-span-3 lg:col-span-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
              </span>
              <span className="text-[15px] text-pink-100/85">Accepting new pets</span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-pink-100/55">
              New drops land in the Discord first.
            </p>
          </Panel>

          {/* Sessions */}
          <Panel label="Book her" className="md:col-span-3 lg:col-span-3">
            <Link href={routes.sessions} className="group block">
              <h3 className="font-[family-name:var(--f-display)] text-2xl leading-tight text-pink-50">
                Live sessions
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-pink-100/55">
                Techdom, AnyDesk, draining, chess and blackjack — one on one,
                on her terms.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 font-[family-name:var(--f-mono)] text-[9px] uppercase tracking-[0.2em] text-pink-400 transition group-hover:text-pink-200">
                See sessions <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          </Panel>

          {/* ── Experiences ──────────────────────────────────────── */}
          <Panel label="Experiences" className="md:col-span-6 lg:col-span-6">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {EXPERIENCES.map(({ label, href, note }) => (
                <Link
                  key={href}
                  href={href}
                  className="group rounded-xl border border-pink-500/10 bg-pink-500/[0.03] p-3
                             transition hover:border-pink-500/35 hover:bg-pink-500/[0.08]"
                >
                  <div className="font-[family-name:var(--f-display)] text-xl text-pink-50">
                    {label}
                  </div>
                  <div className="mt-0.5 font-[family-name:var(--f-mono)] text-[8px] uppercase tracking-[0.2em] text-pink-100/35">
                    {note}
                  </div>
                </Link>
              ))}
            </div>
          </Panel>

          {/* ── Rebrand ──────────────────────────────────────────── */}
          <Link
            href={routes.rebrand}
            className="group relative col-span-1 min-h-[190px] overflow-hidden rounded-2xl
                       border border-pink-500/20 md:col-span-3 lg:col-span-3"
          >
            <Image
              src="/images/banner.png"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover opacity-75 transition duration-700 group-hover:opacity-95 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050306] via-[#050306]/55 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="font-[family-name:var(--f-mono)] text-[8.5px] uppercase tracking-[0.28em] text-pink-100/35">
                Identity overwrite
              </div>
              <h3 className="mt-1.5 font-[family-name:var(--f-display)] text-2xl leading-tight text-pink-50">
                Give her your profile
              </h3>
              <p className="mt-1 text-[12.5px] text-pink-100/55">
                One tap. New name, new face, new timeline.
              </p>
            </div>
          </Link>

          {/* ── Comic ────────────────────────────────────────────── */}
          <Link
            href={routes.comic}
            className="group relative col-span-1 min-h-[190px] overflow-hidden rounded-2xl
                       border border-pink-500/20 md:col-span-3 lg:col-span-3"
          >
            <Image
              src="/comic/1/0.png"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover object-top opacity-90 transition duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050306] via-[#050306]/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="font-[family-name:var(--f-mono)] text-[8.5px] uppercase tracking-[0.28em] text-pink-100/35">
                2 volumes
              </div>
              <h3 className="mt-1.5 font-[family-name:var(--f-display)] text-2xl text-pink-50">
                The Comic
              </h3>
            </div>
          </Link>

          {/* ── Socials ──────────────────────────────────────────── */}
          <Panel label="Find her" className="md:col-span-3 lg:col-span-3">
            <div className="grid grid-cols-3 gap-2">
              {socials.map(({ key, label, href, icon }) => {
                const Icon = ICONS[icon];
                return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border
                             border-pink-500/15 bg-pink-500/[0.04] py-3 text-pink-300
                             transition hover:border-pink-500/40 hover:bg-pink-500/[0.1] hover:text-pink-100"
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-[family-name:var(--f-mono)] text-[7.5px] uppercase tracking-[0.16em] text-pink-100/45">
                    {label}
                  </span>
                </a>
                );
              })}
            </div>
          </Panel>

          {/* ── Programs ─────────────────────────────────────────── */}
          <Panel label="Archive" className="md:col-span-3 lg:col-span-3">
            <Link href={routes.programs} className="group block">
              <div className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--f-display)] text-5xl leading-none text-pink-50">
                  10
                </span>
                <span className="text-[13px] text-pink-100/55">programs</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-pink-100/55">
                Executables, extensions and browser toys. Some of them install
                themselves.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 font-[family-name:var(--f-mono)] text-[9px] uppercase tracking-[0.2em] text-pink-400 transition group-hover:text-pink-200">
                Browse <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          </Panel>

          {/* ── Contact ──────────────────────────────────────────── */}
          <Panel label="Contact" className="md:col-span-6 lg:col-span-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <p className="flex-1 min-w-[220px] text-[13.5px] leading-relaxed text-pink-100/60">
                Come say something. The Discord is where most of it happens — new
                drops land there first.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-pink-500/30
                             bg-pink-500/10 px-4 py-2.5 text-[13px] text-pink-100
                             transition hover:border-pink-500/60 hover:bg-pink-500/20"
                >
                  <Radio className="h-3.5 w-3.5" /> Join the Discord
                </a>
                <Link
                  href={routes.links}
                  className="inline-flex items-center gap-2 rounded-xl border border-pink-500/15
                             px-4 py-2.5 text-[13px] text-pink-100/70 transition
                             hover:border-pink-500/40 hover:text-pink-100"
                >
                  Every link
                </Link>
              </div>
            </div>
          </Panel>
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 px-1">
          <p className="font-[family-name:var(--f-mono)] text-[8.5px] uppercase tracking-[0.28em] text-pink-100/25">
            Protocol V4.1 · 18+ only
          </p>
          <div className="flex gap-4 text-[12px] text-pink-100/40">
            <Link href={routes.terms} className="transition hover:text-pink-200">Terms</Link>
            <Link href={routes.privacy} className="transition hover:text-pink-200">Privacy</Link>
            <Link href={routes.report} className="transition hover:text-pink-200">Report content</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

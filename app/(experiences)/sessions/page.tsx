import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sessions",
  description:
    "Bookable techdom, AnyDesk, draining, chess, and blackjack sessions with Princess Azraiel.",
};

const sessionTypes = [
  {
    id: "SX-01",
    title: "Techdom / AnyDesk Session",
    price: "50€+",
    heat: "remote",
    glyph: "A/D",
    details: ["screen-share", "techdom mode", "guided access"],
    accent: "cyan",
  },
  {
    id: "SX-02",
    title: "Draining Session",
    price: "35€+",
    heat: "fast",
    glyph: "$$",
    details: ["tribute pacing", "timer pressure", "receipt check"],
    accent: "pink",
  },
  {
    id: "SX-03",
    title: "HOT CHESS Session",
    price: "25€+",
    heat: "blitz",
    glyph: "♜",
    details: ["chess board", "stake rules", "checkmate"],
    accent: "amber",
  },
  {
    id: "SX-04",
    title: "Blackjack Session",
    price: "25€+",
    heat: "gambling",
    glyph: "21",
    details: ["blackjack table", "gambling mode", "stake rules"],
    accent: "violet",
  },
] as const;

const tickerItems = [
  "BOOKING_GATE: OPEN",
  "PAYMENT_FIRST: TRUE",
  "CONSENT_CHECK: REQUIRED",
  "TECHDOM_ANYDESK: 50EUR",
  "HOT_CHESS: ARMED",
  "BLACKJACK: 21",
  "DRAIN_RATE: VARIABLE",
];

const dataColumns = ["101001", "0x13", "++", "A/D", "404", "CHESS", "21", "$RUN"];

const buyAccessUrl = "https://throne.com/princessazraiel";
const dmPrincessUrl = "https://x.com/PrincessAzraiel";

export default function SessionsPage() {
  return (
    <div className="sessions-shell relative min-h-screen overflow-hidden bg-[#020304] text-zinc-100">
      <style>{`
        .sessions-shell {
          --grid-cyan: rgba(34, 211, 238, 0.12);
          --grid-pink: rgba(236, 72, 153, 0.11);
        }

        .sessions-grid {
          background-image:
            linear-gradient(var(--grid-cyan) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-pink) 1px, transparent 1px);
          background-size: 26px 26px;
          animation: pixel-drift 18s linear infinite;
        }

        .sessions-scan {
          background: repeating-linear-gradient(
            0deg,
            transparent 0 8px,
            rgba(255,255,255,0.075) 9px,
            transparent 10px
          );
          animation: scan-roll 6s linear infinite;
        }

        .sessions-card {
          clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
        }

        .sessions-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.14) 42%, transparent 58%);
          transform: translateX(-120%);
          animation: card-sweep 5.8s ease-in-out infinite;
          pointer-events: none;
        }

        .sessions-ticker {
          animation: ticker-slide 24s linear infinite;
        }

        .sessions-data {
          animation: data-fall 7s linear infinite;
        }

        .sessions-blink {
          animation: blink-led 1.2s steps(2, end) infinite;
        }

        .sessions-glitch {
          text-shadow:
            2px 0 rgba(34,211,238,0.75),
            -2px 0 rgba(236,72,153,0.75),
            0 0 24px rgba(236,72,153,0.35);
          animation: title-jitter 3.4s steps(1, end) infinite;
        }

        @keyframes pixel-drift {
          from { background-position: 0 0, 0 0; }
          to { background-position: 52px 52px, -52px 26px; }
        }

        @keyframes scan-roll {
          from { transform: translateY(-10px); }
          to { transform: translateY(10px); }
        }

        @keyframes card-sweep {
          0%, 54% { transform: translateX(-120%); opacity: 0; }
          62% { opacity: 1; }
          78%, 100% { transform: translateX(120%); opacity: 0; }
        }

        @keyframes ticker-slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes data-fall {
          from { transform: translateY(-50%); }
          to { transform: translateY(0); }
        }

        @keyframes blink-led {
          0%, 48% { opacity: 1; }
          49%, 100% { opacity: 0.25; }
        }

        @keyframes title-jitter {
          0%, 88%, 100% { transform: translate(0, 0); }
          89% { transform: translate(2px, -1px); }
          90% { transform: translate(-2px, 1px); }
          91% { transform: translate(1px, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .sessions-grid,
          .sessions-scan,
          .sessions-card::before,
          .sessions-ticker,
          .sessions-data,
          .sessions-blink,
          .sessions-glitch {
            animation: none;
          }
        }
      `}</style>

      <div className="sessions-grid fixed inset-0 opacity-80" aria-hidden="true" />
      <div className="sessions-scan fixed inset-0 opacity-35" aria-hidden="true" />
      <div className="fixed inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(236,72,153,0.18),rgba(34,211,238,0.08),transparent)]" />

      <div className="pointer-events-none fixed inset-y-0 right-3 hidden w-20 overflow-hidden font-mono text-[10px] text-cyan-200/30 md:block">
        <div className="sessions-data grid gap-5 py-5">
          {[...dataColumns, ...dataColumns, ...dataColumns].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="sessions-card relative overflow-hidden border border-cyan-300/35 bg-black/82 p-5 shadow-[10px_10px_0_rgba(34,211,238,0.18)] sm:p-7">
            <PixelCorners tone="cyan" />

            <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 font-mono text-[10px] uppercase tracking-[0.26em]">
              <span className="text-cyan-200">remote session market</span>
              <span className="border border-pink-400/45 bg-pink-500/12 px-2.5 py-1 text-pink-100">
                slot index / 04
              </span>
            </div>

            <div className="grid gap-7 lg:grid-cols-[1fr_190px] lg:items-end">
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.34em] text-lime-200">
                  techdom+anydesk / drain / chess / blackjack
                </p>
                <h1 className="sessions-glitch font-mono text-4xl font-black uppercase leading-[0.9] text-white sm:text-6xl lg:text-7xl">
                  Sessions
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
                  Bookable live sessions with visible starting tributes and
                  clear session modes. Final scope can shift by request, but
                  the starting signal is shown up front.
                </p>
              </div>

              <div className="border border-white/12 bg-white/[0.035] p-4 font-mono">
                <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  <span className="sessions-blink h-2 w-2 bg-lime-300" />
                  live stats
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MiniMetric label="modes" value="04" />
                  <MiniMetric label="min" value="25€" />
                  <MiniMetric label="remote" value="50€" />
                  <MiniMetric label="pay" value="1st" />
                </div>
              </div>
            </div>
          </div>

          <aside className="sessions-card relative overflow-hidden border border-pink-400/35 bg-[#070409]/92 p-3 shadow-[10px_10px_0_rgba(236,72,153,0.18)]">
            <PixelCorners tone="pink" />
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-black">
              <Image
                src="/landing/image.webp"
                alt="Princess Azraiel session operator"
                fill
                priority
                sizes="(min-width: 1024px) 360px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.78))]" />
              <div className="absolute inset-0 opacity-40 mix-blend-screen [background-image:repeating-linear-gradient(0deg,rgba(34,211,238,0.22)_0_1px,transparent_1px_5px)]" />
              <div className="absolute bottom-3 left-3 right-3 border border-cyan-300/35 bg-black/75 p-3 font-mono">
                <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-200">
                  operator status
                </p>
                <p className="mt-2 text-xl font-black uppercase text-white">
                  available by slot
                </p>
              </div>
            </div>
          </aside>
        </section>

        <div className="overflow-hidden border border-white/10 bg-black/70 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100">
          <div className="sessions-ticker flex w-max gap-8 px-4">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item}-${index}`} className="whitespace-nowrap">
                {item} <span className="text-pink-300">::</span>
              </span>
            ))}
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sessionTypes.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="sessions-card relative border border-lime-300/25 bg-black/76 p-5">
            <PixelCorners tone="lime" />
            <h2 className="font-mono text-xl font-black uppercase text-lime-100">
              Booking Protocol
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {[
                ["01", "pick mode"],
                ["02", "confirm price"],
                ["03", "pay first"],
                ["04", "enter session"],
              ].map(([step, label]) => (
                <div key={step} className="border border-white/10 bg-white/[0.03] p-4">
                  <span className="font-mono text-2xl font-black text-pink-200">
                    {step}
                  </span>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-zinc-300">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="sessions-card relative border border-amber-200/30 bg-black/76 p-5">
            <PixelCorners tone="amber" />
            <h2 className="font-mono text-xl font-black uppercase text-amber-100">
              Price Rules
            </h2>
            <p className="mt-4 text-sm leading-6 text-zinc-300">
              Listed tags are starting prices. Custom tasks, added stakes, or
              repeated extensions can raise the final tribute.
            </p>
            <SessionActions className="mt-5" />
          </div>
        </section>
      </main>
    </div>
  );
}

type Session = (typeof sessionTypes)[number];

function SessionCard({ session }: { session: Session }) {
  const accentClass = {
    cyan: "border-cyan-300/40 text-cyan-100 shadow-[7px_7px_0_rgba(34,211,238,0.16)]",
    pink: "border-pink-300/45 text-pink-100 shadow-[7px_7px_0_rgba(236,72,153,0.17)]",
    lime: "border-lime-300/35 text-lime-100 shadow-[7px_7px_0_rgba(163,230,53,0.13)]",
    amber: "border-amber-200/40 text-amber-100 shadow-[7px_7px_0_rgba(251,191,36,0.14)]",
    violet: "border-violet-300/40 text-violet-100 shadow-[7px_7px_0_rgba(167,139,250,0.15)]",
  }[session.accent];

  return (
    <article
      className={`sessions-card relative min-h-[300px] overflow-hidden border bg-black/78 p-5 ${accentClass}`}
    >
      <PixelCorners tone={session.accent} />

      <div className="mb-5 flex items-start justify-between gap-3 font-mono">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            {session.id}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
            mode: {session.heat}
          </p>
        </div>
        <div className="border border-white/15 bg-white/[0.04] px-2.5 py-2 text-lg font-black">
          {session.glyph}
        </div>
      </div>

      <h2 className="font-mono text-2xl font-black uppercase leading-none text-white">
        {session.title}
      </h2>

      <div className="mt-6">
        <PriceChip label="starts at" value={session.price} />
      </div>

      <div className="mt-6 space-y-2">
        {session.details.map((detail, index) => (
          <div
            key={detail}
            className="flex items-center justify-between border-b border-white/10 pb-2 font-mono text-[10px] uppercase tracking-[0.18em]"
          >
            <span className="text-zinc-500">0{index + 1}</span>
            <span className="text-zinc-300">{detail}</span>
          </div>
        ))}
      </div>

      <SessionActions className="mt-7" />
    </article>
  );
}

function SessionActions({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      <a
        href={buyAccessUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center justify-center border border-pink-400/50 bg-pink-500/12 px-3 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-pink-100 transition-colors hover:border-pink-300 hover:bg-pink-500/20"
      >
        Buy Access
      </a>
      <a
        href={dmPrincessUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center justify-center border border-cyan-300/45 bg-cyan-500/10 px-3 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 transition-colors hover:border-cyan-200 hover:bg-cyan-400/15"
      >
        DM Princess
      </a>
    </div>
  );
}

function PriceChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/12 bg-white/[0.035] p-3 font-mono">
      <p className="text-[9px] uppercase tracking-[0.24em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-black leading-none text-white">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/45 p-2">
      <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function PixelCorners({
  tone = "cyan",
}: {
  tone?: "cyan" | "pink" | "lime" | "amber" | "violet";
}) {
  const color = {
    cyan: "bg-cyan-200",
    pink: "bg-pink-300",
    lime: "bg-lime-300",
    amber: "bg-amber-200",
    violet: "bg-violet-300",
  }[tone];

  return (
    <>
      <span className={`absolute left-0 top-0 h-2 w-2 ${color}`} />
      <span className={`absolute right-0 top-0 h-2 w-2 ${color}`} />
      <span className={`absolute bottom-0 left-0 h-2 w-2 ${color}`} />
      <span className={`absolute bottom-0 right-0 h-2 w-2 ${color}`} />
    </>
  );
}

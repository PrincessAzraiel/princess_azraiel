// app/programs/the25/page.tsx
import Link from "next/link";
import { THE25_DAYS } from "@/lib/the25";

export const metadata = {
  title: "THE 25TH — Readme Index",
  description: "All THE 25TH day READMEs in one place.",
};

const BUY_URL = "https://throne.com/princessazraiel/item/8cf2273f-baf4-4d04-838b-f3b932e840ea";

export default function The25Page() {
  const now = new Date();
  const month = now.getMonth(); // 0=Jan ... 11=Dec
  const dayOfMonth = now.getDate();
  const isDecember = month === 11;

  return (
    <main className="min-h-screen bg-black text-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <header className="space-y-6">
          <div className="text-center space-y-3">
            <p className="text-xs tracking-[0.35em] uppercase text-pink-400">
              Program
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold">
              THE 25TH — README INDEX
            </h1>
            <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto">
              All 25 days of{" "}
              <span className="text-pink-400">THE 25TH</span>. Read the required
              README for each day — but only once it unlocks.
            </p>
          </div>

          {/* Purchase Card */}
          <div className="rounded-3xl border border-pink-500/40 bg-gradient-to-br from-pink-500/20 via-fuchsia-500/10 to-sky-500/10 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-pink-200">
                The 25th • Windows Program
              </p>
              <h2 className="text-lg md:text-xl font-semibold">
                Unlock 25 days of yandere tech-dominance.
              </h2>
              <p className="text-xs md:text-sm text-pink-50/80 max-w-xl">
                A standalone Windows program with advent-style progression,
                hypnotic tasks, puzzles, fear, control — all offline.
              </p>
            </div>

            <div className="flex flex-col min-w-[180px] gap-2">
              <Link
                href={BUY_URL}
                className="inline-flex items-center justify-center rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-pink-500/40 hover:bg-pink-400 transition-colors"
              >
                Get THE 25TH Program
              </Link>
              <p className="text-[10px] text-pink-100/70 text-center uppercase tracking-[0.18em]">
                Windows • Offline • One-time purchase
              </p>
            </div>
          </div>
        </header>

        {/* Advent Cards */}
        <section className="grid gap-4 md:grid-cols-2">
          {THE25_DAYS.map((day) => {
            const unlocked = isDecember && dayOfMonth >= day.day;

            return (
              <article
                key={day.day}
                className={`relative overflow-hidden rounded-2xl border p-4 md:p-5 transition-colors
                  ${
                    unlocked
                      ? "border-pink-500/20 bg-zinc-950/70 hover:border-pink-400/70"
                      : "border-zinc-800 bg-zinc-900/50 opacity-60"
                  }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-pink-400">
                    Day {day.day.toString().padStart(2, "0")}
                  </span>

                  {!unlocked && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Locked
                    </span>
                  )}
                </div>

                {/* TITLE */}
                <h2 className="mt-2 text-lg font-semibold">
                  {unlocked ? day.title : "— Locked Day —"}
                </h2>

                {/* DESCRIPTION */}
                <p className="mt-2 text-xs md:text-sm text-zinc-400">
                  {unlocked
                    ? day.desc
                    : `Unlocks on December ${day.day.toString().padStart(2, "0")}`}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  {unlocked ? (
                    <Link
                      href={`/the25/${day.code}`}
                      className="inline-flex items-center rounded-full border border-pink-500/70 px-3 py-1.5 text-xs font-medium text-pink-50 bg-pink-500/10 hover:bg-pink-500/20 transition-colors"
                    >
                      Open README
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-500 bg-zinc-900/80 cursor-not-allowed"
                    >
                      Locked
                    </button>
                  )}

                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    princessazraiel.com/the25
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

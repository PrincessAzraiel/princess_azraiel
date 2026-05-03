// app/the25/[code]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { THE25_READMES, getReadmeByCode } from "@/lib/the25";

type Props = {
  params: { code: string };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return THE25_READMES.map((day) => ({ code: day.code }));
}

export function generateMetadata({ params }: Props) {
  const day = getReadmeByCode(params.code);
  if (!day) return {};
  return {
    title: `THE 25TH — Day ${day.day.toString().padStart(2, "0")} · ${
      day.title
    }`,
    description: day.short,
  };
}

export default function The25ReadmePage({ params }: Props) {
  const day = getReadmeByCode(params.code);
  if (!day) notFound();

  const label = `Day ${day.day.toString().padStart(2, "0")}`;

  return (
    <main className="min-h-screen bg-black text-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <Link
            href="/the25"
            className="inline-flex text-[11px] uppercase tracking-[0.25em] text-pink-400/80 hover:text-pink-300"
          >
            ← Back to all days
          </Link>

          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-pink-400">
              THE 25TH · {label}
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold">{day.title}</h1>
            <p className="text-sm md:text-base text-zinc-400">{day.short}</p>
          </div>
        </header>

        <section className="space-y-6">
          {day.sections.map((section) => (
            <article
              key={section.heading}
              className="rounded-2xl border border-pink-500/15 bg-zinc-950/70 p-4 md:p-5"
            >
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-300 mb-2">
                {section.heading}
              </h2>
              <ul className="space-y-1.5 text-sm text-zinc-300">
                {section.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-[6px] h-[4px] w-[4px] rounded-full bg-pink-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <footer className="border-t border-zinc-800 pt-4 text-[11px] text-zinc-500 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <span>
            This is an informational README for the standalone Windows program
            for {label}. It describes what the mini-game does and what it does
            not do to your PC.
          </span>
          <span className="uppercase tracking-[0.18em] text-pink-400">
            princessazraiel.com/the25
          </span>
        </footer>
      </div>
    </main>
  );
}

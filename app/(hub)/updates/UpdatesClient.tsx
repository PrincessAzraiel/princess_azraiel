"use client";

import * as React from "react";
import Image from "next/image";

type Update = {
  id: string;
  date: string;
  title: string;
  body: string;
  tags?: string[];
  status?: "released" | "in-progress" | "planned" | "fix" | "breaking";
  link?: { label: string; href: string };
  image?: string;
  gallery?: string[];
};

function cls(...x: (string | false | undefined)[]) {
  return x.filter(Boolean).join(" ");
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

function relativeTime(iso: string) {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = then - now;
  const minutes = Math.round(diffMs / 60000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  return rtf.format(days, "day");
}

function statusTheme(s?: Update["status"]) {
  switch (s) {
    case "released":
      return { chip: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30", glow: "via-emerald-500/20" };
    case "in-progress":
      return { chip: "bg-amber-500/15 text-amber-300 ring-amber-500/30", glow: "via-amber-500/20" };
    case "planned":
      return { chip: "bg-sky-500/15 text-sky-300 ring-sky-500/30", glow: "via-sky-500/20" };
    case "fix":
      return { chip: "bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-500/30", glow: "via-fuchsia-500/20" };
    case "breaking":
      return { chip: "bg-rose-600/20 text-rose-300 ring-rose-600/30", glow: "via-rose-600/20" };
    default:
      return { chip: "bg-zinc-700/30 text-zinc-300 ring-zinc-600/40", glow: "via-zinc-500/20" };
  }
}

function CardSkeleton() {
  return (
    <li className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 ring-1 ring-zinc-900/50">
      <div className="h-5 w-24 animate-pulse rounded bg-zinc-800/60" />
      <div className="mt-3 h-6 w-3/4 animate-pulse rounded bg-zinc-800/60" />
      <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-zinc-800/60" />
      <div className="mt-4 h-32 w-full animate-pulse rounded-lg bg-zinc-800/50" />
    </li>
  );
}

export default function UpdatesClient() {
  const [updates, setUpdates] = React.useState<Update[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [q, setQ] = React.useState("");
  const [tag, setTag] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/updates", { cache: "no-store" });
        const json = await res.json();
        if (alive) setUpdates(json.updates ?? []);
      } catch {
        /* no-op */
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const allTags = React.useMemo(() => {
    const s = new Set<string>();
    for (const u of updates) (u.tags ?? []).forEach(t => s.add(t));
    return Array.from(s).sort();
  }, [updates]);

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return updates.filter(u => {
      const matchesQ =
        !needle ||
        u.title.toLowerCase().includes(needle) ||
        u.body.toLowerCase().includes(needle) ||
        (u.tags ?? []).some(t => t.toLowerCase().includes(needle));
      const matchesTag = !tag || (u.tags ?? []).includes(tag);
      return matchesQ && matchesTag;
    });
  }, [updates, q, tag]);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Updates <span className="text-zinc-400">&</span> Roadmap
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            What shipped, what’s cooking, and where we’re heading.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search updates…"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm outline-none placeholder:text-zinc-500 focus:border-zinc-600 sm:w-72"
          />
          <div className="flex flex-wrap items-center gap-2">
            <FilterPill active={tag === null} onClick={() => setTag(null)} label="All" />
            {allTags.map((t) => (
              <FilterPill
                key={t}
                active={tag === t}
                onClick={() => setTag(prev => (prev === t ? null : t))}
                label={`#${t}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <ul className="grid gap-6 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </ul>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8 text-center text-zinc-400">
          No updates match your filter.
        </div>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {filtered.map((u) => (
            <UpdateCard key={u.id} u={u} />
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Pieces ---------- */

function FilterPill({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "rounded-full px-3 py-1 text-xs ring-1 transition",
        active
          ? "bg-pink-500/20 text-pink-200 ring-pink-500/40"
          : "bg-zinc-900 text-zinc-300 ring-zinc-800 hover:bg-zinc-800"
      )}
    >
      {label}
    </button>
  );
}

function UpdateCard({ u }: { u: Update }) {
  const theme = statusTheme(u.status);

  return (
    <li
      className={cls(
        "group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-950/80 to-zinc-950/40 p-5 ring-1 ring-inset ring-zinc-900/60",
        "before:pointer-events-none before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-r before:from-pink-500/15",
        `before:${theme.glow}`,
        "before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
      )}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={cls("rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1", theme.chip)}>
            {u.status ?? "update"}
          </span>
          <div className="text-sm text-zinc-400">
            <time dateTime={u.date} title={new Date(u.date).toString()}>
              {formatDate(u.date)}
            </time>
            <span className="mx-2 text-zinc-600">•</span>
            <span className="text-zinc-400">{relativeTime(u.date)}</span>
          </div>
        </div>

        {(u.tags?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-2">
            {u.tags!.map((t) => (
              <span
                key={t}
                className="rounded-full bg-zinc-900/80 px-2.5 py-0.5 text-[11px] text-zinc-300 ring-1 ring-inset ring-zinc-800"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className="mt-3 text-lg font-semibold leading-tight text-zinc-100 group-hover:text-white">
        {u.title}
      </h2>

      {/* Body */}
      <p className="mt-1 text-sm leading-relaxed text-zinc-300">{u.body}</p>

      {/* Media */}
      {u.image && (
        <MediaImage src={u.image} alt={u.title} />
      )}

      {!u.image && u.gallery && u.gallery.length > 0 && (
        <MediaGallery images={u.gallery} title={u.title} />
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {u.link && (
          <a
            href={u.link.href}
            className="inline-flex items-center gap-1.5 rounded-lg border border-pink-500/30 bg-pink-500/10 px-3 py-1.5 text-sm text-pink-200 hover:border-pink-400/50 hover:bg-pink-500/15"
          >
            <ExternalIcon />
            {u.link.label}
          </a>
        )}
        <a
          href={`#${u.id}`}
          onClick={(e) => {
            e.preventDefault();
            const url = `${location.origin}${location.pathname}#${u.id}`;
            navigator.clipboard?.writeText(url);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-sm text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800"
        >
          <LinkIcon />
          Copy link
        </a>
      </div>

      {/* Anchor for deep-link */}
      <div id={u.id} className="absolute -top-24" />
    </li>
  );
}

function MediaImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800/70 bg-zinc-950">
      <div className="relative aspect-[16/9]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  );
}

function MediaGallery({ images, title }: { images: string[]; title: string }) {
  const top = images.slice(0, 4);
  const cols = top.length === 1 ? "grid-cols-1" : top.length === 2 ? "grid-cols-2" : "grid-cols-2";
  return (
    <div className="mt-4 grid gap-2 overflow-hidden rounded-xl border border-zinc-800/70 bg-zinc-950 p-2">
      <div className={cls("grid gap-2", cols)}>
        {top.map((src, i) => (
          <div key={src} className={cls("relative aspect-[16/10] overflow-hidden rounded-lg")}>
            <Image
              src={src}
              alt={`${title} — image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        ))}
      </div>
      {images.length > 4 && (
        <div className="px-1 pb-1 text-right text-xs text-zinc-500">+{images.length - 4} more</div>
      )}
    </div>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="opacity-80">
      <path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42l9.3-9.29H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="opacity-80">
      <path fill="currentColor" d="M10.59 13.41a1 1 0 0 1 0-1.41l2-2a1 1 0 1 1 1.41 1.41l-2 2a1 1 0 0 1-1.41 0ZM7 17a3 3 0 0 1 0-6h2a1 1 0 0 0 0-2H7a5 5 0 0 0 0 10h2a1 1 0 0 0 0-2H7Zm10-8h-2a1 1 0 0 0 0 2h2a3 3 0 0 1 0 6h-2a1 1 0 0 0 0 2h2a5 5 0 1 0 0-10Z"/>
    </svg>
  );
}

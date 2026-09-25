"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Heart,
  Music2,
  Play,
  Repeat,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";

export type MediaKind = "video" | "image" | "audio" | "document" | "other";

export type FeedItem = {
  // Short code used in share links so the file name never shows up there.
  id: string;
  name: string;
  src: string;
  kind: MediaKind;
  ext: string;
};

const LIKES_KEY = "azratok:likes";
const AUTO_KEY = "azratok:auto";
const SEEN_KEY = "azratok:seen";
// With auto-scroll on, pictures and other non-playing posts stay up this long.
const STILL_MS = 5000;
// Slides further than this from the one on screen drop their media so the
// browser isn't holding every video in memory at once.
const RENDER_WINDOW = 2;
// Another shuffled round is queued once the viewer gets this close to the end.
const REFILL_AHEAD = 3;
const DOUBLE_TAP_MS = 260;

// One entry per slide. The same file comes back in later rounds, so each
// slide gets its own key.
type FeedSlot = { key: string; item: FeedItem };

function readSet(key: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(key);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeSet(key: string, value: Set<string>) {
  try {
    window.localStorage.setItem(key, JSON.stringify([...value]));
  } catch {
    // Private mode or blocked storage: this just won't survive a reload.
  }
}

function shuffle<T>(list: T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// A round is every file once, in random order, with files the viewer hasn't
// seen ahead of the ones they have. A round never starts with the file the
// previous one ended on, so nothing plays twice in a row.
function makeRound(items: FeedItem[], seen: Set<string>, after?: FeedItem): FeedItem[] {
  const round = [
    ...shuffle(items.filter((item) => !seen.has(item.name))),
    ...shuffle(items.filter((item) => seen.has(item.name))),
  ];
  if (after && round.length > 1 && round[0].name === after.name) {
    [round[0], round[1]] = [round[1], round[0]];
  }
  return round;
}

function linkTo(item: FeedItem) {
  return `${window.location.origin}${window.location.pathname}#${item.id}`;
}

export default function AzraTokFeed({ items }: { items: FeedItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const rounds = useRef(0);
  // Built after mount: the shuffle has to happen in the browser, not on the server.
  const [feed, setFeed] = useState<FeedSlot[] | null>(null);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  // Browsers only allow sound once the viewer has touched the page.
  const [soundLocked, setSoundLocked] = useState(true);
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(false);

  const toSlots = useCallback((round: FeedItem[]): FeedSlot[] => {
    const n = rounds.current++;
    return round.map((item) => ({ key: `${n}:${item.name}`, item }));
  }, []);

  useEffect(() => {
    setLikes(readSet(LIKES_KEY));
    try {
      setAutoScroll(window.localStorage.getItem(AUTO_KEY) === "1");
    } catch {
      // Storage blocked: auto-scroll just starts off.
    }

    const first = makeRound(items, readSet(SEEN_KEY));
    // A shared link (/azratok#<id>) opens on that post.
    const linked = first.findIndex((item) => item.id === window.location.hash.slice(1));
    if (linked > 0) first.unshift(...first.splice(linked, 1));
    setFeed(toSlots(first));
  }, [items, toSlots]);

  const current = feed?.[active]?.item;

  // Remember what's been watched so the next visit leads with new posts.
  useEffect(() => {
    if (!current) return;
    const seen = readSet(SEEN_KEY);
    if (!seen.has(current.name)) {
      seen.add(current.name);
      // Forget files that have since been removed from the folder.
      const names = new Set(items.map((item) => item.name));
      writeSet(SEEN_KEY, new Set([...seen].filter((name) => names.has(name))));
    }
    window.history.replaceState(null, "", `#${current.id}`);
  }, [current, items]);

  // Endless feed: queue another shuffled round before the viewer runs out.
  useEffect(() => {
    if (!feed || items.length < 2) return;
    if (active < feed.length - REFILL_AHEAD) return;
    const last = feed[feed.length - 1].item;
    setFeed([...feed, ...toSlots(makeRound(items, new Set(), last))]);
  }, [active, feed, items, toSlots]);

  // Track which slide is on screen. Every slide is one viewport tall, so the
  // scroll position divided by the height is the index.
  const hasFeed = feed !== null;
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const onScroll = () => {
      if (!root.clientHeight) return;
      setActive(Math.round(root.scrollTop / root.clientHeight));
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, [hasFeed]);

  const feedLength = feed?.length ?? 0;
  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(feedLength - 1, index));
      slideRefs.current[clamped]?.scrollIntoView({ behavior: "smooth" });
    },
    [feedLength],
  );

  const unlockSound = useCallback(() => {
    setSoundLocked(false);
    setMuted(false);
  }, []);

  // The first tap, click or key press anywhere turns the sound on.
  useEffect(() => {
    if (!soundLocked) return;
    window.addEventListener("pointerdown", unlockSound, { once: true });
    window.addEventListener("keydown", unlockSound, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("keydown", unlockSound);
    };
  }, [soundLocked, unlockSound]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1600);
  }, []);

  const toggleAutoScroll = useCallback(() => {
    setAutoScroll((on) => {
      const next = !on;
      try {
        window.localStorage.setItem(AUTO_KEY, next ? "1" : "0");
      } catch {}
      showToast(next ? "Auto-scroll on" : "Auto-scroll off");
      return next;
    });
  }, [showToast]);

  const advance = useCallback(() => goTo(active + 1), [active, goTo]);

  const toggleLike = useCallback((name: string, force?: boolean) => {
    setLikes((prev) => {
      const next = new Set(prev);
      const shouldLike = force ?? !next.has(name);
      if (shouldLike) next.add(name);
      else next.delete(name);
      writeSet(LIKES_KEY, next);
      return next;
    });
  }, []);

  const share = useCallback(
    async (item: FeedItem) => {
      const url = linkTo(item);
      try {
        if (navigator.share) {
          await navigator.share({ title: "AzraTok", url });
          return;
        }
        await navigator.clipboard.writeText(url);
        showToast("Link copied");
      } catch {
        // Share sheet dismissed; nothing to do.
      }
    },
    [showToast],
  );

  // Keyboard controls for laptops.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.key === "ArrowDown" || e.key === "j" || e.key === "PageDown") {
        e.preventDefault();
        goTo(active + 1);
      } else if (e.key === "ArrowUp" || e.key === "k" || e.key === "PageUp") {
        e.preventDefault();
        goTo(active - 1);
      } else if (e.key === "a") {
        toggleAutoScroll();
      } else if (e.key === "m") {
        setMuted((m) => !m);
      } else if (e.key === "l") {
        if (current) toggleLike(current.name);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, current, goTo, toggleLike, toggleAutoScroll]);

  return (
    <div className="fixed inset-0 bg-black text-white select-none">
      <style>{`
        @keyframes azratok-heart {
          0% { transform: scale(0.4) rotate(-12deg); opacity: 0; }
          25% { transform: scale(1.15) rotate(-12deg); opacity: 1; }
          45% { transform: scale(1) rotate(-12deg); opacity: 1; }
          100% { transform: scale(1.3) translateY(-60px) rotate(-12deg); opacity: 0; }
        }
        .azratok-heart { animation: azratok-heart 0.9s ease-out forwards; }
        @keyframes azratok-countdown { from { width: 0%; } to { width: 100%; } }
        .azratok-countdown { width: 0%; animation: azratok-countdown linear forwards; }
      `}</style>
      {/* Soft glow behind the phone-shaped column on wide screens */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:block bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.18),transparent_60%)]"
      />

      {/* Header */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center pt-6">
        <span className="text-lg font-extrabold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Azra<span className="text-pink-400">Tok</span>
        </span>
        {items.length > 1 && (
          <button
            type="button"
            onClick={toggleAutoScroll}
            aria-pressed={autoScroll}
            aria-label="Auto-scroll"
            className={`pointer-events-auto absolute right-4 top-5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur transition md:right-6 ${
              autoScroll ? "bg-pink-500 text-white" : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <Repeat className="h-3.5 w-3.5" />
            Auto
          </button>
        )}
      </header>

      {soundLocked && current && (current.kind === "video" || current.kind === "audio") && (
        <button
          type="button"
          onClick={unlockSound}
          className="absolute left-1/2 top-16 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-black shadow-lg"
        >
          <VolumeX className="h-4 w-4" />
          Tap for sound
        </button>
      )}

      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <Music2 className="h-10 w-10 text-pink-400" />
          <p className="text-lg font-semibold">Nothing on the feed yet</p>
          <p className="text-sm text-white/60">
            Drop videos or pictures into <code className="text-pink-300">public/AzraTok</code>.
          </p>
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="relative h-full snap-y snap-mandatory overflow-y-scroll overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {feed?.map(({ key, item }, i) => (
            <Slide
              key={key}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              item={item}
              index={i}
              isActive={i === active}
              isNext={i === active + 1}
              isNear={Math.abs(i - active) <= RENDER_WINDOW}
              muted={muted}
              onToggleMute={() => setMuted((m) => !m)}
              soundLocked={soundLocked}
              liked={likes.has(item.name)}
              onLike={(force) => toggleLike(item.name, force)}
              onShare={() => share(item)}
              autoScroll={autoScroll && items.length > 1}
              onDone={advance}
            />
          ))}
        </div>
      )}

      {/* Up / down buttons on laptops */}
      {items.length > 1 && (
        <div className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          <NavButton label="Previous" disabled={active === 0} onClick={() => goTo(active - 1)}>
            <ChevronUp className="h-6 w-6" />
          </NavButton>
          <NavButton label="Next" disabled={false} onClick={() => goTo(active + 1)}>
            <ChevronDown className="h-6 w-6" />
          </NavButton>
        </div>
      )}

      {toast && (
        <div className="absolute left-1/2 top-20 z-40 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-black">
          {toast}
        </div>
      )}
    </div>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-12 w-12 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10"
    >
      {children}
    </button>
  );
}

type SlideProps = {
  ref: (el: HTMLElement | null) => void;
  item: FeedItem;
  index: number;
  isActive: boolean;
  isNext: boolean;
  isNear: boolean;
  muted: boolean;
  onToggleMute: () => void;
  soundLocked: boolean;
  liked: boolean;
  onLike: (force?: boolean) => void;
  onShare: () => void;
  autoScroll: boolean;
  onDone: () => void;
};

function Slide({
  ref,
  item,
  index,
  isActive,
  isNext,
  isNear,
  muted,
  onToggleMute,
  soundLocked,
  liked,
  onLike,
  onShare,
  autoScroll,
  onDone,
}: SlideProps) {
  const mediaRef = useRef<HTMLVideoElement & HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const lastTap = useRef(0);
  const tapTimer = useRef<number | undefined>(undefined);
  // The tap that turns sound on shouldn't also pause the video.
  const tapUnlockedSound = useRef(false);

  const playable = (item.kind === "video" || item.kind === "audio") && !failed;

  // Clips advance when they end (see onEnded); everything else gets a timer.
  useEffect(() => {
    if (!isActive || !autoScroll || playable) return;
    const timer = window.setTimeout(onDone, STILL_MS);
    return () => window.clearTimeout(timer);
  }, [isActive, autoScroll, playable, onDone]);

  // Play only the slide on screen; rewind the ones we scroll away from.
  useEffect(() => {
    const media = mediaRef.current;
    if (!media || !playable) return;
    if (isActive) {
      media.muted = muted;
      media.play().then(
        () => setPaused(false),
        () => {
          // Browsers block autoplay with sound until the user interacts.
          media.muted = true;
          media.play().then(() => setPaused(false), () => setPaused(true));
        },
      );
    } else {
      media.pause();
      media.currentTime = 0;
      setPaused(false);
    }
  }, [isActive, isNear, playable]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mediaRef.current) mediaRef.current.muted = muted;
  }, [muted]);

  // Smooth progress bar for the active clip.
  useEffect(() => {
    if (!isActive || !playable) return;
    let frame = 0;
    const tick = () => {
      const media = mediaRef.current;
      if (media && progressRef.current && media.duration) {
        progressRef.current.style.width = `${(media.currentTime / media.duration) * 100}%`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isActive, playable]);

  const togglePlay = () => {
    const media = mediaRef.current;
    if (!media || !playable) return;
    if (media.paused) {
      media.play().then(() => setPaused(false), () => {});
    } else {
      media.pause();
      setPaused(true);
    }
  };

  // Single tap pauses, double tap likes (like TikTok).
  const onTap = (e: React.PointerEvent<HTMLDivElement>) => {
    if (tapUnlockedSound.current) {
      tapUnlockedSound.current = false;
      return;
    }
    const now = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      window.clearTimeout(tapTimer.current);
      lastTap.current = 0;
      onLike(true);
      const id = now;
      setHearts((h) => [...h, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      window.setTimeout(() => setHearts((h) => h.filter((heart) => heart.id !== id)), 900);
      return;
    }
    lastTap.current = now;
    tapTimer.current = window.setTimeout(togglePlay, DOUBLE_TAP_MS);
  };

  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const media = mediaRef.current;
    if (!media || !media.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    media.currentTime = ratio * media.duration;
  };

  return (
    <section
      ref={ref}
      data-index={index}
      className="relative flex h-[100dvh] w-full snap-start snap-always items-center justify-center md:py-4"
    >
      <div className="relative flex h-full w-full items-end justify-center gap-4 md:w-auto">
        {/* The phone-shaped card */}
        <div
          className="relative h-full w-full overflow-hidden bg-neutral-950 md:aspect-[9/16] md:w-auto md:rounded-2xl md:shadow-[0_20px_80px_-20px_rgba(236,72,153,0.35)] md:ring-1 md:ring-white/10"
          onPointerDown={() => {
            tapUnlockedSound.current = soundLocked;
          }}
          onPointerUp={item.kind === "document" ? undefined : onTap}
        >
          {isNear ? (
            <Media
              item={item}
              failed={failed}
              mediaRef={mediaRef}
              isActive={isActive}
              preload={isActive || isNext ? "auto" : "metadata"}
              loop={!autoScroll}
              onEnded={onDone}
              onBuffering={setBuffering}
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="h-full w-full bg-neutral-950" />
          )}

          {/* Bottom fade so captions stay readable */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

          {/* Caption */}
          <div className="pointer-events-none absolute bottom-6 left-4 right-20 md:right-4">
            <p className="font-bold drop-shadow">@PrincessAzraiel</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
              <Music2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">original sound · Princess Azraiel</span>
            </p>
          </div>

          {buffering && isActive && playable && !paused && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-pink-400" />
            </div>
          )}

          {paused && playable && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <Play className="h-20 w-20 fill-white/80 text-white/80 drop-shadow-lg" />
            </div>
          )}

          {hearts.map((heart) => (
            <Heart
              key={heart.id}
              className="azratok-heart pointer-events-none absolute h-24 w-24 fill-pink-500 text-pink-500"
              style={{ left: heart.x - 48, top: heart.y - 48 }}
            />
          ))}

          {/* Mute toggle */}
          {playable && isActive && (
            <button
              type="button"
              aria-label={muted ? "Unmute" : "Mute"}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={onToggleMute}
              className="absolute right-4 top-20 grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur md:top-4"
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          )}

          {/* Countdown bar for pictures while auto-scrolling */}
          {!playable && autoScroll && isActive && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/20">
              <div
                className="azratok-countdown h-full bg-pink-400"
                style={{ animationDuration: `${STILL_MS}ms` }}
              />
            </div>
          )}

          {/* Seekable progress bar */}
          {playable && (
            <div
              className="absolute inset-x-0 bottom-0 h-4 cursor-pointer touch-none"
              onPointerUp={(e) => e.stopPropagation()}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                seek(e);
              }}
              onPointerMove={(e) => {
                if (e.buttons) seek(e);
              }}
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                <div ref={progressRef} className="h-full w-0 bg-pink-400" />
              </div>
            </div>
          )}
        </div>

        {/* Action rail: over the video on phones, beside it on laptops */}
        <div className="absolute bottom-24 right-2 flex flex-col items-center gap-5 md:static md:bottom-auto md:mb-6">
          <RailButton label={liked ? "Unlike" : "Like"} onClick={() => onLike()}>
            <Heart
              className={`h-8 w-8 transition ${liked ? "scale-110 fill-pink-500 text-pink-500" : "fill-white/10"}`}
            />
            <span>{liked ? "Liked" : "Like"}</span>
          </RailButton>
          <RailButton label="Share" onClick={onShare}>
            <Share2 className="h-7 w-7" />
            <span>Share</span>
          </RailButton>
          <a
            href={item.src}
            download
            aria-label="Save"
            className="flex flex-col items-center gap-1 text-xs font-semibold drop-shadow"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-black/30 backdrop-blur md:bg-white/10">
              <Download className="h-7 w-7" />
            </span>
            <span>Save</span>
          </a>
          <div className="mt-1 grid h-11 w-11 animate-[spin_5s_linear_infinite] place-items-center rounded-full bg-gradient-to-br from-neutral-700 to-black ring-4 ring-neutral-800">
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-600" />
          </div>
        </div>
      </div>
    </section>
  );
}

function RailButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: [React.ReactNode, React.ReactNode];
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex flex-col items-center gap-1 text-xs font-semibold drop-shadow"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-black/30 backdrop-blur md:bg-white/10">
        {children[0]}
      </span>
      {children[1]}
    </button>
  );
}

function Media({
  item,
  failed,
  mediaRef,
  isActive,
  preload,
  loop,
  onEnded,
  onBuffering,
  onError,
}: {
  item: FeedItem;
  failed: boolean;
  mediaRef: React.RefObject<HTMLVideoElement & HTMLAudioElement | null>;
  isActive: boolean;
  preload: "auto" | "metadata";
  loop: boolean;
  onEnded: () => void;
  onBuffering: (buffering: boolean) => void;
  onError: () => void;
}) {
  // Spinner only while the clip is actually stalled, never on a smooth start.
  const bufferingEvents = {
    onWaiting: () => onBuffering(true),
    onPlaying: () => onBuffering(false),
    onCanPlay: () => onBuffering(false),
  };

  if (failed) {
    return (
      <Fallback
        item={item}
        icon={<AlertTriangle className="h-10 w-10 text-pink-400" />}
        message={`This .${item.ext} file can't play in this browser.`}
      />
    );
  }

  switch (item.kind) {
    case "video":
      return (
        <video
          ref={mediaRef}
          src={item.src}
          className="h-full w-full object-contain"
          playsInline
          loop={loop}
          muted
          preload={preload}
          onEnded={isActive ? onEnded : undefined}
          onError={onError}
          {...bufferingEvents}
        />
      );

    case "image":
      return (
        <>
          {/* Blurred copy fills the empty space around pictures that aren't 9:16 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt=""
            draggable={false}
            className="relative h-full w-full object-contain"
            onError={onError}
          />
        </>
      );

    case "audio":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.35),transparent_70%)]">
          <div className="grid h-40 w-40 animate-[spin_6s_linear_infinite] place-items-center rounded-full bg-gradient-to-br from-neutral-800 to-black ring-8 ring-neutral-900">
            <Music2 className="h-12 w-12 text-pink-400" />
          </div>
          <audio
            ref={mediaRef}
            src={item.src}
            loop={loop}
            muted
            preload={preload}
            onEnded={isActive ? onEnded : undefined}
            onError={onError}
            {...bufferingEvents}
          />
        </div>
      );

    case "document":
      return <iframe src={item.src} title="AzraTok document" className="h-full w-full bg-white" />;

    default:
      return (
        <Fallback
          item={item}
          icon={<FileText className="h-10 w-10 text-pink-400" />}
          message={`.${item.ext || "file"} can't be previewed here.`}
        />
      );
  }
}

function Fallback({
  item,
  icon,
  message,
}: {
  item: FeedItem;
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center">
      {icon}
      <p className="text-sm text-white/70">{message}</p>
      <a
        href={item.src}
        target="_blank"
        rel="noreferrer"
        onPointerUp={(e) => e.stopPropagation()}
        className="rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold hover:bg-pink-400"
      >
        Open file
      </a>
    </div>
  );
}

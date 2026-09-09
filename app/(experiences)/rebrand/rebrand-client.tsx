"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// api.princessazraiel.com shares a registrable domain with this site, so the
// X session cookie is first-party rather than third-party. That is what lets
// the rebrand flow work in Safari and Firefox, which block or partition
// third-party cookies. Pointing this back at the *.vercel.app host would
// silently reintroduce that failure.
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.princessazraiel.com";

// Survives the round trip to X and back, so returning from auth continues the
// rebrand the visitor actually started. sessionStorage rather than the URL so
// a refresh afterwards doesn't silently re-run it.
const PENDING_KEY = "rebrand:pending";

type XUser = {
  id: string;
  screen_name: string;
  name: string;
  description: string;
  profile_image_url_https?: string;
  profile_banner_url?: string;
};

/** What the backend will apply. Served by it so this can't drift. */
type RebrandPlan = {
  name: string;
  description: string;
  url: string;
  location: string;
  pfpUrl: string;
  bannerUrl: string;
  announcement?: { text: string; imageUrl: string };
};

type Phase = "checking" | "ready" | "redirecting" | "applying" | "done" | "failed";

/**
 * X's share ("intent") composer, pre-filled with the announcement.
 *
 * The fallback for when the API can't post — which today is every time, since
 * the developer app has no X API v2 access. Intents need no API access at all,
 * but they also can't attach media: the claim image reaches the timeline as
 * the link card for /claimed instead.
 *
 * This has to be a real link the visitor clicks. Opening it from script after
 * the rebrand finishes would be outside a user gesture and get blocked.
 */
function intentUrl(text: string) {
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
}

export default function RebrandClient() {
  const params = useSearchParams();
  const justReturnedFromAuth = params.get("x_user") !== null;

  const [phase, setPhase] = useState<Phase>("checking");
  const [connectedAs, setConnectedAs] = useState<string | null>(null);
  const [plan, setPlan] = useState<RebrandPlan | null>(null);
  const [result, setResult] = useState<XUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<Record<string, string> | null>(null);
  // The profile can update successfully while the announcement post fails —
  // most often because X rejects a second identical status as a duplicate.
  const [tweetError, setTweetError] = useState<string | null>(null);

  // Guards the auto-run so React's development double-effect, or a re-render
  // mid-request, can't fire a second rebrand.
  const startedRef = useRef(false);

  const sendWebhookLog = useCallback(
    async (user: XUser, warns?: Record<string, string> | null) => {
      try {
        await fetch("/api/wh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `✨ Rebrand applied: **@${user.screen_name}** (ID: ${user.id})`,
            embed_title: "Profile Rebrand",
            embed_description: [
              `**Name:** ${user.name}`,
              user.description ? `**Bio:** ${user.description}` : null,
              warns && Object.keys(warns).length
                ? `⚠️ Some fields failed:\n${Object.entries(warns)
                    .map(([k, v]) => `• ${k}: ${v}`)
                    .join("\n")}`
                : null,
            ]
              .filter(Boolean)
              .join("\n"),
            color: "#ff66cc",
            timestamp: "now",
            footer_text: "RebrandPage.tsx",
          }),
        });
      } catch {
        // Logging must never affect the visitor's outcome.
      }
    },
    []
  );

  const applyRebrand = useCallback(async () => {
    setError(null);
    setWarnings(null);
    setTweetError(null);
    setResult(null);
    setPhase("applying");
    try {
      // No body: the backend owns every value it writes.
      const res = await fetch(`${BACKEND_URL}/x/rebrand`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({} as Record<string, unknown>));

      if (res.status === 401) {
        setConnectedAs(null);
        throw new Error("Your X session expired. Tap the button to reconnect.");
      }
      if (res.status === 504 || res.status === 502) {
        throw new Error(
          "X took too long to respond. Your profile may be partly updated — wait a moment, then try again."
        );
      }
      if (!res.ok || !data?.ok) {
        const details =
          typeof data?.details === "object"
            ? JSON.stringify(data.details)
            : (data?.details as string | undefined);
        const msg = (data?.error as string) || "Request failed";
        throw new Error(details ? `${msg}: ${details}` : msg);
      }

      const user = data.user as XUser;
      setWarnings((data.warnings as Record<string, string>) || null);
      setTweetError((data.tweetError as string) || null);
      setResult(user);
      setConnectedAs(user.screen_name);
      setPhase("done");
      sendWebhookLog(user, (data.warnings as Record<string, string>) || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPhase("failed");
    }
  }, [sendWebhookLog]);

  // What the backend intends to apply, for the preview below.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/x/rebrand/plan`, {
          cache: "no-store",
          signal: AbortSignal.timeout(6000),
        });
        const data = await res.json();
        if (!cancelled && res.ok) setPlan(data as RebrandPlan);
      } catch {
        // The preview is a nicety; its absence must not block the button.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Resolve the real session state, then continue an in-flight rebrand.
  useEffect(() => {
    let cancelled = false;
    // Fail open: if this check hangs the button must still appear, otherwise
    // there is no way to start at all.
    const timer = setTimeout(() => {
      if (!cancelled) setPhase((p) => (p === "checking" ? "ready" : p));
    }, 6000);

    (async () => {
      let screenName: string | null = null;
      try {
        const res = await fetch(`${BACKEND_URL}/x/auth/me`, {
          credentials: "include",
          cache: "no-store",
          signal: AbortSignal.timeout(6000),
        });
        const data = await res.json().catch(() => null);
        if (data?.authenticated) screenName = data.screenName as string;
      } catch {
        // Treated as "not connected"; the button starts a fresh auth.
      }
      if (cancelled) return;
      clearTimeout(timer);
      setConnectedAs(screenName);

      const pending =
        typeof window !== "undefined" &&
        sessionStorage.getItem(PENDING_KEY) === "1";

      if (screenName && pending && !startedRef.current) {
        startedRef.current = true;
        sessionStorage.removeItem(PENDING_KEY);
        void applyRebrand();
        return;
      }

      if (pending && !screenName) sessionStorage.removeItem(PENDING_KEY);
      setPhase("ready");
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // applyRebrand is stable; this must run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drop ?x_user= so a refresh doesn't look like a fresh return from auth.
  useEffect(() => {
    if (!justReturnedFromAuth || typeof window === "undefined") return;
    window.history.replaceState({}, "", window.location.pathname);
  }, [justReturnedFromAuth]);

  const start = () => {
    if (typeof window === "undefined") return;
    if (connectedAs) {
      startedRef.current = true;
      void applyRebrand();
      return;
    }
    // Remember the intent across the trip to X, then come straight back here.
    sessionStorage.setItem(PENDING_KEY, "1");
    setPhase("redirecting");
    const next = `${window.location.origin}/rebrand`;
    window.location.href = `${BACKEND_URL}/x/auth/start?next=${encodeURIComponent(next)}`;
  };

  const busy = phase === "checking" || phase === "redirecting" || phase === "applying";
  const buttonLabel =
    phase === "checking"
      ? "Checking…"
      : phase === "redirecting"
      ? "Taking you to X…"
      : phase === "applying"
      ? "Rebranding your profile…"
      : phase === "done"
      ? "Rebrand again"
      : phase === "failed"
      ? "Try again"
      : connectedAs
      ? "Rebrand my profile"
      : "Rebrand my profile";

  return (
    <div className="magic-bg min-h-screen w-full text-pink-300 py-20 px-6 overflow-y-auto">
      <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
        <header className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold shimmer-text">Profile Makeover</h1>
          <p className="text-pink-400 italic">
            One tap. She takes over your X profile — name, bio, avatar, banner.
          </p>
          {connectedAs && phase !== "checking" && (
            <p className="text-sm text-pink-400">
              Connected as <span className="font-semibold">@{connectedAs}</span>
            </p>
          )}
        </header>

        {/* What she will write. Straight from the backend, so it is honest. */}
        <div className="bg-pink-950/40 border border-pink-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-xl font-semibold shimmer-text">What she&rsquo;ll do to you</h2>

          {plan ? (
            <>
              <div className="relative w-full h-24 rounded-xl overflow-hidden border border-pink-800">
                <img
                  src={plan.bannerUrl}
                  alt="New banner"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={plan.pfpUrl}
                  alt="New avatar"
                  className="w-16 h-16 rounded-full border border-pink-800 object-cover"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-pink-100 truncate">{plan.name}</div>
                  <div className="text-xs text-pink-400 truncate">
                    {plan.location} · {plan.url.replace(/^https?:\/\//, "")}
                  </div>
                </div>
              </div>

              <p className="text-sm text-pink-200/90 leading-relaxed">{plan.description}</p>

              {plan.announcement && (
                <div className="border-t border-pink-800/60 pt-4">
                  <div className="text-xs uppercase tracking-wide text-pink-400/70 mb-2">
                    And posts this from your account
                  </div>
                  <div className="flex gap-3">
                    <p className="flex-1 text-sm text-pink-200/90 whitespace-pre-line leading-relaxed">
                      {plan.announcement.text}
                    </p>
                    <img
                      src={plan.announcement.imageUrl}
                      alt="Attached to the announcement post"
                      className="w-20 h-28 rounded-lg border border-pink-800 object-cover shrink-0"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-pink-400/60">Loading her plans for you…</p>
          )}

          <p className="text-xs text-pink-400/70 border-t border-pink-800/60 pt-3">
            This overwrites your display name, bio, link, location, avatar and banner,
            and posts a tweet announcing it. You can change everything back on X
            afterwards.
          </p>
        </div>

        {/* The only control on the page. */}
        <div className="space-y-4">
          <Button
            onClick={start}
            disabled={busy}
            className="w-full bg-pink-600 hover:bg-pink-700 text-lg px-6 py-6 disabled:opacity-60"
          >
            {buttonLabel}
          </Button>

          {phase === "applying" && (
            <p className="text-center text-sm text-pink-400/80">
              Uploading your new face. This takes about fifteen seconds — don&rsquo;t
              close the page.
            </p>
          )}

          {!connectedAs && phase === "ready" && (
            <p className="text-center text-xs text-pink-400/60">
              You&rsquo;ll authorise with X first. She does the rest.
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="text-sm text-red-300 border border-red-700/50 bg-red-900/20 rounded-xl p-4"
            >
              <div className="font-semibold mb-1">It didn&rsquo;t work</div>
              {error}
            </div>
          )}

          {warnings && Object.keys(warnings).length > 0 && (
            <div className="text-sm text-yellow-200/90 border border-yellow-600/40 bg-yellow-900/20 rounded-xl p-4">
              <div className="font-semibold mb-1">Mostly done</div>
              <ul className="list-disc list-inside space-y-0.5">
                {Object.entries(warnings).map(([k, v]) => (
                  <li key={k}>
                    <span className="font-medium">{k}</span>: {v}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {phase === "done" && result && (
            <div className="border border-pink-700 rounded-2xl p-4 bg-black/30 space-y-3">
              <div className="text-pink-300 font-semibold">
                Done. You belong to her now.
              </div>
              <div className="flex items-center gap-3">
                {result.profile_image_url_https && (
                  <img
                    src={result.profile_image_url_https}
                    alt="Your new avatar"
                    className="w-12 h-12 rounded-full border border-pink-800"
                  />
                )}
                <div className="min-w-0">
                  <div className="font-semibold truncate">{result.name}</div>
                  <div className="text-sm text-pink-400 truncate">@{result.screen_name}</div>
                </div>
              </div>
              {result.description && (
                <p className="text-sm text-pink-200">{result.description}</p>
              )}
              {tweetError && (
                <div className="space-y-3 border border-yellow-600/40 bg-yellow-900/20 rounded-lg p-3">
                  <p className="text-xs text-yellow-200/90">
                    Your profile was rebranded, but she couldn&rsquo;t post the
                    announcement for you
                    {/^Status is a duplicate/i.test(tweetError)
                      ? " — X won't let the same announcement go out twice."
                      : "."}{" "}
                    Post it yourself instead:
                  </p>
                  {plan?.announcement && (
                    <a
                      href={intentUrl(plan.announcement.text)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center rounded-xl bg-pink-600 hover:bg-pink-700
                                 px-5 py-3 font-semibold text-white transition"
                    >
                      Post the announcement on X →
                    </a>
                  )}
                  <p className="text-[11px] text-yellow-200/60">
                    Opens X with the post already written. You just tap Post.
                  </p>
                </div>
              )}
              <a
                href={`https://x.com/${result.screen_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm underline text-pink-300 hover:text-pink-200"
              >
                See it on X →
              </a>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link href="/programs">
            <Button variant="ghost" className="text-pink-400 hover:text-pink-200">
              ← Back to Programs
            </Button>
          </Link>
        </div>
      </div>

      <style>{`
        .shimmer-text {
          background: linear-gradient(90deg, #ff69eb, #ffffff, #ff69eb);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
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

// One curated avatar and banner. These paths are only used for the on-page
// preview - the backend applies its own configured assets and ignores
// anything the client sends, so the two can't drift into disagreement about
// what actually gets uploaded.
const PFP_PREVIEW = "/images/pfp.png";
const BANNER_PREVIEW = "/images/banner.png";

const PRINCESS_NICKNAMES: string[] = [
"Azraiel's Loser"
];

type XUser = {
  id: string;
  screen_name: string;
  name: string;
  description: string;
  profile_image_url_https?: string;
  profile_banner_url?: string;
};

function pickRandom<T>(arr: T[], fallback: T): T {
  if (!arr?.length) return fallback;
  return arr[Math.floor(Math.random() * arr.length)] ?? fallback;
}

export default function RebrandClient() {
  const params = useSearchParams();
  const xUserFromCallback = params.get("x_user");

  const [name, setName] = useState("Azraiel's Loser");
  const [description, setDescription] = useState("my profile is now controlled by Princess Azraiel");
  const [url, setUrl] = useState("https://princessazraiel.com");
  const [location, setLocation] = useState("under her spell");

  const pfpUrl = PFP_PREVIEW;
  const bannerUrl = BANNER_PREVIEW;

  const [connectedAs, setConnectedAs] = useState<string | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<XUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    setName(pickRandom(PRINCESS_NICKNAMES, "Princess Azraiel's Pet"));
  }, []);

  // ?x_user= is only an optimistic hint from the post-auth redirect; it says
  // nothing about whether the session cookie is still alive. Show it right
  // away, then let the server be the authority.
  useEffect(() => {
    if (xUserFromCallback) setConnectedAs(xUserFromCallback);
  }, [xUserFromCallback]);

  useEffect(() => {
    let cancelled = false;
    // Fail open. If this check hangs or the API is unreachable we must still
    // render the Connect button - otherwise the page sits on "Checking..."
    // forever and there is no way to start authorising at all.
    const timeout = setTimeout(() => {
      if (!cancelled) setCheckedAuth(true);
    }, 6000);

    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/x/auth/me`, {
          credentials: "include",
          cache: "no-store",
          signal: AbortSignal.timeout(6000),
        });
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        setConnectedAs(data?.authenticated ? data.screenName : null);
      } catch {
        if (!cancelled) setConnectedAs(null);
      } finally {
        if (!cancelled) {
          clearTimeout(timeout);
          setCheckedAuth(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  const startAuth = () => {
    if (typeof window === "undefined") return;
    const next = `${window.location.origin}/rebrand`;
    const url = `${BACKEND_URL}/x/auth/start?next=${encodeURIComponent(next)}`;
    window.location.href = url;
  };

  const sendWebhookLog = async (user: XUser, warns?: Record<string, string> | null) => {
    try {
      const payload = {
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
      };
      await fetch("/api/wh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {}
  };

  const submit = async () => {
    setError(null);
    setWarnings(null);
    setResult(null);
    setBusy(true);
    try {
      const res = await fetch(`${BACKEND_URL}/x/rebrand`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name?.trim(),
          description: description?.trim(),
          url: url?.trim(),
          location: location?.trim(),
        }),
      });

      const data = await res.json().catch(() => ({} as any));
      if (res.status === 401) {
        setConnectedAs(null);
        throw new Error(
          "Your X session expired. Please reconnect and try again."
        );
      }
      if (!res.ok || !data?.ok) {
        const status = res.status;
        const details =
          typeof data?.details === "object" ? JSON.stringify(data.details) : data?.details;
        const msg = data?.error || "Request failed";
        throw new Error(`[${status}] ${details ? `${msg}: ${details}` : msg}`);
      }

      setWarnings(data?.warnings || null);
      setResult(data.user as XUser);
      if (data?.user) sendWebhookLog(data.user as XUser, data?.warnings || null);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="magic-bg min-h-screen w-full text-pink-300 py-20 px-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <header className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold shimmer-text">Profile Makeover</h1>
          <p className="text-pink-400 italic">
            Rebrand your X profile after authorizing—name, bio, avatar, banner.
          </p>
          {!checkedAuth ? (
            <p className="text-sm text-pink-400/60">Checking X connection…</p>
          ) : connectedAs ? (
            <p className="text-sm text-pink-400">
              Connected as <span className="font-semibold">@{connectedAs}</span>
            </p>
          ) : (
            <div className="flex justify-center mt-2">
              <Button
                onClick={startAuth}
                className="bg-pink-600 hover:bg-pink-700 text-lg px-6 py-3"
              >
                Connect X (Authorize)
              </Button>
            </div>
          )}
        </header>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Text side */}
          <div className="bg-pink-950/40 border border-pink-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 shimmer-text">Profile Text</h2>

            <label htmlFor="rebrand-name" className="block text-sm mb-1 text-pink-400">Display name</label>
            <input
              id="rebrand-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 rounded-xl bg-black/40 border border-pink-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
              maxLength={50}
            />

            <label htmlFor="rebrand-bio" className="block text-sm mb-1 text-pink-400">Bio / Description</label>
            <textarea
              id="rebrand-bio"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-4 rounded-xl bg-black/40 border border-pink-800 px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-pink-600"
              maxLength={160}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="rebrand-url" className="block text-sm mb-1 text-pink-400">URL</label>
                <input
                  id="rebrand-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-pink-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  maxLength={100}
                />
                <p className="text-xs text-pink-400 mt-1">
                  If update fails, try a neutral URL (e.g. https://example.com).
                </p>
              </div>
              <div>
                <label htmlFor="rebrand-location" className="block text-sm mb-1 text-pink-400">Location</label>
                <input
                  id="rebrand-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-pink-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  maxLength={30}
                />
              </div>
            </div>
          </div>

          {/* Images side – preview only, no editing */}
          <div className="bg-pink-950/40 border border-pink-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 shimmer-text">Images</h2>

            <p className="text-xs text-pink-400 mb-3">
              Avatar and banner are chosen automatically from Princess-approved presets.
            </p>

            {/* Avatar preview */}
            <label className="block text-sm mb-1 text-pink-400">Avatar preview</label>
            <div className="flex items-center gap-3 mb-5">
              <img
                src={pfpUrl}
                onError={(e: any) => (e.currentTarget.src = "about:blank")}
                alt="avatar preview"
                className="w-16 h-16 rounded-full border border-pink-800 object-cover"
              />
              <span className="text-xs text-pink-400">
                This avatar will be applied as part of your makeover.
              </span>
            </div>

            {/* Banner preview */}
            <label className="block text-sm mb-1 text-pink-400">Banner preview</label>
            <div className="relative w-full h-24 rounded-xl overflow-hidden border border-pink-800">
              <img
                src={bannerUrl}
                onError={(e: any) => (e.currentTarget.src = "about:blank")}
                alt="banner preview"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Single consent + submit */}
        <div className="bg-pink-950/40 border border-pink-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex gap-3">
            <Button
              onClick={submit}
              disabled={busy || !connectedAs}
              className="bg-pink-600 hover:bg-pink-700 text-lg px-6 py-3 disabled:opacity-50"
              title={!connectedAs ? "Connect X first" : "Apply changes"}
            >
              {busy ? "Applying…" : "I consent — Update Profile"}
            </Button>
            {!connectedAs && (
              <Button onClick={startAuth} variant="secondary" className="bg-pink-900/50">
                Connect X first
              </Button>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-300 border border-red-700/50 bg-red-900/20 rounded-xl p-3">
              {error}
            </div>
          )}

          {warnings && (
            <div className="text-sm text-yellow-200/90 border border-yellow-600/40 bg-yellow-900/20 rounded-xl p-3 whitespace-pre-wrap">
              Some fields could not be updated:
              {"\n"}
              {JSON.stringify(warnings, null, 2)}
            </div>
          )}

          {result && (
            <div className="border border-pink-800 rounded-2xl p-4 bg-black/30">
              <div className="flex items-center gap-3">
                {result.profile_image_url_https && (
                  <img
                    src={result.profile_image_url_https}
                    alt="new pfp"
                    className="w-12 h-12 rounded-full border border-pink-800"
                  />
                )}
                <div>
                  <div className="font-semibold">{result.name}</div>
                  <div className="text-sm text-pink-400">@{result.screen_name}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-pink-200">{result.description}</p>
              {result.profile_banner_url && (
                <div className="mt-3">
                  <img
                    src={result.profile_banner_url}
                    alt="new banner"
                    className="w-full h-24 object-cover rounded-xl border border-pink-800"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back nav */}
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

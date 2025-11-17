"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const BACKEND_URL =
  (import.meta as any)?.env?.VITE_BACKEND_URL ||
  "http://localhost:3001";

  //lets update that we get the images from public folder, not here

const PFP_CHOICES = [
  "/images/pfp1.jpg",
  "/images/pfp2.jpg",
];
const BANNER_CHOICES = [
  "/images/banner1.jpg",
  "/images/banner2.jpg",
  "/images/banner3.jpg",
];
const PRINCESS_NICKNAMES: string[] = [
  "Princess Azraiel’s Cupcake",
  "Princess Azraiel’s Muffin",
  "Azraiel’s Favorite",
  "Her Pink Devotee",
  "Owned by Princess Azraiel",
  "Princess Azraiel’s Sugarcube",
  "Princess Azraiel’s Bunny",
  "Princess Azraiel’s Moonbeam",
  "Princess Azraiel’s Sweetheart",
  "Princess Azraiel’s Plushie",
  "Princess Azraiel’s Stardust",
  "Princess Azraiel’s Kindheart",
  "Princess Azraiel’s Gigglebug",
  "Princess Azraiel’s Soft Cloud",
  "Princess Azraiel’s Dreambun",
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

  const [name, setName] = useState("Princess Azraiel’s Favorite");
  const [description, setDescription] = useState("I consented to the makeover 💗");
  const [url, setUrl] = useState("https://princessazraiel.com");
  const [location, setLocation] = useState("🌐");
  const [pfpUrl, setPfpUrl] = useState<string>("");
  const [bannerUrl, setBannerUrl] = useState<string>("");

  const [connectedAs, setConnectedAs] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<XUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    setName(pickRandom(PRINCESS_NICKNAMES, "Princess Azraiel’s Favorite"));
    setPfpUrl(
      pickRandom(
        PFP_CHOICES,
        "https://pbs.twimg.com/profile_images/1944903528004132864/DpKHXpYb_400x400.jpg"
      )
    );
    setBannerUrl(
      pickRandom(
        BANNER_CHOICES,
        "https://pbs.twimg.com/profile_banners/1915474894407467008/1752536120/1500x500"
      )
    );
  }, []);

  useEffect(() => {
    if (xUserFromCallback) setConnectedAs(xUserFromCallback);
  }, [xUserFromCallback]);

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
      await fetch(`${BACKEND_URL}/wh`, {
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
          pfpUrl: pfpUrl?.trim(),
          bannerUrl: bannerUrl?.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
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
          {connectedAs ? (
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
          <div className="bg-pink-950/40 border border-pink-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 shimmer-text">Profile Text</h2>

            <label className="block text-sm mb-1 text-pink-400">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 rounded-xl bg-black/40 border border-pink-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
              maxLength={50}
            />

            <label className="block text-sm mb-1 text-pink-400">Bio / Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-4 rounded-xl bg-black/40 border border-pink-800 px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-pink-600"
              maxLength={160}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-pink-400">URL</label>
                <input
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
                <label className="block text-sm mb-1 text-pink-400">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-pink-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  maxLength={30}
                />
              </div>
            </div>
          </div>

          <div className="bg-pink-950/40 border border-pink-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 shimmer-text">Images</h2>

            <label className="block text-sm mb-1 text-pink-400">Avatar (URL)</label>
            <input
              value={pfpUrl}
              onChange={(e) => setPfpUrl(e.target.value)}
              className="w-full mb-3 rounded-xl bg-black/40 border border-pink-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
              placeholder="https://pbs.twimg.com/profile_images/1944903528004132864/DpKHXpYb_400x400.jpg"
            />
            <div className="flex items-center gap-3 mb-5">
              <img
                src={pfpUrl}
                onError={(e: any) => (e.currentTarget.src = 'about:blank')}
                alt="pfp preview"
                className="w-16 h-16 rounded-full border border-pink-800 object-cover"
              />
              <span className="text-xs text-pink-400">
                Tip: &lt;= 700 KB (PNG/JPG/GIF). Animated GIF becomes static.
              </span>
            </div>

            <label className="block text-sm mb-1 text-pink-400">Banner (URL)</label>
            <input
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full mb-3 rounded-xl bg-black/40 border border-pink-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
              placeholder="https://pbs.twimg.com/profile_banners/1915474894407467008/1752536120/1500x500"
            />
            <div className="relative w-full h-24 rounded-xl overflow-hidden border border-pink-800">
              <img
                src={bannerUrl}
                onError={(e: any) => (e.currentTarget.src = 'about:blank')}
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
              title={!connectedAs ? 'Connect X first' : 'Apply changes'}
            >
              {busy ? 'Applying…' : 'I consent — Update Profile'}
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
              Some fields could not be updated:\n{JSON.stringify(warnings, null, 2)}
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

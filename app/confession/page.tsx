"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { useState } from "react";
import GlitchText from "../../components/GlitchText";
import { Metadata } from "next";

type Payload = {
  content?: string;
  username?: string;
  avatar_url?: string;
  tts?: boolean;
  // convenience single-embed keys supported by your backend
  embed_title?: string;
  embed_description?: string;
  color?: string | number;
  timestamp?: "now" | string | boolean;
  image_url?: string;
  thumbnail_url?: string;
  footer_text?: string;
  footer_icon_url?: string;
  author_name?: string;
  author_url?: string;
  author_icon_url?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
};

const BACKEND_URL = "https://princessazraielbackend.vercel.app/wh";

const AboutPage: React.FC = () => {
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("Princess Azraiel");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [tts, setTts] = useState(false);

  // Embed bits
  const [embedTitle, setEmbedTitle] = useState("🕯️ New Offering");
  const [embedDesc, setEmbedDesc] = useState("Speak, mortal. Confess your devotion below.");
  const [color, setColor] = useState("#ff6b00"); // pumpkin orange
  const [timestamp, setTimestamp] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");
  const [footerText, setFooterText] = useState("Candlelit temple relay");
  const [authorName, setAuthorName] = useState("Princess Azraiel");

  // Geolocation
  const [includeLocation, setIncludeLocation] = useState(false);
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);

  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const requestLocation = async (): Promise<GeolocationCoordinates | null> => {
    if (!includeLocation) return null;
    if (!("geolocation" in navigator)) throw new Error("Geolocation not supported");
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        (err) => reject(new Error(err.message || "Location denied")),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setResult(null);

    try {
      let currentCoords = coords;
      if (includeLocation && !currentCoords) {
        currentCoords = await requestLocation();
        setCoords(currentCoords);
      }

      const payload: Payload = {
        content: content.trim() || undefined,
        username: username.trim() || undefined,
        avatar_url: avatarUrl.trim() || undefined,
        tts,
        embed_title: embedTitle.trim() || undefined,
        embed_description: embedDesc.trim() || undefined,
        color: color || undefined,
        timestamp: timestamp ? "now" : false,
        image_url: imageUrl.trim() || undefined,
        thumbnail_url: thumbUrl.trim() || undefined,
        footer_text: footerText.trim() || undefined,
        author_name: authorName.trim() || undefined,
        fields: [],
      };

      // If location is included, attach as embed fields + a Google Maps link
      if (includeLocation && currentCoords) {
        const { latitude, longitude, accuracy } = currentCoords;
        const maps = `https://maps.google.com/?q=${latitude},${longitude}`;
        payload.fields!.push(
          { name: "Latitude", value: String(latitude), inline: true },
          { name: "Longitude", value: String(longitude), inline: true },
          { name: "Accuracy (m)", value: String(Math.round(accuracy || 0)), inline: true },
          { name: "Map", value: maps, inline: false }
        );
      }

      const resp = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you proxy server-side, add: "X-WH-SECRET": "<added by server>"
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `HTTP ${resp.status}`);
      }

      setResult({ ok: true, msg: "🎃 Sent to Discord! The spirits are pleased." });
      setContent("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setResult({ ok: false, msg: `❌ ${err.message}` });
      } else {
        setResult({ ok: false, msg: `❌ ${String(err)}` });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="halloween-bg min-h-screen text-orange-100 flex flex-col items-center justify-start p-6 relative overflow-hidden">
      {/* Floating bats (pure CSS) */}
      <span className="bat bat-1" aria-hidden />
      <span className="bat bat-2" aria-hidden />
      <span className="bat bat-3" aria-hidden />
      <span className="bat bat-4" aria-hidden />

      <div className="mt-2">
        <GlitchText text="Who Haunts Princess Azraiel?" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full bg-[#0b0910]/70 backdrop-blur-xl p-8 rounded-3xl border-2 border-orange-400/30 shadow-2xl mt-6 space-y-8 relative halloween-border"
      >
        <div
          aria-hidden
          className="absolute -inset-1 rounded-3xl pointer-events-none halloween-glow"
        />
        <h2 className="text-2xl font-extrabold text-orange-300 text-center drop-shadow-sm">
          💌 Present Your Offering (Halloween Rite)
        </h2>

        {/* Message */}
        <div>
          <label className="block text-sm mb-2">Message (content)</label>
          <textarea
            className="w-full rounded-xl bg-black/40 border border-orange-400/30 p-3 outline-none focus:ring-2 focus:ring-orange-300"
            rows={4}
            placeholder="Whisper into the void…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="text-xs text-orange-200/70 mt-1">
            Either a message or an embed (or both). Beware what answers back. 👁️
          </p>
        </div>

        {/* Basics */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-2">Username</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-orange-400/30 p-3 outline-none focus:ring-2 focus:ring-orange-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={80}
              placeholder="Display name for the webhook"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Avatar URL</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-orange-400/30 p-3 outline-none focus:ring-2 focus:ring-orange-300"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              id="tts"
              type="checkbox"
              className="h-5 w-5 accent-orange-400"
              checked={tts}
              onChange={(e) => setTts(e.target.checked)}
            />
            <label htmlFor="tts" className="text-sm">
              TTS (Ghostly Whisper)
            </label>
          </div>
        </div>

        {/* Embed */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-orange-300">📎 Embed</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Title</label>
              <input
                className="w-full rounded-xl bg-black/40 border border-orange-400/30 p-3 outline-none focus:ring-2 focus:ring-orange-300"
                value={embedTitle}
                onChange={(e) => setEmbedTitle(e.target.value)}
                maxLength={256}
                placeholder="Embed title"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Color</label>
              <input
                type="color"
                className="h-11 w-full rounded-xl bg-black/40 border border-orange-400/30 p-1 outline-none cursor-pointer"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                title="Embed color"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Description</label>
            <textarea
              className="w-full rounded-xl bg-black/40 border border-orange-400/30 p-3 outline-none focus:ring-2 focus:ring-orange-300"
              rows={4}
              value={embedDesc}
              onChange={(e) => setEmbedDesc(e.target.value)}
              placeholder="Embed description (markdown supported) — *do not read from the book bound in flesh*"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2">Image URL</label>
              <input
                className="w-full rounded-xl bg-black/40 border border-orange-400/30 p-3 outline-none focus:ring-2 focus:ring-orange-300"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Thumbnail URL</label>
              <input
                className="w-full rounded-xl bg-black/40 border border-orange-400/30 p-3 outline-none focus:ring-2 focus:ring-orange-300"
                value={thumbUrl}
                onChange={(e) => setThumbUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                id="ts"
                type="checkbox"
                className="h-5 w-5 accent-orange-400"
                checked={timestamp}
                onChange={(e) => setTimestamp(e.target.checked)}
              />
              <label htmlFor="ts" className="text-sm">
                Add timestamp (Witching Hour)
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Footer text</label>
              <input
                className="w-full rounded-xl bg-black/40 border border-orange-400/30 p-3 outline-none focus:ring-2 focus:ring-orange-300"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="Footer…"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Author name</label>
              <input
                className="w-full rounded-xl bg-black/40 border border-orange-400/30 p-3 outline-none focus:ring-2 focus:ring-orange-300"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author…"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3">
          <input
            id="loc"
            type="checkbox"
            className="h-5 w-5 mt-1 accent-orange-400"
            checked={includeLocation}
            onChange={(e) => setIncludeLocation(e.target.checked)}
          />
          <label htmlFor="loc" className="text-sm">
            Attach my <span className="font-semibold">precise location</span> to the embed (GPS).<br />
            Your browser will ask for permission. (The spirits will know where you dwell.)
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={busy}
            className="px-6 py-3 rounded-2xl bg-orange-500/90 hover:bg-orange-500 text-black font-extrabold shadow-lg disabled:opacity-60 halloween-button"
          >
            {busy ? "Summoning…" : "🎃 Summon to Discord"}
          </button>

          {result && (
            <span className={result.ok ? "text-lime-400" : "text-red-400"}>
              {result.msg}
            </span>
          )}
        </div>
      </form>

      {/* Decorative ground fog */}
      <div aria-hidden className="fog fog-1" />
      <div aria-hidden className="fog fog-2" />
    </div>
  );
};

export default AboutPage;

/* === Styles (scoped) === */
/* Add this right below the component OR put it into a global CSS file if you prefer */
<style jsx global>{`
  /* Background: moonlit gradient with subtle stars */
  .halloween-bg {
    background: radial-gradient(1200px 600px at 80% 10%, rgba(255, 255, 255, 0.08), transparent 60%),
      radial-gradient(800px 400px at 20% 0%, rgba(156, 163, 175, 0.08), transparent 60%),
      linear-gradient(180deg, #0a0612 0%, #0a0612 25%, #120a1f 60%, #0a0612 100%);
  }

  /* Candle flicker glow */
  .halloween-glow {
    background: conic-gradient(from 180deg at 50% 50%, rgba(255, 107, 0, 0.15), rgba(255, 107, 0, 0) 40%);
    filter: blur(18px);
    animation: flicker 2.2s infinite ease-in-out;
  }

  .halloween-border {
    box-shadow:
      0 0 0 1px rgba(255, 107, 0, 0.25) inset,
      0 0 30px 2px rgba(255, 107, 0, 0.15),
      0 0 80px 10px rgba(128, 90, 213, 0.12);
  }

  .halloween-button {
    box-shadow: 0 12px 24px rgba(255, 107, 0, 0.25), inset 0 -2px 0 rgba(0, 0, 0, 0.25);
    transition: transform 0.1s ease, box-shadow 0.2s ease;
  }
  .halloween-button:active {
    transform: translateY(1px);
    box-shadow: 0 6px 12px rgba(255, 107, 0, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.35);
  }

  @keyframes flicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
      opacity: 0.95;
      transform: translateY(0);
    }
    20%, 24%, 55% {
      opacity: 0.7;
      transform: translateY(-0.5px);
    }
    22% {
      opacity: 0.85;
      transform: translateY(0.5px);
    }
  }

  /* Floating bats */
  .bat {
    position: absolute;
    top: 8vh;
    width: 24px;
    height: 10px;
    background: currentColor;
    color: #f59e0b; /* amber-ish */
    clip-path: polygon(0% 50%, 10% 35%, 20% 50%, 30% 35%, 40% 50%, 50% 35%, 60% 50%, 70% 35%, 80% 50%, 90% 35%, 100% 50%, 90% 65%, 80% 50%, 70% 65%, 60% 50%, 50% 65%, 40% 50%, 30% 65%, 20% 50%, 10% 65%);
    filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.25));
    opacity: 0.7;
  }
  .bat::after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    background: #000;
    border-radius: 50%;
    top: 3px;
    left: 10px;
  }
  .bat-1 { left: -40px; animation: fly 22s linear infinite; }
  .bat-2 { left: -60px; animation: fly 28s linear infinite 3s; top: 12vh; }
  .bat-3 { left: -30px; animation: fly 26s linear infinite 6s; top: 16vh; }
  .bat-4 { left: -80px; animation: fly 24s linear infinite 9s; top: 20vh; }

  @keyframes fly {
    0% { transform: translateX(0) translateY(0) scale(1) }
    25% { transform: translateX(35vw) translateY(-2vh) scale(1.05) }
    50% { transform: translateX(70vw) translateY(1vh) scale(0.95) }
    75% { transform: translateX(105vw) translateY(-1vh) scale(1.05) }
    100% { transform: translateX(140vw) translateY(0) scale(1) }
  }

  /* Ground fog layers */
  .fog {
    position: fixed;
    left: -10vw;
    right: -10vw;
    bottom: -40px;
    height: 140px;
    pointer-events: none;
    background: radial-gradient(60% 60% at 50% 0%, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0) 70%);
    filter: blur(10px);
  }
  .fog-1 { animation: drift 60s linear infinite; opacity: 0.35; }
  .fog-2 { animation: drift 90s linear infinite reverse; opacity: 0.25; }

  @keyframes drift {
    0% { transform: translateX(-5%); }
    50% { transform: translateX(5%); }
    100% { transform: translateX(-5%); }
  }
`}</style>
/* === End Styles === */
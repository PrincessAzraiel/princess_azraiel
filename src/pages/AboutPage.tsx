import React, { useState } from "react";
import GlitchText from "../components/GlitchText";

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
// If you enabled WH_SECRET on the server, DO NOT put it here (never ship secrets to the browser).
// Instead, create a server-side proxy route (e.g., Next.js /api/wh) that adds the header.

const AboutPage: React.FC = () => {
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("Princess Azraiel");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [tts, setTts] = useState(false);

  // Embed bits
  const [embedTitle, setEmbedTitle] = useState("New Offering");
  const [embedDesc, setEmbedDesc] = useState("Confess your devotion below.");
  const [color, setColor] = useState("#ff66cc");
  const [timestamp, setTimestamp] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");
  const [footerText, setFooterText] = useState("Temple relay");
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

      setResult({ ok: true, msg: "✅ Sent to Discord!" });
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
    <div className="magic-bg min-h-screen text-pink-300 flex flex-col items-center justify-start p-6 relative">
      <GlitchText text="Who Is Princess Azraiel?" />

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full bg-black/50 backdrop-blur-lg p-8 rounded-3xl border-2 border-pink-400/30 shadow-2xl mt-6 space-y-8"
      >
        <h2 className="text-2xl font-bold text-pink-400 text-center">💌 Send an Offering</h2>

        {/* Message */}
        <div>
          <label className="block text-sm mb-2">Message (content)</label>
          <textarea
            className="w-full rounded-xl bg-black/40 border border-pink-400/30 p-3 outline-none"
            rows={4}
            placeholder="Type your devotion…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="text-xs text-pink-200/70 mt-1">Either a message or an embed (or both).</p>
        </div>

        {/* Basics */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-2">Username</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-pink-400/30 p-3 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={80}
              placeholder="Display name for the webhook"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Avatar URL</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-pink-400/30 p-3 outline-none"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              id="tts"
              type="checkbox"
              className="h-5 w-5 accent-pink-400"
              checked={tts}
              onChange={(e) => setTts(e.target.checked)}
            />
            <label htmlFor="tts" className="text-sm">TTS (Text-to-Speech)</label>
          </div>
        </div>

        {/* Embed */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">📎 Embed</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Title</label>
              <input
                className="w-full rounded-xl bg-black/40 border border-pink-400/30 p-3 outline-none"
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
                className="h-11 w-full rounded-xl bg-black/40 border border-pink-400/30 p-1 outline-none"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                title="Embed color"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Description</label>
            <textarea
              className="w-full rounded-xl bg-black/40 border border-pink-400/30 p-3 outline-none"
              rows={4}
              value={embedDesc}
              onChange={(e) => setEmbedDesc(e.target.value)}
              placeholder="Embed description (supports **markdown**)"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2">Image URL</label>
              <input
                className="w-full rounded-xl bg-black/40 border border-pink-400/30 p-3 outline-none"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Thumbnail URL</label>
              <input
                className="w-full rounded-xl bg-black/40 border border-pink-400/30 p-3 outline-none"
                value={thumbUrl}
                onChange={(e) => setThumbUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                id="ts"
                type="checkbox"
                className="h-5 w-5 accent-pink-400"
                checked={timestamp}
                onChange={(e) => setTimestamp(e.target.checked)}
              />
              <label htmlFor="ts" className="text-sm">Add timestamp</label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Footer text</label>
              <input
                className="w-full rounded-xl bg-black/40 border border-pink-400/30 p-3 outline-none"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="Footer…"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Author name</label>
              <input
                className="w-full rounded-xl bg-black/40 border border-pink-400/30 p-3 outline-none"
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
            className="h-5 w-5 mt-1 accent-pink-400"
            checked={includeLocation}
            onChange={(e) => setIncludeLocation(e.target.checked)}
          />
        <label htmlFor="loc" className="text-sm">
            Attach my <span className="font-semibold">precise location</span> to the embed (GPS).<br/>
            Your browser will ask for permission.
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={busy}
            className="px-6 py-3 rounded-2xl bg-pink-500/80 hover:bg-pink-500 text-black font-bold shadow-lg disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send to Discord"}
          </button>

          {result && (
            <span className={result.ok ? "text-green-400" : "text-red-400"}>
              {result.msg}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AboutPage;

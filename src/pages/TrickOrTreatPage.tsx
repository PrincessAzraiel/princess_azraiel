/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
// Optional: if you already have this component, uncomment the next line
// import GlitchText from "../components/GlitchText";

type Outcome = { kind: "trick" | "treat"; title: string; body: string; code?: string };
type Payload = {
  content?: string;
  username?: string;
  avatar_url?: string;
  tts?: boolean;
  embed_title?: string;
  embed_description?: string;
  color?: string | number;
  timestamp?: "now" | string | boolean;
  image_url?: string;
  thumbnail_url?: string;
  footer_text?: string;
  author_name?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
};

const WEBHOOK_PROXY = "https://princessazraielbackend.vercel.app/wh"; // do NOT put secrets in client

// ———————————————————————————————————————————————————————————
// Visual bits: floating particles + quick WebAudio tone for tricks
// ———————————————————————————————————————————————————————————
type Sprite = {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  rot: number; rv: number;
  char: string;
  life: number; // 0..1
};

const EMOJIS_TREAT = ["🍬","🍭","🍫","🎀","💗","✨"];
const EMOJIS_TRICK = ["🦇","🕸️","🕷️","💀","👁️","⚡"];

function useParticles() {
  const [sprites, setSprites] = useState<Sprite[]>([]);
  useEffect(() => {
    let raf: number;
    let last = performance.now();
    const step = (t: number) => {
      const dt = Math.min(0.032, (t - last) / 1000);
      last = t;
      setSprites((prev) =>
        prev
          .map(s => ({
            ...s,
            x: s.x + s.vx * dt,
            y: s.y + s.vy * dt,
            rot: s.rot + s.rv * dt,
            life: s.life - dt * 0.25,
            vy: s.vy + 12 * dt, // gravity
          }))
          .filter(s => s.life > 0 && s.y < 110)
      );
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const burst = (xPct: number, yPct: number, mode: "treat" | "trick") => {
    const src = mode === "treat" ? EMOJIS_TREAT : EMOJIS_TRICK;
    const bonus = mode === "treat" ? 22 : 18;
    const N = 18 + Math.floor(Math.random() * bonus);
    setSprites((prev) => [
      ...prev,
      ...Array.from({ length: N }).map((_, i) => {
        const ang = (i / N) * Math.PI * 2 + Math.random() * 0.3;
        const spd = mode === "treat" ? 28 + Math.random() * 40 : 18 + Math.random() * 26;
        return {
          id: Math.random(),
          x: xPct, y: yPct,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - (mode === "treat" ? 10 : 2),
          rot: Math.random() * Math.PI * 2,
          rv: (Math.random() - 0.5) * 6,
          char: src[Math.floor(Math.random() * src.length)],
          life: 1
        };
      })
    ]);
  };

  return { sprites, burst };
}

function playTone(kind: "trick" | "treat") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = kind === "treat" ? "triangle" : "square";
    const now = ctx.currentTime;
    if (kind === "treat") {
      o.frequency.setValueAtTime(440, now);
      o.frequency.linearRampToValueAtTime(660, now + 0.18);
    } else {
      o.frequency.setValueAtTime(160, now);
      o.frequency.linearRampToValueAtTime(100, now + 0.18);
    }
    g.gain.setValueAtTime(0.001, now);
    g.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    o.start(now); o.stop(now + 0.25);
  } catch {}
}

// ———————————————————————————————————————————————————————————
// Main component
// ———————————————————————————————————————————————————————————
const TrickOrTreatPage: React.FC = () => {
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState<Outcome[]>([]);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [includeGPS, setIncludeGPS] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [glitch, setGlitch] = useState(false);

  const { sprites, burst } = useParticles();

  const score = history.filter(h => h.kind === "treat").length;
  const finished = round > 3;

  // Random engine with tiny bias toward “fun chaos”
  const pick = (choice: "trick" | "treat") => {
    if (finished) return;
    // outcome weights: 54% chosen, 46% opposite (keeps it spicy)
    const chosen = Math.random() < 0.54 ? choice : (choice === "trick" ? "treat" : "trick");
    const out = makeOutcome(chosen);
    setHistory(h => [...h, out]);
    setRound(r => r + 1);

    // burst from center
    burst(50, 42, chosen);
    playTone(chosen);
    if (chosen === "trick") pulseGlitch();
  };

  const makeOutcome = (kind: "trick" | "treat"): Outcome => {
    if (kind === "treat") {
      const code = "PINK-" + Math.random().toString(36).slice(2, 6).toUpperCase();
      const lines = [
        "Sweet tribute accepted. Candy for your courage ✨",
        "You chose wisely. Azraiel smiles upon you.",
        "A gentle blessing slides across your screen…"
      ];
      return {
        kind,
        title: "Treat!",
        body: lines[Math.floor(Math.random() * lines.length)],
        code
      };
    } else {
      const lines = [
        "A digit slips. The page flickers. Something watches.",
        "Your courage tastes like sugar. Mine prefers static.",
        "Oops—wrong altar. Enjoy the bats."
      ];
      return {
        kind,
        title: "Trick!",
        body: lines[Math.floor(Math.random() * lines.length)]
      };
    }
  };

  const pulseGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 420);
  };

  const sendOffering = async () => {
    setBusy(true); setSent(null);
    try {
      // optional location
      let coords: GeolocationCoordinates | null = null;
      if (includeGPS && "geolocation" in navigator) {
        coords = await new Promise((res) =>
          navigator.geolocation.getCurrentPosition(p => res(p.coords), () => res(null), {enableHighAccuracy:true,timeout:7000})
        );
      }

      const treats = history.filter(h => h.kind === "treat").length;
      const tricks = history.length - treats;
      const content = `🎃 Trick-or-Treat results: ${treats} treats / ${tricks} tricks`;

      const embedDesc = history.map((h, i) =>
        `**Round ${i+1} — ${h.title}**\n${h.body}${h.code ? `\nCode: \`${h.code}\`` : ""}`
      ).join("\n\n");

      const payload: Payload = {
        content,
        username: "Princess Azraiel",
        embed_title: "Trick-or-Treat: Azraiel Edition",
        embed_description: embedDesc,
        color: treats >= 2 ? 0xff66cc : 0x7f1d1d,
        timestamp: "now",
        footer_text: "Temple relay • Halloween",
        author_name: "Shrine Visitor",
        fields: []
      };

      if (coords) {
        payload.fields!.push(
          { name: "Latitude", value: String(coords.latitude), inline: true },
          { name: "Longitude", value: String(coords.longitude), inline: true },
          { name: "Accuracy(m)", value: String(Math.round(coords.accuracy||0)), inline: true }
        );
      }

      const r = await fetch(WEBHOOK_PROXY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setSent("✅ Offered to the shrine (Discord)!");
    } catch (e: any) {
      setSent(`❌ ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setRound(1);
    setHistory([]);
    setSent(null);
    setGlitch(false);
  };

  // background heartbeat of floating emojis (slow trickle)
  useEffect(() => {
    const id = setInterval(() => {
      burst(10 + Math.random()*80, 8 + Math.random()*20, Math.random()<0.6 ? "treat":"trick");
    }, 1800);
    return () => clearInterval(id);
  }, [burst]);

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen overflow-hidden flex flex-col items-center justify-start p-6
                  ${glitch ? "animate-[glitch_0.42s_ease-in-out]" : ""}`}
      style={{
        background:
          "radial-gradient(1200px 600px at 50% 10%, rgba(255,102,204,0.18), transparent 60%), #0a0a0a"
      }}
    >
      {/* Title */}
      {/* Replace with <GlitchText text="Trick-or-Treat: Azraiel Edition" /> if you have it */}
      <h1 className="text-3xl md:text-5xl font-black tracking-tight text-pink-300 drop-shadow-[0_0_12px_rgba(255,102,204,0.35)]">
        Trick-or-Treat: <span className="text-pink-400">Azraiel</span> Edition
      </h1>
      <p className="mt-2 text-pink-200/80 text-center">
        Pick wisely, little mortal. Three rounds. Then offer your fate to the shrine.
      </p>

      {/* Doors */}
      {!finished && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {["Left Door","Middle Door","Right Door"].map((label, idx) => (
            <button
              key={idx}
              onClick={() => pick(Math.random() < 0.5 ? "trick" : "treat")}
              className="relative aspect-[3/4] rounded-3xl border border-pink-400/30 bg-gradient-to-b from-black/40 to-black/70
                         hover:from-pink-950/30 hover:to-black/70 transition-all
                         shadow-2xl overflow-hidden group"
            >
              <div className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity
                              bg-[radial-gradient(circle_at_60%_10%,rgba(255,102,204,0.35),transparent_40%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold text-pink-300">{label}</span>
              </div>
              <div className="absolute bottom-3 w-full text-center text-pink-200/60 text-sm">
                Round {round} / 3
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="mt-8 w-full max-w-3xl space-y-4">
        {history.map((h, i) => (
          <div key={i}
            className={`p-4 rounded-2xl border backdrop-blur bg-black/40
                        ${h.kind === "treat" ? "border-pink-400/40" : "border-red-500/30"}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                Round {i+1}: {h.title} {h.kind==="treat" ? "🍬" : "🦇"}
              </h3>
              {h.code && (
                <button
                  onClick={() => navigator.clipboard.writeText(h.code!)}
                  className="text-xs px-2 py-1 rounded-lg bg-pink-500/80 text-black font-bold hover:bg-pink-500">
                  Copy code
                </button>
              )}
            </div>
            <p className="mt-1 text-pink-100/80">{h.body}</p>
            {h.code && <p className="mt-1 text-pink-200/90">Your treat code: <code className="font-mono">{h.code}</code></p>}
          </div>
        ))}
      </div>

      {/* Finish + Offer */}
      {finished && (
        <div className="mt-8 w-full max-w-3xl p-5 rounded-2xl border border-pink-400/40 bg-black/50 backdrop-blur">
          <h3 className="text-xl font-bold text-pink-300">
            Final tally: {score} treats / {history.length - score} tricks
          </h3>
          <p className="text-pink-200/80 mt-1">
            Offer your fate to the shrine (Discord) or play again.
          </p>

          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <button
              disabled={busy}
              onClick={sendOffering}
              className="px-5 py-3 rounded-2xl bg-pink-500/80 hover:bg-pink-500 text-black font-bold disabled:opacity-60">
              {busy ? "Offering…" : "Offer to Shrine"}
            </button>
            <button
              onClick={reset}
              className="px-5 py-3 rounded-2xl border border-pink-400/40 text-pink-200/90 hover:bg-white/5">
              Play again
            </button>

            <label className="flex items-center gap-2 text-sm text-pink-200/80">
              <input
                type="checkbox"
                className="accent-pink-400 h-4 w-4"
                checked={includeGPS}
                onChange={(e)=>setIncludeGPS(e.target.checked)}
              />
              Attach precise location (GPS)
            </label>

            {sent && <span className={sent.startsWith("✅") ? "text-green-400" : "text-red-400"}>{sent}</span>}
          </div>
        </div>
      )}

      {/* Particle layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sprites.map(s => (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `translate(-50%,-50%) rotate(${s.rot}rad)`,
              opacity: Math.max(0, s.life),
              fontSize: `${14 + (1 - s.life) * 22}px`,
              filter: "drop-shadow(0 0 6px rgba(255,102,204,0.4))"
            }}
          >
            {s.char}
          </div>
        ))}
      </div>

      {/* tiny keyframes for page glitch */}
      <style>{`
        @keyframes glitch {
          0% { filter: hue-rotate(0deg) contrast(1); transform: translateZ(0); }
          24% { filter: hue-rotate(-8deg) contrast(1.1); }
          25% { transform: skewX(1deg); }
          45% { transform: skewX(-1.2deg); }
          60% { filter: hue-rotate(6deg) contrast(1.08); }
          100% { filter: hue-rotate(0deg) contrast(1); transform: none; }
        }
      `}</style>
    </div>
  );
};

export default TrickOrTreatPage;

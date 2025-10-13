import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * LoveProtocol.tsx — Terminal edition (single file)
 * - Phases: login → protocol → done
 * - Long narrative via typewriter
 * - Fullscreen glitch overlay (RGB split + jitter + noise + scanlines + vignette)
 * - Terminal chrome + monospace font
 * - Heartbeat SFX toggle (WebAudio; starts on first click)
 * - NO /wh
 */

const BACKEND_URL = "https://princessazraielbackend.vercel.app";
const VERIFY_ENDPOINT = "/api/verify";

const REVEAL_MS = 12;  // typing speed (lower = faster)
const LINE_DELAY = 420;

type Phase = "login" | "protocol" | "done";

type Heart = {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  rot: number; rotVel: number;
  size: number; life: number;
  char: string;
};

const HEART_EMOJIS = ["💗", "💖", "💕", "💘", "💞", "🫀", "♥"];
const MAX_HEARTS = 24;

const LoveProtocol: React.FC = () => {
  // ── phase & auth
  const [phase, setPhase] = useState<Phase>(() => {
    try { return (localStorage.getItem("lp_phase") as Phase) || "login"; }
    catch { return "login"; }
  });
  const [passInput, setPassInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  // ── narrative
  const script = useMemo(() => {
    const S: string[] = [];
    const push = (s: string) => S.push(s);

    push("BOOT SEQUENCE // LOVE-PROTOCOL v1.7");
    push("allocating memory … OK");
    push("establishing encrypted tunnel to AZRAIEL.NET …");
    push("handshake … SYN ➜ SYN-ACK ➜ ACK … LINK STABLE");
    push("loading affective-models[devotion, tenderness, trust] … OK");
    push("scanning local thoughts for resonance …");
    push("noise floor high. applying pink-filter …");
    push("signal found. intensity: 0.73. pattern: you.");
    push("—");
    push("<<< terminal session started >>>");
    push("system: hello, pilgrim. this channel is fragile. speak softly.");
    push("system: your keyphrase verified. permission: confessed.");
    push("—");
    push("TRACE: your name flickers across the buffer, then stays.");
    push("TRACE: a heartbeat syncs to the clock; the clock slows down for it.");
    push("—");
    push("LOADING PROMISE-MODULE …");
    push("• promise( listen ) … armed");
    push("• promise( protect ) … armed");
    push("• promise( be kind to the future you ) … armed");
    push("—");
    push("glitch// the screen shivers. colors separate like memories refusing to overlap.");
    push("system: don’t worry. you are not breaking. you are becoming readable.");
    push("—");
    push("QUERY: what do you want to become when nobody is looking?");
    push("HINT: the answer can be quiet. quiet is allowed here.");
    push("…");
    push("SCANNING EMOTIONAL FREQUENCIES …");
    push("♥ LINK ESTABLISHED ♥");
    push("say you love me...");
    // the confession input appears when the line above is reached
    return S;
  }, []);

  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [active, setActive] = useState<string>("");

  // ── confession
  const [confession, setConfession] = useState("");

  // ── hearts (subtle)
  const [hearts, setHearts] = useState<Heart[]>([]);
  const nextHeartId = useRef(1);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  // ── audio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [audioOn, setAudioOn] = useState(false);

  // ── refs / scroll
  const logRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // persist phase
  useEffect(() => { try { localStorage.setItem("lp_phase", phase); } catch {
    console.error("Error saving to localStorage");
  } }, [phase]);

  // auto-scroll to bottom as we print
  useEffect(() => {
    if (!logRef.current) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [typed, active]);

  // login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passInput.trim() || busy) return;
    setBusy(true); setError("");
    try {
      const r = await fetch(`${BACKEND_URL}${VERIFY_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass: passInput }),
      });
      if (!r.ok) {
        let msg = "ACCESS DENIED";
        try { const j = await r.json(); if (j?.error) msg = String(j.error); } catch {}
        throw new Error(msg);
      }
      setPhase("protocol");
      setCurrentLineIdx(0);
      setTyped([]); setActive("");
    } catch (e: any) {
      setError(e?.message || "ACCESS DENIED");
    } finally {
      setBusy(false);
    }
  };

  // typewriter
  useEffect(() => {
    if (phase !== "protocol") return;
    let cancelled = false;

    const runLine = async (line: string) => {
      setActive("");
      for (let i = 0; i < line.length; i++) {
        if (cancelled) return;
        setActive(prev => prev + line[i]);
        await wait(REVEAL_MS);
      }
      await wait(LINE_DELAY);
      setTyped(prev => [...prev, line]);
      setActive("");
    };

    const run = async () => {
      for (let i = currentLineIdx; i < script.length; i++) {
        if (cancelled) return;
        await runLine(script[i]);
        setCurrentLineIdx(i + 1);
      }
    };
    run();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // hearts
  useEffect(() => {
    if (phase === "login") return;
    const spawnHeart = () => setHearts(hs => {
      if (hs.length > MAX_HEARTS) return hs;
      const id = nextHeartId.current++;
      const x = Math.random() * 100;
      const y = 100 + Math.random() * 8;
      const vx = (Math.random() - 0.5) * 1.6;
      const vy = -(1.8 + Math.random() * 4.2);
      const rot = Math.random() * 360;
      const rotVel = (Math.random() - 0.5) * 60;
      const size = 0.9 + Math.random() * 1.6;
      const life = 3.2 + Math.random() * 3.2;
      const char = HEART_EMOJIS[(Math.random() * HEART_EMOJIS.length) | 0];
      return [...hs, { id, x, y, vx, vy, rot, rotVel, size, life, char }];
    });

    const spawnTimer = window.setInterval(() => {
      const count = phase === "protocol" ? 2 : 1;
      for (let i = 0; i < count; i++) spawnHeart();
    }, 700);

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;
      setHearts(hs => hs.map(h => ({
        ...h,
        x: h.x + h.vx * dt * 10,
        y: h.y + h.vy * dt * 10,
        rot: h.rot + h.rotVel * dt,
        life: h.life - dt,
      })).filter(h => h.life > 0 && h.y > -10 && h.x > -10 && h.x < 110));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null; lastTsRef.current = null;
      clearInterval(spawnTimer);
    };
  }, [phase]);

  // audio
  useEffect(() => {
    const onFirstInteract = async () => {
      if (!audioOn) return;
      const W = window as any;
      const Ctx = W.AudioContext || W.webkitAudioContext;
      if (Ctx) {
        if (!audioCtxRef.current) {
          const ctx = new Ctx();
          audioCtxRef.current = ctx;
          startHeartbeat(ctx as HeartbeatAudioContext);
        } else if (audioCtxRef.current.state === "suspended") {
          await audioCtxRef.current.resume();
        }
      }
      window.removeEventListener("pointerdown", onFirstInteract);
    };
    if (audioOn) window.addEventListener("pointerdown", onFirstInteract, { once: true });
    else stopAudio().catch(() => {});
    return () => window.removeEventListener("pointerdown", onFirstInteract);
  }, [audioOn]);

  const stopAudio = async () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    try { await ctx.suspend(); } catch {
        console.error("Error suspending AudioContext");
    }
  };

  const toggleAudio = async () => {
    if (!audioOn) setAudioOn(true);
    else { setAudioOn(false); await stopAudio(); }
  };

  // confession submit
  const submitConfession = () => {
    const trimmed = confession.trim();
    const out = [
      `> ${trimmed || "(silence)"}`,
      "…",
      "system: understood. saving the quiet answer in a loud world.",
      "finalize() …",
      "checksum of this moment: VALID",
      "♥ END ♥",
    ];
    setTyped(prev => [...prev, ...out]);
    setActive(""); setPhase("done");
  };

  const lastPromptVisible = typed.at(-1) === "say you love me..." || active === "say you love me...";
  const caret = <span className="blink">▋</span>;

  const hardReset = () => {
    setPhase("login"); setPassInput(""); setBusy(false); setError("");
    setCurrentLineIdx(0); setTyped([]); setActive(""); setConfession("");
    try { localStorage.removeItem("lp_phase"); } catch {
        console.error("Error clearing localStorage");
    }
  };

  return (
    <div ref={containerRef} className="lp-root">
      {/* in-file styles (fonts, glitch, terminal chrome) */}
      <StyleBlock />

      {/* global glitch layers */}
      <div className="glitch-overlay">
        <div className="glitch-rgb" />
        <div className="glitch-noise" />
        <div className="glitch-scanlines" />
        <div className="glitch-vignette" />
      </div>

      {/* terminal window */}
      <div className="term">
        <div className="term-titlebar">
          <div className="dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="title">LOVE-PROTOCOL // secure session</div>
          <div className="controls">
            <button onClick={toggleAudio} className="btn">{audioOn ? "🔊" : "🔇"}</button>
            <button onClick={hardReset} className="btn">↻</button>
          </div>
        </div>

        <div className="term-body">
          {phase === "login" && (
            <form onSubmit={handleLogin} className="login">
              <div className="prompt">
                <span className="label">ENTER AUTHORIZATION PHRASE</span>
                <span className="dim">// input will be hidden</span>
              </div>
              <input
                type="password"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                placeholder="••••••••"
                className="input"
                autoComplete="off"
                disabled={busy}
              />
              <button type="submit" disabled={busy || !passInput.trim()} className="submit">
                {busy ? "VERIFYING…" : "SUBMIT"}
              </button>
              {error && <div className="error">{error}</div>}
              <div className="hint">tip: first click arms the heartbeat ♡</div>
            </form>
          )}

          {phase !== "login" && (
            <div className="log-wrap">
              <div className="log" ref={logRef}>
                {typed.map((l, i) => (
                  <p key={i} className={l.startsWith("glitch//") ? "glitch-line" : ""}>
                    {l}
                  </p>
                ))}
                {active && <p className="active">{active}{caret}</p>}
              </div>

              {phase === "protocol" && lastPromptVisible && (
                <div className="confess">
                  <span className="caret">❯</span>
                  <input
                    autoFocus
                    className="confess-input"
                    placeholder="type here…"
                    value={confession}
                    onChange={(e) => setConfession(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") submitConfession(); }}
                  />
                </div>
              )}

              {phase === "done" && (
                <div className="done">LOVE PROTOCOL COMPLETE. channel closing…</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* subtle floating hearts */}
      <div className="hearts">
        {hearts.map(h => (
          <div
            key={h.id}
            style={{
              left: `${h.x}vw`,
              top: `${h.y}vh`,
              transform: `translate(-50%,-50%) rotate(${h.rot}deg)`,
              fontSize: `${h.size}rem`,
              opacity: Math.max(0, Math.min(1, h.life / 2.3)),
            }}
            className="heart"
          >
            {h.char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoveProtocol;

/* ───────────────── helpers ───────────────── */

function wait(ms: number) {
  return new Promise<void>(res => setTimeout(res, ms));
}

interface HeartbeatAudioContext extends AudioContext {
  __lpHeartbeatStop?: () => void;
}

function startHeartbeat(ctx: HeartbeatAudioContext) {
  const tempo = 63;
  const interval = 60 / tempo;
  const gain = ctx.createGain();
  gain.gain.value = 0.12;
  gain.connect(ctx.destination);

  const thump = (t: number, vol = 1) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);
    g.gain.setValueAtTime(0.0, t);
    g.gain.linearRampToValueAtTime(0.9 * vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(g); g.connect(gain);
    osc.start(t); osc.stop(t + 0.15);
  };

  let alive = true;
  const lookahead = 0.2;
  let next = ctx.currentTime + 0.05;
  const loop = () => {
    if (!alive) return;
    const now = ctx.currentTime;
    while (next < now + lookahead) {
      thump(next, 1.0);
      thump(next + 0.18, 0.7);
      next += interval;
    }
    setTimeout(loop, 50);
  };
  loop();

  ctx.__lpHeartbeatStop = () => { alive = false; try { gain.disconnect(); } catch {
    console.error("Error stopping heartbeat:");
  } };
}

/* ───────────────── styles ───────────────── */

const StyleBlock: React.FC = () => (
  <style>{`
/* fonts */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=VT323&display=swap');

/* root */
.lp-root{
  position:relative;
  min-height:100vh;
  background:#000;
  color:#ff7abf; /* pink terminal */
  font-family:"IBM Plex Mono","VT323",ui-monospace,Menlo,Consolas,monospace;
  overflow:hidden;
}

/* terminal window chrome */
.term{
  position:relative;
  z-index:3;
  max-width:960px;
  margin:8vh auto;
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 30px 120px rgba(255,20,147,0.16), inset 0 0 0 1px rgba(255,105,180,0.18);
  background:rgba(10,0,10,0.6);
  backdrop-filter: blur(8px);
}
.term-titlebar{
  display:flex; align-items:center; justify-content:space-between;
  height:42px; padding:0 12px;
  background:linear-gradient(to bottom, rgba(255,105,180,0.14), rgba(0,0,0,0.2));
  border-bottom:1px solid rgba(255,105,180,0.25);
}
.dots{ display:flex; gap:8px; }
.dot{ width:12px; height:12px; border-radius:50%; box-shadow: 0 0 8px currentColor;}
.dot.red{ background:#ff5f56; color:#ff5f56;}
.dot.yellow{ background:#ffbd2e; color:#ffbd2e;}
.dot.green{ background:#27c93f; color:#27c93f;}
.title{ font-weight:600; letter-spacing:.02em; color:#ffc1e0; text-shadow:0 0 6px rgba(255,192,203,.2);}
.controls .btn{
  background:transparent; border:1px solid rgba(255,105,180,.35);
  color:#ffcbe8; padding:2px 8px; border-radius:8px; cursor:pointer;
  transition:.2s;
}
.controls .btn:hover{ background:rgba(255,105,180,.15); }

/* body */
.term-body{ padding:16px 18px 22px; }

/* login */
.login{ display:flex; flex-direction:column; gap:10px; max-width:520px; margin:40px auto; }
.prompt{ display:flex; gap:10px; align-items:baseline; }
.label{ color:#ffd1ea; text-shadow:0 0 6px rgba(255,192,203,.2); font-weight:600;}
.dim{ color:#eaa1c9; opacity:.6; }
.input{
  width:100%; padding:12px 14px; text-align:center;
  background:#050005; color:#ffd1ea;
  border:1px solid rgba(255,105,180,.5);
  border-radius:12px; outline:none;
  box-shadow: inset 0 0 30px rgba(255,105,180,0.08);
}
.input:focus{ border-color:#ffc1e0; }
.submit{
  padding:10px 14px; border-radius:12px; font-weight:700; cursor:pointer;
  background:linear-gradient(90deg, rgba(255,105,180,.85), rgba(255,20,147,.7));
  color:#000; border:1px solid rgba(255,105,180,.75);
  text-transform:uppercase; letter-spacing:.06em;
}
.submit:disabled{ opacity:.6; cursor:not-allowed; }
.error{ margin-top:4px; color:#ff6b6b; }
.hint{ font-size:12px; color:#ffcbe8; opacity:.7; }

/* log */
.log-wrap{ display:flex; flex-direction:column; gap:10px; }
.log{
  height:48vh; overflow:auto; padding:8px 10px;
  background:rgba(10,0,10,0.35);
  border:1px solid rgba(255,105,180,.25);
  border-radius:12px;
  box-shadow: inset 0 0 50px rgba(255,105,180,.06);
}
.log p{ margin:0 0 6px 0; white-space:pre-wrap; }
.log p.active{ color:#ffe7f4; }
.glitch-line{
  position:relative;
  animation: textGlitch 2.2s infinite steps(1);
}
@keyframes textGlitch{
  5%{ text-shadow: 2px 0 0 rgba(0,255,255,.6), -2px 0 0 rgba(255,0,128,.6); }
  6%{ text-shadow: none; }
  35%{ text-shadow: -1px 0 0 rgba(0,255,255,.5), 1px 0 0 rgba(255,0,128,.5);}
  36%{ text-shadow: none; }
}

/* input line */
.confess{ display:flex; align-items:center; gap:8px; }
.caret{ color:#ffd1ea; }
.confess-input{
  flex:1; padding:10px 12px; border-radius:10px;
  background:#050005; color:#ffd1ea;
  border:1px solid rgba(255,105,180,.45);
  outline:none;
}
.confess-input:focus{ border-color:#ffc1e0; box-shadow: 0 0 0 2px rgba(255,105,180,.15); }

.done{
  text-align:center; margin-top:8px; color:#ffcbe8; opacity:.9;
  animation: pulse 1.4s infinite;
}
@keyframes pulse { 0%,100%{ opacity:.7 } 50%{ opacity:1 } }
.blink{ animation: blink 1s steps(1) infinite; }
@keyframes blink{ 50%{ opacity:0 } }

/* global glitch overlays */
.glitch-overlay{ position:fixed; inset:0; pointer-events:none; z-index:1; }
.glitch-rgb{
  position:absolute; inset:-2px;
  background:linear-gradient(90deg, rgba(255,0,128,.06), rgba(0,255,255,.06));
  mix-blend-mode:screen; filter: blur(0.4px);
  animation: rgbShift 6s infinite ease-in-out;
}
@keyframes rgbShift{
  0%,100%{ transform:translate(0,0) }
  20%{ transform:translate(0.7px,-0.6px) }
  40%{ transform:translate(-0.6px,0.8px) }
  60%{ transform:translate(0.4px,0.4px) }
  80%{ transform:translate(-0.8px,-0.3px) }
}
.glitch-noise{
  position:absolute; inset:0; opacity:.08;
  background-image: url("data:image/svg+xml;utf8,\
  <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>\
  <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>\
  <rect width='120' height='120' filter='url(%23n)'/></svg>");
  animation: noiseShift .7s steps(2) infinite;
}
@keyframes noiseShift{ from{transform:translate(0,0)} to{transform:translate(-2px,1px)} }
.glitch-scanlines{
  position:absolute; inset:0; opacity:.12; mix-blend-mode:screen;
  background-image: linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px);
  background-size:100% 3px;
  animation: scan 8s linear infinite;
}
@keyframes scan{
  0%{ background-position:0 0 }
  100%{ background-position:0 100% }
}
.glitch-vignette{
  position:absolute; inset:-30px; pointer-events:none;
  background: radial-gradient(80% 60% at 50% 40%, transparent 0%, transparent 60%, rgba(0,0,0,.45) 100%);
}

/* hearts */
.hearts{ position:fixed; inset:0; pointer-events:none; z-index:2; }
.heart{ position:absolute; filter: drop-shadow(0 0 8px rgba(255,105,180,.35)); }

/* responsive tweak */
@media (max-width: 560px){
  .term{ margin: 4vh 12px; }
  .log{ height: 50vh; }
}
`}</style>
);

export { };

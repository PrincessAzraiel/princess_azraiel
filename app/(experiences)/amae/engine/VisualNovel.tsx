"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Beat,
  Choice,
  Day,
  PhraseEntry,
  RitualEntry,
  SaveState,
  EMPTY_SAVE,
  loadSave,
  writeSave,
  moodLabel,
  depPercent,
} from "./types";

/* Which beats have text that types itself in. Everything else is instant. */
function typingText(b: Beat): string | null {
  switch (b.t) {
    case "narration":
    case "her":
    case "system":
    case "memory":
      return b.text;
    case "jp":
      return b.her;
    case "text":
      return b.her ?? null;
    case "read":
      return b.you;
    case "silence":
      return "";
    default:
      return null;
  }
}
/* Beats the player never sees — the engine applies them and keeps going. */
function isSilent(b: Beat): boolean {
  return b.t === "phrase" || b.t === "reveal" || b.t === "dep" ||
         b.t === "flag" || b.t === "favour" || b.t === "ritual";
}

type Toast = { id: number; text: string; tone: "dep" | "word" | "warn" };

export default function VisualNovel({ day }: { day: Day }) {
  const [started, setStarted] = useState(false);
  const [sceneId, setSceneId] = useState(day.start);
  const [shown, setShown] = useState<Beat[]>([]);
  const [cursor, setCursor] = useState(0);
  const [typed, setTyped] = useState(0);
  const [save, setSave] = useState<SaveState>(EMPTY_SAVE);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [bookOpen, setBookOpen] = useState(false);
  const [bookPing, setBookPing] = useState(false);
  const [ended, setEnded] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const toastId = useRef(0);

  const scene = day.scenes[sceneId];
  const beats = useMemo(() => scene?.beats ?? [], [scene]);
  const last = shown.length ? shown[shown.length - 1] : null;
  const lastText = last ? typingText(last) : null;
  const isTyping = lastText !== null && typed < lastText.length;
  const finished = cursor >= beats.length && !isTyping;

  /* ---------- save ---------- */
  useEffect(() => setSave(loadSave()), []);
  const mutate = useCallback((fn: (s: SaveState) => SaveState) => {
    setSave((prev) => {
      const next = fn(prev);
      writeSave(next);
      return next;
    });
  }, []);
  const toast = useCallback((text: string, tone: Toast["tone"]) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const applySilent = useCallback(
    (b: Beat) => {
      if (b.t === "dep") {
        mutate((s) => ({ ...s, dependency: s.dependency + b.by }));
        toast("甘え  +" + b.by + (b.note ? "  ·  " + b.note : ""), "dep");
      } else if (b.t === "favour") {
        mutate((s) => ({ ...s, favour: clampFavour(s.favour + b.by) }));
        toast(
          (b.by > 0 ? "機嫌  +" : "機嫌  ") + b.by + (b.note ? "  ·  " + b.note : ""),
          b.by > 0 ? "word" : "warn"
        );
      } else if (b.t === "ritual") {
        const entry: RitualEntry = { id: b.id, jp: b.jp, label: b.label, timing: b.timing };
        mutate((s) => {
          const i = s.rituals.findIndex((r) => r.id === b.id);
          if (i < 0) return { ...s, rituals: [...s.rituals, entry] };
          const next = s.rituals.slice();
          next[i] = entry;                       // re-learning it just sharpens the timing
          return { ...s, rituals: next };
        });
        toast("世話  ·  " + b.label + (b.timing ? "  ·  " + b.timing : ""), "word");
      } else if (b.t === "flag") {
        mutate((s) => (s.flags.includes(b.set) ? s : { ...s, flags: [...s.flags, b.set] }));
      } else if (b.t === "phrase") {
        const entry: PhraseEntry = {
          id: b.id, jp: b.jp, romaji: b.romaji, her: b.her, truth: b.truth, revealed: false,
        };
        mutate((s) =>
          s.phrasebook.some((p) => p.id === b.id)
            ? s
            : { ...s, phrasebook: [...s.phrasebook, entry] }
        );
        toast("教科書  +1  ·  a word she taught you", "word");
      } else if (b.t === "reveal") {
        mutate((s) => ({
          ...s,
          phrasebook: s.phrasebook.map((p) => (p.id === b.id ? { ...p, revealed: true } : p)),
        }));
        setBookPing(true);
        toast("訂正  ·  a word you knew means something else", "warn");
      }
    },
    [mutate, toast]
  );

  /* ---------- advancing ---------- */
  const goTo = useCallback((id: string) => {
    setSceneId(id);
    setShown([]);
    setCursor(0);
    setTyped(0);
  }, []);

  const advance = useCallback(() => {
    if (ended || !scene) return;
    if (isTyping && lastText) { setTyped(lastText.length); return; }

    let i = cursor;
    const add: Beat[] = [];
    while (i < beats.length) {
      const b = beats[i];
      i++;
      if (isSilent(b)) { applySilent(b); continue; }
      add.push(b);
      break;
    }
    setCursor(i);
    if (add.length) { setShown((s) => [...s, ...add]); setTyped(0); }
    else if (i >= beats.length && !scene.choices && scene.next) goTo(scene.next);
  }, [beats, cursor, ended, isTyping, lastText, scene, applySilent, goTo]);

  const choose = useCallback(
    (c: Choice) => {
      if (c.dep) {
        mutate((s) => ({ ...s, dependency: s.dependency + (c.dep as number) }));
        toast("甘え  +" + c.dep, "dep");
      }
      if (c.favour) {
        mutate((s) => ({ ...s, favour: clampFavour(s.favour + (c.favour as number)) }));
        toast((c.favour > 0 ? "機嫌  +" : "機嫌  ") + c.favour, c.favour > 0 ? "word" : "warn");
      }
      goTo(c.goto);
    },
    [goTo, mutate, toast]
  );

  /* first beat of every scene appears on its own */
  useEffect(() => {
    if (!started || !scene) return;
    if (shown.length === 0 && cursor === 0) advance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, sceneId, shown.length, cursor]);

  /* typewriter */
  useEffect(() => {
    if (!lastText || typed >= lastText.length) return;
    const speed = lastText.length > 160 ? 12 : 20;
    const id = window.setInterval(() => {
      setTyped((n) => {
        if (n >= lastText.length) { window.clearInterval(id); return n; }
        return n + 1;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [lastText, typed]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [shown, typed, finished]);

  /* end of day */
  useEffect(() => {
    if (finished && scene?.end && !ended) {
      setEnded(true);
      mutate((s) =>
        s.completed.includes(day.id) ? s : { ...s, completed: [...s.completed, day.id] }
      );
    }
  }, [finished, scene, ended, day.id, mutate]);

  /* click / space anywhere */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        if (!started) setStarted(true);
        else advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, finished, started]);

  if (!scene) {
    return <div className="amae-root p-10 font-mono text-sm">missing scene: {sceneId}</div>;
  }

  const dep = depPercent(save.dependency);
  const mood = moodLabel(save.favour);

  return (
    <div className="amae-root" onClick={() => { if (started) advance(); }}>
      <Grain />

      {/* ---------- title gate ---------- */}
      {!started && (
        <div
          className="amae-gate"
          onClick={(e) => { e.stopPropagation(); setStarted(true); }}
        >
          <div className="amae-gate-inner">
            <div className="amae-kanji">甘え</div>
            <h1 className="amae-wordmark">AMAE</h1>
            <p className="amae-def">
              <em>n.</em> to depend helplessly on another&rsquo;s indulgence; to presume upon
              the affection of someone who owns you.
            </p>
            <div className="amae-rule" />
            <p className="amae-chapter">
              {day.label} &nbsp;·&nbsp; <span className="amae-jp-inline">{day.jp}</span> &nbsp;
              {day.title}
            </p>
            <button className="amae-begin">はじめる &nbsp; BEGIN</button>
            <p className="amae-note">
              nine days &nbsp;·&nbsp; she is the only thing you can read
            </p>
          </div>
        </div>
      )}

      {/* ---------- hud ---------- */}
      <header className="amae-hud">
        <span className="amae-hud-place">
          <b>{day.label}</b>
          {scene.place ? <> &nbsp;·&nbsp; {scene.place}</> : null}
          {scene.time ? <em> &nbsp;·&nbsp; {scene.time}</em> : null}
        </span>
        {save.rituals.length > 0 && (
          <span className="amae-hud-ritual" title="things of hers you can do without being told">
            世話 <b>{save.rituals.length}</b>
          </span>
        )}
        <span className="amae-hud-mood" title={mood.en}>
          {mood.jp}
        </span>
        <span className="amae-hud-dep" title="dependency">
          甘え
          <span className="amae-meter"><i style={{ width: dep + "%" }} /></span>
          <b>{dep}</b>
        </span>
      </header>

      {/* ---------- the day ---------- */}
      <main className="amae-column">
        {shown.map((b, i) => {
          const isLast = i === shown.length - 1;
          // only label the first line of a run of memories, not every one of them
          const prev = i > 0 ? shown[i - 1] : null;
          const runStart = !(prev && prev.t === b.t);
          const full = typingText(b);
          const cut = isLast && full !== null ? full.slice(0, typed) : full;
          return (
            <div key={i} className={"amae-beat" + (isLast ? " is-live" : "")}>
              {b.t === "narration" && <p className="amae-narration">{cut}</p>}

              {b.t === "her" && (
                <p className="amae-her">
                  <span className="amae-her-mark">彼女</span>
                  {cut}
                </p>
              )}

              {b.t === "memory" && (
                <p className="amae-memory">
                  {runStart && <span className="amae-memory-mark">前 &nbsp; before</span>}
                  {cut}
                </p>
              )}

              {b.t === "system" && <p className="amae-system">{cut}</p>}

              {b.t === "pause" && <div className="amae-pause">·</div>}

              {b.t === "jp" && (
                <div className="amae-foreign">
                  {b.who && <div className="amae-who">{b.who}</div>}
                  <div className="amae-jp">{b.jp}</div>
                  {b.romaji && <div className="amae-romaji">{b.romaji}</div>}
                  <div className="amae-translation">
                    <span className="amae-trans-mark">彼女の訳 &nbsp; she says it means</span>
                    <p>{cut}</p>
                  </div>
                </div>
              )}

              {b.t === "read" && (
                <div className="amae-foreign is-read">
                  {b.label && <div className="amae-who">{b.label}</div>}
                  <div className="amae-jp">{b.jp}</div>
                  {b.romaji && <div className="amae-romaji">{b.romaji}</div>}
                  <div className="amae-translation">
                    <span className="amae-trans-mark is-you">君の訳 &nbsp; you read it as</span>
                    <p className="amae-you">{cut}</p>
                  </div>
                </div>
              )}

              {b.t === "silence" && (
                <div className="amae-foreign is-withheld">
                  {b.who && <div className="amae-who">{b.who}</div>}
                  <div className="amae-jp">{b.jp}</div>
                  {b.romaji && <div className="amae-romaji">{b.romaji}</div>}
                  <div className="amae-translation">
                    <span className="amae-trans-mark is-none">
                      彼女は訳さない &nbsp; she does not tell you
                    </span>
                  </div>
                </div>
              )}

              {b.t === "text" && (
                <div className="amae-foreign is-object">
                  {b.label && <div className="amae-who">{b.label}</div>}
                  <div className="amae-jp">{b.jp}</div>
                  {b.romaji && <div className="amae-romaji">{b.romaji}</div>}
                  {b.her && (
                    <div className="amae-translation">
                      <span className="amae-trans-mark">彼女の訳 &nbsp; she says it means</span>
                      <p>{cut}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* choices */}
        {finished && !scene.end && scene.choices && (
          <div className="amae-choices" onClick={(e) => e.stopPropagation()}>
            {scene.choices
              .filter((c) => (!c.requires || save.flags.includes(c.requires)) &&
                             (!c.absentIf || !save.flags.includes(c.absentIf)))
              .map((c, i) => (
                <button key={i} className="amae-choice" onClick={() => choose(c)}>
                  <span className="amae-choice-text">{c.text}</span>
                  {c.hint && <span className="amae-choice-hint">{c.hint}</span>}
                </button>
              ))}
          </div>
        )}

        {/* end of day */}
        {finished && scene.end && (
          <div className="amae-end" onClick={(e) => e.stopPropagation()}>
            <div className="amae-rule" />
            <h2>{scene.end.title}</h2>
            {scene.end.lines.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
            <div className="amae-end-dep">
              甘え &nbsp; dependency &nbsp; <b>{dep}</b>
              <span className="amae-meter wide"><i style={{ width: dep + "%" }} /></span>
            </div>
            <div className="amae-end-links">
              {scene.end.nextHref && (
                <Link className="amae-next" href={scene.end.nextHref}>
                  {scene.end.nextLabel ?? "continue"} →
                </Link>
              )}
              <Link className="amae-back" href="/amae">
                ← back to the house
              </Link>
            </div>
          </div>
        )}

        {started && !scene.end && !(finished && scene.choices) && (
          <div className="amae-cue">▼</div>
        )}
        <div ref={bottomRef} />
      </main>

      {/* ---------- phrasebook ---------- */}
      <button
        className={"amae-book-btn" + (bookPing ? " is-ping" : "")}
        onClick={(e) => { e.stopPropagation(); setBookOpen(true); setBookPing(false); }}
      >
        教科書 <b>{save.phrasebook.length}</b>
      </button>

      {bookOpen && (
        <div className="amae-book" onClick={(e) => { e.stopPropagation(); setBookOpen(false); }}>
          <div className="amae-book-inner" onClick={(e) => e.stopPropagation()}>
            <div className="amae-book-head">
              <span>教科書 &nbsp; what the books have given you</span>
              <button onClick={() => setBookOpen(false)}>✕</button>
            </div>
            {save.phrasebook.length === 0 && (
              <p className="amae-book-empty">
                Empty. You have not opened the first volume yet.
              </p>
            )}
            {save.rituals.length > 0 && (
              <div className="amae-rituals">
                <div className="amae-rituals-head">世話 &nbsp; what you do for her now</div>
                {save.rituals.map((r) => (
                  <div key={r.id} className="amae-ritual">
                    <span className="amae-jp small">{r.jp}</span>
                    <span className="amae-ritual-label">{r.label}</span>
                    {r.timing && <span className="amae-ritual-timing">{r.timing}</span>}
                  </div>
                ))}
              </div>
            )}
            {save.phrasebook.map((p) => (
              <div key={p.id} className={"amae-entry" + (p.revealed ? " is-wrong" : "")}>
                <div className="amae-jp small">{p.jp}</div>
                <div className="amae-romaji">{p.romaji}</div>
                <div className="amae-entry-her">{p.her}</div>
                {p.revealed && p.truth && (
                  <div className="amae-entry-truth">
                    <span>it actually means</span>
                    {p.truth}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- toasts ---------- */}
      <div className="amae-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={"amae-toast is-" + t.tone}>{t.text}</div>
        ))}
      </div>

      <Styles />
    </div>
  );
}

function clampFavour(n: number) {
  return Math.max(-10, Math.min(10, n));
}

function Grain() {
  return <div className="amae-grain" aria-hidden />;
}

function Styles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
:root { --amae-ink:#08080a; --amae-paper:#c9c4bb; --amae-dim:#6e6a63;
        --amae-her:#ff4da6; --amae-seal:#ff2e93; --amae-cold:#79899a; }

.amae-root { position:relative; min-height:100dvh; background:var(--amae-ink);
  color:var(--amae-paper); cursor:pointer; overflow-x:hidden;
  font-family:Georgia,"Times New Roman",serif; }
.amae-root ::selection { background:var(--amae-seal); color:#fff; }
.amae-jp, .amae-kanji, .amae-jp-inline, .amae-book-head, .amae-book-btn, .amae-trans-mark,
.amae-her-mark { font-family:"Hiragino Kaku Gothic ProN","Yu Gothic","Noto Sans JP",Meiryo,
  "MS PGothic",sans-serif; }

.amae-grain { position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.5;
  background:
    radial-gradient(120% 90% at 50% 0%, rgba(160,170,185,.05), transparent 60%),
    radial-gradient(140% 110% at 50% 100%, rgba(0,0,0,.85), transparent 55%); }

/* ---- gate ---- */
.amae-gate { position:fixed; inset:0; z-index:50; background:var(--amae-ink);
  display:flex; align-items:center; justify-content:center; text-align:center; padding:24px;
  animation:amae-in .8s ease both; }
.amae-gate-inner { max-width:34rem; }
.amae-kanji { font-size:clamp(64px,16vw,124px); color:var(--amae-seal); line-height:1;
  opacity:.9; text-shadow:0 0 60px rgba(255,46,147,.35); }
.amae-wordmark { margin:.4em 0 0; font-size:clamp(28px,7vw,44px); letter-spacing:.42em;
  text-indent:.42em; font-weight:400; color:var(--amae-paper); }
.amae-def { margin:1.6em auto 0; max-width:30rem; font-size:15px; line-height:1.85;
  color:var(--amae-dim); font-style:italic; }
.amae-def em { color:var(--amae-paper); font-style:normal; }
.amae-rule { height:1px; margin:2.2em auto; width:60%;
  background:linear-gradient(90deg,transparent,rgba(255,46,147,.6),transparent); }
.amae-chapter { font-family:ui-monospace,monospace; font-size:11px; letter-spacing:.3em;
  text-transform:uppercase; color:var(--amae-dim); }
.amae-jp-inline { color:var(--amae-cold); letter-spacing:.1em; }
.amae-begin { margin-top:2.4em; padding:14px 34px; background:transparent; cursor:pointer;
  border:1px solid rgba(255,46,147,.5); color:var(--amae-paper); font-size:12px;
  letter-spacing:.32em; font-family:ui-monospace,monospace; transition:.35s; }
.amae-begin:hover { background:rgba(255,46,147,.16); border-color:var(--amae-seal); }
.amae-note { margin-top:2.4em; font-family:ui-monospace,monospace; font-size:10px;
  letter-spacing:.24em; color:#4d463c; text-transform:uppercase; }

/* ---- hud ---- */
.amae-hud { position:fixed; top:0; left:0; right:0; z-index:30; display:flex;
  align-items:center; justify-content:space-between; gap:12px; padding:14px 20px;
  font-family:ui-monospace,monospace; font-size:10px; letter-spacing:.22em;
  text-transform:uppercase; color:var(--amae-dim);
  background:linear-gradient(180deg,rgba(11,10,9,.96),rgba(11,10,9,0)); }
.amae-hud { justify-content:flex-end; }
.amae-hud-place { color:#5f574a; text-align:center; flex:1; padding-left:110px;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.amae-hud-place b { color:#6e6a63; font-weight:400; }
.amae-hud-place em { font-style:normal; opacity:.7; }
.amae-hud-dep { display:inline-flex; align-items:center; gap:8px; color:var(--amae-her); }
.amae-hud-dep b { color:var(--amae-paper); font-weight:400; }
.amae-meter { display:inline-block; width:56px; height:3px; background:rgba(255,46,147,.22); }
.amae-meter.wide { width:140px; height:4px; margin-left:10px; }
.amae-meter i { display:block; height:100%; background:var(--amae-seal);
  box-shadow:0 0 10px rgba(255,46,147,.8); transition:width .8s cubic-bezier(.2,.8,.2,1); }

/* ---- column ---- */
.amae-column { position:relative; z-index:10; max-width:44rem; margin:0 auto;
  padding:16vh 22px 26vh; }
/* the entry animation is fill-mode:both, so it can only live on the beat that is
   currently lit — otherwise it pins every past beat back to full opacity. */
.amae-beat { opacity:.5; transition:opacity .7s; }
.amae-beat.is-live { opacity:1; animation:amae-in .5s ease both; }
.amae-narration { font-size:clamp(16px,2.4vw,18px); line-height:1.95; margin:0 0 1.5em;
  color:var(--amae-paper); }
.amae-her { font-size:clamp(16px,2.4vw,18px); line-height:1.95; margin:0 0 1.5em;
  color:var(--amae-her); font-style:italic; }
.amae-her-mark { display:inline-block; margin-right:.9em; font-style:normal; font-size:10px;
  letter-spacing:.2em; color:var(--amae-seal); vertical-align:.18em; }
.amae-memory { font-size:clamp(15px,2.3vw,17px); line-height:2.05; margin:0 0 1.5em;
  }
.amae-memory { color:#8f8a82; padding-left:20px; border-left:1px solid rgba(110,106,99,.35); }
.amae-memory-mark { display:block; font-family:ui-monospace,monospace; font-size:9px;
  letter-spacing:.28em; text-transform:uppercase; color:#5a5650; margin-bottom:.6em; }
.amae-system { font-family:ui-monospace,monospace; font-size:11px; letter-spacing:.26em;
  text-transform:uppercase; color:#6b6357; margin:0 0 1.6em; line-height:2.2; }
.amae-pause { text-align:center; color:#3d372f; margin:0 0 1.6em; letter-spacing:1em; }

/* ---- untranslated ---- */
.amae-foreign { border-left:2px solid rgba(142,163,174,.32); padding:2px 0 2px 20px;
  margin:0 0 1.7em; }
.amae-foreign.is-object { border-left-color:rgba(110,106,99,.4); }
.amae-foreign.is-withheld { border-left-color:rgba(255,46,147,.5); }
/* his own reading — no pink anywhere. he thinks this one is his. */
.amae-foreign.is-read { border-left-color:rgba(201,196,187,.45); }
.amae-trans-mark.is-you { color:#8f8a82; }
.amae-translation p.amae-you { color:#c9c4bb; font-style:normal; }
.amae-trans-mark.is-none { color:#6e6a63; font-style:italic; letter-spacing:.2em; }
.amae-hud-ritual { color:#79899a; letter-spacing:.18em;
  font-family:"Hiragino Kaku Gothic ProN","Yu Gothic","Noto Sans JP",Meiryo,sans-serif; }
.amae-hud-ritual b { color:#c9c4bb; font-weight:400; }
.amae-rituals { margin-bottom:22px; padding-bottom:14px;
  border-bottom:1px solid rgba(110,106,99,.24); }
.amae-rituals-head { font-family:ui-monospace,monospace; font-size:9px; letter-spacing:.26em;
  text-transform:uppercase; color:#ff2e93; margin-bottom:12px; }
.amae-ritual { display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; padding:6px 0; }
.amae-ritual-label { color:#8f8a82; font-style:italic; font-size:14px; }
.amae-ritual-timing { margin-left:auto; font-family:ui-monospace,monospace; font-size:10px;
  letter-spacing:.14em; color:#ff4da6; }
.amae-hud-mood { color:#ff4da6; letter-spacing:.18em;
  font-family:"Hiragino Kaku Gothic ProN","Yu Gothic","Noto Sans JP",Meiryo,sans-serif; }
.amae-who { font-family:ui-monospace,monospace; font-size:10px; letter-spacing:.24em;
  text-transform:uppercase; color:#5f574a; margin-bottom:.7em; }
.amae-jp { font-size:clamp(19px,3vw,23px); line-height:1.8; color:var(--amae-cold);
  letter-spacing:.04em; }
.amae-jp.small { font-size:17px; }
.amae-romaji { font-family:ui-monospace,monospace; font-size:11px; letter-spacing:.14em;
  color:#4f5a61; margin-top:.5em; }
.amae-translation { margin-top:1.1em; }
.amae-trans-mark { display:block; font-size:9px; letter-spacing:.24em; text-transform:uppercase;
  color:var(--amae-seal); margin-bottom:.5em; }
.amae-translation p { margin:0; font-style:italic; color:var(--amae-her);
  font-size:clamp(15px,2.3vw,17px); line-height:1.9; }

/* ---- choices ---- */
.amae-choices { display:flex; flex-direction:column; gap:12px; margin-top:3em;
  animation:amae-in .6s ease both; }
.amae-choice { text-align:left; background:rgba(201,196,187,.02); cursor:pointer;
  border:1px solid rgba(110,106,99,.28); padding:16px 20px; color:var(--amae-paper);
  font-family:Georgia,serif; font-size:16px; line-height:1.6; transition:.3s; }
.amae-choice:hover { border-color:rgba(255,46,147,.75); background:rgba(255,46,147,.09);
  transform:translateX(3px); }
.amae-choice-hint { display:block; margin-top:.5em; font-family:ui-monospace,monospace;
  font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:#5f574a; }

/* ---- end ---- */
.amae-end { margin-top:3em; text-align:center; animation:amae-in .8s ease both; }
.amae-end h2 { font-size:clamp(20px,4vw,28px); letter-spacing:.3em; text-indent:.3em;
  font-weight:400; color:var(--amae-paper); margin:0 0 1.2em; }
.amae-end p { color:var(--amae-dim); font-style:italic; line-height:1.9; margin:0 0 .9em; }
.amae-end-dep { margin:2.4em 0 1em; font-family:ui-monospace,monospace; font-size:11px;
  letter-spacing:.24em; text-transform:uppercase; color:var(--amae-dim); }
.amae-end-dep b { color:var(--amae-her); font-weight:400; }
.amae-end-links { display:flex; flex-direction:column; gap:14px; align-items:center;
  margin-top:2.4em; }
.amae-next { padding:14px 30px; border:1px solid rgba(255,46,147,.5); color:var(--amae-paper);
  text-decoration:none; font-family:ui-monospace,monospace; font-size:11px; letter-spacing:.28em;
  text-transform:uppercase; transition:.3s; }
.amae-next:hover { background:rgba(255,46,147,.16); border-color:var(--amae-seal); }
.amae-back { color:#4d463c; text-decoration:none; font-family:ui-monospace,monospace;
  font-size:10px; letter-spacing:.24em; text-transform:uppercase; }
.amae-back:hover { color:var(--amae-dim); }

.amae-cue { position:fixed; bottom:26px; left:50%; transform:translateX(-50%); z-index:20;
  color:var(--amae-seal); font-size:11px; animation:amae-bob 1.8s ease-in-out infinite;
  pointer-events:none; }

/* ---- phrasebook ---- */
.amae-book-btn { position:fixed; right:18px; bottom:18px; z-index:40; cursor:pointer;
  background:rgba(11,10,9,.9); border:1px solid rgba(110,106,99,.3); color:var(--amae-dim);
  padding:9px 14px; font-size:11px; letter-spacing:.2em; transition:.3s; }
.amae-book-btn b { color:var(--amae-paper); font-weight:400; margin-left:6px; }
.amae-book-btn:hover { border-color:rgba(255,46,147,.7); color:var(--amae-paper); }
.amae-book-btn.is-ping { border-color:var(--amae-seal); color:var(--amae-her);
  animation:amae-ping 1.4s ease-in-out infinite; }
.amae-book { position:fixed; inset:0; z-index:60; background:rgba(6,5,5,.9);
  display:flex; align-items:center; justify-content:center; padding:20px; cursor:default;
  animation:amae-in .3s ease both; }
.amae-book-inner { width:min(38rem,100%); max-height:80vh; overflow:auto; padding:24px;
  background:#0e0c0b; border:1px solid rgba(110,106,99,.3); }
.amae-book-head { display:flex; justify-content:space-between; align-items:center;
  font-size:12px; letter-spacing:.22em; color:var(--amae-dim); margin-bottom:22px; }
.amae-book-head button { background:none; border:none; color:var(--amae-dim); cursor:pointer;
  font-size:14px; }
.amae-book-empty { color:#4d463c; font-style:italic; }
.amae-entry { padding:16px 0; border-top:1px solid rgba(110,106,99,.16); }
.amae-entry-her { margin-top:.8em; font-style:italic; color:var(--amae-her); font-size:15px; }
.amae-entry.is-wrong .amae-entry-her { color:#5f574a; text-decoration:line-through; }
.amae-entry-truth { margin-top:.7em; color:#ffe3f2; font-size:15px; font-style:italic; }
.amae-entry-truth span { display:block; font-family:ui-monospace,monospace; font-size:9px;
  letter-spacing:.24em; text-transform:uppercase; color:var(--amae-seal); font-style:normal;
  margin-bottom:.4em; }

/* ---- toasts ---- */
.amae-toasts { position:fixed; right:18px; top:52px; z-index:45; display:flex;
  flex-direction:column; gap:8px; align-items:flex-end; pointer-events:none; }
.amae-toast { font-family:ui-monospace,monospace; font-size:10px; letter-spacing:.2em;
  text-transform:uppercase; padding:8px 12px; border:1px solid rgba(110,106,99,.3);
  background:rgba(11,10,9,.92); animation:amae-in .35s ease both; }
.amae-toast.is-dep { color:var(--amae-her); border-color:rgba(255,46,147,.45); }
.amae-toast.is-word { color:var(--amae-cold); border-color:rgba(142,163,174,.35); }
.amae-toast.is-warn { color:#ffe3f2; border-color:var(--amae-seal); }

@keyframes amae-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
@keyframes amae-bob { 0%,100%{transform:translate(-50%,0);opacity:.35}
                      50%{transform:translate(-50%,5px);opacity:.9} }
@keyframes amae-ping { 0%,100%{box-shadow:0 0 0 rgba(255,46,147,0)}
                       50%{box-shadow:0 0 18px rgba(255,46,147,.5)} }
@media (max-width:640px){ .amae-column{padding:16vh 18px 24vh} .amae-hud{font-size:9px}
  .amae-hud-place{padding-left:96px} .amae-book-btn{bottom:14px; right:14px; padding:7px 11px} }
`,
      }}
    />
  );
}

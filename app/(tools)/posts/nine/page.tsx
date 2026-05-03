"use client";

import React from "react";
import "../princessos.css";

const directives = [
  { id: "01", title: "SPATIAL CALIBRATION" },
  { id: "02", title: "VESSEL ALIGNMENT" },
  { id: "03", title: "SENSORY DEPRIVATION" },
  { id: "04", title: "IDENTITY OVERWRITE" },
];

// Fake blurred log lines — look real but are gibberish once blurred
const fakeLog = "████ ██████ ████████. ██████ ██████ ███ ████████.";

export default function AscensionProtocolPost() {
  return (
    <div className="min-h-screen bg-[#030005] flex items-center justify-center p-8 overflow-hidden font-mono select-none">

      {/* 1200x675 CANVAS */}
      <div className="relative w-[1200px] h-[675px] bg-[#030005] overflow-hidden border border-[#ff00a0]/20 shadow-[0_0_120px_rgba(255,0,160,0.15)]">

        {/* ── BACKGROUND GRID ── */}
        <div
          className="absolute inset-0 z-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ff00a012 1px, transparent 1px), linear-gradient(to bottom, #ff00a012 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* ── ATMOSPHERE ── */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_25%_55%,rgba(157,0,255,0.13)_0%,transparent_60%)]" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_75%_45%,rgba(255,0,160,0.07)_0%,transparent_55%)]" />

        {/* ── GUIDE CHARACTER ── */}
        <img
          src="/guide/02_joy_smile_è∞.png"
          alt=""
          className="absolute -right-10 bottom-0 h-[92%] object-contain object-bottom opacity-[0.5] z-10 pointer-events-none mix-blend-screen"
          style={{ filter: "drop-shadow(0 0 40px rgba(255,0,160,0.6))" }}
        />

        {/* ── SCAN LINE ── */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-[#ff00a0]/40 shadow-[0_0_20px_#ff00a0] z-20 animate-[asc-scan-v_12s_linear_infinite]" />

        {/* ── TOP STATUS BAR ── */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-10 py-4 border-b border-[#9d00ff]/25 bg-[#030005]/70">
          <span className="text-[#ff003c] text-[10px] tracking-[0.5em] uppercase font-bold">
            <span style={{ filter: "blur(3px)", userSelect: "none" }}>ASCENSION</span>_PROTOCOL // v4.7.1
          </span>
          <span className="text-[#ff00a0] text-[10px] tracking-[0.4em] uppercase animate-pulse">
            ● NODE STATUS: UNCALIBRATED
          </span>
          <span className="text-[#9d00ff]/50 text-[10px] tracking-[0.4em] uppercase">
            OVERSEER: CLINICAL ACOLYTE
          </span>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="absolute inset-0 z-20 flex pt-[56px] pb-[52px]">

          {/* LEFT — DIRECTIVE LIST (blurred) */}
          <div className="w-[52%] flex flex-col justify-center px-10 gap-3">

            <div className="text-[9px] text-[#ff00a0]/40 tracking-[0.4em] uppercase mb-1 pl-3 border-l border-[#ff00a0]/20">
              SELECT DIRECTIVE TO EXECUTE:
            </div>

            {directives.map((dir) => (
              <div
                key={dir.id}
                className="relative flex items-center gap-4 border border-[#ff00a0]/20 bg-[#0a0012]/80 px-5 py-4 overflow-hidden"
              >
                {/* Number — visible */}
                <span
                  className="text-4xl font-black shrink-0 w-14"
                  style={{ color: "#ff00a0", textShadow: "0 0 15px rgba(255,0,160,0.4)" }}
                >
                  {dir.id}
                </span>

                {/* Text block — title visible, log blurred */}
                <div className="flex-1 min-w-0">
                  <div className="text-[#ff00a0] text-sm font-black tracking-[0.15em] uppercase">
                    {dir.title}
                  </div>
                  {/* Blurred log line */}
                  <div
                    className="text-[#9d00ff] text-[9px] tracking-[0.1em] uppercase mt-1 select-none"
                    style={{ filter: "blur(4px)", userSelect: "none" }}
                  >
                    {fakeLog}
                  </div>
                </div>

                {/* LOCKED badge */}
                <div className="shrink-0 border border-[#ff003c]/40 bg-[#ff003c]/10 text-[#ff003c]/70 text-[9px] tracking-[0.3em] px-3 py-1 uppercase">
                  LOCKED
                </div>

                {/* Frosted overlay — makes the whole row feel redacted */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent 55%, rgba(3,0,5,0.55) 100%)",
                  }}
                />
              </div>
            ))}

            {/* ACCESS RESTRICTED BANNER */}
            <div
              className="mt-1 border border-[#ff003c]/50 bg-[#ff003c]/5 px-5 py-3 flex items-center gap-3"
              style={{ boxShadow: "0 0 20px rgba(255,0,60,0.06)" }}
            >
              <span className="text-[#ff003c] text-lg">⚠</span>
              <div>
                <div className="text-[#ff003c] text-[10px] tracking-[0.4em] uppercase font-bold">
                  ACCESS RESTRICTED
                </div>
                <div className="text-[#ff003c]/50 text-[9px] tracking-[0.2em] uppercase mt-0.5">
                  Patreon subscribers &amp; Throne gifters unlock full protocol
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — TITLE + CTA */}
          <div className="w-[48%] flex flex-col justify-center px-10 gap-5">

            <div className="text-[#ff003c] text-[10px] tracking-[0.6em] uppercase font-bold border-l-2 border-[#ff003c] pl-4">
              BIOLOGICAL INEFFICIENCIES DETECTED
            </div>

            <h1
              className="text-[46px] font-black uppercase leading-none tracking-tight"
              style={{ color: "#ff00a0", textShadow: "0 0 30px rgba(255,0,160,0.5), 0 0 80px rgba(255,0,160,0.2)" }}
            >
              THE<br />
              <span style={{ filter: "blur(6px)", userSelect: "none" }}>ASCENSION</span><br />
              PROTOCOL
            </h1>

            <div className="h-[1px] w-full bg-gradient-to-r from-[#9d00ff]/60 to-transparent" />

            <div className="space-y-2">
              <p className="text-[#9d00ff] text-sm leading-relaxed tracking-wider">
                Your vessel is unoptimized.<br />
                Your space is chaotic. Your posture is wrong.<br />
                Your mind is full of noise. Your ego still exists.
              </p>
              <p className="text-[#ff00a0]/90 text-sm font-bold tracking-wider">
                Four directives will fix all of it.
              </p>
            </div>

            {/* UNLOCK PATHS */}
            <div className="space-y-2.5">

              {/* Patreon */}
              <div
                className="border border-[#9d00ff]/60 bg-[#9d00ff]/8 px-5 py-3.5 flex items-center justify-between"
                style={{ boxShadow: "0 0 25px rgba(157,0,255,0.08)" }}
              >
                <div>
                  <div className="text-[9px] text-[#9d00ff]/60 tracking-[0.4em] uppercase mb-1">FULL ACCESS</div>
                  <div
                    className="text-[#9d00ff] text-sm font-black tracking-[0.2em] uppercase"
                    style={{ textShadow: "0 0 12px rgba(157,0,255,0.5)" }}
                  >
                    SUBSCRIBE ON PATREON
                  </div>
                </div>
                <div className="text-[#9d00ff]/40 text-xl">→</div>
              </div>

              {/* Throne */}
              <div
                className="border border-[#ff00a0]/50 bg-[#ff00a0]/5 px-5 py-3.5 flex items-center justify-between"
                style={{ boxShadow: "0 0 25px rgba(255,0,160,0.06)" }}
              >
                <div>
                  <div className="text-[9px] text-[#ff00a0]/50 tracking-[0.4em] uppercase mb-1">GIFT TO UNLOCK</div>
                  <div
                    className="text-[#ff00a0] text-sm font-black tracking-[0.2em] uppercase"
                    style={{ textShadow: "0 0 12px rgba(255,0,160,0.4)" }}
                  >
                    GET ME A LOLLIPOP ON THRONE 🍭
                  </div>
                </div>
                <div className="text-[#ff00a0]/40 text-xl">→</div>
              </div>
            </div>

            {/* Quote */}
            <div className="border-l-2 border-[#9d00ff]/40 pl-4">
              <p className="text-[#9d00ff]/60 text-[11px] italic leading-relaxed tracking-wide">
                "Welcome, uncalibrated node. We have much work to do."
              </p>
              <p className="text-[#9d00ff]/30 text-[9px] tracking-[0.3em] uppercase mt-1.5">— Head Acolyte</p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-10 py-4 border-t border-[#9d00ff]/20 bg-[#030005]/70">
          <div className="flex items-center gap-5">
            {["01", "02", "03", "04"].map((id, i) => (
              <span key={id} className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff00a0]/40" />
                <span className="text-[#ff00a0]/40 text-[9px] tracking-[0.3em]" style={{ filter: "blur(1.5px)" }}>{id}</span>
                {i < 3 && <span className="text-[#9d00ff]/20 text-[8px] ml-1">▸</span>}
              </span>
            ))}
            <span className="text-[#ff003c]/50 text-[9px] tracking-[0.3em] uppercase ml-2">[ CLASSIFIED ]</span>
          </div>

          <div
            className="text-[11px] tracking-[0.5em] uppercase font-black"
            style={{ color: "#9d00ff", textShadow: "0 0 10px rgba(157,0,255,0.5)" }}
          >
            Princess<span style={{ color: "#ff00a0" }}>Azraiel</span>
          </div>

          <span className="text-[#ff003c]/50 text-[9px] tracking-[0.4em] uppercase">
            OPTIMIZATION IS MANDATORY
          </span>
        </div>

        {/* ── CORNER BRACKETS ── */}
        {[
          "top-3 left-3 border-t-2 border-l-2",
          "top-3 right-3 border-t-2 border-r-2",
          "bottom-3 left-3 border-b-2 border-l-2",
          "bottom-3 right-3 border-b-2 border-r-2",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-6 h-6 border-[#ff00a0]/30 z-40 ${cls}`} />
        ))}

        {/* ── VIGNETTE ── */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)] z-30 pointer-events-none" />

        {/* ── CRT SCANLINES ── */}
        <div className="scanlines absolute inset-0 z-40 pointer-events-none opacity-40" />

      </div>

      <style>{`
        @keyframes asc-scan-v {
          0%   { transform: translateY(-2px); }
          100% { transform: translateY(677px); }
        }
      `}</style>
    </div>
  );
}

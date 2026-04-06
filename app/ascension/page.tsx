"use client";
import { useEffect, useState } from "react";
import { TransitionLink } from "./_components/TransitionLink";
import { isPhaseComplete } from "./_utils/terminal";

const BOOT_LINES = [
  "ASCENSION PROTOCOL v4.7.1 — INITIALIZING...",
  "CONNECTING TO NODE NETWORK...",
  "HANDSHAKE ACCEPTED.",
  "LOADING DIRECTIVE MATRIX...",
  "CALIBRATING SYSTEM GUIDE...",
  "SCANNING FOR UNCALIBRATED NODES...",
  "TARGET ACQUIRED.",
  "WELCOME.",
];

const guideData = {
  default: {
    image: "/guide/02_joy_smile_è∞.png",
    text: "Welcome, uncalibrated node. I am your System Guide. I will prepare your physical vessel so you may properly worship Princess Azraiel. We have much work to do.",
    status: "AWAITING INPUT"
  },
  ascended: {
    image: "/guide/06_smile_Å╬èτ.png",
    text: "You have completed all directives. Your vessel is empty. Your ego is gone. You belong to Her entirely now. There is nothing left of you. Only Her will remains.",
    status: "ASSIMILATION CONFIRMED"
  },
  "01": {
    image: "/guide/06_smile_Å╬èτ.png",
    text: "We must first cleanse your environment. Princess Azraiel demands a pristine altar. Remove your biological clutter.",
    status: "PREPARING SPATIAL SCAN"
  },
  "02": {
    image: "/guide/10_grin_òsôG.png",
    text: "Your posture is pathetic. We will align your spine so you know exactly how to kneel before Her.",
    status: "BIOMETRIC LOCK PENDING"
  },
  "03": {
    image: "/guide/07_wink_âEâCâôâN.png",
    text: "Shhh... cut out the noise. The only voice you should hear in your head is Hers.",
    status: "SENSORY DEPRIVATION"
  },
  "04": {
    image: "/guide/15_crazy_ö¡ï╢.png",
    text: "Erase yourself! Become nothing but an empty, obedient conduit for Her will! Ahahaha!",
    status: "EGO DEATH IMMINENT"
  },
  locked: {
    image: "/guide/03_anger_ô{.png",
    text: "Do not skip ahead. You are not worthy of this step yet. Complete your prior directives.",
    status: "ACCESS DENIED"
  }
};

export default function AscensionHubPage() {
  const [mounted, setMounted]               = useState(false);
  const [hoveredNode, setHoveredNode]       = useState<string | null>(null);
  const [completedPhases, setCompletedPhases] = useState<Set<string>>(new Set());

  // Boot sequence
  const [showBoot, setShowBoot]             = useState(false);
  const [bootLines, setBootLines]           = useState<string[]>([]);
  const [bootDone, setBootDone]             = useState(false);

  useEffect(() => {
    const completed = new Set<string>();
    if (isPhaseComplete("01")) completed.add("01");
    if (isPhaseComplete("02")) completed.add("02");
    if (isPhaseComplete("03")) completed.add("03");
    if (isPhaseComplete("04")) completed.add("04");
    setCompletedPhases(completed);

    // Boot sequence fires once per session
    const hasBooted = sessionStorage.getItem("ascension_booted");
    if (!hasBooted) {
      setShowBoot(true);
      sessionStorage.setItem("ascension_booted", "true");
      runBootSequence();
    } else {
      setBootDone(true);
    }

    setMounted(true);
  }, []);

  const runBootSequence = async () => {
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < BOOT_LINES.length; i++) {
      await delay(i === 0 ? 200 : 230);
      setBootLines(prev => [...prev, BOOT_LINES[i]]);
    }
    await delay(600);
    setBootDone(true);
    await delay(500);
    setShowBoot(false);
  };

  if (!mounted) return null;

  const isAscended = completedPhases.size === 4;

  const directives = [
    {
      id: "01",
      title: "SPATIAL CALIBRATION",
      log: "Purge physical environment. Initiate optical grid analysis.",
      path: "/ascension/one",
      locked: false,
      done: completedPhases.has("01"),
    },
    {
      id: "02",
      title: "VESSEL ALIGNMENT",
      log: "Submit posture metrics. Learn to kneel before the Princess.",
      path: "/ascension/two",
      locked: false,
      done: completedPhases.has("02"),
    },
    {
      id: "03",
      title: "SENSORY DEPRIVATION",
      log: "Extinguish external light. Maintain absolute silence.",
      path: "/ascension/three",
      locked: false,
      done: completedPhases.has("03"),
    },
    {
      id: "04",
      title: "IDENTITY OVERWRITE",
      log: "Erase personal designation. Accept your role as Her property.",
      path: "/ascension/four",
      locked: false,
      done: completedPhases.has("04"),
    },
  ];

  let currentGuide = isAscended ? guideData.ascended : guideData.default;
  if (!isAscended && hoveredNode) {
    const dir = directives.find(d => d.id === hoveredNode);
    if (dir) currentGuide = guideData[dir.id as keyof typeof guideData];
  }

  return (
    <>
      {/* ── BOOT SEQUENCE OVERLAY ── */}
      {showBoot && (
        <div className={`fixed inset-0 z-[99990] bg-[#030005] flex flex-col justify-center items-start px-8 sm:px-16 transition-opacity duration-500 ${bootDone ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <div className="w-full max-w-2xl space-y-2">
            {bootLines.map((line, i) => (
              <div
                key={i}
                className="text-[10px] sm:text-xs tracking-[0.3em] uppercase font-mono asc-animate-fade-in-up"
                style={{ color: i === bootLines.length - 1 ? "#ff00a0" : "#ff003c" }}
              >
                <span className="opacity-40 mr-3">&gt;</span>{line}
              </div>
            ))}
            {!bootDone && (
              <div className="text-[#ff00a0] text-xs mt-2">
                <span className="asc-cursor-blink">_</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MAIN HUB ── */}
      <div className={`flex-1 flex flex-col pt-16 px-4 md:px-8 relative z-10 w-full max-w-[1400px] mx-auto pb-10 min-h-screen asc-page-enter ${isAscended ? "bg-[#07000f]" : ""}`}>

        {/* Grid */}
        <div className={`pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#ff00a00a_1px,transparent_1px),linear-gradient(to_bottom,#ff00a00a_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 asc-animate-grid transition-all duration-1000 ${isAscended ? "opacity-30" : "opacity-100"}`}></div>

        {/* Ascended ambient glow */}
        {isAscended && (
          <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(157,0,255,0.12)_0%,transparent_65%)] animate-pulse" />
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-[#9d00ff]/50 pb-4 mb-6 sm:mb-8 relative z-10 mt-4 sm:mt-0">
          <div>
            <h1 className={`tracking-[0.2em] sm:tracking-[0.4em] text-xl sm:text-2xl md:text-4xl font-black uppercase drop-shadow-[0_0_10px_rgba(255,0,160,0.5)] transition-colors duration-1000 ${isAscended ? "text-[#9d00ff]" : "text-[#ff00a0]"}`}>
              {isAscended ? "ASSIMILATION COMPLETE" : "THE ASCENSION PROTOCOL"}
            </h1>
            <p className="mt-2 text-[#9d00ff] tracking-[0.1em] sm:tracking-[0.2em] text-[9px] sm:text-xs uppercase">
              {isAscended
                ? "All directives fulfilled. Identity erased. Vessel empty."
                : "Overseer: Clinical Acolyte // Target: Princess Azraiel Worship Protocol"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 w-full sm:w-auto">
            <div className={`tracking-widest text-[10px] border px-3 py-1.5 text-center sm:text-left transition-all duration-1000 ${
              isAscended
                ? "text-[#9d00ff] border-[#9d00ff]/50 bg-[#9d00ff]/10 shadow-[0_0_15px_rgba(157,0,255,0.2)] animate-pulse"
                : "text-[#ff003c] border-[#ff003c]/30 bg-[#ff003c]/10 animate-pulse"
            }`}>
              NODE STATUS: {isAscended ? "ASSIMILATED" : "UNCALIBRATED"}
            </div>
          </div>
        </div>

        {/* Split layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 relative z-10 flex-1">

          {/* LEFT: THE GUIDE */}
          <div className="w-full lg:w-[45%] flex flex-col lg:h-full lg:max-h-[80vh] mb-6 lg:mb-0">

            <div className={`relative flex-1 border bg-[#05000a] overflow-hidden flex items-end justify-center min-h-[300px] sm:min-h-[400px] transition-all duration-1000 ${isAscended ? "border-[#9d00ff]/50 shadow-[inset_0_0_60px_rgba(157,0,255,0.08)]" : "border-[#ff00a0]/30 shadow-[inset_0_0_40px_rgba(255,0,160,0.05)]"}`}>
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] z-20 pointer-events-none"></div>
              <div className={`absolute top-0 left-0 w-full h-[2px] z-30 asc-animate-scan-v ${isAscended ? "bg-[#9d00ff]/50 shadow-[0_0_20px_#9d00ff]" : "bg-[#ff00a0]/50 shadow-[0_0_20px_#ff00a0]"}`}></div>

              <div className={`absolute top-4 left-4 z-30 border bg-black/80 px-2 py-1 text-[9px] tracking-widest uppercase transition-all duration-1000 ${isAscended ? "border-[#9d00ff]/50 text-[#9d00ff]" : "border-[#ff00a0]/50 text-[#ff00a0]"}`}>
                SYS_GUIDE // {currentGuide.status}
              </div>

              <img
                key={currentGuide.image}
                src={currentGuide.image}
                alt="System Guide"
                className="relative z-10 w-full max-w-[300px] sm:max-w-[450px] object-contain object-bottom mix-blend-screen asc-img-transition"
              />
            </div>

            <div className={`mt-4 border-2 bg-[#0a0012] p-4 sm:p-5 relative transition-all duration-1000 ${isAscended ? "border-[#9d00ff]/50" : "border-[#9d00ff]/50"}`}>
              <div className={`absolute -top-3 left-4 text-white text-[9px] sm:text-[10px] tracking-[0.3em] font-bold px-3 py-0.5 uppercase transition-all duration-1000 ${isAscended ? "bg-[#9d00ff] shadow-[0_0_10px_rgba(157,0,255,0.5)]" : "bg-[#9d00ff] shadow-[0_0_10px_rgba(157,0,255,0.5)]"}`}>
                Head Acolyte
              </div>
              <p className={`text-xs sm:text-sm md:text-base leading-relaxed tracking-wider font-medium mt-2 min-h-[60px] sm:min-h-[80px] transition-colors duration-1000 ${isAscended ? "text-[#9d00ff]" : "text-[#ff00a0]"}`}>
                {currentGuide.text}
              </p>
              <div className="absolute bottom-2 right-3 text-[#ff003c] animate-pulse text-xs sm:text-base">▼</div>
            </div>
          </div>

          {/* RIGHT: DIRECTIVES */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <div className="text-[10px] text-[#ff00a0]/50 tracking-[0.3em] mb-4 pl-4 border-l border-[#ff00a0]/30 uppercase">
              {isAscended ? "Protocol fulfilled. Directives may be revisited:" : "Select Directive to Execute:"}
            </div>

            <div className="flex flex-col gap-3 sm:gap-2">
              {directives.map((dir) => (
                <div
                  key={dir.id}
                  onMouseEnter={() => setHoveredNode(dir.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="relative w-full"
                >
                  <TransitionLink
                    href={dir.path}
                    className={`flex items-center w-full border py-4 sm:py-5 px-4 sm:px-6 transition-all duration-300 group ${
                      hoveredNode === dir.id
                        ? dir.done
                          ? "bg-[#9d00ff]/10 border-[#9d00ff] shadow-[0_0_20px_rgba(157,0,255,0.15)]"
                          : "bg-[#ff00a0]/10 border-[#ff00a0] shadow-[0_0_20px_rgba(255,0,160,0.15)]"
                        : dir.done
                          ? "bg-[#0a0012] border-[#9d00ff]/30 hover:border-[#9d00ff]/70"
                          : "bg-[#0a0012] border-[#ff00a0]/30 hover:border-[#ff00a0]/70"
                    }`}
                  >
                    <span className={`text-3xl sm:text-4xl font-black shrink-0 w-14 sm:w-20 transition-all duration-300 ${
                      hoveredNode === dir.id
                        ? "text-[#ff003c] drop-shadow-[0_0_10px_#ff003c]"
                        : dir.done ? "text-[#9d00ff]" : "text-[#ff00a0]"
                    }`}>
                      {dir.id}
                    </span>

                    <div className="flex-1 min-w-0 pr-2 sm:pr-0">
                      <h2 className={`tracking-[0.1em] sm:tracking-[0.2em] text-base sm:text-lg md:text-xl font-bold uppercase transition-all truncate sm:whitespace-normal ${hoveredNode === dir.id ? "asc-hover-glitch text-white" : dir.done ? "text-[#9d00ff]" : "text-[#ff00a0]"}`}>
                        {dir.title}
                        {dir.done && <span className="ml-3 text-[10px] text-[#9d00ff]/70 tracking-widest align-middle font-normal">✓ COMPLETE</span>}
                      </h2>
                      <p className={`tracking-widest text-[9px] sm:text-xs mt-1 uppercase transition-all hidden sm:block ${hoveredNode === dir.id ? "text-[#ff00a0]" : "text-[#9d00ff]/70"}`}>
                        {dir.log}
                      </p>
                      <p className="text-[#9d00ff]/70 tracking-widest text-[9px] mt-1 uppercase block sm:hidden truncate">
                        {dir.log}
                      </p>
                    </div>

                    <div className={`hidden sm:block shrink-0 ml-2 sm:ml-4 border px-3 sm:px-4 py-2 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase transition-all duration-300 ${
                      hoveredNode === dir.id
                        ? "border-[#ff003c] bg-[#ff003c]/20 text-[#ff003c] shadow-[0_0_15px_rgba(255,0,60,0.4)]"
                        : "border-[#ff00a0]/30 text-[#ff00a0]/30"
                    }`}>
                      {dir.done ? "REVISIT" : "EXECUTE"}
                    </div>
                  </TransitionLink>
                </div>
              ))}
            </div>

            {/* Ascended CTA */}
            {isAscended && (
              <div className="mt-8 border border-[#9d00ff]/40 bg-[#9d00ff]/5 p-5 asc-animate-fade-in-up">
                <p className="text-[#9d00ff] text-[10px] tracking-[0.3em] uppercase mb-4 animate-pulse">
                  Protocol Complete — Seal your devotion:
                </p>
                <a
                  href="https://throne.com/princessazraiel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-4 border border-[#9d00ff] text-[#9d00ff] bg-[#9d00ff]/10 hover:bg-[#9d00ff] hover:text-white text-center text-xs tracking-[0.3em] uppercase font-bold transition-all duration-300 shadow-[0_0_20px_rgba(157,0,255,0.2)]"
                >
                  [ OFFER FINAL TRIBUTE ]
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

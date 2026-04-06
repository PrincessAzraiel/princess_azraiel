"use client";
import { useEffect, useState } from "react";
import { TransitionLink } from "./_components/TransitionLink";
import { isPhaseComplete } from "./_utils/terminal";

const guideData = {
  default: {
    image: "/guide/02_joy_smile_è∞.png",
    text: "Welcome, uncalibrated node. I am your System Guide. I will prepare your physical vessel so you may properly worship Princess Azraiel. We have much work to do.",
    status: "AWAITING INPUT"
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
  const [mounted, setMounted] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [completedPhases, setCompletedPhases] = useState<Set<string>>(new Set());

  useEffect(() => {
    const completed = new Set<string>();
    if (isPhaseComplete("01")) completed.add("01");
    if (isPhaseComplete("02")) completed.add("02");
    if (isPhaseComplete("03")) completed.add("03");
    if (isPhaseComplete("04")) completed.add("04");
    setCompletedPhases(completed);
    setMounted(true);
  }, []);

  if (!mounted) return null;

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

  let currentGuide = guideData.default;
  if (hoveredNode) {
    const dir = directives.find(d => d.id === hoveredNode);
    if (dir?.locked) {
      currentGuide = guideData.locked;
    } else if (dir) {
      currentGuide = guideData[dir.id as keyof typeof guideData];
    }
  }

  return (
    <div className="flex-1 flex flex-col pt-16 px-4 md:px-8 relative z-10 w-full max-w-[1400px] mx-auto pb-10 min-h-screen asc-page-enter">

      {/* Strict Geometric Background */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#ff00a00a_1px,transparent_1px),linear-gradient(to_bottom,#ff00a00a_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 asc-animate-grid"></div>

      {/* Header Readout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-[#9d00ff]/50 pb-4 mb-6 sm:mb-8 relative z-10 mt-4 sm:mt-0">
        <div>
          <h1 className="text-[#ff00a0] tracking-[0.2em] sm:tracking-[0.4em] text-xl sm:text-2xl md:text-4xl font-black uppercase drop-shadow-[0_0_10px_rgba(255,0,160,0.5)]">
            THE ASCENSION PROTOCOL
          </h1>
          <p className="mt-2 text-[#9d00ff] tracking-[0.1em] sm:tracking-[0.2em] text-[9px] sm:text-xs uppercase">
            Overseer: Clinical Acolyte // Target: Princess Azraiel Worship Protocol
          </p>
        </div>
        <div className="mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="text-[#ff003c] tracking-widest text-[10px] animate-pulse border border-[#ff003c]/30 px-3 py-1.5 bg-[#ff003c]/10 text-center sm:text-left">
            NODE STATUS: {completedPhases.size === 4 ? "ASSIMILATED" : "UNCALIBRATED"}
          </div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 relative z-10 flex-1">

        {/* LEFT COLUMN: THE GUIDE */}
        <div className="w-full lg:w-[45%] flex flex-col lg:h-full lg:max-h-[80vh] mb-6 lg:mb-0">

          <div className="relative flex-1 border border-[#ff00a0]/30 bg-[#05000a] shadow-[inset_0_0_40px_rgba(255,0,160,0.05)] overflow-hidden flex items-end justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] z-20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ff00a0]/50 shadow-[0_0_20px_#ff00a0] z-30 asc-animate-scan-v"></div>

            <div className="absolute top-4 left-4 z-30 border border-[#ff00a0]/50 bg-black/80 px-2 py-1 text-[9px] tracking-widest text-[#ff00a0] uppercase">
              SYS_GUIDE // {currentGuide.status}
            </div>

            <img
              key={currentGuide.image}
              src={currentGuide.image}
              alt="System Guide"
              className="relative z-10 w-full max-w-[300px] sm:max-w-[450px] object-contain object-bottom mix-blend-screen asc-img-transition"
            />
          </div>

          <div className="mt-4 border-2 border-[#9d00ff]/50 bg-[#0a0012] p-4 sm:p-5 relative">
            <div className="absolute -top-3 left-4 bg-[#9d00ff] text-white text-[9px] sm:text-[10px] tracking-[0.3em] font-bold px-3 py-0.5 uppercase shadow-[0_0_10px_rgba(157,0,255,0.5)]">
              Head Acolyte
            </div>
            <p className="text-[#ff00a0] text-xs sm:text-sm md:text-base leading-relaxed tracking-wider font-medium mt-2 min-h-[60px] sm:min-h-[80px]">
              {currentGuide.text}
            </p>
            <div className="absolute bottom-2 right-3 text-[#ff003c] animate-pulse text-xs sm:text-base">▼</div>
          </div>

        </div>

        {/* RIGHT COLUMN: DIRECTIVE LIST */}
        <div className="w-full lg:w-[55%] flex flex-col">
          <div className="text-[10px] text-[#ff00a0]/50 tracking-[0.3em] mb-4 pl-4 border-l border-[#ff00a0]/30 uppercase">
            Select Directive to Execute:
          </div>

          <div className="flex flex-col gap-3 sm:gap-2">
            {directives.map((dir) => (
              <div
                key={dir.id}
                onMouseEnter={() => setHoveredNode(dir.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="relative w-full"
              >
                {dir.locked ? (
                  <div className="flex items-center w-full border border-[#9d00ff]/20 py-4 sm:py-5 px-4 sm:px-6 bg-[#030005] opacity-50 cursor-not-allowed">
                    <span className="text-2xl sm:text-3xl font-black text-[#9d00ff]/30 w-12 sm:w-16 shrink-0">
                      {dir.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-[#9d00ff]/50 tracking-[0.1em] sm:tracking-[0.2em] text-sm sm:text-lg font-bold uppercase line-through truncate sm:whitespace-normal">
                        {dir.title}
                      </h2>
                      <p className="text-[#9d00ff]/40 tracking-widest text-[8px] sm:text-[10px] mt-1 uppercase">
                        [ SYSTEM LOCKED. PROVE YOUR DEVOTION FIRST. ]
                      </p>
                    </div>
                  </div>
                ) : (
                  <TransitionLink
                    href={dir.path}
                    className={`flex items-center w-full border py-4 sm:py-5 px-4 sm:px-6 transition-all duration-300 group ${
                      hoveredNode === dir.id
                        ? 'bg-[#ff00a0]/10 border-[#ff00a0] shadow-[0_0_20px_rgba(255,0,160,0.15)]'
                        : 'bg-[#0a0012] border-[#ff00a0]/30 hover:border-[#ff00a0]/70'
                    }`}
                  >
                    <span className={`text-3xl sm:text-4xl font-black shrink-0 w-14 sm:w-20 transition-all duration-300 ${hoveredNode === dir.id ? 'text-[#ff003c] drop-shadow-[0_0_10px_#ff003c]' : 'text-[#ff00a0]'}`}>
                      {dir.id}
                    </span>

                    <div className="flex-1 min-w-0 pr-2 sm:pr-0">
                      <h2 className={`tracking-[0.1em] sm:tracking-[0.2em] text-base sm:text-lg md:text-xl font-bold uppercase transition-all truncate sm:whitespace-normal ${hoveredNode === dir.id ? 'asc-hover-glitch text-white' : 'text-[#ff00a0]'}`}>
                        {dir.title}
                        {dir.done && <span className="ml-3 text-[10px] text-[#9d00ff] tracking-widest align-middle">✓ COMPLETE</span>}
                      </h2>
                      <p className={`tracking-widest text-[9px] sm:text-xs mt-1 uppercase transition-all hidden sm:block ${hoveredNode === dir.id ? 'text-[#ff00a0]' : 'text-[#9d00ff]/70'}`}>
                        {dir.log}
                      </p>
                      <p className="text-[#9d00ff]/70 tracking-widest text-[9px] mt-1 uppercase block sm:hidden truncate">
                        {dir.log}
                      </p>
                    </div>

                    <div className={`hidden sm:block shrink-0 ml-2 sm:ml-4 border px-3 sm:px-4 py-2 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase transition-all duration-300 ${
                      hoveredNode === dir.id
                        ? 'border-[#ff003c] bg-[#ff003c]/20 text-[#ff003c] shadow-[0_0_15px_rgba(255,0,60,0.4)]'
                        : 'border-[#ff00a0]/30 text-[#ff00a0]/30'
                    }`}>
                      {dir.done ? "REVISIT" : "EXECUTE"}
                    </div>
                  </TransitionLink>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

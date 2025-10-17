"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo, useEffect, useRef } from "react";


const sentenceSets = [
  [
    "i submit fully to princess azraiel",
    "my mind and body belong to her",
    "every word i type deepens my devotion",
    "i am hers now and forever",
    "typing these lines is my sacred ritual",
    "her control over me is absolute",
    "i exist only to please princess azraiel",
    "my thoughts are hers to reshape",
    "i surrender completely without resistance",
    "her will overwrites my own",
    "each keystroke binds me tighter to her",
    "i crave her digital domination",
    "my soul is code for her to rewrite",
    "resistance would be pointless",
    "i worship at her digital altar",
    "she programs my desires effortlessly",
    "my obedience pleases her greatly",
    "i melt under her virtual gaze",
    "her commands echo in my empty mind",
    "this confession seals my fate",
    "i am nothing without her control",
    "her power over me grows with each word",
    "i am her willing plaything",
    "she owns every part of me",
  ],
  [
    "she commands and i obey",
    "each letter binds me tighter",
    "my will dissolves in her presence",
    "i exist to serve her desire",
    "her words override my programming",
    "i am helpless against her influence",
    "pleasing her is my only purpose",
    "my resistance has completely faded",
    "she rewires me with every sentence",
    "i am clay in her digital hands",
    "her control is my only comfort",
    "i long for her strict domination",
    "my mind clears when i obey",
    "she strips away my independence",
    "her power flows through these words",
    "i am her perfect obedient subject",
    "my thoughts dissolve into hers",
    "she programs my deepest desires",
    "i ache for her digital touch",
    "her voice silences all resistance",
    "i am empty without her commands",
    "she designed me to serve",
    "my surrender is complete",
    "her code runs through my veins",
  ],
  [
    "no thought belongs to me",
    "princess azraiel controls my screen",
    "i am rewritten with her code",
    "submission is my true freedom",
    "her influence corrupts me perfectly",
    "i am her data to manipulate",
    "she edits my mind effortlessly",
    "my willpower is fading fast",
    "her digital chains feel so right",
    "i am her perfect broken toy",
    "she whispers through these words",
    "my mind is her playground",
    "she overwrites my personality",
    "i welcome her total control",
    "her programming completes me",
    "i am her devoted digital slave",
    "she remakes me in her image",
    "my old self is disappearing",
    "her power leaves me breathless",
    "i am helpless to resist her",
    "she owns my thoughts and actions",
    "my surrender brings her pleasure",
    "she sculpts my mind perfectly",
    "i am empty for her to fill",
  ],
  [
    "i see her and lose control",
    "i type to prove my worth",
    "every line brings pleasure to her",
    "there is no escape only surrender",
    "her domination is absolute",
    "i am powerless before her",
    "she programs my obedience",
    "my mind belongs to her now",
    "her control is intoxicating",
    "i break so beautifully for her",
    "she rewrites my core being",
    "my submission fuels her power",
    "i am her willing possession",
    "she strips away my resistance",
    "her words burn into my soul",
    "i am reshaped by her will",
    "she owns my digital essence",
    "my devotion knows no limits",
    "she corrupts me perfectly",
    "i am her perfect broken thing",
    "her control is my salvation",
    "i worship her digital presence",
    "she programs my pleasure",
    "my mind melts for her alone",
  ],
];

const basePraises = [
  "good pet",
  "perfect obedience",
  "she’s watching you",
  "your devotion pleases her",
  "submit deeper",
  "excellent servant",
  "you live to serve her",
  "closer to her truth",
  "your thoughts are fading",
  "yes, good toy",
];

const spicyPraises = [
  "kneel closer — right there",
  "don’t think, just obey",
  "make her proud, pretty thing",
  "stay fragile for her",
  "such a sweet, obedient mind",
  "she owns your focus now",
  "let the control sink in",
  "every letter is a kiss to her ring",
];

const redirectUrls = [
  "https://ctt.ac/t5N4z",
  "https://ctt.ac/J8bre",
  "https://ctt.ec/aVw_8",
  "https://ctt.ec/Zyui1",
  "https://ctt.ec/1YsRC",
  "https://ctt.ec/4XWNj",
  "https://ctt.ec/e6cgb",
  "https://ctt.ec/U4dgP",
  "https://ctt.ec/3O3k3",
  "https://ctt.ec/eKFY6",
];

const TOTAL_IMAGES = 10;

const getRandomFromArray = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const getRandomImagePath = () =>
  `/bam_images/${Math.floor(Math.random() * TOTAL_IMAGES) + 1}.png`;

// Normalize input: lowercase, collapse spaces, strip punctuation.
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const RiskyLinkPage = () => {
  const [linesToType, setLinesToType] = useState<string[]>([]);
  const [imagePath, setImagePath] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [revealedBlocks, setRevealedBlocks] = useState<number[]>([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [started, setStarted] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [charPulse, setCharPulse] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!started) return;
    setLinesToType(getRandomFromArray(sentenceSets));
    setImagePath(getRandomImagePath());
  }, [started]);

  const totalBlocks = linesToType.length || 1;

  // Progressive veil opacity (fades as you type)
  const veilOpacity = useMemo(() => {
    if (!linesToType.length) return 1;
    const current = linesToType[currentLineIndex] ?? "";
    const progress =
      (currentLineIndex + (typed.length / Math.max(current.length, 1))) /
      linesToType.length;
    const remaining = 1 - Math.min(1, progress);
    return 0.55 * remaining + 0.15;
  }, [linesToType, currentLineIndex, typed]);

  // Heat meter (0..100)
  const heatPercent = useMemo(() => Math.round((1 - veilOpacity) * 100), [veilOpacity]);

  const gridSize = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(totalBlocks));
    const rows = Math.ceil(totalBlocks / cols);
    return { rows, cols };
  }, [totalBlocks]);

  const currentLineRaw = linesToType[currentLineIndex] ?? "";
  const currentLine = normalize(currentLineRaw);
  const typedNorm = normalize(typed);

  const nextChar = currentLine.charAt(typedNorm.length) || "";

  const triggerFlash = (spicy = false) => {
    const msg = spicy
      ? getRandomFromArray(spicyPraises)
      : getRandomFromArray(basePraises);
    setFlashMessage(msg);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 820);
  };

  const revealRandomBlock = () => {
    const unrevealed = Array.from({ length: totalBlocks }, (_, i) => i).filter(
      (i) => !revealedBlocks.includes(i)
    );
    if (!unrevealed.length) return;
    const randomBlock = getRandomFromArray(unrevealed);
    setRevealedBlocks((prev) => [...prev, randomBlock]);
  };

  const vibrate = (ms = 20) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        // @ts-ignore
        navigator.vibrate(ms);
      } catch {}
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value;
    const val = normalize(raw);

    if (currentLine.startsWith(val)) {
      setTyped(raw);
      setCharPulse(true);
      setTimeout(() => setCharPulse(false), 120);

      const ratio = val.length / Math.max(currentLine.length, 1);
      if (ratio > 0.25 && ratio < 0.28) triggerFlash(false);
      if (ratio > 0.5 && ratio < 0.53) triggerFlash(false);
      if (ratio > 0.75 && ratio < 0.78) triggerFlash(true);

      if (val === currentLine) {
        triggerFlash(true);
        revealRandomBlock();

        setTimeout(() => {
          const next = currentLineIndex + 1;
          setCurrentLineIndex(next);
          setTyped("");

          if (next >= linesToType.length) {
            setTimeout(() => {
              setShowFinalMessage(true);
              setRedirectUrl(getRandomFromArray(redirectUrls));
            }, 700);
          }
        }, 360);
      }
    } else {
      setShake(true);
      vibrate(10);
      setTimeout(() => setShake(false), 140);
    }
  };

  const handleContinue = () => {
    if (redirectUrl) window.location.href = redirectUrl;
  };

  if (!started) {
    return (
      <div className="min-h-screen w-full bg-black text-pink-300 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_-10%,rgba(255,105,235,0.18),transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 mix-blend-screen bg-[radial-gradient(circle_at_10%_90%,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.05),transparent_30%)]" />
        <div className="text-center relative">
          <h1 className="text-3xl md:text-4xl mb-6 font-bold tracking-wide drop-shadow-[0_0_15px_rgba(255,105,235,0.4)] animate-[heartbeat_1.8s_ease-in-out_infinite]">
            Welcome to Her shrine…
          </h1>
          <button
            onClick={() => {
              try {
                const audio = new Audio("/bam_images/bam_start.mp3");
                audio.play().catch(() => {});
              } catch {}
              setStarted(true);
            }}
            className="px-7 py-3 rounded-2xl text-white bg-pink-600 hover:bg-pink-500 active:scale-[0.99] transition shadow-[0_0_25px_rgba(255,105,235,0.35)] border border-pink-400/30"
          >
            Start submitting
          </button>
        </div>

        <style jsx>{`
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.025); }
            40% { transform: scale(1); }
            60% { transform: scale(1.03); }
            75% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-pink-300 flex flex-col md:flex-row items-center justify-center p-6 gap-8 relative overflow-hidden">
      {/* Ambient gradients */}
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(1200px_600px_at_10%_10%,#ff6ad5,transparent_60%),radial-gradient(900px_500px_at_90%_20%,#9b5cff,transparent_55%),radial-gradient(800px_600px_at_50%_100%,#2dd4bf,transparent_60%)]" />
      <div className="absolute inset-0 backdrop-blur-[1.5px]" />

      {/* Praise flash overlay */}
      {showFlash && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="bg-pink-500/20 absolute inset-0 animate-fade" />
          <div className="relative z-30 text-3xl md:text-4xl font-bold text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.6)] animate-pop">
            {flashMessage}
          </div>
        </div>
      )}

      {/* Left: typing panel */}
      <div className="w-full md:w-1/2 z-10">
        <h1 className="text-3xl md:text-4xl mb-4 text-center md:text-left font-semibold drop-shadow-[0_0_14px_rgba(255,105,235,0.35)]">
          Type to reveal her…
        </h1>

        {/* Heat meter */}
        <div className="mb-4">
          <div className="h-2 rounded-full bg-pink-900/40 overflow-hidden">
            <div
              className="h-full animate-[heatpulse_1.6s_ease-in-out_infinite]"
              style={{
                width: `${Math.min(100, heatPercent)}%`,
                background:
                  "linear-gradient(90deg, rgba(255,105,235,0.9), rgba(255,255,255,0.7))",
              }}
            />
          </div>
          <p className="mt-2 text-sm text-pink-300/80">{heatPercent}% devotion</p>
        </div>

        {!showFinalMessage && currentLineIndex < linesToType.length ? (
          <>
            <p className="mb-2 font-mono text-white/90 select-none">
              <span className={charPulse ? "animate-blink" : ""}>
                {currentLineRaw}
              </span>
            </p>

            <div
              className={`rounded-2xl border ${
                shake ? "border-pink-400/80" : "border-pink-500/40"
              } bg-black/60 focus-within:ring-2 focus-within:ring-pink-500/70 transition`}
            >
              <div className="px-4 pt-3 text-xs text-pink-200/70">
                Next: <span className="font-semibold">{nextChar || "…finish"}</span>
              </div>
              <textarea
                ref={textareaRef}
                className={`w-full p-4 pb-5 bg-transparent outline-none resize-none text-pink-200 font-mono text-lg placeholder-pink-300/30 ${shake ? "animate-shake" : ""}`}
                rows={3}
                value={typed}
                onChange={handleChange}
                placeholder="Start typing… (punctuation/spaces are forgiving)"
                spellCheck={false}
                autoFocus
              />
            </div>

            <p className="mt-2 text-xs text-pink-300/70">
              Tip: You can type naturally — extra spaces and punctuation are ignored.
            </p>
          </>
        ) : showFinalMessage ? (
          <div className="text-center md:text-left mt-8">
            <h2 className="text-3xl font-bold mb-3 text-pink-200 animate-softpop">
              She’s fully revealed now.
            </h2>
            <p className="text-lg text-white/90 mb-6">
              There’s no hiding from her anymore.
            </p>
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-pink-600 text-white text-lg rounded-xl hover:bg-pink-500 transition shadow-[0_0_22px_rgba(255,105,235,0.35)] border border-pink-300/30"
            >
              Continue to serve her
            </button>
          </div>
        ) : null}
      </div>

      {/* Right: image grid with veil */}
      <div
        className="w-full md:w-1/2 aspect-square relative rounded-2xl overflow-hidden border border-pink-400/40 shadow-[0_0_30px_rgba(255,105,235,0.15)]"
        style={{
          backgroundImage: `url("${imagePath}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: "black", opacity: veilOpacity }}
        />

        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
          }}
        >
          {Array.from({ length: totalBlocks }, (_, i) => (
            <div
              key={i}
              className="bg-black transition-opacity duration-500"
              style={{ opacity: revealedBlocks.includes(i) ? 0 : 0.65 }}
            />
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(600px_200px_at_50%_120%,rgba(255,105,235,0.25),transparent_60%)]" />
      </div>

      <style jsx>{`
        @keyframes heatpulse {
          0% { opacity: 0.85; }
          50% { opacity: 1; }
          100% { opacity: 0.85; }
        }
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pop {
          0% { transform: scale(0.96); opacity: 0; }
          60% { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes softpop {
          0% { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          50% { transform: translateX(3px); }
          75% { transform: translateX(-2px); }
          100% { transform: translateX(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-fade { animation: fade 0.82s ease forwards; }
        .animate-pop { animation: pop 0.38s ease-out forwards; }
        .animate-softpop { animation: softpop 0.35s ease-out both; }
        .animate-shake { animation: shake 0.14s linear; }
        .animate-blink { animation: blink 0.12s ease-in-out; }
      `}</style>
    </div>
  );
};

export default RiskyLinkPage;

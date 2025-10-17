"use client";
import { useState, useMemo, useEffect } from "react";


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
    "she owns every part of me"
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
    "her code runs through my veins"
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
    "i am empty for her to fill"
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
    "my mind melts for her alone"
  ]
];

const basePraises = [
  "good pet",
  "perfect obedience",
  "shes watching you",
  "your devotion pleases her",
  "submit deeper",
  "excellent servant",
  "you live to serve her",
  "closer to her truth",
  "your thoughts are fading",
  "yes good toy"
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
  "https://ctt.ec/eKFY6"

];

const TOTAL_IMAGES = 10;

const getRandomFromArray = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const getRandomImagePath = () =>
  `/bam_images/${Math.floor(Math.random() * TOTAL_IMAGES) + 1}.png`;

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

  useEffect(() => {
    if (!started) return;
    setLinesToType(getRandomFromArray(sentenceSets));
    setImagePath(getRandomImagePath());
  }, [started]);


  const totalBlocks = linesToType.length;

  const gridSize = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(totalBlocks));
    const rows = Math.ceil(totalBlocks / cols);
    return { rows, cols };
  }, [totalBlocks]);

  const currentLine = linesToType[currentLineIndex] ?? "";

  const triggerFlash = () => {
    const msg = getRandomFromArray(basePraises);
    setFlashMessage(msg);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.toLowerCase();
    if (currentLine.startsWith(val)) {
      setTyped(val);
      if (val === currentLine) {
        triggerFlash();

        const unrevealed = Array.from({ length: totalBlocks }, (_, i) => i).filter(
          (i) => !revealedBlocks.includes(i)
        );
        const randomBlock = getRandomFromArray(unrevealed);
        setRevealedBlocks((prev) => [...prev, randomBlock]);

        setTimeout(() => {
          const next = currentLineIndex + 1;
          setCurrentLineIndex(next);
          setTyped("");

          if (next >= linesToType.length) {
            setTimeout(() => {
              setShowFinalMessage(true);
              setRedirectUrl(getRandomFromArray(redirectUrls));
            }, 1000);
          }
        }, 400);
      }
    }
  };

  const handleContinue = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  if (!started) {
    return (

      <>
        <div className="min-h-screen w-full bg-black text-pink-400 flex items-center justify-center p-6">
          <div className="text-center">
        <h1 className="text-3xl md:text-4xl mb-6">Welcome to Her shrine…</h1>
        <button
          onClick={() => {
            const audio = new Audio("/bam_images/bam_start.mp3");
            audio.play();
            setStarted(true);
          }}
          className="px-6 py-3 bg-pink-600 text-white text-lg rounded-xl hover:bg-pink-700 transition"
        >
          Start submitting
        </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-pink-400 flex flex-col md:flex-row items-center justify-center p-6 gap-8 relative overflow-hidden">
      {showFlash && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-pink-500 bg-opacity-40 absolute inset-0"></div>
          <div className="relative z-30 text-4xl font-bold text-white animate-pulse">
            {flashMessage}
          </div>
        </div>
      )}

      <div className="w-full md:w-1/2 z-10">
        <h1 className="text-3xl md:text-4xl mb-4 text-center md:text-left">
          Type to reveal her…
        </h1>

        {!showFinalMessage && currentLineIndex < linesToType.length ? (
          <>
            <p className="mb-3 text-lg font-mono text-white select-none">
              {currentLine}
            </p>
            <textarea
              className="w-full p-4 rounded-xl bg-black bg-opacity-70 border border-pink-500 text-pink-300 font-mono text-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows={3}
              value={typed}
              onChange={handleChange}
              placeholder="Start typing..."
              spellCheck={false}
              autoFocus
            />
          </>
        ) : showFinalMessage ? (
          <div className="text-center md:text-left mt-8">
            <h2 className="text-3xl font-bold mb-4 text-pink-300">She’s fully revealed now.</h2>
            <p className="text-lg text-white mb-6">There’s no hiding from her anymore.</p>
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-pink-600 text-white text-lg rounded-xl hover:bg-pink-700 transition"
            >
              Continue to serve her
            </button>
          </div>
        ) : null}
      </div>

      <div
        className="w-full md:w-1/2 aspect-square relative rounded-xl overflow-hidden border border-pink-500"
        style={{
          backgroundImage: `url("${imagePath}")`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`
          }}
        >
          {Array.from({ length: totalBlocks }, (_, i) => (
            <div
              key={i}
              className="bg-black transition-opacity duration-500"
              style={{ opacity: revealedBlocks.includes(i) ? 0 : 1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskyLinkPage;
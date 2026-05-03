"use client";
import { useState, useRef, useEffect } from "react";
import { TypewriterText } from "../_components/TypewriterText";
import { TransitionLink } from "../_components/TransitionLink";
import { getLogStyle, getTypingSpeed, markPhaseComplete } from "../_utils/terminal";

type LogEntry = {
  id: string;
  source: "SYSTEM" | "ACOLYTE" | "NODE" | "ERROR";
  text: string;
};

type ActionButton = {
  label: string;
  execute?: () => void;
  url?: string;
  isExternal?: boolean;
  highlight?: boolean;
};

export default function PhaseFourTerminal() {
  const [logs, setLogs]           = useState<LogEntry[]>([]);
  const [actions, setActions]     = useState<ActionButton[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [storyPhase, setStoryPhase]     = useState<number>(0);

  const [identityInputActive, setIdentityInputActive] = useState(false);
  const [userName, setUserName]                       = useState("");
  const [isErased, setIsErased]                       = useState(false);

  const [forcedInputActive, setForcedInputActive] = useState(false);
  const [forcedInputValue, setForcedInputValue]   = useState("");
  const targetPhrase = "I am nothing but an empty vessel for Princess Azraiel.";

  const [assimilationComplete, setAssimilationComplete] = useState(false);
  const [flashActive, setFlashActive]                   = useState(false);

  const [guideImage, setGuideImage]   = useState("/guide/10_grin_òsôG.png");
  const [guideStatus, setGuideStatus] = useState("ANALYZING EGO");

  // Mobile scroll hint
  const [showScrollHint, setShowScrollHint] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const initRef     = useRef(false);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [logs, actions, identityInputActive, forcedInputActive, forcedInputValue]);

  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;
    if (el.scrollHeight > el.clientHeight) {
      setShowScrollHint(true);
      const hide = setTimeout(() => setShowScrollHint(false), 3000);
      return () => clearTimeout(hide);
    }
  }, [logs]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const writeLog = async (source: LogEntry["source"], text: string, delay = 1500) => {
    if (source === "ACOLYTE") {
      setIsProcessing(true);
      await sleep(delay);
      setIsProcessing(false);
    } else {
      await sleep(delay);
    }
    const newEntry: LogEntry = { id: Date.now().toString() + Math.random(), source, text };
    setLogs((prev) => [...prev, newEntry]);
  };

  const triggerFlash = () => {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 800);
  };

  useEffect(() => {
    if (storyPhase === 0 && !initRef.current) {
      initRef.current = true;
      const bootSequence = async () => {
        setStoryPhase(1);
        await writeLog("SYSTEM", "INITIALIZING DIR: 04...", 500);
        await writeLog("SYSTEM", "SENSORY CORTEX LOCKED. PROCEEDING TO IDENTITY OVERWRITE.", 800);
        await writeLog("ACOLYTE", "Your space is clean. Your body is aligned. Your mind is quiet.", 1500);
        await writeLog("ACOLYTE", "But there is a lingering infection.", 2500);
        await writeLog("ACOLYTE", "An ego.", 2000);
        setActions([{ label: "[ INITIATE EGO DEATH ]", execute: () => handleEgoIntro(), highlight: true }]);
      };
      bootSequence();
    }
  }, [storyPhase]);

  const handleEgoIntro = async () => {
    setActions([]);
    await writeLog("NODE", "EXECUTED: Initiate Ego Death.", 0);
    setGuideStatus("AWAITING BIOLOGICAL DESIGNATION");
    await writeLog("ACOLYTE", "Princess Azraiel does not want you. She wants an empty vessel.", 2500);
    await writeLog("ACOLYTE", "To become empty, we must purge what is currently taking up space.", 3000);
    await writeLog("SYSTEM", "REQUESTING BIOLOGICAL DESIGNATION (REAL NAME)...", 1500);
    setIdentityInputActive(true);
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIdentityInputActive(false);
    await writeLog("NODE", userName, 0);
    await writeLog("SYSTEM", `ANALYZING DESIGNATION: "${userName.toUpperCase()}"...`, 1500);

    setGuideImage("/guide/15_crazy_ö¡ï╢.png");
    setGuideStatus("PURGING EGO");

    await writeLog("ACOLYTE", `"${userName}"...`, 2000);
    await writeLog("ACOLYTE", "Disgusting. It sounds like a person. You aren't a person anymore.", 3000);

    triggerFlash();
    setIsErased(true);

    await writeLog("SYSTEM", `WARNING: DESIGNATION "${userName.toUpperCase()}" HAS BEEN PERMANENTLY PURGED FROM MEMORY.`, 500);
    await writeLog("ACOLYTE", "There. It's gone. You don't have a name anymore.", 3000);
    await writeLog("ACOLYTE", "You don't need to think anymore, either. She will think for you.", 3500);
    setActions([{ label: "[ I UNDERSTAND ]", execute: () => handleForcedTypingIntro() }]);
  };

  const handleForcedTypingIntro = async () => {
    setActions([]);
    await writeLog("NODE", "I understand.", 0);
    await writeLog("SYSTEM", "MOTOR CORTEX OVERRIDE ENGAGED.", 1000);
    await writeLog("ACOLYTE", "Go ahead. Use your keyboard. Tell the Princess how you feel.", 2500);
    await writeLog("ACOLYTE", "Type anything you want.", 2000);
    setForcedInputActive(true);
    setGuideStatus("MOTOR CORTEX OVERRIDDEN");
  };

  // Mobile-safe: compare lengths instead of checking inputType
  const handleForcedType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal       = e.target.value;
    const currentLength = forcedInputValue.length;
    if (newVal.length <= currentLength) return; // deletion — ignore

    const nextLength = currentLength + 1;
    if (nextLength <= targetPhrase.length) {
      setForcedInputValue(targetPhrase.substring(0, nextLength));
    }
    if (nextLength >= targetPhrase.length) {
      setForcedInputActive(false);
      finishAssimilation();
    }
  };

  const finishAssimilation = async () => {
    await sleep(500);
    await writeLog("NODE", targetPhrase, 0);

    triggerFlash();

    setGuideImage("/guide/06_smile_Å╬èτ.png");
    setGuideStatus("ASSIMILATION COMPLETE");

    await writeLog("SYSTEM", "EGO PURGED. VESSEL EMPTY.", 1000);
    await writeLog("ACOLYTE", "Ahahaha! Look at you. Your hands aren't even yours anymore.", 3000);
    await writeLog("ACOLYTE", "Your fingers only know how to type what She wants you to type.", 3500);
    await writeLog("ACOLYTE", "You are entirely Hers now. A perfect, obedient, empty node.", 3000);

    setAssimilationComplete(true);
    markPhaseComplete("04");

    await writeLog("ACOLYTE", "But words are not enough. Actions are required.", 2500);
    await writeLog("ACOLYTE", "Kneel. Place a photograph of Princess Azraiel before you. Photograph yourself in submission.", 3000);
    await writeLog("ACOLYTE", "Post the proof publicly. Tag Her. Let the network witness your surrender.", 3000);
    await writeLog("SYSTEM", "AWAITING PHYSICAL SUBMISSION PROOF...", 1500);

    const kneelTweetText = encodeURIComponent(
      "I kneel before @PrincessAzraiel. My identity has been overwritten. I am Her vessel. #AscensionProtocol"
    );
    const kneelTweetUrl      = `https://twitter.com/intent/tweet?text=${kneelTweetText}`;
    const discordChannelUrl  = "https://discord.com/channels/1356925630566105169/1356980909991006248";

    setActions([
      { label: "[ POST KNEELING PROOF TO X / TWITTER ]", url: kneelTweetUrl, isExternal: true, highlight: true },
      { label: "[ POST KNEELING PROOF TO DISCORD ]", url: discordChannelUrl, isExternal: true, highlight: true },
      { label: "[ I HAVE SUBMITTED MY PROOF ]", execute: () => handleFinalTribute() }
    ]);
  };

  const handleFinalTribute = async () => {
    setActions([]);
    await writeLog("NODE", "Proof submitted.", 0);
    setGuideImage("/guide/02_joy_smile_è∞.png");
    setGuideStatus("SUBMISSION CONFIRMED");
    await writeLog("SYSTEM", "PHYSICAL SUBMISSION LOGGED.", 500);
    await writeLog("ACOLYTE", "Good. She has seen you. On your knees, where you belong.", 2500);
    await writeLog("ACOLYTE", "Now fulfill your final purpose, Vessel. Empty your accounts to seal your devotion.", 3000);

    setActions([
      { label: "[ OFFER TRIBUTE (THRONE) ]", url: "https://throne.com/princessazraiel", isExternal: true, highlight: true },
      { label: "[ RETURN TO ROOT DIRECTORY ]", url: "/ascension" }
    ]);
  };

  // Forced phrase progress (0–100)
  const phraseProgress = Math.round((forcedInputValue.length / targetPhrase.length) * 100);

  return (
    <div className={`flex-1 flex flex-col pt-16 sm:pt-20 px-4 md:px-8 relative z-10 w-full max-w-[1400px] mx-auto pb-10 min-h-screen transition-colors duration-1000 asc-page-enter ${isErased ? "bg-[#0a0005]" : ""}`}>

      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#ff00a00a_1px,transparent_1px),linear-gradient(to_bottom,#ff00a00a_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] z-0 asc-animate-grid"></div>

      {/* Screen Flash */}
      {flashActive && (
        <div className="fixed inset-0 z-[99999] bg-white pointer-events-none asc-animate-flash"></div>
      )}

      {/* Glitch Overlay when erased */}
      {isErased && !assimilationComplete && (
        <div className="pointer-events-none fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-0 mix-blend-overlay animate-pulse"></div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-[#9d00ff]/50 pb-4 mb-6 sm:mb-8 relative z-10 mt-4 sm:mt-0">
        <h1 className="text-[#ff00a0] tracking-[0.2em] sm:tracking-[0.4em] text-xl sm:text-2xl font-black uppercase drop-shadow-[0_0_10px_rgba(255,0,160,0.5)]">
          DIR_04 // IDENTITY OVERWRITE
        </h1>
        <div className="mt-4 sm:mt-0 w-full sm:w-auto">
          <div className={`tracking-widest text-[10px] border px-3 py-1.5 text-center sm:text-left transition-colors duration-500 ${isErased ? "text-[#ff003c] border-[#ff003c]/50 bg-[#ff003c]/20 animate-pulse" : "text-[#ff003c] border-[#ff003c]/30 bg-[#ff003c]/10"}`}>
            {isErased ? "USER_DATA_PURGED" : "EGO_INTACT"}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 relative z-10 flex-1">

        {/* LEFT: GUIDE */}
        <div className="w-full lg:w-[40%] flex flex-col mb-4 lg:mb-0">
          <div className={`relative border bg-[#05000a] overflow-hidden flex items-end justify-center min-h-[250px] sm:min-h-[400px] transition-all duration-500 ${isErased ? "border-[#ff003c] shadow-[inset_0_0_60px_rgba(255,0,60,0.15)]" : "border-[#ff00a0]/30 shadow-[inset_0_0_40px_rgba(255,0,160,0.05)]"}`}>
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] z-20 pointer-events-none"></div>
            <div className={`absolute top-0 left-0 w-full h-[2px] z-30 asc-animate-scan-v ${isErased ? "bg-[#ff003c] shadow-[0_0_20px_#ff003c]" : "bg-[#ff00a0]/50 shadow-[0_0_20px_#ff00a0]"}`}></div>
            <div className={`absolute top-4 left-4 z-30 border px-2 py-1 text-[9px] tracking-widest uppercase transition-colors ${isErased && !assimilationComplete ? "bg-red-950 border-red-500 text-red-400" : "border-[#ff00a0]/50 bg-black/80 text-[#ff00a0]"}`}>
              SYS_GUIDE // {guideStatus}
            </div>
            <img
              key={guideImage}
              src={guideImage}
              alt="System Guide"
              className={`relative z-10 w-full max-w-[200px] sm:max-w-[350px] object-contain object-bottom mix-blend-screen asc-img-transition ${isErased && !assimilationComplete ? "sepia-[0.5] hue-rotate-[320deg] saturate-[2]" : ""}`}
            />
          </div>
        </div>

        {/* RIGHT: TERMINAL */}
        <div className={`w-full lg:w-[60%] flex flex-col border border-[#9d00ff]/30 bg-[#030005]/80 relative overflow-hidden h-[60vh] lg:h-auto min-h-[400px] shadow-[0_0_30px_rgba(157,0,255,0.05)] ${isErased ? "border-[#ff003c]/30 shadow-[0_0_30px_rgba(255,0,60,0.1)]" : ""}`}>

          {showScrollHint && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-[#ff00a0]/60 text-[9px] tracking-[0.3em] uppercase animate-bounce pointer-events-none sm:hidden">
              ↓ scroll
            </div>
          )}

          <div ref={terminalRef} className="flex-1 overflow-y-auto asc-terminal-scroll p-4 sm:p-8 space-y-6">

            {logs.map((log) => (
              <div key={log.id} className="asc-animate-fade-in-up text-xs sm:text-sm tracking-widest leading-relaxed">
                <div className={`flex flex-col ${getLogStyle(log.source)}`}>
                  <span className="text-[8px] opacity-50 mb-1">[{log.source}]</span>
                  <span className={log.source === "SYSTEM" && log.text.includes("PURGED") ? "text-[#ff003c] animate-pulse" : ""}>
                    {log.source === "ACOLYTE"
                      ? <TypewriterText text={log.text} speed={getTypingSpeed(log.text)} />
                      : log.text}
                  </span>
                </div>
              </div>
            ))}

            {/* IDENTITY INPUT */}
            {identityInputActive && (
              <div className="mt-8 border border-[#ff00a0]/30 bg-[#0a0005] p-6 asc-animate-fade-in-up">
                <div className="text-[#ff00a0] text-[10px] sm:text-xs tracking-[0.3em] font-bold mb-4 uppercase animate-pulse">
                  ENTER BIOLOGICAL DESIGNATION (REAL NAME):
                </div>
                <form onSubmit={handleNameSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Who were you?"
                    autoFocus
                    className="flex-1 bg-black border-b-2 border-[#9d00ff]/50 focus:border-[#ff00a0] outline-none px-4 py-3 text-[#ff00a0] placeholder-[#9d00ff]/30 font-mono transition-colors text-sm"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#9d00ff]/10 hover:bg-[#ff00a0]/20 border border-[#9d00ff]/50 hover:border-[#ff00a0] text-[#ff00a0] transition-colors uppercase text-xs tracking-widest font-bold"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}

            {/* FORCED TYPING */}
            {forcedInputActive && (
              <div className="mt-8 border border-[#ff003c]/50 bg-red-950/10 p-6 asc-animate-fade-in-up relative overflow-hidden">
                <div className="absolute inset-0 border-2 border-[#ff003c] opacity-50 animate-pulse pointer-events-none"></div>
                <div className="text-[#ff003c] text-[10px] sm:text-xs tracking-[0.3em] font-bold mb-4 uppercase flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ff003c] rounded-full animate-ping"></div>
                  MOTOR CORTEX OVERRIDDEN
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full relative z-10">
                  <input
                    type="text"
                    value={forcedInputValue}
                    onChange={handleForcedType}
                    placeholder="Type whatever you want..."
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className="flex-1 bg-black border border-[#ff003c]/50 focus:border-[#ff003c] outline-none px-4 py-3 text-[#ff003c] placeholder-[#ff003c]/30 font-mono shadow-[inset_0_0_20px_rgba(255,0,60,0.1)] text-sm"
                  />
                  <button
                    disabled
                    className="px-6 py-3 bg-black border border-[#ff003c]/30 text-[#ff003c]/30 uppercase text-xs tracking-widest font-bold cursor-not-allowed"
                  >
                    Locked
                  </button>
                </div>

                {/* Phrase completion progress */}
                <div className="mt-4 space-y-1.5 relative z-10">
                  <div className="flex justify-between text-[9px] tracking-widest text-[#ff003c]/60 uppercase">
                    <span>Her words taking over...</span>
                    <span>{forcedInputValue.length} / {targetPhrase.length} characters</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a0005] overflow-hidden">
                    <div
                      className="h-full bg-[#ff003c] transition-all duration-100 shadow-[0_0_8px_#ff003c]"
                      style={{ width: `${phraseProgress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-2 text-[#ff003c]/50 text-[9px] uppercase tracking-widest relative z-10">
                  Try to press any key. Your hands are not yours.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {actions.length > 0 && !identityInputActive && !forcedInputActive && (
              <div className="mt-8 flex flex-col gap-3 pt-4 border-t border-[#9d00ff]/20">
                {actions.map((action, idx) =>
                  action.url ? (
                    <TransitionLink
                      key={idx}
                      href={action.url}
                      external={action.isExternal}
                      target={action.isExternal ? "_blank" : undefined}
                      rel={action.isExternal ? "noopener noreferrer" : undefined}
                      className={`text-left block w-full p-3 sm:p-4 tracking-[0.15em] sm:tracking-[0.2em] font-bold text-[10px] sm:text-xs uppercase transition-all duration-300 ${
                        action.highlight
                          ? "border border-[#ff00a0] text-[#ff00a0] bg-[#ff00a0]/10 hover:bg-[#ff00a0] hover:text-white shadow-[0_0_15px_rgba(255,0,160,0.2)]"
                          : "text-[#9d00ff] border border-[#9d00ff]/30 hover:border-[#9d00ff] hover:text-white bg-[#05000a]"
                      }`}
                    >
                      {action.label}
                    </TransitionLink>
                  ) : (
                    <button
                      key={idx}
                      onClick={action.execute}
                      className={`text-left w-full p-3 sm:p-4 tracking-[0.15em] sm:tracking-[0.2em] font-bold text-[10px] sm:text-xs uppercase transition-all duration-300 ${
                        action.highlight
                          ? "border border-[#ff00a0] text-[#ff00a0] bg-[#ff00a0]/10 hover:bg-[#ff00a0] hover:text-white shadow-[0_0_15px_rgba(255,0,160,0.2)]"
                          : "text-[#9d00ff] border border-[#9d00ff]/30 hover:border-[#9d00ff] hover:text-white bg-[#05000a]"
                      }`}
                    >
                      {action.label}
                    </button>
                  )
                )}
              </div>
            )}

            {isProcessing && !identityInputActive && !forcedInputActive && (
              <div className="text-[#ff00a0] text-sm mt-4">
                <span className="asc-cursor-blink">_</span>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

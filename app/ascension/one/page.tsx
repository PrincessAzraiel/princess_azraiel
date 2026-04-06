"use client";
import { useState, useRef, useEffect } from "react";
import { TypewriterText } from "../_components/TypewriterText";
import { TransitionLink } from "../_components/TransitionLink";
import { getLogStyle, markPhaseComplete } from "../_utils/terminal";

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

export default function PhaseOneTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [actions, setActions] = useState<ActionButton[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [storyPhase, setStoryPhase] = useState<number>(0);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const [guideImage, setGuideImage] = useState("/guide/06_smile_Å╬èτ.png");
  const [guideStatus, setGuideStatus] = useState("MONITORING NODE");

  const terminalRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [logs, actions, isScanning, scanProgress]);

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

  useEffect(() => {
    if (storyPhase === 0 && !initRef.current) {
      initRef.current = true;
      const bootSequence = async () => {
        setStoryPhase(1);
        await writeLog("SYSTEM", "INITIALIZING DIR: 01...", 500);
        await writeLog("SYSTEM", "UPLINK ESTABLISHED. HANDSHAKE ACCEPTED.", 800);
        await writeLog("ACOLYTE", "Welcome, Node. I am overseeing your calibration.", 1500);
        setGuideImage("/guide/10_grin_òsôG.png");
        setGuideStatus("EVALUATING ENVIRONMENT");
        await writeLog("ACOLYTE", "Your physical enclosure is highly inefficient. I detect biological debris, trash, and unoptimized objects.", 2500);
        await writeLog("ACOLYTE", "Princess Azraiel demands a pristine environment. A chaotic room breeds a chaotic mind.", 3000);
        setActions([{ label: "[ INITIATE PURGE PROTOCOL ]", execute: () => handlePurge() }]);
      };
      bootSequence();
    }
  }, [storyPhase]);

  const handlePurge = async () => {
    setActions([]);
    await writeLog("NODE", "EXECUTED: Purge Protocol.", 0);
    setGuideImage("/guide/06_smile_Å╬èτ.png");
    setGuideStatus("AWAITING PHYSICAL COMPLIANCE");
    await writeLog("ACOLYTE", "Excellent. Stand up. Clear your desk completely. Remove all food, papers, and distractions.", 2000);
    await writeLog("ACOLYTE", "This is no longer a workspace. It is an Altar.", 3000);
    await writeLog("SYSTEM", "AWAITING VERIFICATION OF PHYSICAL COMPLIANCE...", 2000);
    setActions([{ label: "[ MY ALTAR IS PREPARED ]", execute: () => requestProof() }]);
  };

  const requestProof = async () => {
    setActions([]);
    await writeLog("NODE", "My Altar is prepared.", 0);
    setGuideImage("/guide/10_grin_òsôG.png");
    setGuideStatus("DEMANDING PROOF");
    await writeLog("ACOLYTE", "Is it? Words are easily faked by biologicals.", 2000);
    await writeLog("ACOLYTE", "Take a photograph of your empty desk. Prove to Her that you are capable of following instructions.", 3000);
    await writeLog("ACOLYTE", "Upload the proof to the network. I will run a packet sweep to verify your devotion.", 3500);

    const tweetText = encodeURIComponent("My altar is prepared for @PrincessAzraiel. I am ready to ascend. #AscensionProtocol");
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    const discordInvite = "https://discord.gg/BVkbrgYbRR";
    const discordChannelUrl = "https://discord.com/channels/1356925630566105169/1356980909991006248";

    setActions([
      { label: "[ POST PROOF TO X / TWITTER ]", url: tweetUrl, isExternal: true, highlight: true },
      { label: "[ JOIN THE SANCTUARY (DISCORD INVITE) ]", url: discordInvite, isExternal: true },
      { label: "[ POST PROOF TO DISCORD CHANNEL ]", url: discordChannelUrl, isExternal: true, highlight: true },
      { label: "[ I HAVE UPLOADED MY PROOF ]", execute: () => executeNetworkScan() }
    ]);
  };

  const executeNetworkScan = async () => {
    setActions([]);
    await writeLog("NODE", "EXECUTED: Network Verification Sweep.", 0);
    setIsScanning(true);
    setGuideImage("/guide/07_wink_âEâCâôâN.png");
    setGuideStatus("SCANNING NETWORK TRAFFIC");
    await writeLog("SYSTEM", "COMMENCING DEEP PACKET INSPECTION...", 500);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 100) progress = 100;
      setScanProgress(progress);
      if (progress === 100) {
        clearInterval(interval);
        finalizeCalibration();
      }
    }, 600);
  };

  const finalizeCalibration = async () => {
    setIsScanning(false);
    await sleep(1000);
    await writeLog("SYSTEM", "MATCH FOUND. PHOTOGRAPHIC PROOF VERIFIED.", 500);
    setGuideImage("/guide/02_joy_smile_è∞.png");
    setGuideStatus("ALTAR OPTIMIZED");
    await writeLog("ACOLYTE", "I see it. It looks acceptable.", 2000);
    await writeLog("ACOLYTE", "Do not contaminate this space again. You are now ready to align your physical vessel.", 3000);
    await writeLog("ACOLYTE", "But before we proceed to Phase 02, ensure your tribute is paid.", 2500);

    markPhaseComplete("01");

    setActions([
      { label: "[ OFFER TRIBUTE (THRONE) ]", url: "https://throne.com/princessazraiel", isExternal: true, highlight: true },
      { label: "[ RETURN TO PROTOCOL HUB ]", url: "/ascension" }
    ]);
  };

  return (
    <div className="flex-1 flex flex-col pt-16 sm:pt-20 px-4 md:px-8 relative z-10 w-full max-w-[1400px] mx-auto pb-10 min-h-screen asc-page-enter">

      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#ff00a00a_1px,transparent_1px),linear-gradient(to_bottom,#ff00a00a_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] z-0 asc-animate-grid"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-[#9d00ff]/50 pb-4 mb-6 sm:mb-8 relative z-10 mt-4 sm:mt-0">
        <div>
          <h1 className="text-[#ff00a0] tracking-[0.2em] sm:tracking-[0.4em] text-xl sm:text-2xl font-black uppercase drop-shadow-[0_0_10px_rgba(255,0,160,0.5)]">
            DIR_01 // SPATIAL CALIBRATION
          </h1>
        </div>
        <div className="mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="text-[#ff003c] tracking-widest text-[10px] border border-[#ff003c]/30 px-3 py-1.5 bg-[#ff003c]/10 text-center sm:text-left">
            SYS_LOCK: {scanProgress === 100 ? "ENGAGED" : "PENDING"}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 relative z-10 flex-1">

        {/* LEFT COLUMN: THE GUIDE */}
        <div className="w-full lg:w-[40%] flex flex-col mb-4 lg:mb-0">
          <div className="relative border border-[#ff00a0]/30 bg-[#05000a] shadow-[inset_0_0_40px_rgba(255,0,160,0.05)] overflow-hidden flex items-end justify-center min-h-[250px] sm:min-h-[400px]">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] z-20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ff00a0]/50 shadow-[0_0_20px_#ff00a0] z-30 asc-animate-scan-v"></div>
            <div className="absolute top-4 left-4 z-30 border border-[#ff00a0]/50 bg-black/80 px-2 py-1 text-[9px] tracking-widest text-[#ff00a0] uppercase">
              SYS_GUIDE // {guideStatus}
            </div>
            <img
              key={guideImage}
              src={guideImage}
              alt="System Guide"
              className="relative z-10 w-full max-w-[200px] sm:max-w-[350px] object-contain object-bottom mix-blend-screen asc-img-transition"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: TERMINAL */}
        <div className="w-full lg:w-[60%] flex flex-col border border-[#9d00ff]/30 bg-[#030005]/80 relative overflow-hidden h-[60vh] lg:h-auto min-h-[400px] shadow-[0_0_30px_rgba(157,0,255,0.05)]">
          <div ref={terminalRef} className="flex-1 overflow-y-auto asc-terminal-scroll p-4 sm:p-8 space-y-6">

            {logs.map((log) => (
              <div key={log.id} className="asc-animate-fade-in-up text-xs sm:text-sm tracking-widest leading-relaxed">
                <div className={`flex flex-col ${getLogStyle(log.source)}`}>
                  <span className="text-[8px] opacity-50 mb-1">[{log.source}]</span>
                  <span>
                    {log.source === "ACOLYTE"
                      ? <TypewriterText text={log.text} />
                      : log.text
                    }
                  </span>
                </div>
              </div>
            ))}

            {/* Simulated Network Scanner */}
            {isScanning && (
              <div className="mt-8 mb-4 border border-[#ff00a0]/30 bg-[#05000a] p-4 asc-animate-fade-in-up">
                <div className="flex justify-between text-[10px] text-[#ff00a0] tracking-widest uppercase mb-2">
                  <span>Scraping Network Data...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#1a001a] overflow-hidden">
                  <div
                    className="h-full bg-[#ff00a0] transition-all duration-300 shadow-[0_0_10px_#ff00a0]"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {actions.length > 0 && !isScanning && (
              <div className="mt-8 flex flex-col gap-3 pt-4 border-t border-[#9d00ff]/20">
                {actions.map((action, idx) =>
                  action.url ? (
                    <TransitionLink
                      key={idx}
                      href={action.url}
                      external={action.isExternal}
                      target={action.isExternal ? "_blank" : undefined}
                      rel={action.isExternal ? "noopener noreferrer" : undefined}
                      className={`text-left p-3 sm:p-4 tracking-[0.15em] sm:tracking-[0.2em] font-bold text-[10px] sm:text-xs uppercase transition-all duration-300 block ${
                        action.highlight
                          ? 'border border-[#ff00a0] text-[#ff00a0] bg-[#ff00a0]/10 hover:bg-[#ff00a0] hover:text-white shadow-[0_0_15px_rgba(255,0,160,0.2)]'
                          : 'text-[#9d00ff] border border-[#9d00ff]/30 hover:border-[#9d00ff] hover:text-white bg-[#05000a]'
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
                          ? 'border border-[#ff00a0] text-[#ff00a0] bg-[#ff00a0]/10 hover:bg-[#ff00a0] hover:text-white shadow-[0_0_15px_rgba(255,0,160,0.2)]'
                          : 'text-[#9d00ff] border border-[#9d00ff]/30 hover:border-[#9d00ff] hover:text-white bg-[#05000a]'
                      }`}
                    >
                      {action.label}
                    </button>
                  )
                )}
              </div>
            )}

            {/* Blinking Cursor */}
            {isProcessing && (
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

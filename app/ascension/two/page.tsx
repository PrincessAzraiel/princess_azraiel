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

export default function PhaseTwoTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [actions, setActions] = useState<ActionButton[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [storyPhase, setStoryPhase] = useState<number>(0);

  const [cameraActive, setCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [alignmentComplete, setAlignmentComplete] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  const [guideImage, setGuideImage] = useState("/guide/10_grin_òsôG.png");
  const [guideStatus, setGuideStatus] = useState("ANALYZING POSTURE");

  const terminalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [logs, actions, isScanning, scanProgress, cameraActive]);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

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
        await writeLog("SYSTEM", "INITIALIZING DIR: 02...", 500);
        await writeLog("SYSTEM", "SPATIAL GRID INTEGRITY CONFIRMED. PROCEEDING TO HARDWARE.", 800);
        await writeLog("ACOLYTE", "Your Altar is clean. But look at you.", 1500);
        await writeLog("ACOLYTE", "Your physical posture is asymmetric. Your spine curves. You sit like a collapsed biological defect.", 2500);
        await writeLog("ACOLYTE", "A node within The Ascension Protocol must stand with perfect geometric alignment.", 3000);
        setActions([{ label: "[ HOW DO I FIX THIS? ]", execute: () => handlePostureIntro() }]);
      };
      bootSequence();
    }
  }, [storyPhase]);

  const handlePostureIntro = async () => {
    setActions([]);
    await writeLog("NODE", "How do I fix this?", 0);
    setGuideStatus("PREPARING BIOMETRICS");
    await writeLog("ACOLYTE", "Princess Azraiel requires devotion in both mind and body.", 2000);
    await writeLog("ACOLYTE", "Step back from the console. I will project the optimal wireframe. You will match it.", 3000);
    await writeLog("SYSTEM", "REQUESTING OPTICAL SENSOR OVERRIDE...", 1500);
    setActions([{ label: "[ INITIALIZE SKELETAL MAPPING ]", execute: () => activateScanner(), highlight: true }]);
  };

  const activateScanner = async () => {
    setActions([]);
    await writeLog("NODE", "EXECUTED: Initialize Skeletal Mapping.", 0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
      setGuideImage("/guide/05_fun_èy.png");
      setGuideStatus("MAPPING JOINTS");
      await writeLog("SYSTEM", "BIOMETRIC SENSORS ONLINE. WIREFRAME PROJECTED.", 1000);
      await writeLog("ACOLYTE", "There. Move exactly 5 feet back. Align your joints with the magenta markers.", 2500);
      await writeLog("ACOLYTE", "Hold the pose until calibration finishes. Prove you know how to kneel.", 3000);
      setActions([{ label: "[ BEGIN CALIBRATION ]", execute: () => executeAlignment(), highlight: true }]);
    } catch {
      await writeLog("ERROR", "BIOMETRIC SENSORS BLOCKED BY HOST.", 1000);
      await writeLog("ACOLYTE", "Refusal to provide visual metrics forces a blind calibration. This will be painful.", 3000);
      setCameraActive(true);
      setActions([{ label: "[ BEGIN BLIND CALIBRATION ]", execute: () => executeAlignment(), highlight: true }]);
    }
  };

  const executeAlignment = async () => {
    setActions([]);
    await writeLog("NODE", "EXECUTED: Begin Calibration.", 0);
    setIsScanning(true);
    await writeLog("SYSTEM", "COMMENCING POSTURE OVERWRITE...", 500);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 3;
      if (progress > 100) progress = 100;
      setScanProgress(progress);
      if (progress === 100) {
        clearInterval(interval);
        finalizeAlignment();
      }
    }, 500);
  };

  const finalizeAlignment = async () => {
    setIsScanning(false);
    setFlashActive(true);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    await sleep(400);
    setAlignmentComplete(true);
    setFlashActive(false);
    await sleep(1000);
    await writeLog("SYSTEM", "SKELETAL LOCK CONFIRMED. SNAPSHOT SAVED TO ARCHIVE.", 500);
    setGuideImage("/guide/08_wink_kiss_âEâCâôâNôèé░âLâbâX.png");
    setGuideStatus("VESSEL ALIGNED");
    await writeLog("ACOLYTE", "Much better. You look almost acceptable now.", 2000);
    await writeLog("ACOLYTE", "Remember this exact posture. If I detect you slumping again, we will repeat this until your muscles fail.", 3500);

    markPhaseComplete("02");

    setActions([
      { label: "[ PROCEED TO DIRECTIVE 03 ]", url: "/ascension/three", highlight: true },
      { label: "[ RETURN TO PROTOCOL HUB ]", url: "/ascension" }
    ]);
  };

  return (
    <div className="flex-1 flex flex-col pt-16 sm:pt-20 px-4 md:px-8 relative z-10 w-full max-w-[1400px] mx-auto pb-10 min-h-screen asc-page-enter">

      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#ff00a00a_1px,transparent_1px),linear-gradient(to_bottom,#ff00a00a_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] z-0 asc-animate-grid"></div>

      {/* Screen Flash */}
      {flashActive && (
        <div className="fixed inset-0 z-[99999] bg-white pointer-events-none asc-animate-flash"></div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-[#9d00ff]/50 pb-4 mb-6 sm:mb-8 relative z-10 mt-4 sm:mt-0">
        <div>
          <h1 className="text-[#ff00a0] tracking-[0.2em] sm:tracking-[0.4em] text-xl sm:text-2xl font-black uppercase drop-shadow-[0_0_10px_rgba(255,0,160,0.5)]">
            DIR_02 // VESSEL ALIGNMENT
          </h1>
        </div>
        <div className="mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="text-[#ff003c] tracking-widest text-[10px] border border-[#ff003c]/30 px-3 py-1.5 bg-[#ff003c]/10 text-center sm:text-left">
            SYS_LOCK: {alignmentComplete ? "ENGAGED" : "PENDING"}
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

            {/* SKELETAL CAMERA UI */}
            {cameraActive && (
              <div className="my-6 border-y-2 border-[#ff00a0] bg-black relative asc-animate-fade-in-up">
                <div className="absolute top-0 left-0 w-full bg-[#ff00a0]/20 text-[#ff00a0] text-[8px] px-2 py-1 tracking-[0.5em] z-30 flex justify-between">
                  <span>BIOMETRIC_FEED // LIVE</span>
                  <span className={alignmentComplete ? "text-[#9d00ff]" : "text-[#ff003c]"}>
                    {isScanning ? "CALCULATING MATRICES..." : alignmentComplete ? "MATCH: 99.8%" : "DEVIATION DETECTED"}
                  </span>
                </div>

                <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-[#0a0012] flex items-center justify-center">

                  {!alignmentComplete && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center opacity-80 pointer-events-none">
                      <svg viewBox="0 0 100 100" className="h-[90%] w-auto stroke-[#ff00a0] fill-none" strokeWidth="0.8" strokeDasharray="1 1">
                        <circle cx="50" cy="20" r="8" />
                        <line x1="50" y1="28" x2="50" y2="60" />
                        <line x1="35" y1="32" x2="65" y2="32" />
                        <line x1="35" y1="32" x2="40" y2="50" />
                        <line x1="65" y1="32" x2="60" y2="50" />
                        <line x1="40" y1="50" x2="45" y2="70" />
                        <line x1="60" y1="50" x2="55" y2="70" />
                        <line x1="42" y1="60" x2="58" y2="60" />
                        <line x1="42" y1="60" x2="40" y2="80" />
                        <line x1="58" y1="60" x2="60" y2="80" />
                        <line x1="40" y1="80" x2="25" y2="85" />
                        <line x1="60" y1="80" x2="75" y2="85" />
                        <circle cx="35" cy="32" r="1.5" className="fill-[#ff003c] stroke-none animate-pulse" />
                        <circle cx="65" cy="32" r="1.5" className="fill-[#ff003c] stroke-none animate-pulse" />
                        <circle cx="50" cy="45" r="1.5" className="fill-[#ff003c] stroke-none animate-pulse" />
                        <circle cx="40" cy="80" r="1.5" className="fill-[#ff003c] stroke-none animate-pulse" />
                        <circle cx="60" cy="80" r="1.5" className="fill-[#ff003c] stroke-none animate-pulse" />
                      </svg>
                    </div>
                  )}

                  {isScanning && (
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-[#ff003c] shadow-[0_0_20px_#ff003c] z-40 asc-animate-scan-h"></div>
                  )}

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover opacity-80 mix-blend-screen contrast-[1.4] sepia-[0.5] hue-rotate-[260deg] saturate-[2] ${alignmentComplete ? 'blur-md opacity-30 grayscale' : ''}`}
                  />

                  {!streamRef.current && !alignmentComplete && (
                    <div className="absolute z-10 text-[#ff003c] font-bold tracking-[0.4em] animate-pulse text-xs">FEED_UNAVAILABLE</div>
                  )}
                </div>

                {isScanning && (
                  <div className="w-full bg-[#05000a] h-1.5">
                    <div className="bg-[#ff003c] h-full transition-all duration-300 shadow-[0_0_10px_#ff003c]" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                )}
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
                      className={`text-left block w-full p-3 sm:p-4 tracking-[0.15em] sm:tracking-[0.2em] font-bold text-[10px] sm:text-xs uppercase transition-all duration-300 ${
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

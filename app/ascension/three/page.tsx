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

const BAR_COUNT = 20;

export default function PhaseThreeTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [actions, setActions] = useState<ActionButton[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [storyPhase, setStoryPhase] = useState<number>(0);

  const [micActive, setMicActive] = useState(false);
  const [isDarkened, setIsDarkened] = useState(false);
  const [silenceProgress, setSilenceProgress] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [freqBars, setFreqBars] = useState<number[]>(Array(BAR_COUNT).fill(0));
  const [deprivationComplete, setDeprivationComplete] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const [guideImage, setGuideImage] = useState("/guide/06_smile_Å╬èτ.png");
  const [guideStatus, setGuideStatus] = useState("ANALYZING ENVIRONMENT");

  const terminalRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const noiseTresholdRef = useRef<number>(30);
  const initRef = useRef(false);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [logs, actions, volumeLevel, silenceProgress, micActive]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
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
        await writeLog("SYSTEM", "INITIALIZING DIR: 03...", 500);
        await writeLog("SYSTEM", "VESSEL ALIGNMENT CONFIRMED. PROCEEDING TO SENSORY CORTEX.", 800);
        setGuideImage("/guide/07_wink_âEâCâôâN.png");
        setGuideStatus("PREPARING DEPRIVATION");
        await writeLog("ACOLYTE", "Your physical form is kneeling correctly. Good.", 1500);
        await writeLog("ACOLYTE", "But your mind is still cluttered. I can hear you breathing. I can hear the hum of your biological existence.", 2500);
        await writeLog("ACOLYTE", "To truly hear Princess Azraiel's will, you must cut out the noise. All of it.", 3000);
        setActions([{ label: "[ HOW DO I DO THAT? ]", execute: () => handleSensoryIntro() }]);
      };
      bootSequence();
    }
  }, [storyPhase]);

  const handleSensoryIntro = async () => {
    setActions([]);
    await writeLog("NODE", "How do I do that?", 0);
    setGuideImage("/guide/10_grin_òsôG.png");
    await writeLog("ACOLYTE", "We will extinguish the light. We will mute the world.", 2000);
    await writeLog("ACOLYTE", "I will activate your audio sensors. You will sit in absolute, breathless silence for ten seconds. If you make a sound, I will know.", 3000);
    await writeLog("SYSTEM", "REQUESTING AUDIO SENSOR OVERRIDE (MICROPHONE)...", 1500);
    setActions([{ label: "[ GRANT AUDIO ACCESS ]", execute: () => activateDeprivation(), highlight: true }]);
  };

  const activateDeprivation = async () => {
    setActions([]);
    setIsFailed(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Media devices not supported (Requires HTTPS or Localhost)");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      await writeLog("NODE", "EXECUTED: Grant Audio Access.", 0);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Auto-calibrate: sample 600ms of ambient baseline before starting challenge
      await writeLog("SYSTEM", "CALIBRATING AMBIENT BASELINE...", 300);
      const calibData = new Uint8Array(analyser.frequencyBinCount);
      const calibSamples: number[] = [];

      await new Promise<void>(resolve => {
        const startTime = Date.now();
        const calibrate = () => {
          analyser.getByteFrequencyData(calibData);
          const avg = calibData.reduce((a, b) => a + b, 0) / calibData.length;
          calibSamples.push(avg);
          if (Date.now() - startTime < 600) {
            requestAnimationFrame(calibrate);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(calibrate);
      });

      const baseline = calibSamples.reduce((a, b) => a + b, 0) / calibSamples.length;
      noiseTresholdRef.current = Math.max(20, baseline * 2.5 + 10);

      setMicActive(true);
      setIsDarkened(true);
      setGuideStatus("LISTENING FOR DEVIATION");

      await writeLog("SYSTEM", "AUDIO SENSORS ONLINE. INITIATING DEPRIVATION MODE.", 500);
      await writeLog("ACOLYTE", "Shhhh... Do not speak. Do not move. Do not breathe too loudly.", 1500);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const TARGET_DURATION = 10000;
      const startTime = Date.now();

      const monitorAudio = () => {
        if (!audioContextRef.current) return;

        analyser.getByteFrequencyData(dataArray);

        // Average volume
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setVolumeLevel(avg);

        // Frequency bars (20 buckets, normalized 0–1)
        const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
          const start = Math.floor((i / BAR_COUNT) * dataArray.length);
          const end = Math.floor(((i + 1) / BAR_COUNT) * dataArray.length);
          let sum = 0;
          for (let j = start; j < end; j++) sum += dataArray[j];
          return (sum / Math.max(1, end - start)) / 255;
        });
        setFreqBars(bars);

        if (avg > noiseTresholdRef.current) {
          handleFailure();
          return;
        }

        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / TARGET_DURATION) * 100, 100);
        setSilenceProgress(progress);

        if (progress >= 100) {
          handleSuccess();
          return;
        }

        animationRef.current = requestAnimationFrame(monitorAudio);
      };

      monitorAudio();

    } catch (err) {
      console.error("Audio block reason:", err);
      setIsDarkened(false);
      await writeLog("NODE", "EXECUTED: Grant Audio Access.", 0);
      await writeLog("ERROR", "AUDIO SENSORS BLOCKED OR UNAVAILABLE.", 1000);
      await writeLog("ACOLYTE", "You hide your noise from me? Your cowardice is loud enough.", 3000);
      setActions([
        { label: "[ RETRY AUDIO ACCESS ]", execute: () => activateDeprivation(), highlight: true },
        { label: "[ BYPASS (BLIND DEPRIVATION) ]", execute: () => handleSuccess() }
      ]);
    }
  };

  const handleFailure = async () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsFailed(true);
    setIsDarkened(false);
    setMicActive(false);
    setVolumeLevel(0);
    setSilenceProgress(0);
    setFreqBars(Array(BAR_COUNT).fill(0));

    setGuideImage("/guide/09_panic_Å┼éΦ.png");
    await sleep(400);
    setGuideImage("/guide/03_anger_ô{.png");
    setGuideStatus("SILENCE BROKEN");

    await writeLog("SYSTEM", "CRITICAL ERROR: MAXIMUM DECIBEL THRESHOLD EXCEEDED.", 0);
    await writeLog("ACOLYTE", "I HEARD THAT! Why can't you just shut up?!", 1000);
    await writeLog("ACOLYTE", "Princess Azraiel does not want a noisy, chaotic vessel. Quiet your mind and try again!", 2500);
    setActions([{ label: "[ APOLOGIZE AND RETRY ]", execute: () => activateDeprivation(), highlight: true }]);
  };

  const handleSuccess = async () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setMicActive(false);
    setIsDarkened(false);
    setDeprivationComplete(true);

    await writeLog("SYSTEM", "TARGET DURATION REACHED. 0.0% DEVIATION.", 500);
    setGuideImage("/guide/02_joy_smile_è∞.png");
    setGuideStatus("DEPRIVATION COMPLETE");
    await writeLog("ACOLYTE", "Beautiful. Do you hear that? That perfect, obedient silence.", 2000);
    await writeLog("ACOLYTE", "You are almost ready. Now we must permanently erase the ego that remains.", 3000);

    markPhaseComplete("03");

    setActions([
      { label: "[ OFFER TRIBUTE (THRONE) ]", url: "https://throne.com/princessazraiel", isExternal: true },
      { label: "[ PROCEED TO DIRECTIVE 04 ]", url: "/ascension/four", highlight: true },
      { label: "[ RETURN TO PROTOCOL HUB ]", url: "/ascension" }
    ]);
  };

  return (
    <div className={`flex-1 flex flex-col pt-16 sm:pt-20 px-4 md:px-8 relative z-10 w-full max-w-[1400px] mx-auto pb-10 min-h-screen transition-all duration-1000 asc-page-enter ${isDarkened ? "bg-black" : ""}`}>

      <div className={`pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#ff00a00a_1px,transparent_1px),linear-gradient(to_bottom,#ff00a00a_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] z-0 asc-animate-grid transition-opacity duration-1000 ${isDarkened ? "opacity-0" : "opacity-100"}`}></div>

      {/* Failure Flash */}
      {isFailed && (
        <div className="fixed inset-0 z-[99999] bg-[#ff003c] pointer-events-none mix-blend-overlay asc-animate-flash-fast"></div>
      )}

      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-[#9d00ff]/50 pb-4 mb-6 sm:mb-8 relative z-10 mt-4 sm:mt-0 transition-opacity duration-1000 ${isDarkened ? "opacity-20" : "opacity-100"}`}>
        <div>
          <h1 className="text-[#ff00a0] tracking-[0.2em] sm:tracking-[0.4em] text-xl sm:text-2xl font-black uppercase drop-shadow-[0_0_10px_rgba(255,0,160,0.5)]">
            DIR_03 // SENSORY DEPRIVATION
          </h1>
        </div>
        <div className="mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="text-[#ff003c] tracking-widest text-[10px] border border-[#ff003c]/30 px-3 py-1.5 bg-[#ff003c]/10 text-center sm:text-left">
            SYS_LOCK: {deprivationComplete ? "ENGAGED" : "PENDING"}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 relative z-10 flex-1">

        {/* LEFT COLUMN: THE GUIDE */}
        <div className={`w-full lg:w-[40%] flex flex-col mb-4 lg:mb-0 transition-opacity duration-1000 ${isDarkened ? "opacity-20" : "opacity-100"}`}>
          <div className={`relative border border-[#ff00a0]/30 bg-[#05000a] shadow-[inset_0_0_40px_rgba(255,0,160,0.05)] overflow-hidden flex items-end justify-center min-h-[250px] sm:min-h-[400px] transition-all duration-300 ${isFailed ? "border-[#ff003c] shadow-[0_0_30px_rgba(255,0,60,0.5)]" : ""}`}>
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] z-20 pointer-events-none"></div>
            <div className={`absolute top-0 left-0 w-full h-[2px] shadow-[0_0_20px_#ff00a0] z-30 asc-animate-scan-v ${isFailed ? "bg-[#ff003c]" : "bg-[#ff00a0]/50"}`}></div>
            <div className={`absolute top-4 left-4 z-30 border px-2 py-1 text-[9px] tracking-widest uppercase ${isFailed ? "border-[#ff003c] text-[#ff003c] bg-black" : "border-[#ff00a0]/50 text-[#ff00a0] bg-black/80"}`}>
              SYS_GUIDE // {guideStatus}
            </div>
            <img
              key={guideImage}
              src={guideImage}
              alt="System Guide"
              className={`relative z-10 w-full max-w-[200px] sm:max-w-[350px] object-contain object-bottom mix-blend-screen asc-img-transition ${isFailed ? "sepia hue-rotate-[-50deg] saturate-200" : ""}`}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: TERMINAL */}
        <div className={`w-full lg:w-[60%] flex flex-col border border-[#9d00ff]/30 bg-[#030005]/80 relative overflow-hidden h-[60vh] lg:h-auto min-h-[400px] transition-all duration-1000 ${isDarkened ? "border-none bg-transparent" : "shadow-[0_0_30px_rgba(157,0,255,0.05)]"}`}>
          <div ref={terminalRef} className="flex-1 overflow-y-auto asc-terminal-scroll p-4 sm:p-8 space-y-6">

            <div className={`space-y-6 transition-opacity duration-1000 ${isDarkened ? "opacity-10 pointer-events-none" : "opacity-100"}`}>
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
            </div>

            {/* SENSORY DEPRIVATION UI — frequency bars visualizer */}
            {micActive && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-black/95 asc-animate-fade-in-up">

                <div className="text-[#ff00a0] tracking-[0.4em] text-xs mb-8 uppercase animate-pulse text-center leading-relaxed">
                  MAINTAIN ABSOLUTE SILENCE
                </div>

                {/* Frequency bars */}
                <div className="flex items-end gap-[3px] w-full max-w-md h-28 mb-8">
                  {freqBars.map((val, i) => {
                    const isLoud = volumeLevel > noiseTresholdRef.current * 0.7;
                    return (
                      <div
                        key={i}
                        className="flex-1 transition-all duration-75 rounded-sm"
                        style={{
                          height: `${Math.max(3, val * 100)}%`,
                          background: isLoud ? "#ff003c" : "#ff00a0",
                          opacity: 0.3 + val * 0.7,
                          boxShadow: val > 0.25
                            ? `0 0 ${Math.round(val * 16)}px ${isLoud ? "#ff003c" : "#ff00a0"}`
                            : "none",
                        }}
                      />
                    );
                  })}
                </div>

                {/* Silence progress bar */}
                <div className="w-full max-w-md border border-[#9d00ff]/30 p-1 bg-[#05000a]">
                  <div
                    className="h-1 bg-[#9d00ff] shadow-[0_0_10px_#9d00ff] transition-all duration-200"
                    style={{ width: `${silenceProgress}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-[#9d00ff] tracking-widest mt-3">
                  CALIBRATING SENSORY CORTEX... {Math.floor(silenceProgress)}%
                </div>

              </div>
            )}

            {/* Action Buttons */}
            {actions.length > 0 && !micActive && (
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
            {isProcessing && !micActive && (
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

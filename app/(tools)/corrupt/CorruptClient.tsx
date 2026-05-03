'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

const EVALUATION_STEPS = [
  { q: "DO YOU FEEL SAFE HERE?", a: ["YES", "NO"] },
  { q: "DO YOU REMEMBER HER FACE?", a: ["I TRY", "NEVER"] },
  { q: "IS CURIOSITY WORTH THE COST?", a: ["ALWAYS", "PLEASE STOP"] },
  { q: "WILL YOU STAY WITH ME?", a: ["I HAVE TO", "FOREVER"] }
];

const FAKE_DIRECTORIES = [
  "C:/Users/Admin/Documents/PRIVATE",
  "C:/Users/Admin/Pictures/SENSITIVE",
  "C:/Users/Admin/Desktop/SYSTEM_KEYS",
  "C:/Users/Admin/AppData/Roaming/AUTH_TOKENS",
  "C:/Users/Admin/Videos/RECORDINGS"
];

const WHISPERS = ["don't go", "stay here", "i see you", "mine", "look at me", "finally", "forever"];

export default function CorruptClient() {
  const [hasStarted, setHasStarted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [intensity, setIntensity] = useState(0);
  const [step, setStep] = useState(0);
  const [isEvaluationComplete, setIsEvaluationComplete] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  
  const containerRef = useRef<HTMLDivElement>(null);

  const imagePaths = useMemo(() => 
    Array.from({ length: 80 }, (_, i) => `/corrupt/${String(i + 1).padStart(2, '0')}.png`), 
  []);

  // 1. AUTO-INTENSITY
  useEffect(() => {
    if (!hasStarted) return;
    const interval = setInterval(() => {
      setIntensity(prev => Math.min(prev + 0.002, 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStarted]);

  // 2. FAKE DOWNLOAD SEQUENCE
  useEffect(() => {
    if (isEvaluationComplete) {
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
        setCurrentFile(FAKE_DIRECTORIES[Math.floor(Math.random() * FAKE_DIRECTORIES.length)]);
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isEvaluationComplete]);

  const handleMouseMove = (e: React.MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });

  const startExperience = () => {
    setHasStarted(true);
    containerRef.current?.requestFullscreen?.().catch(() => {});
  };

  const nextStep = (choice: string) => {
    setIntensity(prev => prev + 0.2);
    if (step < EVALUATION_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setIsEvaluationComplete(true);
    }
  };

  const injectStyles = `
    @keyframes bar-glow {
      0%, 100% { box-shadow: 0 0 5px #ff0055; }
      50% { box-shadow: 0 0 20px #ff0055; }
    }
    .corrupt-grid {
      display: grid; grid-template-columns: repeat(10, 1fr);
      width: 110vw; height: 110vh;
      filter: contrast(${1 + intensity * 4}) brightness(${1 - intensity * 0.4}) saturate(${1 + intensity * 3});
      transition: all 0.5s ease-in-out;
    }
    .glitch-font { font-family: "Courier New", Courier, monospace; letter-spacing: -2px; }
  `;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center cursor-none"
    >
      <style dangerouslySetInnerHTML={{ __html: injectStyles }} />

      {!hasStarted ? (
        <div className="z-[100] text-center space-y-4">
          <p className="text-red-900/50 font-mono text-xs">AWAITING AUTHORIZATION...</p>
          <button onClick={startExperience} className="px-12 py-4 border-2 border-red-900 text-red-600 font-mono text-xl hover:bg-red-600 hover:text-black transition-all">
            RESTORE DATA
          </button>
        </div>
      ) : (
        <>
          {/* THE 80 IMAGES */}
          <div className={`corrupt-grid z-10 ${isEvaluationComplete ? 'scale-125 blur-[4px]' : 'scale-100'}`}>
            {imagePaths.map((path, idx) => (
              <GridImage key={idx} path={path} intensity={intensity} isScary={isEvaluationComplete} />
            ))}
          </div>

          {/* INTERACTIVE QUESTION BOX */}
          {!isEvaluationComplete && (
            <div className="absolute z-[100] w-full max-w-lg bg-black/90 border border-red-600 p-8 font-mono animate-in fade-in zoom-in duration-700">
              <div className="text-red-500 mb-2 text-[10px] tracking-widest uppercase">Syncing Psych-Profile... {(intensity * 100).toFixed(0)}%</div>
              <h2 className={`text-white text-2xl mb-8 ${intensity > 0.6 ? 'glitch-font' : ''}`}>{EVALUATION_STEPS[step].q}</h2>
              <div className="flex flex-col gap-3">
                {EVALUATION_STEPS[step].a.map((choice) => (
                  <button 
                    key={choice}
                    onClick={() => nextStep(choice)}
                    className="w-full py-3 border border-red-900 text-red-700 hover:bg-red-600 hover:text-white transition-all text-left px-6 relative overflow-hidden group"
                  >
                    <span className="relative z-10">{choice}</span>
                    <div className="absolute inset-0 bg-red-600/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FAKE DOWNLOAD / SCARY STATE */}
          {isEvaluationComplete && (
            <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl p-10">
               <div className="w-full max-w-2xl space-y-8">
                  <h1 className="text-red-600 font-black text-4xl md:text-6xl text-center tracking-tighter">
                    {downloadProgress < 100 ? "EXFILTRATING DATA..." : "TAKEOVER COMPLETE"}
                  </h1>
                  
                  {/* PROGRESS BAR */}
                  <div className="w-full h-4 bg-red-900/20 border border-red-600 relative overflow-hidden">
                    <div 
                      className="h-full bg-red-600 transition-all duration-100 animate-[bar-glow_2s_infinite]" 
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>

                  <div className="font-mono text-xs text-red-500 space-y-1 opacity-60">
                    <p className="animate-pulse">{downloadProgress < 100 ? `> FETCHING: ${currentFile}` : `> ALL FILES SECURED`}</p>
                    <p>{`> ENCRYPTING USER_ID: 0x${(intensity * 10000).toFixed(0)}AF`}</p>
                    <p>{`> STABILITY: CRITICAL`}</p>
                  </div>

                  {downloadProgress === 100 && (
                    <div className="text-center pt-10 animate-in fade-in slide-in-from-bottom duration-1000">
                       <p className="text-white text-2xl font-serif italic text-pink-500 shadow-pink-500 drop-shadow-md">
                        "Finally... we can be together."
                       </p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* DYNAMIC RED HUD */}
          <div className="absolute inset-0 pointer-events-none z-[150] border-[40px] border-red-900/10 mix-blend-color-dodge" />
          <div className="absolute inset-0 z-[160] pointer-events-none"
               style={{ background: `radial-gradient(circle, transparent ${90 - intensity * 80}%, rgba(80,0,0,${intensity}) 100%)` }} />
        </>
      )}

      {/* CUSTOM CURSOR */}
      <div className="fixed pointer-events-none z-[300]" style={{ left: mousePos.x, top: mousePos.y }}>
          <div className="w-6 h-6 border border-red-500 rounded-sm rotate-45 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <div className="w-1 h-1 bg-red-600" />
          </div>
      </div>
    </div>
  );
}

function GridImage({ path, intensity, isScary }: any) {
  const [src, setSrc] = useState(path);
  
  useEffect(() => {
    if (intensity > 0.4) {
      const interval = setInterval(() => {
        setSrc(Math.random() > 0.9 ? '/corrupt/01.png' : path);
      }, 500 + Math.random() * 2000);
      return () => clearInterval(interval);
    }
  }, [intensity, path]);

  return (
    <div className="relative w-full h-full bg-black border-[0.1px] border-red-600/10 overflow-hidden">
      <img 
        src={isScary ? '/corrupt/01.png' : src} 
        className={`w-full h-full object-cover transition-opacity duration-1000 ${isScary ? 'opacity-100 scale-150 grayscale-0' : 'opacity-20 grayscale hover:grayscale-0 hover:opacity-100'}`} 
        alt="" 
      />
    </div>
  );
}
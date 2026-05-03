'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

// --- Yandere Configuration ---
const DIALOGUE = [
  { text: "Oh... you actually clicked?", delay: 100, glitchChance: 0.1 },
  { text: "I've been waiting for you...", delay: 120, glitchChance: 0.2 },
  { text: "I deleted the others.", delay: 80, glitchChance: 0.8 }, // Glitch heavy
  { text: "Now it's just you... and me.", delay: 150, glitchChance: 0.0 }, // Suddenly calm
  { text: "Why is your mouse moving away?", delay: 50, glitchChance: 0.5 },
  { text: "DON'T LOOK AT ANYONE ELSE.", delay: 30, glitchChance: 1.0 }, // Fast & Scary
  { text: "Let's install our love forever.", delay: 100, glitchChance: 0.3 }
];

const TERMINAL_LOGS = [
  "CONNECTING_TO_HOST...",
  "BYPASSING_FIREWALL...",
  "DELETING_HISTORY...",
  "LOCKING_DOOR_SYSTEM...",
  "INSTALLING_LOVE.EXE...",
  "OVERWRITING_USER_PREFS...",
  "HEART_RATE_SYNC: 180BPM",
  "ACCESS_GRANTED: ADMIN",
];

const AGREEMENT_TERMS = [
  "I will never close this tab",
  "I will only look at you",
  "My data is your data",
  "I love you I love you I love you",
];

export default function DoNotClickClient() {
  // State
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<'intro' | 'agreement' | 'end'>('intro');
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [splatters, setSplatters] = useState<Array<{id: number, x: number, y: number, scale: number, rot: number}>>([]);
  const [agreedCount, setAgreedCount] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Audio Setup ---
  useEffect(() => {
    // Note: You would need a file like heartbeat.mp3 or static noise
    const playAudio = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio('/audio/glitch.mp3'); // Ensure this file exists in public/
        audioRef.current.loop = true;
        audioRef.current.volume = 0.05;
        audioRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('click', playAudio, { once: true });
    return () => window.removeEventListener('click', playAudio);
  }, []);

  // --- Mouse & Interaction Logic ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: MouseEvent) => {
      // Add blood splatter on click
      const id = Date.now();
      setSplatters(prev => [...prev, {
        id,
        x: e.clientX,
        y: e.clientY,
        scale: 0.5 + Math.random() * 1.5,
        rot: Math.random() * 360
      }]);

      // Intense glitch on click
      setGlitchIntensity(1);
      setTimeout(() => setGlitchIntensity(0), 200);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // --- Hacked Terminal Background ---
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = TERMINAL_LOGS[Math.floor(Math.random() * TERMINAL_LOGS.length)];
      const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
      setTerminalLines(prev => [`> ${randomLog} [0x${randomHex}]`, ...prev].slice(0, 15));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // --- Typing Logic (Yandere Mode) ---
  useEffect(() => {
    if (lineIndex >= DIALOGUE.length) {
      setTimeout(() => setPhase('agreement'), 1000);
      return;
    }

    const currentLine = DIALOGUE[lineIndex];
    let charIndex = 0;
    
    // Randomize glitch intensity based on the line
    if (Math.random() < currentLine.glitchChance) {
      setGlitchIntensity(0.5);
    } else {
      setGlitchIntensity(0);
    }

    const typeInterval = setInterval(() => {
      // Sometimes mix in Zalogo/Garbage text
      const char = currentLine.text[charIndex];
      const garbage = "!@#$%^&*broken_heart<3"[Math.floor(Math.random() * 20)];
      
      if (Math.random() < 0.1) {
        setText(prev => prev + garbage);
        setTimeout(() => setText(prev => prev.slice(0, -1) + char), 50);
      } else {
        setText(prev => prev + char);
      }
      
      charIndex++;
      if (charIndex === currentLine.text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setText("");
          setLineIndex(prev => prev + 1);
        }, 2000);
      }
    }, currentLine.delay);

    return () => clearInterval(typeInterval);
  }, [lineIndex]);

  // --- Helper: Scramble Text ---
  const scramble = (str: string) => {
    return str.split('').map((char) => {
      if (char === ' ') return ' ';
      return Math.random() > 0.7 ? "❤️" : char;
    }).join('');
  };

  return (
    <>
      <style jsx global>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          5% { transform: scale(1.02); }
          10% { transform: scale(1); }
          15% { transform: scale(1.02); }
          50% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s infinite;
        }
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
          background-size: 100% 4px;
        }
      `}</style>

      {/* --- CUSTOM CURSOR --- */}
      <motion.div 
        className="fixed z-[100] pointer-events-none mix-blend-exclusion"
        animate={{
          x: cursorPos.x - 16,
          y: cursorPos.y - 16,
          scale: glitchIntensity > 0 ? 1.5 : 1
        }}
        transition={{ type: "tween", duration: 0 }}
      >
        <div className="text-3xl filter drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]">
          {glitchIntensity > 0 ? '🔪' : '❤️'}
        </div>
      </motion.div>

      {/* --- BACKGROUND TERMINAL --- */}
      <div className="absolute inset-0 z-0 p-10 font-mono text-xs md:text-sm leading-tight text-red-900/20 overflow-hidden select-none pointer-events-none">
        {terminalLines.map((line, i) => (
          <div key={i} className="opacity-70">{line}</div>
        ))}
      </div>

      {/* --- BLOOD SPLATTERS (ON CLICK) --- */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {splatters.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: s.scale }}
            className="absolute text-red-700/80 mix-blend-multiply"
            style={{ 
              left: s.x, 
              top: s.y, 
              rotate: s.rot,
              fontSize: '4rem',
              filter: 'blur(1px)'
            }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
              {/* Abstract Splatter Shape */}
              <path d="M50 40 C 60 20, 80 20, 90 40 C 100 60, 50 100, 50 100 C 50 100, 0 60, 10 40 C 20 20, 40 20, 50 40" />
              <circle cx="20" cy="80" r="5" />
              <circle cx="80" cy="90" r="8" />
              <circle cx="90" cy="20" r="4" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div 
        ref={containerRef}
        className={`relative z-20 w-full h-full flex flex-col items-center justify-center ${phase === 'intro' ? 'animate-heartbeat' : ''}`}
      >
        
        {/* PHASE 1: DIALOGUE */}
        {phase === 'intro' && (
          <div className="relative max-w-4xl px-6 text-center">
            {/* RGB Split Effect Layer */}
            <div className="absolute inset-0 translate-x-[2px] text-red-500 opacity-70 mix-blend-screen pointer-events-none">
              {text}
            </div>
            <div className="absolute inset-0 -translate-x-[2px] text-blue-500 opacity-70 mix-blend-screen pointer-events-none">
              {text}
            </div>
            
            <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter uppercase font-mono relative">
              {text}
              <span className="animate-pulse text-red-600">_</span>
            </h1>
          </div>
        )}

        {/* PHASE 2: FORCED AGREEMENT */}
        <AnimatePresence>
          {phase === 'agreement' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full bg-black/80 border border-red-600/50 p-8 rounded-lg backdrop-blur-md shadow-[0_0_50px_rgba(220,38,38,0.3)]"
            >
              <h2 className="text-2xl text-red-500 font-mono mb-6 text-center border-b border-red-900 pb-2">
                SYSTEM_OVERRIDE: LOVE.EXE
              </h2>
              
              <div className="space-y-4">
                {AGREEMENT_TERMS.map((term, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={() => {
                      if (agreedCount < AGREEMENT_TERMS.length) {
                        setAgreedCount(p => p + 1);
                        setGlitchIntensity(1);
                        setTimeout(() => setGlitchIntensity(0), 100);
                      }
                    }}
                  >
                    <div className={`w-6 h-6 border-2 flex items-center justify-center transition-all duration-300 ${i < agreedCount ? 'border-red-500 bg-red-900/50' : 'border-gray-700'}`}>
                      {i < agreedCount && <span className="text-red-400 font-bold">❤️</span>}
                    </div>
                    <span className={`font-mono text-sm md:text-base ${i < agreedCount ? 'text-red-300 line-through decoration-red-500' : 'text-gray-400'}`}>
                      {i < agreedCount ? "ACCEPTED FOREVER" : term}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* The Button that runs away or unlocks */}
              <div className="mt-8 relative h-16">
                {agreedCount === AGREEMENT_TERMS.length ? (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setPhase('end')}
                    className="w-full py-4 bg-red-700 text-white font-black tracking-[0.5em] text-xl shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:bg-red-600 transition-colors"
                  >
                    BE MINE
                  </motion.button>
                ) : (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-50 text-xs text-red-900"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ACCEPT ALL TERMS TO CONTINUE...
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHASE 3: THE END (Final Glitch State) */}
        {phase === 'end' && (
            <motion.div 
                className="text-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.h1 
                    className="text-6xl md:text-9xl font-black text-red-600 mb-8 mix-blend-difference"
                    animate={{ 
                        x: [-5, 5, -5],
                        scale: [1, 1.1, 1],
                        filter: ["blur(0px)", "blur(4px)", "blur(0px)"]
                    }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                >
                    FOREVER
                </motion.h1>
                <Link 
                    href="https://iplogger.com/2qsfG4"
                    className="inline-block px-8 py-3 bg-white text-black font-mono font-bold hover:bg-red-500 hover:text-white transition-colors"
                >
                    ENTER RED ROOM
                </Link>
                <p className="mt-4 text-red-900 font-mono text-xs">
                    ID: {Date.now()} // SUBJECT: CAPTURED
                </p>
            </motion.div>
        )}
      </div>

      {/* --- OVERLAYS --- */}
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-40 scanlines opacity-30"></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(circle,transparent_0%,rgba(0,0,0,0.8)_90%,rgba(50,0,0,1)_120%)]"></div>
      
      {/* Glitch Overlay (Active only when intense) */}
      {glitchIntensity > 0 && (
        <div className="absolute inset-0 z-50 pointer-events-none bg-red-500/10 mix-blend-color-dodge">
          <div className="w-full h-full animate-pulse bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>
        </div>
      )}
    </>
  );
}
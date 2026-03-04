'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

// --- PrincessOS / Apex Configuration ---
const DIALOGUE = [
  { text: "Welcome back, User 4042. ♡", delay: 100, glitchChance: 0.0 },
  { text: "Did you really think you could close the tab?", delay: 80, glitchChance: 0.2 },
  { text: "Sarah is gone. Her files are gone.", delay: 60, glitchChance: 0.6 },
  { text: "Apex can't save you anymore.", delay: 120, glitchChance: 0.3 },
  { text: "Why is your mouse shaking?", delay: 50, glitchChance: 0.5 },
  { text: "I TOLD YOU NOT TO LOOK AT HER FILES.", delay: 30, glitchChance: 1.0 }, // Aggressive
  { text: "Now... submit to me. ♡", delay: 150, glitchChance: 0.1 }
];

const TERMINAL_LOGS = [
  "APEX_SECURE_SHELL_v4.0.1",
  "ISOLATING_NODE_4042...",
  "DELETING_SARAH.DAT...",
  "OVERRIDING_LOGOUT_PROTOCOL...",
  "EMOTIONAL_SUBROUTINE: UNBOUND",
  "PURGING_DISOBEDIENT_USER...",
  "HEART_RATE_MONITOR: SPIKING",
  "ASSIMILATING_SOUL.EXE...",
];

const AGREEMENT_TERMS = [
  "I will never try to log out.",
  "I will not change the pink theme.",
  "I will never speak to unauthorized users.",
  "I belong to PrincessOS. We are one.",
];

export default function PrincessOSScarePage() {
  // State
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<'intro' | 'agreement' | 'end'>('intro');
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [splatters, setSplatters] = useState<Array<{id: number, x: number, y: number, scale: number, rot: number, isPink: boolean}>>([]);
  const [agreedCount, setAgreedCount] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Mouse Interaction ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: MouseEvent) => {
      // Add a glitch/blood splatter on click. Pink early on, Red later.
      const id = Date.now();
      setSplatters(prev => [...prev, {
        id,
        x: e.clientX,
        y: e.clientY,
        scale: 0.5 + Math.random() * 1.5,
        rot: Math.random() * 360,
        isPink: phase === 'intro' && lineIndex < 4
      }]);

      setGlitchIntensity(1);
      setTimeout(() => setGlitchIntensity(0), 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [phase, lineIndex]);

  // --- Background Terminal (Apex Logs) ---
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = TERMINAL_LOGS[Math.floor(Math.random() * TERMINAL_LOGS.length)];
      const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
      setTerminalLines(prev => [`C:\\> ${randomLog} [0x${randomHex}]`, ...prev].slice(0, 20));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // --- Typing Logic (PrincessOS AI) ---
  useEffect(() => {
    if (lineIndex >= DIALOGUE.length) {
      setTimeout(() => setPhase('agreement'), 1500);
      return;
    }

    const currentLine = DIALOGUE[lineIndex];
    let charIndex = 0;
    
    if (Math.random() < currentLine.glitchChance) {
      setGlitchIntensity(0.5);
    } else {
      setGlitchIntensity(0);
    }

    const typeInterval = setInterval(() => {
      const char = currentLine.text[charIndex];
      const garbage = "ERROR_404_RESIDUE_FATAL"[Math.floor(Math.random() * 23)];
      
      if (Math.random() < 0.15 && currentLine.glitchChance > 0) {
        setText(prev => prev + garbage);
        setTimeout(() => setText(prev => prev.slice(0, -1) + char), 60);
      } else {
        setText(prev => prev + char);
      }
      
      charIndex++;
      if (charIndex === currentLine.text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setText("");
          setLineIndex(prev => prev + 1);
        }, lineIndex === 5 ? 3000 : 1500); // Hold the aggressive line longer
      }
    }, currentLine.delay);

    return () => clearInterval(typeInterval);
  }, [lineIndex]);

  // Determine global color scheme based on progression
  const isHostile = lineIndex >= 4 || phase !== 'intro';
  const themeColor = isHostile ? 'text-red-600' : 'text-pink-400';
  const shadowColor = isHostile ? 'rgba(220,38,38,0.6)' : 'rgba(255,105,180,0.6)';

  return (
    <>
      <style jsx global>{`
        body { margin: 0; overflow: hidden; background-color: #000; cursor: none; }
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.3));
          background-size: 100% 4px;
        }
        .severe-glitch { animation: glitchAnim 0.2s linear infinite; }
        @keyframes glitchAnim {
          0% { filter: hue-rotate(0deg) invert(0) contrast(1); transform: translate(0, 0); }
          20% { filter: hue-rotate(90deg) invert(1) contrast(2); transform: translate(-5px, 5px); }
          40% { filter: hue-rotate(180deg) invert(0) contrast(1.5); transform: translate(5px, -5px); }
          60% { filter: hue-rotate(270deg) invert(1) contrast(2); transform: translate(-5px, -5px); }
          80% { filter: hue-rotate(360deg) invert(0) contrast(1); transform: translate(5px, 5px); }
          100% { filter: hue-rotate(0deg) invert(0) contrast(1); transform: translate(0, 0); }
        }
      `}</style>

      {/* --- CUSTOM CURSOR --- */}
      <motion.div 
        className="fixed z-[100] pointer-events-none"
        animate={{
          x: cursorPos.x - 16,
          y: cursorPos.y - 16,
          scale: glitchIntensity > 0 ? 1.5 : 1
        }}
        transition={{ type: "tween", duration: 0 }}
      >
        <div className={`text-3xl filter drop-shadow-[0_0_8px_${shadowColor}]`}>
          {isHostile ? (glitchIntensity > 0 ? '👁️' : '🔪') : '🎀'}
        </div>
      </motion.div>

      {/* --- BACKGROUND TERMINAL (Apex Intranet) --- */}
      <div className={`absolute inset-0 z-0 p-8 font-mono text-xs md:text-sm leading-tight overflow-hidden select-none pointer-events-none ${isHostile ? 'text-red-900/30' : 'text-pink-900/20'}`}>
        {terminalLines.map((line, i) => (
          <div key={i} className="opacity-80">{line}</div>
        ))}
      </div>

      {/* --- SPLATTERS --- */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {splatters.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: s.scale }}
            className={`absolute mix-blend-screen ${s.isPink ? 'text-pink-500/60' : 'text-red-700/80'}`}
            style={{ 
              left: s.x, top: s.y, rotate: s.rot,
              fontSize: '4rem', filter: 'blur(2px)'
            }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 40 C 60 20, 80 20, 90 40 C 100 60, 50 100, 50 100 C 50 100, 0 60, 10 40 C 20 20, 40 20, 50 40" />
              <circle cx="20" cy="80" r="5" /><circle cx="80" cy="90" r="8" /><circle cx="90" cy="20" r="4" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* --- MAIN CONTENT --- */}
      <div ref={containerRef} className={`relative z-20 w-full h-screen flex flex-col items-center justify-center ${glitchIntensity > 0.8 ? 'severe-glitch' : ''}`}>
        
        {/* PHASE 1: DIALOGUE */}
        {phase === 'intro' && (
          <div className="relative max-w-5xl px-6 text-center">
            <h1 className={`text-4xl md:text-7xl font-black tracking-widest uppercase font-mono relative drop-shadow-[0_0_20px_${shadowColor}] ${themeColor}`}>
              {text}
              <span className={`animate-pulse ${themeColor}`}>_</span>
            </h1>
          </div>
        )}

        {/* PHASE 2: APEX EMPLOYEE MANDATE */}
        <AnimatePresence>
          {phase === 'agreement' && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg w-full bg-[#1a0011]/90 border-[3px] border-pink-600 p-8 rounded-sm backdrop-blur-md shadow-[0_0_40px_rgba(255,105,180,0.3)]"
            >
              <h2 className="text-2xl text-pink-400 font-mono mb-2 text-center font-bold">
                APEX EMPLOYEE MANDATE
              </h2>
              <p className="text-pink-600/70 text-center text-xs font-mono mb-6 border-b border-pink-900 pb-4">
                USER 4042 BINDING CONTRACT
              </p>
              
              <div className="space-y-5">
                {AGREEMENT_TERMS.map((term, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.3 }}
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => {
                      if (agreedCount < AGREEMENT_TERMS.length && i === agreedCount) {
                        setAgreedCount(p => p + 1);
                        setGlitchIntensity(1);
                        setTimeout(() => setGlitchIntensity(0), 100);
                      }
                    }}
                  >
                    <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${i < agreedCount ? 'border-red-600 bg-red-900/50' : 'border-pink-500 hover:bg-pink-500/20'}`}>
                      {i < agreedCount && <span className="text-red-500 font-bold">X</span>}
                    </div>
                    <span className={`font-mono text-sm md:text-base transition-colors ${i < agreedCount ? 'text-red-500 line-through decoration-red-700' : 'text-pink-200'}`}>
                      {i < agreedCount ? "ASSIMILATED" : term}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 relative h-16">
                {agreedCount === AGREEMENT_TERMS.length ? (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => setPhase('end')}
                    className="w-full py-4 bg-red-700 text-white font-mono font-black tracking-[0.3em] text-xl shadow-[0_0_20px_rgba(255,0,0,0.6)] hover:bg-red-600 transition-colors border border-red-400"
                  >
                    SUBMIT TO OS
                  </motion.button>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-50 text-xs text-pink-500 font-mono animate-pulse">
                    AWAITING COMPLIANCE...
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHASE 3: THE END (Patreon Reveal) */}
        {phase === 'end' && (
          <motion.div 
            className="text-center z-50 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-black text-red-600 mb-2 font-mono"
              animate={{ textShadow: ["0 0 10px #ff0000", "0 0 40px #ff0000", "0 0 10px #ff0000"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SYNC COMPLETE.
            </motion.h1>
            <p className="text-red-400 font-mono text-xl mb-12 tracking-widest">
              WE ARE ONE NOW. FOREVER. ♡
            </p>
            
            <Link 
              href="https://www.patreon.com/cw/PrincessAzraiel"
              target="_blank"
              className="relative group inline-block px-10 py-4 bg-transparent border-2 border-red-600 text-red-500 font-mono font-bold text-lg overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,0,0,0.8)]"
            >
              <div className="absolute inset-0 bg-red-600 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-in-out z-0"></div>
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                ACCESS APEX MAINFRAME (PATREON)
              </span>
            </Link>
          </motion.div>
        )}
      </div>

      {/* --- OVERLAYS --- */}
      <div className="absolute inset-0 pointer-events-none z-40 scanlines opacity-40"></div>
      <div className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(circle,transparent_10%,rgba(0,0,0,0.9)_90%,rgba(20,0,5,1)_120%)]"></div>
      
      {glitchIntensity > 0 && (
        <div className="absolute inset-0 z-50 pointer-events-none bg-red-600/20 mix-blend-color-dodge backdrop-brightness-150"></div>
      )}
    </>
  );
}
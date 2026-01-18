'use client';

import { useState, useEffect, useRef } from 'react';

const DIALOGUE = [
  "Hi darling...",
  "I was waiting for you.",
  "You look so cute today.",
  "I can't stop thinking about you.",
  "I made this place just for us.",
  "Don't look at anyone else.", // Transition point
  "Why are you trying to leave?",
  "I'm the only one who loves you.",
  "I can see you right now.",
  "I'll never let you go.",
  "FOREVER. AND. EVER."
];

export default function LovebombingClient() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [hearts, setHearts] = useState<{ id: number; left: number; duration: number }[]>([]);
  const [eyes, setEyes] = useState<{ id: number; top: number; left: number; scale: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const intensity = currentLine / DIALOGUE.length;
  const isScary = currentLine > 5;

  // 1. START & FULLSCREEN PRIMING
  const startExperience = () => {
    setHasStarted(true);
    // Request fullscreen immediately on click to satisfy browser security
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => {
        console.log("Fullscreen blocked or failed");
      });
    }
  };

  // 2. AUTOMATIC FULLSCREEN RE-TRIGGER (If they exited)
  useEffect(() => {
    if (isScary && document.fullscreenElement === null) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    }
  }, [isScary]);

  // 3. TYPING LOGIC
  useEffect(() => {
    if (!hasStarted || currentLine >= DIALOGUE.length) return;
    let charIndex = 0;
    const currentStr = DIALOGUE[currentLine];
    
    const interval = setInterval(() => {
      setDisplayedText(currentStr.slice(0, charIndex + 1));
      charIndex++;
      if (charIndex === currentStr.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDisplayedText("");
          setCurrentLine((prev) => prev + 1);
        }, 1500 + (intensity * 500));
      }
    }, 70 - (intensity * 40));

    return () => clearInterval(interval);
  }, [currentLine, hasStarted, intensity]);

  // 4. EYES SPAWNING
  useEffect(() => {
    if (!isScary || !hasStarted) return;
    const eyeTimer = setInterval(() => {
      setEyes((prev) => [
        ...prev,
        {
          id: Date.now(),
          top: Math.random() * 90,
          left: Math.random() * 90,
          scale: 0.5 + Math.random() * 1.2,
        }
      ].slice(-20));
    }, 1500 / (currentLine - 4));
    return () => clearInterval(eyeTimer);
  }, [isScary, currentLine, hasStarted]);

  // 5. HEART RAIN
  useEffect(() => {
    if (!hasStarted) return;
    const heartTimer = setInterval(() => {
      setHearts((prev) => [
        ...prev.slice(-15),
        { id: Date.now(), left: Math.random() * 100, duration: 3 + Math.random() * 3 },
      ]);
    }, 600);
    return () => clearInterval(heartTimer);
  }, [hasStarted]);

  const injectStyles = `
    @keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0); } }
    @keyframes fall { 0% { transform: translateY(-10vh); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(110vh); opacity: 0; } }
    @keyframes text-glitch {
      0% { transform: translate(0); text-shadow: none; }
      20% { transform: translate(-3px, 3px); text-shadow: 2px 0 #ff007f; }
      40% { transform: translate(-3px, -3px); text-shadow: -2px 0 #ff0000; }
      100% { transform: translate(0); }
    }
    .yandere-eye {
      width: 70px; height: 35px; background: #fff; border-radius: 50%;
      position: relative; overflow: hidden; animation: blink 3s infinite;
      box-shadow: 0 0 20px rgba(255, 0, 127, 0.6);
    }
    .yandere-eye::after {
      content: ''; position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%); width: 22px; height: 22px;
      background: radial-gradient(circle, #ff007f 0%, #220005 80%); border-radius: 50%;
    }
    .scary-text { animation: text-glitch 0.15s infinite; }
  `;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center transition-colors duration-1000"
      style={{ backgroundColor: isScary ? `rgb(${40 + intensity * 60}, 0, 15)` : '#120008' }}
    >
      <style dangerouslySetInnerHTML={{ __html: injectStyles }} />

      {!hasStarted && (
        <div className="z-[100] flex flex-col items-center gap-6">
          <button 
            onClick={startExperience}
            className="px-10 py-4 border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black transition-all font-bold tracking-[0.3em] uppercase animate-pulse"
          >
            Accept Her Love
          </button>
        </div>
      )}

      {hasStarted && (
        <>
          {/* VIGNETTE */}
          <div className="absolute inset-0 pointer-events-none z-50"
               style={{ background: `radial-gradient(circle, transparent 30%, rgba(0,0,0,${0.4 + intensity * 0.5}) 100%)` }} />

          {/* EYES */}
          {eyes.map(eye => (
            <div key={eye.id} className="absolute z-10 animate-pulse"
                 style={{ top: `${eye.top}%`, left: `${eye.left}%`, transform: `scale(${eye.scale})` }}>
              <div className="yandere-eye" />
            </div>
          ))}

          {/* HEARTS */}
          {hearts.map(h => (
            <div key={h.id} className="absolute select-none pointer-events-none"
                 style={{ 
                   left: `${h.left}%`, 
                   animation: `fall ${h.duration}s linear forwards`,
                   color: isScary ? '#ff0044' : '#ff99cc',
                   fontSize: '24px'
                 }}>
              ❤
            </div>
          ))}

          {/* CONTENT */}
          <div className="relative z-40 text-center px-4 max-w-2xl">
            <h1 className={`text-4xl md:text-7xl font-bold transition-all duration-200
              ${isScary ? 'text-red-500 scary-text' : 'text-pink-400 drop-shadow-[0_0_10px_rgba(255,100,200,0.8)]'}
            `}
            style={{ fontFamily: isScary ? 'monospace' : 'serif' }}>
              {displayedText}
              <span className="animate-pulse ml-1">_</span>
            </h1>
          </div>

          {/* CRT PINK LINES */}
          <div className="absolute inset-0 pointer-events-none z-30 opacity-10 bg-[linear-gradient(rgba(255,0,127,1)_1px,transparent_1px)] bg-[length:100%_3px]" />
        </>
      )}
    </div>
  );
}
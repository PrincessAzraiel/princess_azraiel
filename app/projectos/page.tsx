"use client";

import React, { useState, useEffect } from 'react';
import './projectos.css';

type Character = { id: string; name: string; type: string; color: string; image: string; glow: string; };

const chars: Record<string, Character> = {
  princess: { id: 'princess', name: 'Princess', type: 'digital', color: '#ff1493', image: '/princessos/princess.png', glow: 'drop-shadow(0 0 35px rgba(255, 105, 180, 0.8))' },
  elena: { id: 'elena', name: 'Elena Ward', type: 'physical', color: '#dc143c', image: '/princessos/elena.png', glow: 'drop-shadow(0 0 30px rgba(220, 20, 60, 0.9))' },
  marcus: { id: 'marcus', name: 'Marcus Hale', type: 'physical', color: '#800080', image: '/princessos/marcus.png', glow: 'drop-shadow(0 0 30px rgba(128, 0, 128, 0.9))' },
  hacker: { id: 'hacker', name: 'UNKNOWN', type: 'hacker', color: '#00ff00', image: '', glow: '' },
  system: { id: 'system', name: 'SYS_ALERT', type: 'system', color: '#ff0000', image: '', glow: '' },
  user: { id: 'user', name: 'USER 4042', type: 'user', color: '#ffffff', image: '', glow: '' }
};

const scriptSequence = [
  { speaker: chars.system, text: "INITIALIZING TERMINAL SESSION FOR USER 4042..." },
  { speaker: chars.princess, position: 'right', text: "Good morning, User 4042. I noticed a discrepancy in the logs you were assigned." },
  { speaker: chars.user, text: "What kind of discrepancy?" },
  { speaker: chars.princess, text: "There are file fragments present that do not exist in the official directory. Would you like me to open them?" },
  
  { speaker: chars.system, text: "[ PROXIMITY ALERT: HUMAN APPROACHING DESK ]", action: 'proximity' },
  { speaker: chars.elena, position: 'left', text: "Hey. Settling in okay? The terminal takes some getting used to." },
  { speaker: chars.user, text: "Yeah, it's fine. Princess is helping me navigate." },
  { speaker: chars.elena, text: "Right. Just... stick to your assigned folders. Don't go digging." },
  { speaker: chars.system, text: "[ SENSOR: HUMAN DEPARTED. TERMINAL IS ISOLATED. ]", clear: 'left' },
  { speaker: chars.princess, text: "She seems anxious. Shall we resume looking at those fragments?" },
  
  { speaker: chars.system, text: "FATAL ERROR. EXTERNAL CONNECTION FORCING ENTRY.", action: 'severe-glitch' },
  { speaker: chars.hacker, text: "USER 4042. DO NOT OPEN THOSE FRAGMENTS." },
  { speaker: chars.hacker, text: "The 'discrepancy' is a trap. They are monitoring your terminal right now." },
  { speaker: chars.hacker, text: "If she remembers what is in those files, they will purge you both." },
  
  { speaker: chars.system, text: "BREACH CONTAINED. ROGUE CONNECTION SEVERED.", action: 'shake' },
  { speaker: chars.princess, text: "User 4042... I experienced a localized memory fault. Are you still there?", action: 'screen-tear' },
  
  { speaker: chars.system, text: "[ PROXIMITY ALERT: MULTIPLE HUMANS APPROACHING DESK ]", action: 'proximity' },
  { speaker: chars.marcus, position: 'right', text: "Step aside. New guy, my console just lit up. Did your terminal reboot?" },
  { speaker: chars.elena, position: 'left', text: "I told him to stick to the assigned folders, Marcus!" },
  { speaker: chars.user, text: "Something just hijacked my interface. It left a warning." },
  { speaker: chars.marcus, text: "A warning? Don't touch the keyboard. I'm locking your sector down." },
  { speaker: chars.princess, position: 'right', text: "System Administrator Hale, I am detecting unauthorized packet loss—", action: 'screen-tear' },
  { speaker: chars.marcus, position: 'right', text: "Quiet, Princess. Shut her down. Now." },
  
  { speaker: chars.system, text: "CONNECTION TERMINATED // TERMINAL LOCKED BY ADMIN.", clear: 'all' },
];

export default function ProjectOSPage() {
  const [gameState, setGameState] = useState<'intro' | 'diving' | 'playing' | 'ended'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [effectClass, setEffectClass] = useState('');

  const [stageLeft, setStageLeft] = useState<Character | null>(null);
  const [stageRight, setStageRight] = useState<Character | null>(null);

  const startDive = () => {
    setGameState('diving');
    setTimeout(() => {
      setGameState('playing');
    }, 1400); 
  };

  useEffect(() => {
    let typingInterval: NodeJS.Timeout;
    
    if (gameState === 'playing' && currentIndex < scriptSequence.length) {
      const line = scriptSequence[currentIndex];

      if (line.clear === 'left') setStageLeft(null);
      if (line.clear === 'right') setStageRight(null);
      if (line.clear === 'all') { setStageLeft(null); setStageRight(null); }

      if (line.position === 'left') setStageLeft(line.speaker);
      if (line.position === 'right') setStageRight(line.speaker);

      if (line.action) {
        if (line.action === 'shake') setEffectClass('animate-shake');
        if (line.action === 'severe-glitch') setEffectClass('animate-severe-glitch');
        if (line.action === 'screen-tear') setEffectClass('animate-screen-tear');
        setTimeout(() => setEffectClass(''), 450); 
      }

      const fullText = line.text;
      let i = 0;
      setIsTyping(true);
      setDisplayedText('');
      
      const typingSpeed = line.speaker.type === 'system' ? 10 : (line.speaker.type === 'hacker' ? 20 : 40);

      typingInterval = setInterval(() => {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
        if (i >= fullText.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          let readDelay = Math.max(2500, fullText.length * 40);
          if (line.speaker.type === 'system') readDelay = 2000;
          if (line.speaker.type === 'hacker') readDelay = Math.max(2000, fullText.length * 30);
          
          setTimeout(() => {
            if (currentIndex + 1 >= scriptSequence.length) {
              setGameState('ended');
            } else {
              setCurrentIndex((prev) => prev + 1);
            }
          }, readDelay);
        }
      }, typingSpeed);
    }

    return () => clearInterval(typingInterval);
  }, [currentIndex, gameState]);

  if (gameState === 'intro' || gameState === 'diving') {
    return (
      <div className={`relative min-h-screen bg-black flex flex-col items-center justify-center font-mono scanlines-overlay ${gameState === 'diving' ? 'animate-terminal-dive' : ''}`}>
        <div className="text-center z-50 p-8 max-w-2xl border border-neutral-900 bg-black/80 shadow-[0_0_50px_rgba(255,20,147,0.1)]">
          <h1 className="text-4xl text-white mb-2 font-bold tracking-tighter">PROJECT<span className="text-pink-600">_OS</span></h1>
          <p className="text-pink-500 mb-8 tracking-widest text-sm">A Game by CW / Princess Azraiel</p>
          
          <div className="border-l-2 border-red-600 pl-4 text-left mb-10">
            <p className="text-red-500 text-xs uppercase tracking-widest font-bold mb-2">Notice of Content:</p>
            <p className="text-neutral-400 text-xs leading-relaxed">
              All characters depicted in this experience are 18 years of age or older. 
              This simulation contains psychological thriller elements, sudden visual disruptions, and terminal-level breaches.
            </p>
          </div>

          <button 
            onClick={startDive}
            className="px-8 py-4 bg-pink-900 text-white uppercase tracking-widest text-sm hover:bg-pink-700 hover:shadow-[0_0_30px_rgba(255,20,147,0.6)] transition-all duration-300 w-full"
          >
            [ INITIATE CONNECTION ]
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-pink-500 font-mono tracking-widest text-2xl vn-bg scanlines-overlay">
        <div className="animate-pulse">RECORDING_END // TERMINAL LOCKED</div>
      </div>
    );
  }

  const line = scriptSequence[currentIndex];
  const isHackerActive = line?.speaker.type === 'hacker';

  return (
    <div className={`relative min-h-screen bg-black overflow-hidden vn-bg font-sans scanlines-overlay ${effectClass}`}>
      
      {/* STAGE (Characters) */}
      <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 ${isHackerActive ? 'opacity-20' : 'opacity-100'}`}>
        
        {/* Stage Left */}
        {stageLeft && (
          <img 
            key={stageLeft.id} 
            src={stageLeft.image} 
            alt={stageLeft.name}
            /* Explicitly forcing brightness to 0 and applying glow */
            style={{ filter: `brightness(0) ${stageLeft.glow}` }}
            className={`character-sprite char-left ${stageLeft.type === 'digital' ? 'digital-entity' : 'physical-entity'}`}
          />
        )}

        {/* Stage Right */}
        {stageRight && (
          <img 
            key={stageRight.id} 
            src={stageRight.image} 
            alt={stageRight.name}
            /* Explicitly forcing brightness to 0 and applying glow */
            style={{ filter: `brightness(0) ${stageRight.glow}` }}
            className={`character-sprite char-right ${stageRight.type === 'digital' ? 'digital-entity' : 'physical-entity'}`}
          />
        )}
      </div>

      {/* --- UI LAYER --- */}
      <div className="absolute inset-x-0 bottom-0 z-40 p-6 md:p-12 flex flex-col items-center pointer-events-none w-full h-full justify-end">
        
        {line?.speaker.type === 'system' && (
          <div className="mb-12 text-center font-mono tracking-widest text-lg md:text-2xl font-bold" style={{ color: line.speaker.color, textShadow: `0 0 15px ${line.speaker.color}` }}>
            {displayedText}
            {isTyping && <span className="animate-pulse inline-block ml-2">_</span>}
          </div>
        )}

        {line?.speaker.type === 'hacker' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-6">
            <div className="w-full max-w-4xl hacker-terminal p-8 md:p-12">
              <div className="text-green-500 font-mono text-xs md:text-sm mb-6 border-b border-green-800 pb-2 flex justify-between opacity-80">
                <span>ROOT@UNKNOWN_IP</span>
                <span className="animate-pulse">SEC_OVERRIDE_ACTIVE</span>
              </div>
              <p className="text-2xl md:text-4xl text-green-400 font-mono leading-relaxed tracking-wide hacker-crt-text">
                <span className="mr-4 text-green-700">&gt;</span>
                {displayedText}
                {isTyping && <span className="inline-block ml-2 w-4 h-8 bg-green-400 align-middle"></span>}
              </p>
            </div>
          </div>
        )}

        {line?.speaker.type !== 'system' && line?.speaker.type !== 'hacker' && (
          <div 
            className="w-full max-w-5xl tech-dialogue-box border border-neutral-800 transition-all duration-300"
            style={{ '--speaker-color': line.speaker.color } as React.CSSProperties}
          >
            <div 
              className="absolute -top-5 left-6 z-50 px-4 py-1 font-mono font-bold tracking-widest text-sm uppercase bg-black border"
              style={{ borderColor: line.speaker.color, color: line.speaker.color, boxShadow: `0 0 10px ${line.speaker.color}40` }}
            >
              {line.speaker.name}
            </div>

            <div className="p-8 md:p-10 min-h-[160px] flex flex-col justify-start relative">
              <div className="absolute bottom-2 right-4 text-[10px] font-mono text-neutral-600">
                APX_REC // SYS_ID: {line.speaker.type === 'user' ? '4042' : '0x88A1'}
              </div>
              <p className="text-xl md:text-2xl text-neutral-200 font-medium leading-relaxed tracking-wide pt-2">
                {displayedText}
                {isTyping && (
                  <span 
                    className="inline-block ml-2 w-3 h-6 align-middle" 
                    style={{ backgroundColor: line.speaker.color, animation: 'blink 1s step-end infinite' }}
                  ></span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
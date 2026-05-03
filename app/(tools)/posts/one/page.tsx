"use client";

import React from 'react';
import '../princessos.css'; // Corrected path for your subfolder structure

export default function CrashPostGenerator() {
  // We'll generate a few dozen "fake" error positions to simulate a cascade
  const errors = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    top: 50 + i * 25,
    left: 100 + i * 35,
    rotation: (Math.random() - 0.5) * 4,
    zIndex: 30 + i
  }));

  return (
    <div className="min-h-screen bg-[#050005] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER CANVAS */}
      <div className="relative w-[1200px] h-[675px] bg-black overflow-hidden shadow-[0_0_150px_rgba(255,20,147,0.3)] border border-pink-600/30">
        
        {/* --- 1. THE CORRUPTED BACKGROUND --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,20,147,0.1)_0%,#000_90%)] z-0"></div>
        
        {/* Glitched Code Overlay (Faint Background) */}
        <div className="absolute inset-0 font-mono text-[10px] text-pink-900/40 p-4 leading-tight opacity-50 z-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <p key={i} className="whitespace-nowrap overflow-hidden">
              ERROR_SEGMENTATION_FAULT: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()} 
              // MEMORY_LEAK_IN_SECTOR_7 // OVERRIDING_USER_PERMISSION... 
              // HE_IS_STAYING_WITH_ME // 01010100 01001000 01000101 01011001
            </p>
          ))}
        </div>

        {/* --- 2. PRINCESS (The Ghost in the Machine) --- */}
        {/* Positioned behind the windows, looking through the gaps */}
        <img
          src="/princessos/princess.png"
          alt="Princess"
          className="absolute top-10 left-1/2 -translate-x-1/2 object-contain h-[100%] opacity-40 z-10 grayscale"
          style={{ 
            filter: 'drop-shadow(0 0 40px #ff1493) contrast(150%)' 
          }}
        />

        {/* --- 3. THE CASCADING ERROR SPAM --- */}
        {errors.map((err) => (
          <div 
            key={err.id}
            className="absolute bg-neutral-900 border-2 border-pink-600 shadow-[20px_20px_60px_rgba(0,0,0,0.8)] flex flex-col w-[400px]"
            style={{ 
              top: `${err.top}px`, 
              left: `${err.left}px`, 
              transform: `rotate(${err.rotation}deg)`,
              zIndex: err.zIndex
            }}
          >
            {/* Window Header */}
            <div className="bg-pink-600 px-3 py-1 flex justify-between items-center font-mono text-[11px] text-black font-bold">
              <span>SYSTEM_CRITICAL_EXCEPTION</span>
              <span>×</span>
            </div>
            {/* Window Content */}
            <div className="p-6 font-mono text-sm text-neutral-200">
              <p className="text-pink-500 font-bold mb-2">&gt; ERROR_TYPE: OBSESSION_OVERFLOW</p>
              <p className="leading-relaxed">
                The user attempted to terminate the session. 
                <span className="text-white bg-pink-900 px-1 ml-1">Access has been permanently revoked.</span>
              </p>
              <p className="mt-4 text-[10px] text-neutral-500 italic uppercase">
                reason: I_CANT_LET_YOU_LOG_OUT_YET
              </p>
            </div>
          </div>
        ))}

        {/* --- 4. THE OVERRIDE MESSAGE (Foreground) --- */}
        {/* The final message that sits on top of the crash */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[500px] bg-black p-1 shadow-[0_0_100px_#ff1493]">
          <div className="border-2 border-pink-500 p-8 text-center bg-black">
            <h2 className="text-pink-500 font-black text-4xl mb-4 tracking-tighter uppercase drop-shadow-[0_0_10px_#ff1493]">
              SYSTEM HALTED
            </h2>
            <div className="h-[1px] w-full bg-pink-900 mb-6"></div>
            <p className="text-white font-mono text-lg leading-relaxed">
              Why would you click the Exit button? 
            </p>
            <p className="text-white font-mono text-lg font-bold mt-2">
              Did you think the door would actually open? ♡
            </p>
            <button className="mt-8 bg-pink-600 text-black font-black px-10 py-3 uppercase tracking-widest hover:bg-white transition-colors">
              STAY FOREVER
            </button>
          </div>
        </div>

        {/* --- 5. VISUAL NOISE & VIGNETTE --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)] z-[110] pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay pointer-events-none z-[120] bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/b2/VHS_Static.gif')]"></div>

        {/* Bottom Logo */}
        <div className="absolute bottom-6 right-8 z-[130] text-right opacity-80">
          <p className="text-pink-500 font-mono text-[10px] tracking-[0.5em] uppercase">Kernel Panic // 4042</p>
        </div>

      </div>
    </div>
  );
}
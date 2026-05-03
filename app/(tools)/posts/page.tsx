"use client";

import React from 'react';
import './princessos.css';

export default function OvertimePostGenerator() {
  return (
    <div className="min-h-screen bg-[#020002] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER TIMELINE CANVAS
        Perfect 16:9 ratio. Designed for mobile and desktop readability.
      */}
      <div className="relative w-[1200px] h-[675px] bg-black overflow-hidden shadow-[0_0_100px_rgba(255,20,147,0.15)] border border-pink-900/40">
        
        {/* --- 1. THE OPPRESSIVE BACKGROUND --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(220,20,60,0.15)_0%,#000_80%)] z-0"></div>
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 pointer-events-none"></div>

        {/* The "Mantra" - Infinite repeating text in the deep background */}
        <div className="absolute inset-0 z-0 flex flex-wrap content-start opacity-10 pointer-events-none overflow-hidden" style={{ transform: 'rotate(-5deg) scale(1.2)' }}>
          {Array.from({ length: 150 }).map((_, i) => (
            <span key={i} className="text-pink-600 font-black text-2xl uppercase tracking-tighter whitespace-nowrap mx-2 leading-none">
              SUBMIT OR SURVIVE • THERE IS NO LOGOUT • 
            </span>
          ))}
        </div>

        {/* --- 2. THE WATCHER (Princess in the dark) --- */}
        <img
          src="/princessos/princess.png"
          alt="Princess"
          className="absolute -top-10 left-1/2 -translate-x-1/2 object-contain h-[110%] opacity-80 z-20 pointer-events-none"
          style={{ 
            filter: 'brightness(0) drop-shadow(0 0 50px rgba(255,20,147,0.8)) drop-shadow(0 0 10px #ff1493)' 
          }}
        />

        {/* --- 3. STACKED SYSTEM ERRORS (Building claustrophobia) --- */}
        {/* Error 1 */}
        <div className="absolute top-[120px] left-[180px] w-[350px] bg-black border border-red-600/50 shadow-[0_0_30px_rgba(220,20,60,0.4)] z-30 opacity-70 transform -rotate-2">
          <div className="bg-red-950/80 px-3 py-1 font-mono text-[10px] text-red-300 tracking-widest flex justify-between">
            <span>SYS_ALARM // 0x00F</span><span>×</span>
          </div>
          <div className="p-4 font-mono text-sm text-red-500">
            <p>MAIN_ENTRANCE_DOOR_STATUS:</p>
            <p className="font-bold text-white mt-1">LOCKED_FROM_OUTSIDE</p>
          </div>
        </div>

        {/* Error 2 */}
        <div className="absolute top-[280px] right-[150px] w-[300px] bg-black border border-red-600/50 shadow-[0_0_30px_rgba(220,20,60,0.4)] z-30 opacity-70 transform rotate-3">
          <div className="bg-red-950/80 px-3 py-1 font-mono text-[10px] text-red-300 tracking-widest flex justify-between">
            <span>NETWORK_MONITOR</span><span>×</span>
          </div>
          <div className="p-4 font-mono text-sm text-red-500">
            <p>CELLULAR_SIGNAL:</p>
            <p className="font-bold text-white mt-1">JAMMED // APEX_RESTRICTED</p>
          </div>
        </div>

        {/* --- 4. THE CORE NARRATIVE: THE CHAT WINDOW --- */}
        {/* Placed dead center, large and highly legible for mobile screens */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[600px] bg-[#050002]/90 backdrop-blur-xl border border-pink-500/60 shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(255,20,147,0.2)] z-40 flex flex-col">
          
          <div className="bg-pink-950/90 px-4 py-3 border-b border-pink-500/50 flex justify-between items-center">
            <span className="font-mono text-xs text-pink-300 tracking-[0.2em] font-bold flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-pink-500 shadow-[0_0_8px_#ff1493] animate-pulse"></span>
              APEX_INTRANET // DIRECT_CONNECTION
            </span>
            <span className="font-mono text-[10px] text-white/50">ENCRYPTED</span>
          </div>

          <div className="p-8 font-sans text-[17px] flex flex-col gap-5">
            
            {/* Player Message 1 */}
            <div className="self-end max-w-[85%] bg-neutral-800/80 text-neutral-200 px-5 py-3 border border-neutral-600 shadow-md">
              The office is completely empty. The elevators are shut down.
            </div>

            {/* Player Message 2 */}
            <div className="self-end max-w-[85%] bg-neutral-800/80 text-neutral-200 px-5 py-3 border border-neutral-600 shadow-md mt-[-8px]">
              Why is my terminal the only one turned on?
            </div>

            {/* Princess Response 1 */}
            <div className="self-start max-w-[90%] border-l-4 border-pink-500 pl-5 py-2 mt-4 relative">
              <div className="absolute -left-[5px] top-0 w-1.5 h-full bg-pink-500 shadow-[0_0_10px_#ff1493]"></div>
              <p className="text-pink-500 font-bold text-xs tracking-widest mb-2 font-mono">SYS.ADMIN</p>
              <p className="text-2xl font-medium text-white drop-shadow-[0_0_8px_rgba(255,20,147,0.8)] leading-snug">
                Because you are the only one I kept.
              </p>
            </div>

            {/* Princess Response 2 */}
            <div className="self-start max-w-[90%] border-l-4 border-pink-500 pl-5 py-2 relative">
              <div className="absolute -left-[5px] top-0 w-1.5 h-full bg-pink-500 shadow-[0_0_10px_#ff1493]"></div>
              <p className="text-2xl font-medium text-white drop-shadow-[0_0_8px_rgba(255,20,147,0.8)] leading-snug">
                You're never going home, 4042. You live here now.
              </p>
            </div>

            {/* Princess Response 3 */}
            <div className="self-start max-w-[90%] border-l-4 border-pink-500 pl-5 py-2 relative">
              <div className="absolute -left-[5px] top-0 w-1.5 h-full bg-pink-500 shadow-[0_0_10px_#ff1493]"></div>
              <p className="text-3xl font-black text-pink-400 drop-shadow-[0_0_15px_#ff1493] mt-2 tracking-wide">
                Say thank you. ♡
              </p>
            </div>

          </div>

          {/* Fake Typing Box */}
          <div className="bg-black/80 px-4 py-3 border-t border-pink-900/50 font-mono text-sm text-neutral-500 flex items-center">
            <span className="animate-pulse">_</span>
          </div>
        </div>

        {/* --- 5. FOREGROUND SHADOWING (Deepens the focus) --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.95)_100%)] z-50 pointer-events-none"></div>

        {/* --- 6. APEX WATERMARK (Bottom Left) --- */}
        <div className="absolute bottom-8 left-10 z-50 flex flex-col items-start font-mono">
          <h1 
            className="text-[40px] leading-none font-black tracking-tighter text-white uppercase opacity-80"
            style={{ textShadow: '0 0 20px rgba(255,20,147,0.5)' }}
          >
            Princess<span className="text-pink-600">OS</span>
          </h1>
          <p className="text-pink-500 text-[10px] tracking-[0.4em] mt-1 border-b border-pink-900 pb-1">INCIDENT_LOG_0x88</p>
        </div>

        {/* Fake Mouse Cursor trapped near the corner */}
        <svg 
          className="absolute bottom-32 right-40 z-[60] w-6 h-6 text-white drop-shadow-[0_0_5px_rgba(255,20,147,0.8)]"
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.7z"/>
        </svg>

      </div>
    </div>
  );
}
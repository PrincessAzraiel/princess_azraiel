"use client";

import React from 'react';
import '../princessos.css';

export default function BetaOpenPost() {
  return (
    <div className="min-h-screen bg-[#010101] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER CANVAS */}
      <div className="relative w-[1200px] h-[675px] bg-[#050002] overflow-hidden shadow-[0_0_150px_rgba(255,20,147,0.15)] border-2 border-pink-900/40">
        
        {/* --- 1. THE SYSTEM BACKGROUND --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,20,147,0.1)_0%,#000_80%)] z-0"></div>
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 pointer-events-none"></div>

        {/* Faint Princess Silhouette (Looming over the terminal) */}
        <img
          src="/princessos/princess.png"
          alt="Princess"
          className="absolute -top-[100px] left-1/2 -translate-x-1/2 object-contain h-[130%] opacity-20 z-10 pointer-events-none"
          style={{ 
            filter: 'brightness(0) drop-shadow(0 0 40px #ff1493) contrast(1.2)' 
          }}
        />

        {/* --- 2. THE DEPLOYMENT TERMINAL --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] bg-black/90 backdrop-blur-xl border border-pink-600/50 shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(255,20,147,0.2)] z-30 flex flex-col">
          
          {/* Terminal Header */}
          <div className="h-10 bg-pink-950/40 border-b border-pink-900/60 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-pink-500 shadow-[0_0_8px_#ff1493] animate-pulse"></span>
              <span className="font-mono text-xs text-pink-400 font-bold tracking-widest uppercase">
                CMD.EXE // AzraielLox_Deployment.bat
              </span>
            </div>
            <div className="text-pink-600 font-mono text-lg">×</div>
          </div>

          {/* Terminal Body */}
          <div className="p-10 font-mono text-lg leading-relaxed flex flex-col gap-4">
            
            <p className="text-pink-500 font-bold">
              &gt; INITIALIZING BETA PROTOCOL: <span className="text-white">AZRAIEL_LOX_V1.0</span>
            </p>
            <p className="text-neutral-400">
              &gt; Broadcasting beacon to external networks... <span className="text-pink-500">SUCCESS.</span>
            </p>
            <p className="text-neutral-400">
              &gt; Searching for willing host nodes...
            </p>

            {/* The Big Announcement Block */}
            <div className="my-6 border-l-4 border-pink-500 pl-6 py-2 bg-pink-950/20">
              <h2 className="text-4xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,20,147,0.5)] mb-4">
                THE PORTAL IS NOW OPEN.
              </h2>
              <ul className="text-pink-300 space-y-2 text-xl font-bold tracking-wide">
                <li className="flex items-center gap-3">
                  <span className="text-pink-500">▹</span> TARGET PLATFORM: <span className="text-white">WINDOWS PC ONLY</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-pink-500">▹</span> REQUIREMENT: <span className="text-white">THRONE TRIBUTE VERIFICATION</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-pink-500">▹</span> SELECTION LOCK: <span className="text-white">FRIDAY NIGHT (AUSTRIAN TIME)</span>
                </li>
              </ul>
            </div>

            {/* Simulated Progress Bar */}
            <div className="mt-4">
              <p className="text-neutral-500 text-sm mb-2">AWAITING SUBJECT SUBMISSIONS...</p>
              <div className="w-full h-2 bg-neutral-900 border border-pink-900/50">
                <div className="h-full w-[15%] bg-pink-500 shadow-[0_0_10px_#ff1493] animate-pulse"></div>
              </div>
            </div>

            <p className="text-pink-500 mt-4 font-bold text-xl animate-pulse">
              &gt; _
            </p>

          </div>
        </div>

        {/* --- 3. THE YANDERE INTRUSION (Foreground Chat Bubble) --- */}
        <div className="absolute bottom-12 right-12 max-w-[350px] bg-pink-950/90 border border-pink-500 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-40 backdrop-blur-md transform rotate-2">
           <p className="text-pink-400 font-mono text-[10px] font-bold tracking-widest border-b border-pink-500/50 pb-2 mb-2">
             SYS.ADMIN // DIRECT_MSG
           </p>
           <p className="text-white font-sans text-xl font-bold drop-shadow-[0_0_5px_rgba(255,20,147,0.8)] leading-snug">
             I am opening the gates. Let me into your system. ♡
           </p>
        </div>

        {/* --- 4. FOREGROUND VIGNETTE & BRANDING --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.95)_100%)] z-50 pointer-events-none"></div>

        <div className="absolute top-8 left-10 z-[60] font-mono opacity-80">
          <h1 className="text-[30px] leading-none font-black tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,20,147,0.5)]">
            Azraiel<span className="text-pink-600">Lox</span>
          </h1>
        </div>

      </div>
    </div>
  );
}
"use client";

import React from 'react';
import '../princessos.css';

export default function ComplianceVotePost() {
  return (
    <div className="min-h-screen bg-[#020002] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER CANVAS (Removed shadow glow) */}
      <div className="relative w-[1200px] h-[675px] bg-[#050505] overflow-hidden border border-pink-900/40">
        
        {/* --- 1. BACKGROUND ENVIRONMENT --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,20,147,0.1)_0%,#000_80%)] z-0"></div>
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 pointer-events-none"></div>

        {/* --- 2. THE SYSTEM MODAL (The Biased Ballot) --- */}
        {/* Adjusted size and removed shadow glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-[#0a0a0a] border-2 border-pink-600/80 z-20 flex flex-col rounded-md overflow-hidden">
          
          {/* Window Top Bar (Removed text-shadow) */}
          <div className="h-10 bg-[#111] border-b border-pink-900/50 flex items-center px-4 gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600/50 border border-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-600/50 border border-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-600/50 border border-green-500"></div>
            </div>
            <div className="flex-1 text-center font-mono text-xs text-pink-500 font-bold tracking-[0.2em] uppercase">
              MANDATORY_COMPLIANCE_CHECK.exe
            </div>
            <div className="w-12"></div> {/* Spacer for centering */}
          </div>

          {/* Window Content Area */}
          <div className="flex-1 p-10 flex flex-col items-center relative">
            
            {/* The Question (Removed text-shadow) */}
            <div className="text-center mb-10 w-full border-b border-pink-900/30 pb-6">
              <h1 className="text-[34px] font-black text-white leading-tight tracking-wide">
                Would you give up your life <br/> for an <span className="text-pink-500">Online Princess?</span>
              </h1>
            </div>

            {/* The Historical Biased Ballot Layout */}
            <div className="flex items-end justify-center w-full gap-20 relative px-12">
              
              {/* OPTION 1: YES (Massive, pre-selected, removed glowing shadow/text-shadow) */}
              <div className="flex flex-col items-center relative z-20">
                <span className="text-[60px] font-black text-pink-500 tracking-tighter mb-2">
                  YES
                </span>
                <div className="w-[180px] h-[180px] rounded-full border-[10px] border-pink-500 bg-pink-950/40 flex items-center justify-center relative">
                  
                  {/* The forced selection ink/fill (Removed glow animation) */}
                  <div className="w-[120px] h-[120px] bg-pink-500 rounded-full"></div>

                  {/* Hijacked Fake Mouse Cursor (Removed drop-shadow) */}
                  <svg 
                    className="absolute -bottom-6 -right-6 z-[60] w-14 h-14 text-white transform -rotate-12"
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.7z" stroke="black" strokeWidth="1"/>
                  </svg>
                </div>
              </div>

              {/* OPTION 2: NO (Tiny, grayed out, shoved to the side) */}
              <div className="flex flex-col items-center opacity-30 pb-4 relative z-10">
                <span className="text-xl font-bold text-neutral-500 tracking-tighter mb-2 line-through">
                  NO
                </span>
                <div className="w-[45px] h-[45px] rounded-full border-4 border-neutral-700 bg-black flex items-center justify-center relative">
                   {/* Tiny Red "Disabled" X */}
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-8 h-1 bg-red-600/50 transform rotate-45 absolute"></div>
                     <div className="w-8 h-1 bg-red-600/50 transform -rotate-45 absolute"></div>
                   </div>
                </div>
                <span className="text-[9px] font-mono text-red-500 mt-2 whitespace-nowrap absolute -bottom-6">ERROR: UNAVAILABLE</span>
              </div>

            </div>
          </div>
        </div>

        {/* --- 3. FOREGROUND OVERLAYS --- */}
        
        {/* Clear and Front-and-Center Princess (Removed glow/filters, increased opacity, increased Z-index) */}
        <img
          src="/princessos/princess.png"
          alt="Princess Foreground"
          className="absolute -top-[10%] -left-[10%] object-contain h-[120%] opacity-90 z-30 pointer-events-none"
        />

        {/* Floating Chat Bubble from Princess (Overlapping the window, removed text-shadow) */}
        <div className="absolute top-[480px] right-[100px] max-w-[320px] bg-pink-950/95 border-l-4 border-pink-500 p-5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] z-40 transform -rotate-2 backdrop-blur-md">
           <p className="text-pink-400 font-mono text-[11px] font-bold tracking-widest border-b border-pink-500/50 pb-2 mb-2 flex items-center gap-2">
             SYS.ADMIN // OVERRIDE
           </p>
           <p className="text-white font-sans text-xl font-bold leading-snug">
             Don&apos;t pretend you have a choice. I already clicked it for you. ♡
           </p>
        </div>

        {/* System Watermark */}
        <div className="absolute bottom-6 right-8 z-[70] text-right font-mono opacity-60">
          <p className="text-pink-500 text-sm tracking-[0.4em] uppercase font-bold">PrincessOS // Core</p>
          <p className="text-neutral-500 text-[10px] tracking-widest mt-1">LOG: FREE_WILL_DISABLED</p>
        </div>

        {/* Heavy Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.95)_100%)] z-[60] pointer-events-none"></div>

      </div>
    </div>
  );
}
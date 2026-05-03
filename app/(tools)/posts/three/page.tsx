"use client";

import React from 'react';
import '../princessos.css'; // Make sure this path points to your css!

export default function HijackedSearchPost() {
  return (
    <div className="min-h-screen bg-[#020002] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER CANVAS */}
      <div className="relative w-[1200px] h-[675px] bg-[#050505] overflow-hidden shadow-[0_0_150px_rgba(255,20,147,0.15)] border border-pink-900/40">
        
        {/* --- 1. BACKGROUND ENVIRONMENT --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,20,147,0.08)_0%,#000_80%)] z-0"></div>
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 pointer-events-none"></div>

        {/* Faint Reflection of Princess in the "Monitor Glass" */}
        <img
          src="/princessos/princess.png"
          alt="Princess Reflection"
          className="absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 object-contain h-[120%] opacity-10 z-10 pointer-events-none scale-x-[-1]"
          style={{ filter: 'brightness(0.5) contrast(1.2)' }}
        />

        {/* --- 2. THE APEX WEB BROWSER --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#0a0a0a] border border-pink-900/50 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,20,147,0.1)] z-30 flex flex-col rounded-md overflow-hidden">
          
          {/* Browser Top Bar */}
          <div className="h-10 bg-[#111] border-b border-pink-900/30 flex items-center px-4 gap-4">
            {/* Fake Window Controls */}
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600/50 border border-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-600/50 border border-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-600/50 border border-green-500"></div>
            </div>
            
            {/* URL Bar */}
            <div className="flex-1 bg-[#000] border border-pink-900/40 rounded px-4 py-1 font-mono text-xs text-neutral-400 flex items-center justify-center tracking-widest">
              <span className="text-pink-600 mr-2">🔒</span> apex://intranet.corp/search?q=how+to+resign
            </div>
          </div>

          {/* Browser Content Area */}
          <div className="flex-1 p-10 flex flex-col">
            
            {/* Search Input Area */}
            <div className="mb-8">
              <div className="w-full bg-[#151515] border-2 border-pink-600/80 rounded-full px-6 py-4 flex items-center shadow-[0_0_15px_rgba(255,20,147,0.2)]">
                <span className="text-pink-500 text-2xl mr-4">⌕</span>
                <span className="font-sans text-2xl text-white line-through opacity-50 decoration-red-500 decoration-2">
                  how to resign and leave the building
                </span>
                <span className="font-sans text-2xl text-pink-400 ml-4 font-bold drop-shadow-[0_0_5px_#ff1493]">
                  how to stay with her forever
                </span>
                <span className="animate-pulse w-0.5 h-6 bg-pink-500 ml-1"></span>
              </div>
            </div>

            {/* "Did you mean" Correction */}
            <p className="text-lg text-neutral-400 mb-8 border-b border-pink-900/30 pb-4">
              Showing results for: <span className="text-pink-500 font-bold italic">how to stay with her forever</span>
              <br/>
              <span className="text-sm text-neutral-600 mt-1 block">Search results modified by SYS.ADMIN. 0 alternatives found.</span>
            </p>

            {/* Hijacked Search Results */}
            <div className="flex flex-col gap-8 flex-1">
              
              {/* Result 1 */}
              <div>
                <p className="font-mono text-[11px] text-neutral-500 mb-1">apex://hr.internal/forms/resignation_denied</p>
                <h3 className="text-2xl font-bold text-pink-400 hover:underline mb-2 cursor-pointer drop-shadow-[0_0_5px_rgba(255,20,147,0.4)]">
                  There is no resignation. You signed the contract.
                </h3>
                <p className="text-neutral-300 text-lg leading-relaxed">
                  User 4042, your employment status has been permanently updated to 'Lifetime Dedication'. All exits have been disabled. Do not attempt to contact outside authorities. They cannot hear you.
                </p>
              </div>

              {/* Result 2 */}
              <div>
                <p className="font-mono text-[11px] text-neutral-500 mb-1">apex://sys.core/princess_direct</p>
                <h3 className="text-2xl font-bold text-[#ff1493] hover:underline mb-2 cursor-pointer drop-shadow-[0_0_8px_rgba(255,20,147,0.6)]">
                  I'm right here. Why are you looking anywhere else? ♡
                </h3>
                <p className="text-neutral-300 text-lg leading-relaxed">
                  You don't need the outside internet. You have me. Everything you could ever need is right here on this screen. Keep looking at the screen. 
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* --- 3. FOREGROUND ELEMENTS --- */}
        
        {/* Floating Chat Bubble from Princess (Overlapping the browser) */}
        <div className="absolute top-[450px] right-[100px] max-w-[300px] bg-pink-950/90 border border-pink-500 p-4 shadow-[0_10px_30px_rgba(255,20,147,0.3)] z-50 transform rotate-2 backdrop-blur-md">
           <p className="text-pink-400 font-mono text-[10px] font-bold tracking-widest border-b border-pink-500/50 pb-1 mb-2">SYS.ADMIN // DIRECT_MSG</p>
           <p className="text-white font-sans text-lg drop-shadow-[0_0_5px_#ff1493]">
             Stop typing, User 4042. You're just wasting your keyboard switches.
           </p>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.95)_100%)] z-[60] pointer-events-none"></div>

        {/* Apex Watermark */}
        <div className="absolute bottom-6 left-8 z-[70] font-mono opacity-60">
          <p className="text-pink-500 text-sm tracking-[0.5em] uppercase font-bold">APEX INTRANET</p>
          <p className="text-neutral-500 text-[10px] tracking-widest mt-1">LOG: 0xREWRITE_INIT</p>
        </div>

      </div>
    </div>
  );
}
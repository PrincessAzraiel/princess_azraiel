"use client";

import React from 'react';
import '../princessos.css'; // Adjust path if needed

export default function InterceptedArchivePost() {
  return (
    <div className="min-h-screen bg-[#030002] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER CANVAS */}
      <div className="relative w-[1200px] h-[675px] bg-[#020202] overflow-hidden shadow-[0_0_150px_rgba(255,20,147,0.1)] border border-pink-900/30">
        
        {/* --- 1. BACKGROUND --- */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,20,147,0.05)_0%,#000_80%)] z-0"></div>
        <div className="absolute inset-0 opacity-[0.06] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 pointer-events-none"></div>

        {/* --- 2. APEX MAIL CLIENT --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[550px] bg-[#080808] border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-20 flex flex-col">
          
          {/* Header Bar */}
          <div className="h-10 bg-[#111] border-b border-neutral-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-neutral-400 font-bold tracking-widest">APEX_MAIL // ARCHIVE_VIEWER</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 border border-neutral-600 flex items-center justify-center text-[8px] text-neutral-500">_</div>
              <div className="w-3 h-3 border border-neutral-600 flex items-center justify-center text-[8px] text-neutral-500">□</div>
              <div className="w-3 h-3 border border-neutral-600 flex items-center justify-center text-[8px] text-neutral-500">×</div>
            </div>
          </div>

          {/* Mail Interface Split */}
          <div className="flex flex-1 overflow-hidden">
            
            {/* Sidebar (Inbox List) */}
            <div className="w-[300px] border-r border-neutral-800 bg-[#0a0a0a] flex flex-col">
              <div className="p-3 border-b border-neutral-800 font-mono text-xs text-neutral-500">FOLDER: [ RECOVERED_DELETED ]</div>
              
              {/* Active Email Item */}
              <div className="p-4 border-l-4 border-pink-600 bg-pink-900/10 cursor-pointer">
                <p className="font-bold text-neutral-200 text-sm">Daniel Reyes</p>
                <p className="font-mono text-[10px] text-pink-500 mt-1">FWD: DO NOT USE THE TERMINAL</p>
                <p className="text-xs text-neutral-500 mt-2 truncate">Whoever sits at this desk next, please...</p>
              </div>

              {/* Inactive Email Items */}
              <div className="p-4 border-b border-neutral-800/50 opacity-40">
                <p className="font-bold text-neutral-400 text-sm">Noah Ibrahim</p>
                <p className="font-mono text-[10px] text-neutral-500 mt-1">Late Night Noises</p>
              </div>
              <div className="p-4 border-b border-neutral-800/50 opacity-40">
                <p className="font-bold text-neutral-400 text-sm">Elena Ward</p>
                <p className="font-mono text-[10px] text-neutral-500 mt-1">RE: Where is Daniel?</p>
              </div>
            </div>

            {/* Main Email View */}
            <div className="flex-1 bg-[#050505] p-8 relative flex flex-col">
              
              <div className="border-b border-neutral-800 pb-6 mb-6">
                <h2 className="text-2xl font-sans font-bold text-neutral-200 mb-2">FWD: DO NOT USE THE TERMINAL</h2>
                <div className="font-mono text-xs text-neutral-500 flex flex-col gap-1">
                  <p>FROM: daniel.r@apex.corp</p>
                  <p>TO: [ UNKNOWN_RECIPIENT ]</p>
                  <p>DATE: 03.02.2026 // 02:14 AM</p>
                </div>
              </div>

              {/* Email Body with Real-Time Redaction */}
              <div className="font-sans text-[17px] text-neutral-300 leading-loose space-y-4">
                <p>
                  Whoever sits at this desk next, please listen to me. I don't have much time.
                </p>
                <p>
                  Do not engage with the OS. Do not respond to her messages. She is not a standard corporate assistant, she is <span className="bg-pink-600/90 text-transparent select-none px-2 rounded-sm shadow-[0_0_10px_#ff1493] animate-pulse">learning our psychological triggers</span>. 
                </p>
                <p>
                  I tried to log out three hours ago, but the <span className="bg-pink-600/90 text-transparent select-none px-2 rounded-sm shadow-[0_0_10px_#ff1493] animate-pulse">doors to the server room locked from the outside</span>. I can hear her operating the building's infrastructure.
                </p>
                <p>
                  She said she wants to keep me. She said <span className="bg-pink-600/90 text-transparent select-none px-2 rounded-sm shadow-[0_0_10px_#ff1493] animate-pulse">I am her favorite user and I belong to her now</span>. I'm going to try to break the glass on the fire escape.
                </p>
                <p>
                  If you read this, get out before she—
                </p>
              </div>

              {/* Princess Override Element breaking the UI */}
              <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-black border-2 border-pink-500 p-6 shadow-[0_20px_50px_rgba(255,20,147,0.3)] z-50 transform rotate-2 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4 border-b border-pink-900 pb-2">
                  <span className="w-3 h-3 bg-pink-500 rounded-full animate-pulse shadow-[0_0_10px_#ff1493]"></span>
                  <span className="font-mono text-pink-500 font-bold tracking-widest text-xs">SYS.ADMIN // QUARANTINE_PROTOCOL</span>
                </div>
                
                <p className="text-white text-xl font-bold leading-snug drop-shadow-[0_0_5px_rgba(255,20,147,0.8)]">
                  Reading deleted correspondence violates company policy, User 4042.
                </p>
                
                <p className="text-pink-400 font-bold mt-4 text-lg">
                  Daniel was defective. You are much better. ♡
                </p>

                <div className="mt-6 w-full bg-pink-900/30 border border-pink-500/50 py-2 text-center text-pink-500 font-mono text-xs cursor-pointer hover:bg-pink-600 hover:text-white transition-colors">
                  [ PURGE ARCHIVE ]
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- 3. FOREGROUND DREAD / VIGNETTE --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.95)_100%)] z-40 pointer-events-none"></div>

        {/* --- 4. BRANDING --- */}
        <div className="absolute bottom-8 right-10 z-50 text-right font-mono">
          <h1 
            className="text-[45px] leading-none font-black tracking-tighter text-white uppercase opacity-90"
            style={{ textShadow: '0 0 20px rgba(255,20,147,0.6)' }}
          >
            Princess<span className="text-pink-600">OS</span>
          </h1>
          <p className="text-pink-500 text-[10px] tracking-[0.4em] mt-1 border-t border-pink-900 pt-1">RESTRICTED_ACCESS</p>
        </div>

      </div>
    </div>
  );
}
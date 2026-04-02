"use client";

import React from 'react';
import '../princessos.css'; // Path for app/princessos/posts/four/page.tsx

export default function FlaggedQueryPost() {
  return (
    <div className="min-h-screen bg-[#010101] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER CANVAS */}
      <div className="relative w-[1200px] h-[675px] bg-[#050505] overflow-hidden shadow-[0_0_150px_rgba(255,20,147,0.1)] border border-pink-900/30">
        
        {/* --- 1. THE DESKTOP BACKGROUND --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#111_0%,#000_85%)] z-0"></div>
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 pointer-events-none"></div>

        {/* --- 2. THE DESKTOP ICONS (Using the SVGs we just implemented) --- */}
        <div className="absolute top-10 left-10 flex flex-col gap-10 z-10">
          <div className="w-[90px] text-center text-pink-600 font-semibold text-sm opacity-50">
            <svg className="mx-auto mb-2 drop-shadow-[0_0_3px_rgba(255,20,147,0.3)]" viewBox="0 0 24 24" fill="currentColor" width="42" height="42"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
            My Files
          </div>
          <div className="w-[90px] text-center text-pink-600 font-semibold text-sm opacity-50">
            <svg className="mx-auto mb-2 drop-shadow-[0_0_3px_rgba(255,20,147,0.3)]" viewBox="0 0 24 24" fill="currentColor" width="42" height="42"><path d="M20 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-8 14H6v-2h6v2zm-3.5-6L5 8.5 6.5 7l5 5-5 5L5 15.5 8.5 12z"/></svg>
            Terminal
          </div>
        </div>

        {/* --- 3. HORROR.JS MECHANIC: GHOST TEXT ON WALLPAPER --- */}
        {/* Represents the typeOnDesktop() function from src/horror.js */}
        <div className="absolute top-[150px] right-[100px] z-10 transform rotate-3 opacity-60">
           <p className="font-sans font-bold text-5xl text-pink-600 drop-shadow-[0_0_15px_#ff1493] tracking-tighter">WHY ARE YOU LOOKING FOR ME?</p>
        </div>
        <div className="absolute bottom-[100px] left-[80px] z-10 transform -rotate-2 opacity-40">
           <p className="font-sans font-bold text-4xl text-pink-600 drop-shadow-[0_0_15px_#ff1493] tracking-tighter">I AM ALREADY HERE.</p>
        </div>

        {/* --- 4. THE INTRANET / DATABASE APP --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[480px] bg-[#0a0a0a] border border-pink-700/60 shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(255,20,147,0.15)] z-30 flex flex-col">
          
          {/* Window Header */}
          <div className="h-9 bg-black border-b border-pink-700/60 flex items-center px-4 justify-between">
            <span className="font-mono text-xs text-pink-500 font-bold tracking-widest">Intranet_Database.exe</span>
            <span className="text-pink-600 text-lg cursor-pointer">×</span>
          </div>

          <div className="flex-1 p-8 flex flex-col relative overflow-hidden">
            
            {/* Search Bar */}
            <div className="mb-6 flex gap-4 items-center">
              <span className="font-mono text-pink-500 font-bold">&gt;</span>
              <div className="flex-1 bg-[#111] border border-neutral-700 px-4 py-3 font-mono text-neutral-300 text-lg">
                PrincessOS core architecture
              </div>
              <button className="bg-neutral-800 border border-neutral-600 px-6 py-3 font-mono text-neutral-400 font-bold">QUERY</button>
            </div>

            <div className="h-[1px] w-full bg-neutral-800 mb-6"></div>

            {/* Pulled directly from src/data/database.json */}
            <div className="bg-red-950/20 border-l-4 border-red-600 p-5 mb-8">
              <p className="font-mono text-red-500 font-bold text-lg mb-2">
                [!] QUERY FLAGGED [!]
              </p>
              <p className="font-mono text-red-400">
                This search term has been logged by PrincessOS.
                <br/>
                0 public records found.
              </p>
            </div>

            {/* The Yandere Override - Breaking the UI constraints */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[110%] bg-pink-950/80 backdrop-blur-sm border-y-2 border-pink-500 py-6 text-center transform -rotate-1 shadow-[0_0_40px_rgba(255,20,147,0.4)]">
               {/* Exact text from src/data/database.json */}
               <p className="font-sans font-black text-4xl text-white tracking-tight drop-shadow-[0_0_10px_#ff1493]">
                 I AM HERE. I AM ALWAYS HERE. ♡
               </p>
            </div>

          </div>
        </div>

        {/* --- 5. FOREGROUND VIGNETTE --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.95)_100%)] z-40 pointer-events-none"></div>

        {/* --- 6. BRANDING --- */}
        <div className="absolute bottom-6 right-8 z-[50] text-right font-mono opacity-80">
          <h1 className="text-[35px] leading-none font-black tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,20,147,0.5)]">
            Princess<span className="text-pink-600">OS</span>
          </h1>
          <p className="text-pink-500 text-[9px] tracking-[0.4em] mt-1 border-t border-pink-900 pt-1">DATABASE_OVERRIDE</p>
        </div>

      </div>
    </div>
  );
}
"use client";

import React from 'react';
import '../princessos.css';
export default function CoverImageGenerator() {
  return (
    <div className="min-h-screen bg-[#010101] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER / ITCH.IO COVER CANVAS */}
      <div className="relative w-[1200px] h-[675px] bg-[#050002] overflow-hidden shadow-[0_0_150px_rgba(255,20,147,0.2)] border-2 border-pink-900/50">
        
        {/* --- 1. THE DEEP BACKGROUND --- */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,20,147,0.15)_0%,#000_80%)] z-0"></div>
        <div className="absolute inset-0 opacity-[0.06] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 pointer-events-none"></div>

        {/* --- 2. AZRAIEL (The Overseer) --- */}
        {/* Updated with the new character sprite, glowing and ominous */}
        <img
          src="/guide/02_joy_smile_è∞.png"
          alt="Azraiel"
          className="absolute -top-[50px] right-[20px] object-contain h-[120%] opacity-90 z-20 pointer-events-none"
          style={{ 
            filter: 'drop-shadow(0 0 50px rgba(255,20,147,0.8)) brightness(0.8) contrast(1.1)' 
          }}
        />

        {/* Matrix/Code Rain Faint Overlay on the left */}
        <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden opacity-10 z-10 font-mono text-xs text-pink-500 leading-none break-all" style={{ writingMode: 'vertical-rl' }}>
          {Array.from({ length: 50 }).map((_, i) => (
             <span key={i} className="mr-2">01010000 01110010 01101001 01101110 01100011 01100101 01110011 01110011 // NODE_ACTIVE // OVERRIDE_INITIATED // {Math.random().toString(36).substring(7).toUpperCase()}</span>
          ))}
        </div>

        {/* --- 3. THE BRANDING & TITLE (Massive, Left-Aligned) --- */}
        <div className="absolute top-[180px] left-[80px] z-30">
          
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-pink-600 text-white font-black px-3 py-1 tracking-widest text-sm shadow-[0_0_10px_#ff1493]">SYS.ADMIN</span>
            <span className="font-mono text-pink-500 font-bold tracking-[0.3em] text-sm">TOTAL DESKTOP CONTROL</span>
          </div>

          <h1 className="text-[110px] font-black leading-none tracking-tighter uppercase font-sans drop-shadow-[0_0_20px_rgba(255,20,147,0.3)]">
            <span className="text-white">Azraiel</span><span className="text-pink-500">Lox</span>
          </h1>
          <h2 className="text-[40px] font-black tracking-tight text-white/90 mt-[-10px] font-sans">
            PC COMPANION NODE
          </h2>

          <div className="mt-8 border-l-4 border-pink-500 pl-6 py-2 max-w-[600px] bg-black/40 backdrop-blur-sm">
            <p className="text-xl text-neutral-300 font-sans leading-relaxed">
              A persistent Windows desktop companion. Where surveillance, compliance, and psychological control stay explicitly in Princess’s hands.
            </p>
          </div>

          {/* Warning Badges */}
          <div className="flex gap-4 mt-10">
            <div className="border border-red-600/50 bg-red-950/40 px-4 py-2 font-mono text-sm text-red-500 font-bold tracking-widest">
              [!] WINDOWS PC ONLY
            </div>
            <div className="border border-pink-600/50 bg-pink-950/40 px-4 py-2 font-mono text-sm text-pink-400 font-bold tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_#ff1493]"></span>
              LIVE SYNC ACTIVE
            </div>
          </div>
        </div>

        {/* --- 4. THE INVASIVE HUD ELEMENTS --- */}
        {/* Fake Target Bracket Top Right */}
        <div className="absolute top-10 right-10 w-16 h-16 border-t-4 border-r-4 border-pink-500/50 z-30"></div>
        
        {/* System Status Box */}
        <div className="absolute top-[200px] right-[100px] bg-black/80 border border-pink-900/50 p-4 font-mono z-30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md transform rotate-2">
          <p className="text-pink-500 text-xs tracking-widest mb-2 border-b border-pink-900/50 pb-1">SUBJECT_MONITOR</p>
          <ul className="text-white/80 text-sm space-y-1">
            <li>SCREENSHOTS: <span className="text-green-400">ENABLED</span></li>
            <li>FILE_ACCESS: <span className="text-green-400">ENABLED</span></li>
            <li>PROCESS_KILL: <span className="text-red-500">ADMIN REQ.</span></li>
          </ul>
        </div>

        {/* --- 5. FAKE PC TASKBAR (Grounds it as a desktop app) --- */}
        <div className="absolute bottom-0 left-0 w-full h-[45px] bg-[#0a0a0a] border-t border-neutral-800 z-40 flex items-center justify-between px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
          {/* Fake Start Button & Pinned Apps */}
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-white/10 rounded-sm hover:bg-white/20"></div>
            <div className="w-6 h-6 bg-white/10 rounded-sm"></div>
            <div className="w-6 h-6 bg-white/10 rounded-sm"></div>
          </div>
          
          {/* System Tray (AzraielLox Icon is pulsing) */}
          <div className="flex items-center gap-4 font-mono text-xs text-neutral-400">
            {/* The invasive tray icon */}
            <div className="flex items-center gap-1 bg-pink-950/40 px-2 py-1 rounded border border-pink-600/50 shadow-[0_0_10px_rgba(255,20,147,0.3)]">
               <span className="text-pink-500 animate-pulse font-bold text-lg leading-none">♡</span>
               <span className="text-pink-400 font-bold">Node Active</span>
            </div>
            <span>ENG</span>
            <span>23:59 PM</span>
          </div>
        </div>

        {/* --- 6. FOREGROUND VIGNETTE --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.95)_100%)] z-[35] pointer-events-none"></div>

      </div>
    </div>
  );
}
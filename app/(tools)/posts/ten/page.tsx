"use client";

import React from 'react';
import '../princessos.css';

export default function AppFeaturePost() {
  return (
    <div className="min-h-screen bg-[#010101] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER CANVAS */}
      <div className="relative w-[1200px] h-[675px] bg-[#050002] overflow-hidden shadow-[0_0_150px_rgba(255,20,147,0.15)] border-2 border-pink-900/40">
        
        {/* --- 1. THE DEEP BACKGROUND --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,20,147,0.1)_0%,#000_80%)] z-0"></div>
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 pointer-events-none"></div>

        {/* Faint Princess Silhouette */}
        <img
          src="/princessos/princess.png"
          alt="Princess"
          className="absolute -top-[50px] right-[50px] object-contain h-[120%] opacity-10 z-10 pointer-events-none grayscale"
          style={{ filter: 'brightness(0) drop-shadow(0 0 50px #ff1493)' }}
        />

        {/* --- 2. THE HEADER --- */}
        <div className="absolute top-10 left-12 z-30 w-[calc(100%-6rem)] flex justify-between items-end border-b-2 border-pink-600 pb-4">
          <div>
            <h1 className="text-white font-black text-5xl uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,20,147,0.4)]">
              Princess<span className="text-pink-500">_Link</span>
            </h1>
            <p className="text-pink-400 font-mono text-sm tracking-[0.4em] mt-2">
              REMOTE OVERSIGHT & COMPLIANCE APP
            </p>
          </div>
          <div className="text-right font-mono text-xs text-neutral-500 tracking-widest leading-relaxed">
            <p>PARENT_NODE: <span className="text-pink-500">ACTIVE</span></p>
            <p>CHILD_NODE: <span className="text-white">AWAITING_INSTALL</span></p>
          </div>
        </div>

        {/* --- 3. THE FEATURE MATRIX --- */}
        <div className="absolute top-[140px] left-12 w-[calc(100%-6rem)] z-30 grid grid-cols-3 gap-8">
          
          {/* COLUMN 1: System & Surveillance */}
          <div className="bg-black/60 border border-neutral-800 p-6 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <h2 className="text-white font-bold font-mono text-lg border-b border-neutral-700 pb-2 mb-4 flex items-center gap-2">
              <span className="text-pink-500">01.</span> SURVEILLANCE & SYSTEM
            </h2>
            <ul className="font-sans text-neutral-300 text-[15px] space-y-3">
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Remote & Periodic Screenshots</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> View & Kill Running Processes</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Full File Browser Access</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> File Grab, Download & Delete</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Browser History Sync</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Web Blocking & URL Forcing</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Remote Volume Control</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Tray-Based Permission Rules</li>
            </ul>
          </div>

          {/* COLUMN 2: Psychological & Interface */}
          <div className="bg-black/60 border border-neutral-800 p-6 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <h2 className="text-white font-bold font-mono text-lg border-b border-neutral-700 pb-2 mb-4 flex items-center gap-2">
              <span className="text-pink-500">02.</span> PSYCHOLOGICAL CONTROL
            </h2>
            <ul className="font-sans text-neutral-300 text-[15px] space-y-3">
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Total PC Lock Screen Mode</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Pink Tint & Ghost Tint Modes</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Ghost Cursor Hijacking</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Glitch Screen Effects</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Possession Mode Audio</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Forced PC Wallpaper Changes</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Ghost Typing Interventions</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Ghost Note Popups</li>
            </ul>
          </div>

          {/* COLUMN 3: Compliance & Interaction */}
          <div className="bg-pink-950/20 border border-pink-600/50 p-6 backdrop-blur-sm shadow-[0_10px_40px_rgba(255,20,147,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/10 transform rotate-45 translate-x-8 -translate-y-8"></div>
            <h2 className="text-pink-400 font-bold font-mono text-lg border-b border-pink-800 pb-2 mb-4 flex items-center gap-2 drop-shadow-[0_0_5px_rgba(255,20,147,0.8)]">
              <span className="text-white">03.</span> COMPLIANCE MODULES
            </h2>
            <ul className="font-sans text-white text-[15px] space-y-3 font-medium">
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Parent-Child Direct Chat</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Popup Image Messages</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Mandatory Questions & Answers</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Typeback & Reaction-Time Tasks</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Ritual Prompts</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Reward Prompts</li>
              <li className="flex items-center gap-2"><span className="text-pink-500 text-sm">▹</span> Confession Prompts</li>
            </ul>
          </div>

        </div>

        {/* --- 4. FOREGROUND VIGNETTE & STATUS --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.95)_100%)] z-40 pointer-events-none"></div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 border border-pink-500/30 bg-black/80 px-8 py-3 rounded-full backdrop-blur-md">
          <span className="w-3 h-3 bg-pink-500 rounded-full animate-pulse shadow-[0_0_10px_#ff1493]"></span>
          <span className="font-mono text-sm text-pink-400 tracking-widest uppercase">
            Development Phase: Active
          </span>
        </div>

      </div>
    </div>
  );
}
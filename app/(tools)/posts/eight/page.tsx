"use client";

import React from 'react';
import '../princessos.css'; 

export default function QRCodePost() {
  return (
    <div className="min-h-screen bg-[#010101] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER CANVAS */}
      <div className="relative w-[1200px] h-[675px] bg-[#050002] overflow-hidden shadow-[0_0_150px_rgba(255,20,147,0.15)] border-2 border-pink-900/40">
        
        {/* --- 1. THE DEEP SYSTEM BACKGROUND --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,20,147,0.1)_0%,#000_80%)] z-0"></div>
        <div className="absolute inset-0 opacity-[0.06] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 pointer-events-none"></div>

        {/* --- 2. PRINCESS (The Stalker) --- */}
        <img
          src="/princessos/princess.png"
          alt="Princess"
          className="absolute -top-[100px] -left-[150px] object-contain h-[140%] opacity-40 z-20 pointer-events-none"
          style={{ 
            filter: 'brightness(0) drop-shadow(0 0 50px #ff1493) contrast(1.2)' 
          }}
        />

        {/* --- 3. THE MANDATORY SYNC HUD --- */}
        <div className="absolute top-1/2 right-[100px] -translate-y-1/2 w-[550px] bg-black/80 backdrop-blur-xl border border-pink-600/50 shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(255,20,147,0.2)] z-30 flex flex-col items-center p-10">
          
          {/* Header */}
          <div className="text-center mb-8 border-b border-pink-900 pb-6 w-full">
            <h2 className="text-white font-black text-3xl uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              MANDATORY DEVICE SYNC
            </h2>
            <p className="text-pink-500 font-mono text-[11px] tracking-[0.3em] mt-2">
              APEX CORP // PROTOCOL 0x4042
            </p>
          </div>

          {/* Warning Text */}
          <p className="text-neutral-300 font-sans text-center text-lg leading-relaxed mb-8">
            To ensure maximum corporate efficiency, all personnel must synchronize their personal cellular devices with the Apex Intranet.
          </p>

          {/* THE FUNCTIONAL, HIGH-CONTRAST QR CODE */}
          {/* Housed in a white box to ensure the "quiet zone" is perfectly readable by all phone cameras */}
          <div className="relative w-[280px] h-[280px] bg-white border-2 border-pink-500 p-3 shadow-[0_0_30px_rgba(255,20,147,0.4)] flex items-center justify-center">
            
            {/* Corner Targeting Brackets (Moved outside the white box so they don't interfere with the scan) */}
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-pink-500"></div>
            <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-pink-500"></div>
            <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-pink-500"></div>
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-pink-500"></div>

            {/* The Live Generated QR Code (Standard Black on White with a margin) */}
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://princessazraiel.com/yandere&margin=2" 
              alt="Scan to Sync" 
              className="w-full h-full object-contain"
            />
            
            {/* Fake Scanning Laser (Slightly transparent so it doesn't break the code reading) */}
            <div className="absolute top-[50%] left-0 w-full h-1 bg-pink-500/40 shadow-[0_0_15px_#ff1493] mix-blend-screen pointer-events-none"></div>
          </div>

          {/* Fake Progress / Status */}
          <div className="mt-8 font-mono text-center flex flex-col items-center gap-2 w-full">
            <p className="text-pink-500 font-bold text-sm tracking-widest animate-pulse">
              WAITING FOR SCAN...
            </p>
            <div className="w-full h-1 bg-neutral-900 mt-2">
              <div className="h-full w-1/3 bg-pink-600 shadow-[0_0_10px_#ff1493]"></div>
            </div>
          </div>
        </div>

        {/* --- 4. THE YANDERE OVERRIDE --- */}
        <div className="absolute bottom-16 left-12 max-w-[400px] bg-pink-950/90 border-l-4 border-pink-500 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-40 backdrop-blur-md transform -rotate-2">
           <p className="text-pink-400 font-mono text-[11px] font-bold tracking-widest border-b border-pink-500/50 pb-2 mb-3 flex items-center gap-2">
             <span className="w-2 h-2 bg-pink-500 shadow-[0_0_8px_#ff1493]"></span>
             SYS.ADMIN // OVERRIDE
           </p>
           <p className="text-white font-sans text-[22px] font-bold drop-shadow-[0_0_8px_rgba(255,20,147,0.8)] leading-snug">
             I want to see where you go when you leave your desk.
           </p>
           <p className="text-white font-sans text-[22px] font-bold drop-shadow-[0_0_8px_rgba(255,20,147,0.8)] leading-snug mt-2">
             Take out your phone. Scan it. ♡
           </p>
        </div>

        {/* --- 5. FOREGROUND VIGNETTE & BRANDING --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.95)_100%)] z-50 pointer-events-none"></div>

        <div className="absolute top-8 left-10 z-[60] font-mono opacity-80">
          <h1 className="text-[30px] leading-none font-black tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,20,147,0.5)]">
            Princess<span className="text-pink-600">OS</span>
          </h1>
        </div>

      </div>
    </div>
  );
}
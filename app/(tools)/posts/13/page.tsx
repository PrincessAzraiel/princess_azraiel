"use client";

import React from 'react';
import '../princessos.css';

export default function SplitAnnouncementPost() {
  return (
    <div className="min-h-screen bg-[#010101] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER CANVAS */}
      <div className="relative w-[1200px] h-[675px] bg-[#020002] overflow-hidden shadow-[0_0_100px_rgba(236,72,153,0.15)] border border-pink-900/30">
        
        {/* --- 1. GLOBAL NOISE --- */}
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] opacity-[0.06] mix-blend-screen z-50 pointer-events-none"></div>

        {/* --- 2. AZRAIEL BACKGROUND (Right Side) --- */}
        {/* Placed behind everything. Free side overlay will mask it out on the left. */}
        <img
          src="/image_efdda6.png"
          alt="Azraiel"
          className="absolute -top-[10%] -right-[5%] object-cover h-[130%] opacity-80 z-10 pointer-events-none mix-blend-lighten"
          style={{ 
            filter: 'drop-shadow(0 0 60px #ff1493) contrast(1.3) brightness(1.1)'
          }}
        />
        {/* Dark gradient to ensure text readability on the Premium side */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/80 z-10 pointer-events-none" />

        {/* --- 3. FREE SIDE OVERLAY (Left Side) --- */}
        <div 
          className="absolute inset-0 bg-[#080808] z-20 backdrop-blur-md"
          style={{ clipPath: 'polygon(0 0, 56% 0, 42% 100%, 0 100%)' }}
        >
          {/* Inner Content Container */}
          <div className="absolute top-0 left-0 w-[45%] h-full p-14 flex flex-col justify-center">
            
            <div className="inline-block bg-neutral-900 border border-neutral-700 text-neutral-400 font-mono text-[10px] font-bold px-3 py-1 mb-6 tracking-widest w-max">
              POST-BETA NODE // RESTRICTED
            </div>

            <h2 className="text-[54px] font-black text-neutral-300 uppercase tracking-tighter leading-none mb-3">
              AzraielLox <br/><span className="text-neutral-600 text-4xl">Free</span>
            </h2>
            
            <div className="h-1 w-16 bg-neutral-800 mb-6 mt-2"></div>

            <p className="text-neutral-500 font-sans text-[17px] mb-8 leading-relaxed pr-6">
              A lightweight taste of my presence. Local ambient audio, sudden whispers, and unpredictable ghost-typing. 
            </p>

            <ul className="text-neutral-600 font-mono text-[13px] space-y-4 font-semibold tracking-wide">
              <li className="flex items-center gap-3">
                <span className="text-neutral-700">[X]</span> Local-Only Profile (No Cloud)
              </li>
              <li className="flex items-center gap-3">
                <span className="text-neutral-700">[X]</span> Ambient Whispers & Idle Audio
              </li>
              <li className="flex items-center gap-3">
                <span className="text-neutral-700">[X]</span> Periodic System Hauntings
              </li>
            </ul>
          </div>
        </div>

        {/* --- 4. PREMIUM CONTENT (Right Side) --- */}
        <div className="absolute top-0 right-0 w-[50%] h-full z-30 p-14 flex flex-col justify-center items-end text-right">
          
          <div className="bg-pink-600 text-white font-black px-4 py-1.5 mb-6 tracking-widest uppercase text-[11px] shadow-[0_0_20px_#ff1493] transform rotate-2 border border-pink-400">
            THE TRUE EXPERIENCE // €4.99
          </div>

          <h2 className="text-[64px] font-black text-white uppercase tracking-tighter leading-none mb-3 drop-shadow-[0_0_15px_rgba(255,20,147,0.5)]">
            AzraielLox <br/><span className="text-pink-500 text-[72px]">Premium</span>
          </h2>
          
          <div className="h-1 w-24 bg-pink-500 mb-6 mt-2 shadow-[0_0_15px_#ff1493]"></div>

          <p className="text-white font-sans text-[20px] font-bold mb-8 leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-[420px]">
            Total system takeover. The definitive psychological compliance tool.
          </p>

          <ul className="text-pink-100 font-mono text-[15px] space-y-5 font-bold">
            <li className="flex items-center justify-end gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              Full Surveillance & Live Chat <span className="text-pink-500 animate-pulse shadow-[0_0_8px_#ff1493]">■</span>
            </li>
            <li className="flex items-center justify-end gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              Forced Lock Screens & Glitches <span className="text-pink-500 animate-pulse shadow-[0_0_8px_#ff1493]">■</span>
            </li>
            <li className="flex items-center justify-end gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              <span className="bg-pink-950/90 px-2 py-0.5 text-pink-100 border border-pink-500/50 text-xs">THE RED ROOM</span> Takeover <span className="text-pink-500 animate-pulse shadow-[0_0_8px_#ff1493]">■</span>
            </li>
            <li className="flex items-center justify-end gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              Unskippable "You're Mine" Protocol <span className="text-pink-500 animate-pulse shadow-[0_0_8px_#ff1493]">■</span>
            </li>
          </ul>
        </div>

        {/* --- 5. SHATTERED BORDER LINE --- */}
        {/* SVG used to draw a mathematically perfect separator over the clipPath seam */}
        <svg className="absolute inset-0 w-full h-full z-40 pointer-events-none drop-shadow-[0_0_12px_rgba(255,20,147,0.8)]">
          {/* Main diagonal: 56% (672px) to 42% (504px) */}
          <line x1="672" y1="0" x2="504" y2="675" stroke="#ec4899" strokeWidth="4" />
          <line x1="672" y1="0" x2="504" y2="675" stroke="#fff" strokeWidth="1" opacity="0.9" />
          
          {/* Tech/Glitch Artifacts on the seam */}
          <line x1="588" y1="337" x2="620" y2="337" stroke="#ec4899" strokeWidth="3" />
          <line x1="610" y1="200" x2="635" y2="200" stroke="#ec4899" strokeWidth="2" />
          <line x1="525" y1="550" x2="555" y2="550" stroke="#ec4899" strokeWidth="2" />
        </svg>

        {/* --- 6. FOREGROUND VIGNETTE --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)] z-40 pointer-events-none"></div>

      </div>
    </div>
  );
}
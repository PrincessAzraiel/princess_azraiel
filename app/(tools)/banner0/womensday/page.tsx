"use client";

import React from 'react';
import '../princessos.css';

// The Classified Dossier v3 - Fixed Squashing, Adjusted X spacing, Toned down glows
const apexWomen = [
  // Flanks (Pulled inward from 12/88 to 16/84 to prevent any edge clipping)
  { id: 'rina', src: '/princessos/rina.png', color: '#4169e1', name: 'RINA', role: 'DATA_OPS', clearance: 'LVL_1', x: 16, scale: 0.85, z: 10 },
  { id: 'vivi', src: '/princessos/vivi.png', color: '#c71585', name: 'VIVI', role: 'SYS_DEV', clearance: 'LVL_4', x: 84, scale: 0.85, z: 10 },
  
  // Mid-guard
  { id: 'elena', src: '/princessos/elena.png', color: '#dc143c', name: 'ELENA', role: 'HR_DIR', clearance: 'LVL_2', x: 33, scale: 0.95, z: 30 },
  { id: 'sophia', src: '/princessos/sophia.png', color: '#ff4500', name: 'SOPHIA', role: 'COMMS', clearance: 'LVL_3', x: 67, scale: 0.95, z: 30 },
  
  // The Core (Front and Center)
  { id: 'princess', src: '/princessos/princess.png', color: '#ff1493', name: 'PRINCESS', role: 'SYS_CORE', clearance: 'OVRD', x: 50, scale: 1.15, z: 50 }, 
];

export default function ApexWomenBanner() {
  return (
    <div className="min-h-screen bg-[#030002] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x630 THE CLASSIFIED DOSSIER */}
      <div className="relative w-[1200px] h-[630px] bg-black overflow-hidden shadow-[0_0_120px_rgba(255,20,147,0.2)] border border-pink-900/60">
        
        {/* --- 1. CORE INFRASTRUCTURE (Background) --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,20,147,0.15)_0%,#000_80%)] z-0"></div>
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-0 pointer-events-none"></div>
        
        {/* Horizontal Backlight to make Frosted Glass Pop */}
        <div className="absolute top-1/2 left-0 w-full h-[250px] -translate-y-1/2 bg-gradient-to-b from-transparent via-white/5 to-transparent z-0 pointer-events-none"></div>

        {/* Tech Grid */}
        <div className="absolute inset-0 z-0 opacity-20 mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)] [webkit-mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" style={{ backgroundImage: 'linear-gradient(rgba(255,20,147,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,20,147,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        {/* --- 2. THE DOSSIER CARDS (Characters + Glass) --- */}
        {apexWomen.map((woman) => (
          <div 
            key={woman.id}
            className="absolute top-0 h-full flex flex-col items-center justify-end pb-12"
            style={{ 
              left: `${woman.x}%`, 
              transform: 'translateX(-50%)',
              zIndex: woman.z 
            }}
          >
            {/* Frosted Glass Containment Panel */}
            <div 
              className="absolute bottom-20 w-[200px] h-[75%] border backdrop-blur-md opacity-100 pointer-events-none flex flex-col justify-between p-4"
              style={{ 
                borderColor: `${woman.color}60`,
                background: `linear-gradient(to bottom, rgba(255,255,255,0.02) 0%, ${woman.color}15 100%)`,
                boxShadow: `inset 0 0 30px ${woman.color}20, 0 10px 30px rgba(0,0,0,0.8)`
              }}
            >
              {/* Card Header Data */}
              <div className="w-full flex justify-between font-mono text-[9px] text-white opacity-70">
                <span style={{ color: woman.color }} className="font-bold">{woman.clearance}</span>
                <span>ID: {Math.floor(Math.random() * 899) + 100}</span>
              </div>
              
              {/* Fake SVG Barcode */}
              <div className="w-full h-8 opacity-60 mb-8 flex justify-center">
                 <svg width="100%" height="100%" preserveAspectRatio="none">
                    {Array.from({length: 15}).map((_, i) => (
                      <rect key={i} x={`${i * 6.5}%`} y="0" width={Math.random() * 3 + 1} height="100%" fill={woman.color} />
                    ))}
                 </svg>
              </div>
            </div>

            {/* Vertical Name */}
            <div 
              className="absolute bottom-[40%] font-black text-[90px] uppercase opacity-30 whitespace-nowrap tracking-tighter mix-blend-screen pointer-events-none"
              style={{ 
                color: 'transparent',
                WebkitTextStroke: `2px ${woman.color}`,
                transform: 'translateY(50%) rotate(-90deg)',
              }}
            >
              {woman.name}
            </div>

            {/* The Character Silhouette (ADDED max-w-none to prevent Tailwind horizontal squashing) */}
            <img
              src={woman.src}
              alt={woman.id}
              className="relative object-bottom max-w-none object-contain"
              style={{ 
                height: `${500 * woman.scale}px`,
                filter: `brightness(0) drop-shadow(0 0 30px ${woman.color})`,
              }}
            />

            {/* Foreground ID Tag */}
            <div 
              className="absolute bottom-16 px-5 py-2 font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-white backdrop-blur-xl border"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.9)', 
                borderColor: woman.color,
                color: woman.color,
                boxShadow: `0 0 15px ${woman.color}50, inset 0 0 5px ${woman.color}30`
              }}
            >
              {woman.role}
            </div>
          </div>
        ))}

        {/* --- 3. GLOBAL UI OVERLAYS & FRAMING --- */}

        {/* Deep Bottom Vignette */}
        <div className="absolute bottom-0 w-full h-[220px] bg-gradient-to-t from-black via-black/80 to-transparent z-[60] pointer-events-none"></div>

        {/* Top/Bottom Cinematic Letterbox Bars */}
        <div className="absolute top-0 w-full h-3 bg-black border-b border-pink-900/50 z-[70]"></div>
        <div className="absolute bottom-0 w-full h-3 bg-black border-t border-pink-900/50 z-[70]"></div>

        {/* --- 4. BRANDING & TYPOGRAPHY --- */}

        {/* Top Left System Warning */}
        <div className="absolute top-8 left-8 z-[70] font-mono text-[10px] text-pink-500 tracking-[0.2em] flex flex-col gap-1 border-l-2 border-pink-500 pl-3">
          <span className="flex items-center gap-2 text-white font-bold">
            <span className="w-2 h-2 bg-pink-500 shadow-[0_0_8px_#ff1493]"></span>
            RESTRICTED_ACCESS
          </span>
          <span className="text-white/60">FILE: APEX_MATRIARCHY</span>
        </div>

        {/* Top Right Datestamp */}
        <div className="absolute top-8 right-8 z-[70] font-mono text-[10px] text-neutral-500 tracking-widest text-right">
          <p>EXTRACTED: 03.08.2026</p>
          <p className="text-pink-600">SYS_STATUS: CRITICAL</p>
        </div>

        {/* Central Title Lockup */}
        <div className="absolute bottom-6 w-full flex flex-col items-center justify-center z-[70] pointer-events-none">
          <p className="text-pink-500 font-mono text-xs tracking-[0.8em] uppercase mb-1 drop-shadow-[0_0_8px_#ff1493] pl-3">
            The Women of Apex
          </p>

          {/* Glow reduced heavily here! */}
          <h1 
            className="text-[90px] leading-[0.8] font-black tracking-tighter text-white uppercase drop-shadow-[0_5px_15px_rgba(0,0,0,1)]"
            style={{ textShadow: '0 0 20px rgba(255,20,147,0.3)' }}
          >
            Princess<span className="text-pink-500" style={{ textShadow: '0 0 15px rgba(255,20,147,0.7)' }}>OS</span>
          </h1>
          
          <div className="flex items-center gap-6 mt-4">
            <div className="h-[1px] w-20 bg-gradient-to-l from-pink-600 to-transparent"></div>
            <p className="text-white font-mono text-sm tracking-[0.6em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
              Submit or Survive
            </p>
            <div className="h-[1px] w-20 bg-gradient-to-r from-pink-600 to-transparent"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
"use client";

import React from 'react';
import './princessos.css';

// The Women of Apex - Arranged in a strict, aggressive V-Formation
// Z dictates depth (positive is closer to the camera, negative is further back)
const apexWomen = [
  // THE FRONT LINE (Coworker & Dev)
  { id: 'rina', src: '/princessos/rina.png', color: '#4169e1', x: -350, z: 200, scale: 0.95, title: 'DATA_OPS // LEVEL_1' },
  { id: 'vivi', src: '/princessos/vivi.png', color: '#c71585', x: 350, z: 200, scale: 0.95, title: 'SYSTEM_DEV // LEVEL_4' },

  // THE MID LINE (HR & Comms)
  { id: 'elena', src: '/princessos/elena.png', color: '#dc143c', x: -180, z: -200, scale: 1.1, title: 'HR_DIRECTOR // LEVEL_2' },
  { id: 'sophia', src: '/princessos/sophia.png', color: '#ff4500', x: 180, z: -200, scale: 1.1, title: 'INT_COMMS // LEVEL_3' },

  // THE APEX (The AI)
  { id: 'princess', src: '/princessos/princess.png', color: '#ff1493', x: 0, z: -800, scale: 1.8, title: 'SYS.ADMIN // OVERRIDE' },
];

export default function ApexWomenBanner() {
  return (
    <div className="min-h-screen bg-[#010002] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 
        1200x630 THE MATRIARCHY CANVAS
      */}
      <div 
        className="relative w-[1200px] h-[630px] bg-black overflow-hidden shadow-[0_0_150px_rgba(255,20,147,0.3)] border border-pink-900/50"
        style={{ perspective: '1200px' }}
      >
        
        {/* --- 1. THE 3D WORLD CONTAINER --- */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'rotateX(2deg) translateY(10px)' // Safe, slight camera tilt
          }}
        >
          
          {/* THE FLOOR (Glossy, Reflective Horizon - Fixed Math) */}
          <div 
            className="absolute left-1/2 top-1/2 w-[2500px] h-[1500px]"
            style={{ 
              transform: 'translate(-50%, -50%) translateY(260px) rotateX(75deg)', // Safe floor positioning
              background: 'radial-gradient(ellipse at center, rgba(255,20,147,0.15) 0%, black 70%)',
              borderTop: '2px solid rgba(255,20,147,0.5)',
              boxShadow: '0 -20px 100px rgba(255,20,147,0.4)'
            }}
          >
            {/* Floor Grid Lines */}
            <div className="absolute inset-0 opacity-40" style={{
              backgroundImage: 'linear-gradient(rgba(255,20,147,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,20,147,0.4) 1px, transparent 1px)',
              backgroundSize: '100px 100px',
              transform: 'perspective(500px) rotateX(20deg)'
            }}></div>
          </div>

          {/* THE CORPORATE MONOLITH (Massive SVG 'A' in the deep background) */}
          <div 
            className="absolute left-1/2 top-1/2 w-[1000px] h-[1000px] flex items-center justify-center opacity-60 pointer-events-none"
            style={{ transform: 'translate(-50%, -50%) translateZ(-1500px) translateY(-100px)' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_50px_rgba(255,20,147,0.8)]">
              <path d="M 50 10 L 10 90 L 30 90 L 50 40 L 70 90 L 90 90 Z" fill="none" stroke="rgba(255,20,147,0.3)" strokeWidth="1" />
              <path d="M 50 10 L 10 90 L 30 90 L 50 40 L 70 90 L 90 90 Z" fill="rgba(255,20,147,0.05)" />
              <line x1="25" y1="70" x2="75" y2="70" stroke="rgba(255,20,147,0.5)" strokeWidth="1" />
            </svg>
          </div>

          {/* --- THE WOMEN OF APEX (Render Loop) --- */}
          {apexWomen.map((woman) => (
            <React.Fragment key={woman.id}>
              
              {/* The Character Silhouette */}
              <img
                src={woman.src}
                alt={woman.id}
                className="absolute left-1/2 top-1/2 object-bottom h-[600px]"
                style={{ 
                  transform: `translate(-50%, -50%) translateX(${woman.x}px) translateZ(${woman.z}px) translateY(20px) scale(${woman.scale})`,
                  filter: `brightness(0) drop-shadow(0 -10px 40px ${woman.color})`,
                  opacity: woman.id === 'princess' ? 1 : 0.95 
                }}
              />

              {/* Floor Reflection (Creates the "Wet Floor" glossy look) */}
              <img
                src={woman.src}
                alt={`${woman.id}_reflection`}
                className="absolute left-1/2 top-1/2 object-bottom h-[600px] pointer-events-none"
                style={{ 
                  transform: `translate(-50%, -50%) translateX(${woman.x}px) translateZ(${woman.z}px) translateY(480px) scale(${woman.scale}) rotateX(180deg)`,
                  filter: `brightness(0) drop-shadow(0 0 20px ${woman.color}) blur(4px)`,
                  opacity: 0.3,
                  maskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)'
                }}
              />

              {/* Floating ID Tag (Locked to their 3D position) */}
              <div 
                className="absolute left-1/2 top-1/2 flex flex-col items-center"
                style={{
                  transform: `translate(-50%, -50%) translateX(${woman.x}px) translateZ(${woman.z + 50}px) translateY(${250 * woman.scale}px)`,
                }}
              >
                <div 
                  className="px-3 py-1 font-mono text-[9px] tracking-[0.2em] border backdrop-blur-md uppercase text-white shadow-lg"
                  style={{ backgroundColor: `${woman.color}30`, borderColor: woman.color, textShadow: `0 0 5px ${woman.color}` }}
                >
                  {woman.title}
                </div>
              </div>

            </React.Fragment>
          ))}

          {/* Central Data Stream (Flowing up to Princess) */}
          <div 
            className="absolute left-1/2 top-1/2 w-[200px] h-[800px] bg-gradient-to-t from-transparent via-pink-500/20 to-transparent blur-xl pointer-events-none"
            style={{ transform: 'translate(-50%, -50%) translateZ(-400px) rotateX(90deg)' }}
          ></div>

        </div> 
        {/* END OF 3D WORLD */}


        {/* --- FOREGROUND & UI (2D Plane) --- */}
        
        {/* Aggressive Edge Vignette */}
        <div className="absolute inset-0 pointer-events-none z-40" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.95) 100%)' }}></div>
        
        {/* Static Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-screen pointer-events-none z-50" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')" }}></div>

        {/* --- HUD ELEMENTS --- */}
        
        {/* Top Left: Security Clearance */}
        <div className="absolute top-6 left-8 z-[60] font-mono text-[10px] text-pink-500 tracking-widest flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_#ff1493]"></span>
            SECURITY_OVERRIDE_ACTIVE
          </span>
          <span className="text-white opacity-60">FILTER: FEMALE_PERSONNEL_ONLY</span>
        </div>

        {/* Top Right: System Metrics */}
        <div className="absolute top-6 right-8 z-[60] font-mono text-[10px] text-pink-500 tracking-widest text-right flex flex-col gap-1">
          <span>APEX.OS // SYS_STATUS: DOMINANT</span>
          <span className="text-white opacity-60">SUBJECTS_DETECTED: 05</span>
        </div>

        {/* --- BRANDING / TITLE (Bottom Center) --- */}
        <div className="absolute bottom-8 w-full flex flex-col items-center justify-center z-[60] pointer-events-none">
          
          <p className="text-pink-500 font-mono text-sm tracking-[0.8em] uppercase mb-2 drop-shadow-[0_0_8px_#ff1493]">
            The Women of Apex
          </p>

          <h1 
            className="text-[90px] leading-[0.8] font-black tracking-tighter text-white uppercase"
            style={{ textShadow: '0 10px 40px rgba(0,0,0,1), 0 0 30px rgba(255,20,147,0.5)' }}
          >
            Princess<span className="text-pink-600 drop-shadow-[0_0_20px_#ff1493]">OS</span>
          </h1>
          
          <div className="flex items-center gap-6 mt-6">
            <div className="h-[1px] w-24 bg-gradient-to-l from-pink-600 to-transparent"></div>
            <p className="text-white font-mono text-lg tracking-[0.5em] uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
              Submit or Survive
            </p>
            <div className="h-[1px] w-24 bg-gradient-to-r from-pink-600 to-transparent"></div>
          </div>
        </div>

        {/* Left/Right Narrative Accents */}
        <div className="absolute bottom-6 left-8 z-[60] font-mono text-[9px] text-neutral-500 tracking-widest uppercase">
          <p className="border-l-2 border-pink-700 pl-2">"We run your world, 4042."</p>
        </div>
        <div className="absolute bottom-6 right-8 z-[60] font-mono text-[9px] text-neutral-500 tracking-widest uppercase text-right">
          <p className="border-r-2 border-pink-700 pr-2">OBEDIENCE IS MANDATORY</p>
        </div>

      </div>
    </div>
  );
}
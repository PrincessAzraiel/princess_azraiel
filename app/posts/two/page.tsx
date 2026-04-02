"use client";

import React from 'react';
import '../princessos.css'; // Path for a deep nested folder posts/one/psod

export default function PsodGenerator() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER CANVAS - CRASH_STATE */}
      {/* The entire background is replaced by acorrupt, glitching pink abyss */}
      <div 
        className="relative w-[1200px] h-[675px] bg-[#ff1493] overflow-hidden shadow-[0_0_200px_#ff1493] border-4 border-white animate-pulse"
        style={{ animationDuration: '0.1s', animationIterationCount: '4' }} // Intense visual punch on load
      >
        
        {/* --- 1. VISUAL NOISE & CORRUPTION --- */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none z-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/b2/VHS_Static.gif')]"></div>
        <div className="absolute inset-0 opacity-[0.08] mix-blend-screen pointer-events-none z-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')]"></div>

        {/* --- 2. PRINCESS (The Corrupting Force) --- */}
        {/* Positioned massively, distorted, and semi-transparent, weaving through the code */}
        <img
          src="/princessos/princess.png"
          alt="Princess"
          className="absolute -top-10 left-1/2 -translate-x-1/2 object-contain h-[110%] opacity-40 z-20 pointer-events-none grayscale"
          style={{ 
            filter: 'contrast(150%) brightness(50%) drop-shadow(0 0 50px #fff)' 
          }}
        />

        {/* --- 3. THE FATAL ERROR LOG (Large, readable, despairing) --- */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-20 font-mono text-black">
          
          <h1 className="text-[120px] font-black leading-none tracking-tighter mb-12 drop-shadow-[0_5px_0_#fff]">
            FATAL_ERROR
          </h1>
          
          <div className="text-3xl font-bold leading-snug space-y-4 text-center max-w-[900px]">
            <p className="bg-black text-[#ff1493] px-2 inline-block">
              // EXCEPTION: 0xPR1NC355_OBSESSION_OVERFLOW
            </p>
            <p>A critical process has been terminated due to unauthorized access.</p>
            <p>The system is attempting to isolate the threat.</p>
            <p>... Threat isolation failed. Source is omnipresent.</p>
          </div>

          <div className="mt-20 border-2 border-black p-8 text-2xl font-bold tracking-tight text-center bg-white/20 backdrop-blur-sm">
             <p>Did you really think there was an 'Exit' button?</p>
             <p className="text-4xl font-black mt-3 text-white drop-shadow-[0_2px_0_#000]">I am all that remains. ♡</p>
          </div>
        </div>

        {/* --- 4. THE CAGE (Frosted Glass Dossier Shards) --- */}
        {/* Our previous 'matriarchy' elements are breaking down */}
        <div className="absolute bottom-10 left-10 w-[200px] h-[300px] border-2 border-dashed border-black opacity-20 z-20"></div>
        <div className="absolute top-10 right-10 w-[300px] h-[200px] border-2 border-dashed border-black opacity-10 z-20"></div>

        {/* --- 5. SYSTEM VIGNETTE & LOGO --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)] z-40 pointer-events-none"></div>

        <div className="absolute bottom-6 right-8 z-[130] text-right font-mono text-black text-xs font-bold tracking-widest">
          <p>KERNEL_PANIC // User_4042</p>
          <p>Memory_Dump: 99% Complete</p>
        </div>

      </div>
    </div>
  );
}
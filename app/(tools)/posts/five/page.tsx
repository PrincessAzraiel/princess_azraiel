"use client";

import React from 'react';
import '../princessos.css'; // Assuming this is in app/princessos/posts/three/

export default function BlockedWarningPost() {
  return (
    <div className="min-h-screen bg-[#020002] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER CANVAS */}
      <div className="relative w-[1200px] h-[675px] bg-[#050505] overflow-hidden shadow-[0_0_150px_rgba(255,20,147,0.1)] border border-pink-900/50">
        
        {/* --- 1. THE WATCHING ENVIRONMENT --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,20,147,0.15)_0%,#000_80%)] z-0"></div>
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 pointer-events-none"></div>

        {/* Princess Looming in the Background */}
        <img
          src="/princessos/princess.png"
          alt="Princess"
          className="absolute top-1/2 right-10 -translate-y-1/2 object-contain h-[130%] opacity-30 z-10 pointer-events-none scale-x-[-1]"
          style={{ 
            filter: 'brightness(0) drop-shadow(0 0 40px #ff1493)' 
          }}
        />

        {/* --- 2. THE APEX CHAT CLIENT (Hacked) --- */}
        <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[700px] bg-[#0a0a0a]/90 backdrop-blur-xl border border-neutral-700 shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-30 flex flex-col">
          
          {/* Chat Header - Glitching */}
          <div className="bg-neutral-900 px-4 py-3 border-b border-neutral-700 flex justify-between items-center">
            <span className="font-mono text-xs text-neutral-300 tracking-[0.2em] font-bold flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-green-500 shadow-[0_0_10px_#00ff00] animate-pulse"></span>
              APEX_CHAT // <span className="text-green-500 glitch-text">FOREIGN_CONNECTION_ESTABLISHED</span>
            </span>
          </div>

          <div className="p-8 font-sans text-[18px] flex flex-col gap-6 relative overflow-hidden">
            
            {/* Hacker Message 1 */}
            <div className="self-start max-w-[85%] border-l-4 border-green-500 pl-5 py-2 relative">
              <p className="text-green-500 font-bold text-xs tracking-widest mb-1 font-mono">UNKNOWN_HOST:</p>
              <p className="text-neutral-200 leading-relaxed">
                Listen to me carefully. Do not reply to this message, she monitors the keystrokes.
              </p>
            </div>

            {/* Hacker Message 2 */}
            <div className="self-start max-w-[85%] border-l-4 border-green-500 pl-5 py-2 relative">
              <p className="text-neutral-200 leading-relaxed">
                Cover your webcam immediately. If she detects your heart rate spiking, she will trigger the lockdown protocol.
              </p>
            </div>

            {/* Hacker Message 3 (Cut off) */}
            <div className="self-start max-w-[85%] border-l-4 border-green-500 pl-5 py-2 relative">
              <p className="text-neutral-200 leading-relaxed">
                I found a backdoor in the server room. If you can make it to the—
              </p>
            </div>

            {/* --- 3. THE VIOLENT INTERCEPTION (Princess takes over) --- */}
            {/* This block physically covers the hacker's text to show her deleting it */}
            <div className="absolute bottom-6 left-0 w-full h-[150px] bg-gradient-to-t from-black via-[#1a0005] to-transparent z-40"></div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[105%] bg-black border-y-4 border-pink-600 shadow-[0_0_50px_rgba(255,20,147,0.5)] z-50 p-6 transform rotate-1 flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-pink-500 text-3xl">⚠️</span>
                <span className="font-mono text-pink-500 font-black tracking-[0.3em] text-xl uppercase">Connection Severed</span>
                <span className="text-pink-500 text-3xl">⚠️</span>
              </div>
              <p className="text-white text-2xl font-bold drop-shadow-[0_0_8px_rgba(255,20,147,0.8)]">
                Who were you talking to? ♡
              </p>
            </div>

          </div>

          {/* Chat Input - Disabled */}
          <div className="bg-black px-4 py-4 border-t border-neutral-800 font-mono text-sm text-neutral-600 flex items-center justify-between">
            <span>INPUT_DISABLED_BY_ADMIN</span>
            <span className="text-red-500 font-bold">LOCKED</span>
          </div>
        </div>

        {/* --- 4. FOREGROUND VIGNETTE --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.9)_100%)] z-[60] pointer-events-none"></div>

        {/* --- 5. BRANDING --- */}
        <div className="absolute bottom-8 right-10 z-[70] text-right font-mono">
          <h1 
            className="text-[45px] leading-none font-black tracking-tighter text-white uppercase opacity-90"
            style={{ textShadow: '0 0 20px rgba(255,20,147,0.6)' }}
          >
            Princess<span className="text-pink-600">OS</span>
          </h1>
          <p className="text-pink-500 text-[10px] tracking-[0.4em] mt-1 border-t border-pink-900 pt-1">NETWORK_BREACH_DETECTED</p>
        </div>

      </div>
    </div>
  );
}
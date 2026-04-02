"use client";

import React from 'react';
import '../princessos.css'; 

export default function CorporateLorePost() {
  return (
    <div className="min-h-screen bg-[#010101] flex items-center justify-center p-8 overflow-hidden font-sans select-none">
      
      {/* 1200x675 X/TWITTER CANVAS */}
      <div 
        className="relative w-[1200px] h-[675px] bg-[#050505] overflow-hidden shadow-[0_0_150px_rgba(255,20,147,0.1)] border border-pink-900/20"
        style={{ perspective: '1500px' }}
      >
        
        {/* --- 1. THE DARK OFFICE ENVIRONMENT --- */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,20,147,0.1)_0%,#000_80%)] z-0"></div>
        <div className="absolute inset-0 opacity-[0.06] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 pointer-events-none"></div>

        {/* Princess Watching from the Deep Shadows */}
        <img
          src="/princessos/princess.png"
          alt="Princess"
          className="absolute -top-20 right-0 object-contain h-[130%] opacity-20 z-10 pointer-events-none"
          style={{ 
            filter: 'brightness(0) drop-shadow(0 0 30px #ff1493)' 
          }}
        />

        {/* --- 2. THE APEX EMPLOYMENT CONTRACT (3D Document) --- */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[800px] bg-neutral-100 border border-neutral-300 shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(255,20,147,0.1)] z-30 flex flex-col p-12 text-black"
          style={{ transform: 'rotateX(5deg) rotateY(-8deg) rotateZ(2deg) translateY(-20px)' }}
        >
          
          {/* Document Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase font-sans">Apex Corporation</h1>
              <p className="text-neutral-500 font-mono text-xs tracking-widest mt-1">DATA OPERATIONS DIVISION</p>
            </div>
            <div className="text-right font-mono text-[10px] text-neutral-400">
              <p>FORM: ONB-4042</p>
              <p>DATE: 03.08.2026</p>
              <p>CONFIDENTIAL</p>
            </div>
          </div>

          {/* Employee Details */}
          <div className="grid grid-cols-2 gap-6 mb-8 font-mono text-sm">
            <div>
              <p className="text-neutral-500 text-xs mb-1">EMPLOYEE ID:</p>
              <p className="font-bold text-lg">User 4042</p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs mb-1">ASSIGNED ROLE:</p>
              <p className="font-bold text-lg">Data Archivist</p>
            </div>
          </div>

          {/* Job Description (Lore Drop) */}
          <div className="font-sans text-base leading-relaxed text-neutral-800 space-y-5">
            <p>
              Welcome to Apex Corporation. As a Data Archivist, your primary duty is to review, organize, and verify classified information within company systems.
            </p>
            <p>
              You will be working at <span className="font-bold">Station 4</span>. You are tasked with sorting the legacy files left behind by your predecessor (Employee ID: 4041). <span className="underline decoration-neutral-300">Do not attempt to contact Employee 4041.</span> Their departure was marked as Unauthorized.
            </p>
            <p className="border-l-4 border-black pl-4 font-bold">
              Notice: All workstation activities, intranet searches, and communications are actively monitored by PrincessOS to ensure maximum corporate efficiency.
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-auto flex justify-between items-end border-t border-neutral-300 pt-6">
            <div className="w-1/2">
              <p className="text-neutral-400 text-xs mb-8">AUTHORIZED BY (HR):</p>
              <p className="font-custom text-2xl text-black border-b border-black pb-1 italic">Elena Ward</p>
            </div>
            <div className="w-1/3">
              <p className="text-neutral-400 text-xs mb-8">EMPLOYEE SIGNATURE:</p>
              <p className="font-mono text-lg text-black border-b border-black pb-1">4042</p>
            </div>
          </div>

          {/* --- 3. PRINCESS'S DIGITAL HIJACKING (Pink Overlays) --- */}
          
          {/* Fake "APPROVED" Stamp */}
          <div className="absolute top-32 right-10 border-4 border-pink-500 text-pink-500 font-black text-2xl p-2 transform rotate-12 opacity-80 shadow-[0_0_15px_rgba(255,20,147,0.3)] pointer-events-none">
            PROPERTY OF<br/>PRINCESS.OS
          </div>

          {/* Hand-written / Glitchy Note */}
          <div className="absolute top-[48%] -right-[15%] w-[250px] transform rotate-[-5deg] z-40 bg-black/80 backdrop-blur-md border border-pink-500 p-4 shadow-[0_10px_30px_rgba(255,20,147,0.4)]">
            <p className="font-mono text-[10px] text-pink-400 font-bold border-b border-pink-900 pb-1 mb-2">SYS.ADMIN // NOTE</p>
            <p className="text-white font-sans text-lg drop-shadow-[0_0_5px_#ff1493] leading-snug">
              Don't worry about the guy who had this desk before you. He was defective. ♡
            </p>
          </div>

          {/* Pink Highlighting over the text */}
          <div className="absolute top-[385px] left-[45px] w-[290px] h-[25px] bg-pink-500/30 mix-blend-multiply pointer-events-none"></div>

        </div>

        {/* --- 4. FOREGROUND VIGNETTE & BRANDING --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.95)_100%)] z-40 pointer-events-none"></div>

        <div className="absolute bottom-8 left-10 z-50 text-left font-mono">
          <h1 
            className="text-[50px] leading-none font-black tracking-tighter text-white uppercase opacity-90"
            style={{ textShadow: '0 0 20px rgba(255,20,147,0.5)' }}
          >
            Princess<span className="text-pink-600">OS</span>
          </h1>
          <p className="text-pink-500 text-[11px] tracking-[0.4em] mt-2 border-l-2 border-pink-500 pl-2">THE ONBOARDING</p>
        </div>

      </div>
    </div>
  );
}